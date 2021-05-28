pragma solidity >=0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false
    address private appContract;
    struct Airline {
        bool isRegistered;
        bool isConsensusReached;
        bool isFunded;
    }
    mapping(address=>Airline) airlines;
    uint256 numberOfAirlines = 0;
    mapping(address=>uint8) votes;
    mapping(address=>mapping(address=>bool)) voted;
    struct FlightInsurance {
        bytes32 flightKey;
        address payable client;
        uint256 amount;
    }
    FlightInsurance[] insurances;
    FlightInsurance[] payouts;


    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/


    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
                                (
                                ) 
                                public 
    {
        contractOwner = msg.sender;
        airlines[msg.sender] = Airline(true, true, true);
        numberOfAirlines = numberOfAirlines + 1;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/
    function authorizeCaller(address _appContract) public requireContractOwner requireIsOperational {
         appContract = _appContract;
    }
    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;
    }


    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus
                            (
                                bool mode
                            ) 
                            external
                            requireContractOwner 
    {
        operational = mode;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/
    function isAirline(address _airline) external view returns (bool) {
        return airlines[_airline].isRegistered==true;
    }
   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */   
    function registerAirline
                            (
                            address _airline
                            )
                            external
                            requireIsOperational
    {
        require(airlines[tx.origin].isRegistered==true);
        require(airlines[_airline].isRegistered==false);
        require(airlines[_airline].isConsensusReached==false);
        require(airlines[_airline].isFunded==false);
        if (numberOfAirlines < 4) {
            airlines[_airline] = Airline(true, true, true);
            numberOfAirlines = numberOfAirlines + 1;
        } else {
            airlines[_airline] = Airline(false, false, false);

        }
    }

    function voteForAirline
                            (
                            address _airline
                            )
                            external
                            requireIsOperational
    {
        require(airlines[tx.origin].isRegistered==true, "Airline that is voting should be registered");
        require(voted[_airline][tx.origin]==false, "You can't vote twice for the same airline");
        voted[_airline][tx.origin] = true;
        votes[_airline] = votes[_airline] + 1;
        if (votes[_airline] >= (numberOfAirlines.div(2).add(1))) {
            airlines[_airline] = Airline(false, true, false);
        }
    }

   /**
    * @dev Buy insurance for a flight
    *
    */
    event BoughtInsurance(address _airline, string _flight, uint256 _timestamp, address sender, uint256 amount);
    function buy
                            (
                                address _airline,
                                string calldata _flight,
                                uint256 _timestamp
                            )
                            external
                            payable
                            requireIsOperational
    {
        require(msg.value <= 1 ether, "Insurance price must be below 1 ether");
        require(airlines[_airline].isRegistered == true, "Airline should be registered.");
        FlightInsurance memory insurance = FlightInsurance(getFlightKey(_airline, _flight, _timestamp), tx.origin, msg.value);
        insurances.push(insurance);
        emit BoughtInsurance(_airline, _flight, _timestamp, msg.sender, msg.value);
        // creditInsurees(getFlightKey(_airline, _flight, _timestamp));
    }

    /**
     *  @dev Credits payouts to insurees
    */
    event Credit(bytes32 flightKey);
    function creditInsurees
                                (
                                    bytes32 _flightKey
                                )
                                public
                                requireIsOperational
    {
//        require(msg.sender==appContract, "You can call this contract only from authorized address.");
//        require(insurances[0].flightKey == _flightKey || insurances[1].flightKey == _flightKey, "No match for insurance with provided flight key.");
        for (uint i=0; i<insurances.length; i++) {
            if (insurances[i].flightKey == _flightKey) {
                payouts.push(insurances[i]);
//                require(false, "Insurance added to payouts.");
                emit Credit(_flightKey);
            }
        }
    }


    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    event AmountPaid(uint256 amount);
    function pay
                            (
                                address _airline,
                                string memory _flight,
                                uint256 _timestamp,
                                address _client
                            )
                            public
                            payable
                            requireIsOperational
    {
        for (uint i=0; i<payouts.length; i++) {
//            require(payouts[i].flightKey != getFlightKey(_airline, _flight, _timestamp) && payouts[i].client != _client,"Client has been found.");
            if (payouts[i].flightKey == getFlightKey(_airline, _flight, _timestamp) && payouts[i].client == _client) {
//                require(false, "Payed ether.");
                emit AmountPaid(payouts[i].amount.mul(3).div(2));
                address(uint160(payouts[i].client)).transfer(payouts[i].amount.mul(3).div(2));
            }
        }
    }

   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */   
    function fund
                            (   
                            )
                            public
                            payable
    {
        require(airlines[tx.origin].isRegistered == false);
        require(airlines[tx.origin].isConsensusReached == true);
        require(airlines[tx.origin].isFunded == false);
        require(msg.value >= 1 ether);
        airlines[tx.origin] = Airline(true, true, true);
        numberOfAirlines = numberOfAirlines + 1;
    }

    function getFlightKey
                        (
                            address _airline,
                            string memory _flight,
                            uint256 _timestamp
                        )
                        internal
                        view
                        requireIsOperational
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(_airline, _flight, _timestamp));
    }

    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    function() requireIsOperational
                            external 
                            payable 
    {
        fund();
    }


}

