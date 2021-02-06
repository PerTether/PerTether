
'use strict';

const clientControl = require('./clientControl');
const winston = require('winston');

function startLoadTimer(loadConfig) {
    let period = loadConfig.period;
    let doubleTimes = loadConfig.doubleTimes;
    for (let i = 1; i < doubleTimes; i++) {
        setTimeout(clientControl.controlRateIndex, i * period * 1000, i + 1);
    }
}

module.exports.startLoadTimer = startLoadTimer;
