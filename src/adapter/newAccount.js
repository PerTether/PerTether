
'use strict';

const Web3 = require('web3');


let proxy = 'http://localhost:8545';
let web3 = new Web3(Web3.providers.HttpProvider(proxy));

let key = web3.utils.randomHex(32);
console.log(key);
web3.eth.personal.newAccount(key).then(console.log);
