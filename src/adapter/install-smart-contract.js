
'use strict';

const winston = require('winston');
const Web3 = require('web3');
const solc = require('solc');
const fs = require ('fs');
const accountUtil = require('../util/account');
const providers = require('../util/providers');
const util = require('../util/util');

module.exports.run = async function (node, contractPath, contractName) {
    // web3sync.setWeb3(config.proxy);
    const web3 = providers.getProvider(node);
    winston.info(`Installing smart contract ${contractName} ...`);
    let accountPair = accountUtil.randomAccount(node);
    let accountPrivateKey = accountPair[1];
    let accountAddress = accountPair[0];
    let contractSource = fs.readFileSync(contractPath, 'utf-8');
    winston.info(`Compiling smart contract ${contractName} ...`);
    const output = solc.compile(contractSource, 1);
    // winston.info(contractBytecode);
// `output` here contains the JSON output as specified in the documentation
    let _contractName = ':' + contractName;
    const bytecode = output.contracts[_contractName].bytecode;
    const abi = output.contracts[_contractName].interface;
    let jsonABI = JSON.parse(abi);
    const contractStructure = new web3.eth.Contract(jsonABI);
    winston.info(`Deploying smart contract ${contractName} ...`);
    let isFailed = true;
    let finalInstance;
    while (isFailed)  {
        let contractInstance = contractStructure.deploy({
            data: '0x' + bytecode
        }).send({
            from: accountAddress,
            gas: 1500000,
            gasPrice: '20000000000'
        }).then((newContractInstance) => {
            winston.info(newContractInstance.options.address); // instance with the new contract address
            return Promise.resolve({
                address: newContractInstance.options.address,
                abi: JSON.parse(abi)
            });
        });

        finalInstance = await Promise.race([contractInstance, new Promise((resolve, reject) => setTimeout(reject, 1200000))]).then(function (newContractInstance) {
            isFailed = false;
            return Promise.resolve(newContractInstance);
        }).catch(function () {
            winston.error(`Install smart contract timeout! Retry...`);
        });
    }

    winston.info(`Install success: ${JSON.stringify(finalInstance)}`);
    winston.info('======================');
    return finalInstance;

};
