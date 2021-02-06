
'use strict';

const winston = require('winston');

function processResult(result, rate, duration){
    let txSuccess = 0;
    let txTotal = 0;
    let latencyTotal = 0;
    let recDuration = duration;
    let durationMs = duration * 1000;
    let maxGasprice = 20;
    let gasCompletion = [];
    let gasLatency = [];
    let gasTotal = [];
    let throughputBySec = [];
    let latencyBySec = [];
    for (let i = 0; i <= maxGasprice; i += 2) {
        gasCompletion.push([rate, i, 0]);
        gasLatency.push([rate, i, 0]);
        gasTotal.push([0,0,0])
    }
    for (let i = 0; i < recDuration; i++) {
        throughputBySec.push([i, 0]);
        latencyBySec.push([i, 0]);
    }
    let startTime = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < result.length; i++) {
        startTime = Math.min(startTime, result[i].startTime)
    }
    for(let i = 0; i < result.length; i++){
        winston.info(`Process type ${result[i].type} node ${result[i].node} `);
        let res = result[i].result;
        for(let j = 0; j < res.length; j++){
            txTotal ++;
            let gasBucket = parseInt(res[j].gasprice / 2);
            if (gasBucket > maxGasprice / 2) gasBucket = maxGasprice / 2;
            gasTotal[gasBucket][0]++;
            if(res[j].status === 0) {
                gasTotal[gasBucket][2] += res[j].latency;
                latencyTotal += res[j].latency;
                txSuccess++;
                gasTotal[gasBucket][1]++;
            }
            //秒级处理
            let retCount = Math.floor((res[j].finishTime - startTime) / 1000);
            if (res[j].status === 0 && retCount >= 0 && retCount < recDuration) {
                throughputBySec[retCount][1]++;
                latencyBySec[retCount][1] += res[j].latency;
            }
        }
    }
    for (let j = 0; j < throughputBySec.length; j++) {
        latencyBySec[j][1] = latencyBySec[j][1] / throughputBySec[j][1];
    }
    winston.info(JSON.stringify(throughputBySec));
    winston.info(JSON.stringify(latencyBySec));
    for (let i = 0; i < gasTotal.length; i++) {
        if(gasTotal[i][0] === 0){
            gasLatency[i][2] = 0;
            gasCompletion[i][2] = 0;
        } else if(gasTotal[i][1] === 0){
            gasLatency[i][2] = 0;
        } else {
            gasLatency[i][2] = gasTotal[i][2] / (gasTotal[i][1] * 1000);
            gasCompletion[i][2] = gasTotal[i][1] / gasTotal[i][0];
        }
    }
    winston.info(`Test rate ${rate}, duration ${duration}. Total tx ${txTotal}, success tx ${txSuccess}.`);
    let throughput = txSuccess / duration;
    let latency = 0;
    if(txSuccess !== 0)
        latency = latencyTotal / (txSuccess * 1000);
    let txCompletion = txSuccess / txTotal;
    winston.info(`Throughput ${throughput}, latency ${latency}, txCompletion ${txCompletion}.`);
    return {
        throughput: [rate, throughput],
        latency: [rate, latency],
        txCompletion: [rate, txCompletion],
        gasCompletion: gasCompletion,
        gasLatency: gasLatency,
        throughputBySec: [rate, throughputBySec],
        latencyBySec: [rate, latencyBySec]
    }
}

module.exports.processResult = processResult;
