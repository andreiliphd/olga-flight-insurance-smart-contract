# Olga - Flight Insurance Smart Contract

============

Smart contract flight insurance.

---

## Features
- Dashboard
- Payouts
- Separation of concerns
- Operational status for contracts


## Dependencies

- "@babel/cli": "^7.14.3",
- "@babel/core": "^7.14.3",
- "@babel/plugin-proposal-class-properties": "^7.13.0",
- "@babel/plugin-proposal-object-rest-spread": "^7.14.2",
- "@babel/plugin-transform-runtime": "^7.14.3",
- "@babel/preset-env": "^7.14.2",
- "babel-core": "^6.26.3",
- "babel-loader": "^8.2.2",
- "babel-polyfill": "^6.26.0",
- "babel-preset-es2015": "^6.24.1",
- "babel-preset-stage-0": "^6.24.1",
- "bignumber.js": "8.0.2",
- "css-loader": "^5.2.6",
- "express": "^4.17.1",
- "file-loader": "^6.2.0",
- "html-loader": "^2.1.2",
- "html-webpack-plugin": "^5.3.1",
- "openzeppelin-solidity": "^2.5.1",
- "start-server-webpack-plugin-2": "^1.1.4",
- "style-loader": "^2.0.0",
- "superstatic": "^7.1.0",
- "@types/node": "^15.6.1",
- "truffle": "^5.3.7",
- "truffle-assertions": "^0.9.2",
- "truffle-hdwallet-provider": "^1.0.17",
- "ganache-cli": "^6.12.2",
- "web3": "^1.3.6",
- "webpack": "5.38.1",
- "webpack-cli": "^4.7.0",
- "webpack-dev-server": "^3.11.2",
- "webpack-node-externals": "^3.0.0",
- "os-browserify": "^0.3.0",
- "https-browserify": "^1.0.0",
- "stream-http": "^3.2.0",
- "stream-browserify": "^3.0.0",
- "crypto-browserify": "^3.12.0",
- "assert": "^2.0.0",
- "buffer": "^6.0.3"

---

## Setup
Clone this repo:

```
git clone git@github.com:andreiliphd/olga-flight-insurance-smart-contract.git
```

---


## Usage
Just run:
```
npm install
truffle migrate --network ganache --reset
npm run dapp
npm run server
```
After that visit localhost:8000.

## Test
Just run:
```
truffle develop
test
```
---

## License
MIT