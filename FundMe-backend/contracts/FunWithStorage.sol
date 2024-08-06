// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract FunWithStorage{
    uint256 public favNum;
    bool public  someBool;
    uint256[] public array;
    mapping(uint256=>bool) public myMap;
    uint256 public constant NOT_IN_STORAGE=123;
    uint256 public immutable i_not_in_storage;
    constructor(){
        favNum=155;
        someBool=true;
        array.push(55);
        myMap[0]=false;
        i_not_in_storage=155;
    }
    function doStuff() public{
        uint256 newVar=favNum+6;
    }
}