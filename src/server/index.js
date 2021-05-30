import http from 'http'
import Web3 from 'web3';
import express from 'express';
var fs = require('fs');

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});
server.listen(3000)
let accounts;
let provider = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8545"));
const networkId = await provider.eth.net.getId();
let fsDataJson = JSON.parse(fs.readFileSync("build/contracts/FlightSuretyData.json", 'utf8'));
const deployedNetworkData = fsDataJson.networks[networkId];
let instanceData = new provider.eth.Contract(
    fsDataJson.abi,
    deployedNetworkData.address,
);
console.log("Data contract ", deployedNetworkData.address);
let fsAppJson = JSON.parse(fs.readFileSync("build/contracts/FlightSuretyApp.json", 'utf8'));
const deployedNetworkApp = fsAppJson.networks[networkId];
let instanceApp = new provider.eth.Contract(
    fsAppJson.abi,
    deployedNetworkApp.address,
);
console.log("App contract ", deployedNetworkApp.address);
await provider.eth.getAccounts(async (error, accts) => {
    accounts = accts;
    console.log("Accounts ", accounts);
});
let fee = Web3.utils.toWei("1", "ether");
const TEST_ORACLES_COUNT = 25;
const STATUS_CODE_UNKNOWN = 0;
const STATUS_CODE_ON_TIME = 10;
const STATUS_CODE_LATE_AIRLINE = 20;
const STATUS_CODE_LATE_WEATHER = 30;
const STATUS_CODE_LATE_TECHNICAL = 40;
const STATUS_CODE_LATE_OTHER = 50;
let statuses = [STATUS_CODE_UNKNOWN, STATUS_CODE_ON_TIME, STATUS_CODE_LATE_AIRLINE, STATUS_CODE_LATE_WEATHER, STATUS_CODE_LATE_TECHNICAL,
    STATUS_CODE_LATE_OTHER];

let firstAirline = accounts[0];
let secondAirline = accounts[2];
let thirdAirline = accounts[3];
let fourthAirline = accounts[4];
let fifthAirline = accounts[5];
let sixthAirline = accounts[6];

for (let a = 1; a < TEST_ORACLES_COUNT; a++) {
    await instanceApp.methods.registerOracle().send({from: accounts[a], value: fee, gas:3000000});
    let result = await instanceApp.methods.getMyIndexes().call({from: accounts[a]});
    console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`);
}
instanceApp.events.OracleRequest({
    fromBlock: 0
}, async function (error, event) {
    if (error) console.log(error)
    console.log(event)
    for (let a = 1; a < TEST_ORACLES_COUNT; a++) {

        // Get oracle information
        let oracleIndexes = await instanceApp.methods.getMyIndexes().call({from: accounts[a]});
        try {
            // Submit a response...it will only be accepted if there is an Index match
            let randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            let isInsurancePaymentReady = await instanceApp.methods.submitOracleResponse(oracleIndexes[2], event.returnValues.airline, event.returnValues.flight, event.returnValues.timestamp, STATUS_CODE_LATE_OTHER).send({from: accounts[a], gas:3000000});
            console.log("Successfully sent response with status " + randomStatus);
        } catch (e) {
            // Enable this when debugging
            console.log("Smart contract not accepting data");
        }
    }
});

const app = express();
app.get('/api', (req, res) => {
    res.send({
        message: 'An API for use with your Dapp!'
    })
})

export default app;


// if (module.hot) {
//  module.hot.accept('./server', () => {
//   server.removeListener('request', currentApp)
//   server.on('request', app)
//   currentApp = app
//  })
// }
