
'use strict';

let accountNum = 0;
let maxAccoount = 100;

module.exports.run = function () {
    if(accountNum < maxAccoount){
        accountNum++;
        return {
            func: 'createAccount',
            param: ['account' + accountNum, 1000000]
        }
    }
};
