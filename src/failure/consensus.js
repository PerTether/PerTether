
'use strict';

const childProcess = require('child_process');
const docker = require('docker-compose');
const winston = require('winston');
const path = require('path');
const util = require('../util/util');

let consensusFailures = {};

async function nodeFailure(clientType, nodeName, label) {
    winston.info(`Preparing node failure on ${nodeName}`);
    consensusFailures[label] = {
        nodeName: nodeName,
        status: 'preparing'
    };
    await docker.stopOne(nodeName, {cwd: path.join(__dirname, '..', 'setup', clientType, 'docker'), log: true});
    consensusFailures[label].status = 'injected';
    winston.info(`Preparing node failure on ${nodeName} --- Success`);
}

async function nodeRecover(clientType, nodeName, label) {
    winston.info(`Recovering node failure on ${nodeName}`);
    if (!consensusFailures.hasOwnProperty(label)) {
        winston.error(`No failure ${label} injected.`);
        return;
    }
    if (consensusFailures[label].status !== 'injected') {
        //todo 如果故障注入还未完成就要撤销，应该轮询等待
        winston.error(`Cannot stop failure ${label} status ${consensusFailures[label].status}.`);
    } else {
        await docker.upOne(nodeName, {cwd: path.join(__dirname, '..', 'setup', clientType, 'docker'), log: true});
        winston.info(`Recovering node failure on ${nodeName} --- Success`);
        consensusFailures[label].status = 'stopped';
    }
}

// async function nodeStopMining(client, nodeName) {
//
// }

module.exports.nodeFailure = nodeFailure;
module.exports.nodeRecover = nodeRecover;
