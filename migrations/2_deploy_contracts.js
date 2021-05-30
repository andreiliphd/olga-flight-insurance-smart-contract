const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");
const fs = require('fs');

module.exports = async function(deployer, network ,accounts) {

    let instanceData;
    deployer.deploy(FlightSuretyData)
    .then((instance) => {
        instanceData = instance;
        return deployer.deploy(FlightSuretyApp, FlightSuretyData.address)
                .then(async (instance) => {
                    let status = await instanceData.authorizeCaller(instance.address);
                    console.log("Status of transaction ", status);
                    let firstAirline = accounts[0];
                    let secondAirline = accounts[2];
                    let thirdAirline = accounts[3];
                    let fourthAirline = accounts[4];

                    // ACT
                    try {
                        await instance.registerAirline(secondAirline, {from: firstAirline});
                        await instance.registerAirline(thirdAirline, {from: secondAirline});
                        await instance.registerAirline(fourthAirline, {from: thirdAirline});
                    } catch (e) {
                        console.log("Error registering airline.");
                    }
                    let result2 = await instance.isAirline.call(secondAirline);
                    console.log("Status of transaction ", result2);
                    let result3 = await instance.isAirline.call(thirdAirline);
                    console.log("Status of transaction ", result3);
                    let result4 = await instance.isAirline.call(fourthAirline);
                    console.log("Status of transaction ", result4);

                    let config = {
                        localhost: {
                            url: 'http://localhost:8545',
                            dataAddress: FlightSuretyData.address,
                            appAddress: FlightSuretyApp.address
                        }
                    }
                    fs.writeFileSync(__dirname + '/../src/dapp/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
                    fs.writeFileSync(__dirname + '/../src/server/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
                });
    });
}