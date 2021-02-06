
'use strict';

const winston = require('winston');
const fs = require('fs');

let contracts = {};

module.exports.newContract = function (contractConfig, contractObject) {
    contracts[contractConfig.name] = {};
    contracts[contractConfig.name].abi = contractObject.abi;
    contracts[contractConfig.name].address = contractObject.address;
    contracts[contractConfig.name].workload = contractConfig.workload;
    winston.info(`Contract ${contractConfig.name} saved.`);
};

module.exports.getContractConfig = function (contractName) {
    return contracts[contractName];
};
