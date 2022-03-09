//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import { StringUtils } from "./libraries/StringUtils.sol";
import "hardhat/console.sol";

contract Domains {
    string public topLevelDomain;

    mapping(string => address) public domains;
    mapping(string => string) public records;

    constructor(string memory _topLevelDomain) payable {
        topLevelDomain = _topLevelDomain;
        console.log("%s name service deployed", _topLevelDomain);
    }

    function price(string calldata name) public pure returns(uint) {
        uint len = StringUtils.strlen(name);
        require(len > 0, "Domain name is required !");

        if (len == 3) {
            // 5 MATIC = 5 000 000 000 000 000 000 (18 decimals). 
            // We're going with 0.5 Matic cause the faucets don't give a lot
            return 5 * 10**17;
        } else if (len == 4) {
            // To charge smaller amounts, reduce the decimals. This is 0.3
            return 3 * 10**17; 
        } else {
            return 1 * 10**17;
        }
    }

    function register(string calldata name) public payable {
        require(domains[name] == address(0), "Domain already registered !");

        uint _price = price(name);

        // Check if enough Matic was paid in the transaction
        require(msg.value >= _price, "Not enough Matic paid");

        domains[name] = msg.sender;
        console.log("%s has registered a domain!", msg.sender);
    }

    function getAddress(string calldata name) public view returns(address) {
        return domains[name];
    }

    function setRecord(string calldata name, string calldata record) public {
        require(domains[name] == msg.sender, "Unauthorised Owner !");
        records[name] = record;
    }

    function getRecord(string calldata name) public view returns(string memory) {
        return  records[name];
    }
}
