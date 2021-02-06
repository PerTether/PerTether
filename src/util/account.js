
'use strict';

const fs = require('fs');
const path = require('path');
const winston = require('winston');

let accounts = {};

module.exports.readAccounts = async function readAccounts(providers){
    let accountData = fs.readFileSync(path.join(__dirname, '..', '..', 'config', 'account.txt'));
    let lines = accountData.toString().split('\n');
    let promises = [];
    lines.forEach((item, index) => {
        let pair = item.split(' ');
        if(pair.length !== 3)
            return;
        // accounts.push(pair);
        promises.push(unlockAccount(pair[0], pair[1], pair[2], providers));

    });
    await Promise.all(promises);
};

async function unlockAccount(node, address, privateKey, providers)  {
    try {
        winston.info(`Unlock account ${address}, privateKey ${privateKey}`);
        await providers[node].eth.personal.unlockAccount(address, privateKey, 10000);
        if (typeof accounts[node] !== 'undefined') {
            accounts[node].push([address, privateKey]);
        }
        else
            accounts[node] = [[address, privateKey]];
    } catch(e) {
        winston.error(e);
    }
}

module.exports.getAccounts = function (){
    return accounts;
};

module.exports.randomAccount = function (node){
    let index = Math.floor(Math.random() * accounts[node].length);
    return accounts[node][index];
};

