
'use strict';

const winston = require('winston');
const failureClient = require('../transaction/failureClientControl');
const clientControl = require('../transaction/clientControl');
const consensus = require('../failure/consensus');
const network = require('../failure/network');
//{label: test, startInterval: 60, duration: 30, type:xxx, status: pending, info:{}}
let failures = [];
let nodeConfig;
let nodeAccounts;
let normalContractConfig;
let rate;
let clientType;
let results;
const contract = require('../transaction/contractInfo');

function initFailures(_nodeConfig, _clientType, _nodeAccounts, _rate, _normalContractConfig, failureConfig, _results) {
    nodeConfig = _nodeConfig;
    clientType = _clientType;
    nodeAccounts = _nodeAccounts;
    normalContractConfig = _normalContractConfig;
    rate = _rate;
    failures = failureConfig;
    results = _results;
    for (let i = 0; i < failures.length; i++) {
        //todo 其他类型也可能需要启动线程
        if (failures[i].type === 'smartContract')
        failureClient.startClients(nodeConfig.length, failures[i].label);
    }
}

function startFailureTimer() {
    winston.info(`Start failure injection timer`);
    for (let i = 0; i < failures.length; i++) {
        setTimeout(injectFailure, failures[i].startAfter * 1000, failures[i]);
        setTimeout(stopFailure, (failures[i].startAfter + failures[i].duration) * 1000, failures[i]);
    }
}

async function injectFailure(failure) {
    winston.info(`Start failure injection: ${failure.label}`);
    failure.status = 'injected';
    failure.startTime = Date.now();
    switch (failure.type) {
        case 'application-normal':
            clientControl.controlRateIndex(1 + 0.25 * Math.pow(2, failure.level - 1));
            failure.finishTime = Date.now();
            failure.status = 'stopped';
            break;
        case 'smartContract':
            clientControl.controlRateIndex(0.2);
            failureClient.controlRateIndex(0.8, failure.label);
            await failureClient.startFailure(nodeConfig, nodeAccounts, rate, failure.type, failure.duration,
                contract.getContractConfig(failure.contractName), results, failure.label, failure.level);
            failure.finishTime = Date.now();
            await failureClient.stop(failure.label);
            failure.status = 'stopped';
            break;
        case 'nodeFailure':
            await consensus.nodeFailure(clientType, failure.nodeName, failure.label);
            break;
        case 'network-packageLoss':
            await network.packageLoss(failure.duration, failure.nodeName, failure.level * 30, failure.label);
            break;
        case 'network-latency':
            await network.networkLatency(failure.duration, failure.nodeName, failure.level * failure.level * 1000, failure.label);
            break;
    }
}

async function stopFailure(failure) {
    winston.info(`Stop failure injection: ${failure.label}`);
    switch (failure.type) {
        case 'nodeFailure':
            await consensus.nodeRecover(clientType, failure.nodeName, failure.label);
            break;
        case 'smartContract':
        case 'application-normal':
            clientControl.controlRateIndex(1);
            break;
    }
}

function getCurrentFailureInfo(){
    return failures;
}


module.exports.startFailureTimer = startFailureTimer;
module.exports.initFailures = initFailures;
module.exports.getCurrentFailureInfo = getCurrentFailureInfo;
