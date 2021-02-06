
'use strict';

const childProcess = require('child_process');
const docker = require('docker-compose');
const winston = require('winston');

let networkFailures = {};

function packageLoss(duration, nodeName, percent, label) {
    winston.info(`Preparing network failure package loss on ${nodeName}, duration ${duration}, loss percentage ${percent} time ${new Date().toISOString().replace(/T/, ' ').replace(/\\..+/, '')}`);
    winston.info(`pumba --random --log-level info netem --tc-image="gaiadocker/iproute2" --duration ${duration}s loss --percent ${percent} --correlation 20 ${nodeName}`);
    let process = childProcess.exec(`pumba --random --log-level info netem --tc-image="gaiadocker/iproute2" --duration ${duration}s loss --percent ${percent} --correlation 20 ${nodeName}`, function(err,stdout,stderr){
        if(err) {
            console.log('get error:'+stderr);
        }
    });

    networkFailures[label] = {
        process: process,
    };
}

function networkLatency(duration, nodeName, latency, label) {
    winston.info(`Preparing network failure package loss on ${nodeName}, duration ${duration}, latency ${latency} ms time ${new Date().toISOString().replace(/T/, ' ').replace(/\\..+/, '')}`);
    winston.info(`pumba --random --log-level info netem --tc-image="gaiadocker/iproute2" --duration ${duration}s delay --time ${latency} --jitter 30 --correlation 20 ${nodeName}`);
    let process = childProcess.exec(`pumba --random --log-level info netem --tc-image="gaiadocker/iproute2" --duration ${duration}s delay --time ${latency} --jitter 30 --correlation 20 ${nodeName}`);
    networkFailures[label] = {
        process: process,
    };
}

function networkRecover(label) {
    winston.info(`Recovering network failure ${label}`);
    networkFailures[label].process.kill();
}

module.exports.packageLoss = packageLoss;
module.exports.networkLatency = networkLatency;
module.exports.networkRecover = networkRecover;

