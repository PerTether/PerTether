
'use strict';

const childProcess = require('child_process');
const winston = require('winston');
const path = require('path');

//todo 三种分开多线程
let processes = {
    // "normal": {},
    // "invalid": {},
    // "inefficient": {}
};


function setPromise(pid, isResolve, msg, label) {
    let p = processes[label][pid];
    if(p && p.promise && typeof p.promise !== 'undefined') {
        if(isResolve) {
            p.promise.resolve(msg);
        }
        else {
            p.promise.reject(msg);
        }
    }
}

function pushResult(pid, data, label) {
    let p = processes[label][pid];
    if(p && p.results && typeof p.results !== 'undefined') {
        p.results.push(data);
    }
}

module.exports.startClients = function(count, label){
    for (let i = 0; i < count; i++) {
        launchClient(count, label);
    }
};

module.exports.startFailure = async function (nodeConfig, nodeAccounts, rate, type, duration, contractConfig, results, label, level) {
    winston.info(`Failure contract ${JSON.stringify(contractConfig)}`);
    let promises = [];
    let i = 0;
    for(let id in processes[label]) {
        let msg = {
            type: 'failure',
            label: label,
            nodeName: nodeConfig[i].nodeName,
            accounts: nodeAccounts[nodeConfig[i].nodeName],
            proxy: nodeConfig[i].proxy,
            rate: rate,
            duration: duration,
            contractConfig: contractConfig
        };
        switch (type) {
            case 'application-normal':
                msg.rate = rate * level;
                break;
            case 'smartContract':
                msg.param = level;
                break;
        }
        let client = processes[label][id];
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
    for(let client in processes[label]) {
        delete client.promise;
    }
};

function launchClient(results, label) {
    let child = childProcess.fork(path.join(__dirname, 'requestSender.js'));
    let pid   = child.pid.toString();
    if (!processes.hasOwnProperty(label))
        processes[label] = {};
    processes[label][pid] = {obj: child, results: results};

    child.on('message', function(msg) {
        if(msg.type === 'testResult') {
            pushResult(pid, msg.data, label);
            setPromise(pid, true, null, label);
        }
        else if(msg.type === 'error') {
            setPromise(pid, false, new Error('Client encountered error:' + msg.data), label);
        }
    });

    child.on('error', function(){
        setPromise(pid, false, new Error('Client encountered unexpected error'), label);
    });

    child.on('exit', function(code, signal){
        winston.info('Client exited ');
        setPromise(pid, false, new Error('Client already exited'), label);
    });
}

module.exports.controlRateIndex = function(rateControlIndex, label) {
    for(let id in processes[label]) {
        let msg = {
            type: 'rateControl',
            rateControlIndex: rateControlIndex,
        };
        let client = processes[label][id];
        client.obj.send(msg);
    }
};

function stop(label) {
    for(let pid in processes[label]) {
        processes[label][pid].obj.kill();
    }
    processes[label] = {};
}

module.exports.stop = stop;
