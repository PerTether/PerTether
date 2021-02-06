
'use strict';

const account = require('./account');
const Web3 = require('web3');

let providers = {};

module.exports.initProviders = async function (config) {
    config.forEach(function (item, index) {
        providers[item.nodeName] = new Web3(item.proxy);
    });
    await account.readAccounts(providers);
};

module.exports.getProvider = function (node){
    return providers[node];
};

module.exports.getProviders = function (){
    return providers;
};
