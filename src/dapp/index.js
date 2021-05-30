
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';
var Buffer = require('buffer/').Buffer;


(async() => {

    let result = null;

    let contract = new Contract(() => {

        DOM.elid('airline').addEventListener('click', (ev) => {
            let currentValue = ev.target.innerText;
            DOM.elid('selected-airline').innerText = currentValue;
        })
        DOM.elid('airline-purchase').addEventListener('click', (ev) => {
            let currentValue = ev.target.innerText;
            DOM.elid('selected-airline-purchase').innerText = currentValue;
        })
        DOM.elid('register').addEventListener('click', (ev) => {
            let currentValue = DOM.elid('selected-airline').innerText;
            contract.registerAirline(currentValue, (error, result) => {
                display('Register airline', 'registerAirline(airline)\n' +
                    '.send({ from: self.owner});\n',{
                    error: error, value: result} );
            });
        });
        DOM.elid('vote').addEventListener('click', () => {
            let currentValue = DOM.elid('selected-airline').innerText;
            // Write transaction
            contract.voteForAirline(currentValue, (error, result) => {
                display('Vote for airline', 'voteForAirline(airline).send({ from: self.owner});\n', {
                    error: error, value: result})
            });
        });
        DOM.elid('fund').addEventListener('click', () => {
            let currentValue = DOM.elid('selected-airline').innerText;
            // Write transaction
            contract.fund((error, result) => {
                display('Fund airline', 'fund().send({ from: self.owner, value: price});\n', {
                    error: error, value: result})
            });
        });
        DOM.elid('check').addEventListener('click', () => {
            let currentValue = DOM.elid('selected-airline').innerText;
            // Write transaction
            contract.isAirline(currentValue, (error, result) => {
                display('Check if airline is registered', 'isAirline(airline).send({ from: self.owner});\n', {
                    error: error, value: result})
            });
        });
        DOM.elid('status-app').addEventListener('click', () => {
            contract.isOperationalApp((error, result) => {
                display('Check if app contract is operational', 'isOperational().send({ from: self.owner});\n', {
                    error: error, value: result})
            });
        });
        DOM.elid('status-data').addEventListener('click', () => {
            contract.isOperationalData((error, result) => {
                display('Check if data contract is operational', 'isOperational().send({ from: self.owner});\n', {
                    error: error, value: result})
            });
        });
        DOM.elid('set-data').addEventListener('click', () => {
            let currentValue = DOM.elid('contract-data-status').value;
            console.log(currentValue);
            console.log("Current value of mode for app ", currentValue==='true');
            contract.setOperatingStatusData(currentValue==='true',(error, result) => {
                display('Set operational status', 'setOperationalStatus().send({ from: self.owner});\n', {
                    error: error, value: result})
            });
        });
        DOM.elid('set-app').addEventListener('click', () => {
            let currentValue = DOM.elid('contract-app-status').value;
            console.log(currentValue);
            console.log("Current value of mode for app ", currentValue==='true');
            contract.setOperatingStatusApp(currentValue==='true',(error, result) => {
                display('Set operational status', 'setOperationalStatus().send({ from: self.owner});\n', {
                    error: error, value: result})
            });
        });
        DOM.elid('purchase').addEventListener('click', () => {
            let airline = DOM.elid('selected-airline-purchase').innerText;;
            let flight = DOM.elid('flight-number').value;
            let timestamp = DOM.elid('timestamp').value;
            let price = DOM.elid('price').value;
            contract.registerFlight(airline, flight, timestamp, price,(error, result) => {
                display('Buy insurance', 'registerFlight(airline, flight, timestamp)\n' +
                    '            .send({ from: self.owner, value: price});\n', {
                    error: error, value: result})
            });
        });
        DOM.elid('fetch').addEventListener('click', () => {
            let airline = DOM.elid('selected-airline-purchase').innerText;;
            let flight = DOM.elid('flight-number').value;
            let timestamp = DOM.elid('timestamp').value;
            contract.fetchFlightStatus(airline, flight, timestamp, (error, result) => {
                display('Update flight status', 'fetchFlightStatus(airline, flight, timestamp)' +
                    '.send({ from: self.owner});\n', {
                    error: error, value: result})
            });
        });
        DOM.elid('withdraw').addEventListener('click', () => {
            let airline = DOM.elid('selected-airline-purchase').innerText;;
            let flight = DOM.elid('flight-number').value;
            let timestamp = DOM.elid('timestamp').value;
            contract.pay(airline, flight, timestamp, (error, result) => {
                display('Withdraw money', 'pay(airline, flight, timestamp, self.owner)'+
                    '.send({ from: self.owner});\n', {
                    error: error, value: result})
            });
        });
        contract.isOperationalApp((error, result) => {
            console.log(error,result);
            display('Operational status app contract', 'fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)\n' +
                '.send({ from: self.owner}',  { label: 'Operational Status', error: error, value: result});
        });

    });
})();


function display(title, description, results) {
    let displayDiv = DOM.elid("event-list");
    let link = DOM.a({
        className: "list-group-item list-group-item-action", href: "#"}
    );
    let dataDiv = DOM.div({className: "d-flex w-100 justify-content-between"});
    dataDiv.appendChild(DOM.h3({
            className: "mb-1"}, title
        ));
    dataDiv.appendChild(DOM.small({}, new Date().toISOString()));
    link.appendChild(dataDiv);
    link.appendChild(DOM.p({className: 'mb-1'}, results.error ? String(results.error.message) : String(results.value)));
    link.appendChild(DOM.small({className: 'text-muted'}, description));
    displayDiv.appendChild(link);
}








