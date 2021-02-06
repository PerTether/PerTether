
'use strict';

const childProcess = require('child_process');
const winston = require('winston');
const path = require('path');

let processes  = {};


function setPromise(pid, isResolve, msg) {
    let p = processes[pid];
    if(p && p.promise && typeof p.promise !== 'undefined') {
        if(isResolve) {
            p.promise.resolve(msg);
        }
        else {
            p.promise.reject(msg);
        }
    }
}

function pushResult(pid, data) {
    let p = processes[pid];
    if(p && p.results && typeof p.results !== 'undefined') {
        p.results.push(data);
    }
}

module.exports.startClients = function(count){
    for (let i = 0; i < count; i++) {
        launchClient(count);
    }
};

module.exports.startTest = async function (nodeConfig, nodeAccounts, rate, duration, contractConfig, results) {
    let promises = [];
    let i = 0;
    for(let id in processes) {
        let msg = {
            type: 'test',
            nodeName: nodeConfig[i].nodeName,
            accounts: nodeAccounts[nodeConfig[i].nodeName],
            proxy: nodeConfig[i].proxy,
            rate: rate,
            duration: duration,
            contractConfig: contractConfig
        };
        let client = processes[id];
        let p = new Promise((resolve, reject) => {
            client.promise = {
                resolve: resolve,
                reject:  reject
            };
        });
        promises.push(p);
        client.results = results;
        // send message to client
        client.obj.send(msg);
        i++;
    }

    await Promise.all(promises);
    // clear promises
    for(let client in processes) {
        delete client.promise;
    }
};

module.exports.controlRateIndex = function(rateControlIndex) {
    for(let id in processes) {
        let msg = {
            type: 'rateControl',
            rateControlIndex: rateControlIndex,
        };
        let client = processes[id];
        client.obj.send(msg);
    }
};

function launchClient(results) {
    let child = childProcess.fork(path.join(__dirname, 'requestSender.js'));
    let pid   = child.pid.toString();
    processes[pid] = {obj: child, results: results};

    child.on('message', function(msg) {
        if(msg.type === 'testResult') {
            pushResult(pid, msg.data);
            setPromise(pid, true, null);
        }
        else if(msg.type === 'error') {
            setPromise(pid, false, new Error('Client encountered error:' + msg.data));
        }
    });

    child.on('error', function(){
        setPromise(pid, false, new Error('Client encountered unexpected error'));
    });

    child.on('exit', function(code, signal){
        winston.info('Client exited ');
        setPromise(pid, false, new Error('Client already exited'));
    });
}

function stop() {
    for(let pid in processes) {
        processes[pid].obj.kill();
    }
    processes = {};
}
module.exports.stop = stop;
