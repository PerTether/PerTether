
'use strict';

const setup = require('./setup/setup');
const account = require('./util/account');
const util = require('./util/util');
const winston = require('winston');
const contract = require('./transaction/contractInfo');
const client = require('./transaction/clientControl');
const load = require('./transaction/loadControl');
const failureManager = require('./failure/failureManager');
const dataAnalysis = require('./dataAnalysis/processData');
const path = require('path');
const fs1 = require('fs');

let configFile;
let resultPath;

function setConfig(file) {
    configFile = file;
}
function setResultPath(rPath) {
    resultPath = rPath;
}

async function main(){
    let program = require('commander');
    program.version('0.1')
        .option('-c, --config <file>', 'config file of PerTether, default is config.json', setConfig)
        .option('-p, --path <rPath>', 'result path of PerTether, default is ./', setResultPath)
        .parse(process.argv);
    await run(configFile, resultPath);
}

async function run(configFile, resultPath) {
    const fs = require('fs-extra');
    let absConfigFile;
    let absResultPath;
    if(typeof configFile === 'undefined') {
        absConfigFile = path.join(__dirname, '..', 'config.json');
    }
    else {
        absConfigFile = path.isAbsolute(configFile) ? configFile : path.join(__dirname, '..', configFile);
    }
    if(!fs.existsSync(absConfigFile)) {
        winston.error('file ' + absConfigFile + ' does not exist');
        return;
    }
    let absConfigObject = require(absConfigFile);
    if(typeof resultPath === 'undefined') {
        absResultPath = path.join(__dirname, '..');
    }
    else {
        absResultPath = path.isAbsolute(resultPath) ? resultPath : path.join(__dirname, '..', resultPath);
    }
    // winston.info(fs1.readFileSync(path.join(absResultPath, 'report01.json')).toString());
    let difficulties = absConfigObject.difficulty;
    let gasLimits = absConfigObject.gasLimit;
    let clientType = absConfigObject.clientType;
    let startRate = absConfigObject.startTps;
    let duration = absConfigObject.duration;
    let smartContract = absConfigObject.smartContract;

    let configNodeCount = absConfigObject.nodeCount;
    let minerCount = absConfigObject.minerCount;
    let loadConfig = absConfigObject.loadConfig;

    if(typeof minerCount === 'undefined')
        minerCount = 1;
    for (let i = 0; i < configNodeCount; i++) {
        fs1.copyFileSync('config/geth/start_geth_common.sh', `src/setup/geth/docker/tmp/node${i}/work/start_geth.sh`);
    }
    for (let i = 0; i < minerCount; i++) {
        fs1.copyFileSync('config/geth/start_geth_miner.sh', `src/setup/geth/docker/tmp/node${i*2}/work/start_geth.sh`);
    }

    //start and stop docker
    winston.info('PerTether starts a new test task.');
    let configObject = util.parseYaml('config/config.yml');
    let failureConfigObject = util.parseYaml('config/failure.yml');
    winston.info(JSON.stringify(failureConfigObject));
    let tFinalResult = {
        timestamp: Date.now(),
        difficulty: difficulties,
        gasLimit: gasLimits,
        nodeCount: 2,
        startUpType: "docker",
        clientType: clientType,
        result: []
    };
    let chainCount = 0;
    for (let j = 0; j < gasLimits.length; j++) {
        for (let i = 0; i < difficulties.length; i++) {
            setup.writeGenesis(clientType, difficulties[i], gasLimits[j], configObject.nodes.length);
            let startStatus = await setup.startTestChain(clientType);
            if (startStatus !== 0) {
                winston.error('Blockchain started failed.');
                return;
            }
            await util.sleep(20000);
            await setup.start(configObject);
            let nodeCount = configObject.nodes.length;

            client.startClients(nodeCount);
            let rate = startRate;
            let eachClientRate = rate / nodeCount;
            let finalResult = {
                timestamp: 0,
                difficulty: difficulties[i],
                gasLimit: gasLimits[j],
                throughput: [],
                generalLatency:[],
                txCompeltion: [],
                // gasCompletion: [],
                detailedLatency: [],
                throughputBySec: [],
                latencyBySec: [],
                failureInfo: null
            };
            let results = [];
            if (typeof loadConfig === 'undefined') {
                failureManager.initFailures(configObject.nodes, clientType, account.getAccounts(),
                    eachClientRate, contract.getContractConfig(smartContract), failureConfigObject.failure, results);
                failureManager.startFailureTimer();
            }
            else
                load.startLoadTimer(loadConfig);
            await client.startTest(configObject.nodes, account.getAccounts(), eachClientRate, duration, contract.getContractConfig(smartContract), results);
            winston.info(results);
	    let data = dataAnalysis.processResult(results, rate, duration);
            winston.info(`Result rate ${eachClientRate * nodeCount} ${data}`);
            finalResult.failureInfo = failureManager.getCurrentFailureInfo();
            finalResult.throughput.push(data.throughput);
            finalResult.generalLatency.push(data.latency);
            finalResult.txCompeltion.push(data.gasCompletion);
            // finalResult.gasCompletion.push(data.gasCompletion);
            finalResult.detailedLatency.push(data.gasLatency);
            finalResult.throughputBySec.push(data.throughputBySec);
            finalResult.latencyBySec.push(data.latencyBySec);
            client.stop();
            finalResult.timestamp = Math.floor(Date.now()/1000);
            tFinalResult.result.push(finalResult);
            let stopStatus = await setup.stopTestChain(clientType);
            if (stopStatus !== 0)
                winston.error('Docker stopped failed. Please stop manually.');
            let finalResultStr = JSON.stringify(finalResult);
            // if (typeof resultPath !== 'undefined')
            //     fs1.writeFileSync(path.join(resultPath, `report${chainCount}.json`), finalResultStr);
            chainCount ++;
        }
    }
    winston.info(`##########True Final Result##########`);
    let tFinalResultStr = JSON.stringify(tFinalResult);
    winston.info(tFinalResultStr);
    if (typeof resultPath !== 'undefined')
        fs1.writeFileSync(path.join(resultPath, `report.json`), tFinalResultStr);
    else
        fs1.writeFileSync(`result.json`, tFinalResultStr);

}

(async () => {
    try {
        await main();
        process.exit(0);
    } catch (err) {
        winston.error(`Error while executing the task: ${err.stack ? err.stack : err}`);
        process.exit(1);
    }
})();
