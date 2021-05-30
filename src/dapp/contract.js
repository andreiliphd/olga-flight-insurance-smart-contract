import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Web3 from 'web3';

export default class Contract {
    constructor(callback) {
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
    }

    async initialize(callback) {
        let self = this;
        if (window.ethereum) {
            // use MetaMask's provider
            this.web3 = new Web3(window.ethereum);
            await window.ethereum.enable(); // get permission to access accounts
            ethereum.on('accountsChanged', function (accounts) {
                // Time to reload your interface with accounts[0]!
                self.owner = accounts[0];
            });
        } else {
            console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",);
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
            this.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"),);
        }
        const networkId = await this.web3.eth.net.getId();
        let fsDataJson = await fetch("contracts/FlightSuretyData.json").then(response => response.json());
        const deployedNetworkData = fsDataJson.networks[networkId];
        this.flightSuretyData = new this.web3.eth.Contract(
            fsDataJson.abi,
            deployedNetworkData.address,
        );
        console.log("Data contract ", deployedNetworkData.address);
        let fsAppJson = await fetch("contracts/FlightSuretyApp.json").then(response => response.json());
        const deployedNetworkApp = fsAppJson.networks[networkId];
        this.flightSuretyApp = new this.web3.eth.Contract(
            fsAppJson.abi,
            deployedNetworkApp.address,
        );
        console.log("App contract ", deployedNetworkApp.address);


        await this.web3.eth.getAccounts((error, accts) => {
            this.owner = accts[0];
            let counter = 1;
            this.airlines = [accts[0], accts[2], accts[3], accts[4]];
            //
            // while(this.airlines.length < 5) {
            //     this.airlines.push(accts[counter++]);
            // }
            while(this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }
            callback();
        });
    }
    registerAirline(airline, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .registerAirline(airline)
            .send({ from: self.owner}, (error, result) => {
                callback(error, result);
            });
    }
    voteForAirline(airline, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .voteForAirline(airline)
            .send({ from: self.owner}, (error, result) => {
                callback(error, result);
            });
    }
    fund(callback) {
        let self = this;
        let price = Web3.utils.toWei("10", "ether");
        self.flightSuretyApp.methods
            .fund()
            .send({ from: self.owner, value: price}, (error, result) => {
                callback(error, result);
            });
    }
    isAirline(airline, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .isAirline(airline)
            .call({ from: self.owner}, (error, result) => {
                callback(error, result);
            });
    }
    isOperationalApp(callback) {
        let self = this;
        self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner}, (error, result) => {
                callback(error, result)});
    }
    isOperationalData(callback) {
        let self = this;
        self.flightSuretyData.methods
            .isOperational()
            .call({ from: self.owner}, (error, result) => {
                callback(error, result)});
    }
    setOperatingStatusData(status, callback) {
        let self = this;
        self.flightSuretyData.methods
            .setOperatingStatus(status)
            .send({ from: self.owner}, (error, result) => {
                callback(error, result)});
    }
    setOperatingStatusApp(status, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .setOperatingStatus(status)
            .send({ from: self.owner}, (error, result) => {
                callback(error, result)});
    }
    registerFlight(airline, flight, timestamp, price, callback) {
        let self = this;
        price = Web3.utils.toWei(price, "ether");
        self.flightSuretyApp.methods
            .registerFlight(airline, flight, timestamp)
            .send({ from: self.owner, value: price}, (error, result) => {
                callback(error, result);
            });
    }
    fetchFlightStatus(airline, flight, timestamp, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .fetchFlightStatus(airline, flight, timestamp)
            .send({ from: self.owner}, (error, result) => {
                callback(error, result);
            });
    }
    pay(airline, flight, timestamp, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .pay(airline, flight, timestamp, self.owner)
            .send({ from: self.owner}, (error, result) => {
                callback(error, result);
            });
    }

}