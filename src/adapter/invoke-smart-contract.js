
'use strict';

const winston = require('winston');
const fs = require('fs');

//gasprice unit gwei
module.exports.submitTransaction = async function (nodeName, web3, address, abi, account, passphrase, gasprice, args) {
    let result = {
        status: 1,
        gasprice: gasprice,
        startTime: Date.now(),
        finishTime: -1,
        latency: -1
    };
    // winston.info(`Debug: address ${address} args ${JSON.stringify(args)} time ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}`);
    let data = web3.eth.abi.encodeFunctionCall(abi, args);
    let isTimeout = true;
    let send = web3.eth.sendTransaction({
        from: account,
        gasPrice: parseInt(gasprice * 1000000000).toString(),
        gas: '200000',
        to: address,
        value: "100000000000000000",
        data: data
    }).on('confirmation', function (confirmationNumber, receipt) {
        isTimeout = false;
        result.status = 0;
        result.finishTime = Date.now();
        result.latency = result.finishTime - result.startTime;
        winston.info(`${nodeName}: TX confirmed number ======> ${JSON.stringify(receipt.blockNumber)}`);
    }).on('error', function (error) {
        isTimeout = false;
        winston.error(`${nodeName}: TX error`);
    }).then(function (receipt) {
        return Promise.resolve(result);
    }, function (error) {
        return Promise.resolve(result);
    });
    let timeout = new Promise(function(resolve, reject){
        setTimeout(function(){
            if(isTimeout) {
                winston.debug(`${nodeName}: TX timeout!`);
                result.finishTime = Date.now();
                result.latency = result.finishTime - result.startTime;
                resolve(result);
            }
        }, 120000);
    });
    return await Promise.race([send, timeout]);
};

module.exports.submitQuery = async function(context, contractID, args){
    //TODO
};
