'use strict';

const yaml = require('js-yaml');
const fs = require('fs');

module.exports.sleep = async function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports.parseYaml = function (filenameOrFilepath) {
    if (!filenameOrFilepath) {
        throw new Error('Util.parseYaml: Parameter is undefined');
    }

    let config ;
    try{
        config = yaml.safeLoad(fs.readFileSync(filenameOrFilepath),'utf8');
    }
    catch(e) {
        // console.log(e);
        throw new Error('failed to parse the yaml file');
    }
    return config;
};
