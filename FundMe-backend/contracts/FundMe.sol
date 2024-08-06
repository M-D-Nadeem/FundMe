// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./PriceConvertorLib.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
contract FundMe {
//Here i_ ->Immutable varible {Does not occupy space in storage directly writen in bytes}
//     s_ ->Storage type {occupy space in memory takes lots of gas}      
    using PriceConvertor for uint256;
    // For staging test as we use sepolia testnet to test and we don't have 50 usd/eth to test
    // uint256 public constant MINIMUMUSD = 0.00000001 * 1e18;   
    uint256 public constant MINIMUMUSD = 50 * 1e18;
    address private immutable i_owner;

//using private var and getters to access private var from test.js, as private var are gas effecient     
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;
    AggregatorV3Interface private s_priceFeed;

    constructor(address s_priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(s_priceFeedAddress);
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUMUSD,
            "Din't send enough"
        );
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public only_owner {
        for (uint256 i = 0; i < s_funders.length; i++) {
            address funder = s_funders[i];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool callSucess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSucess, "Call Failed");
    }

    function cheaper_withdraw() public only_owner {
//Here s_funders is assigned to funders which is memory type so it in not writen in storage
        address[] memory funders=s_funders;
        for(uint256 i=0;i<funders.length;i++){
            address funder=funders[i];
            s_addressToAmountFunded[funder] = 0; 
            }
        s_funders = new address[](0);
        (bool callSucess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSucess, "Call Failed");
    }

    modifier only_owner() {
        require(msg.sender == i_owner, "Sender is not the owner!");
        _;
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function getFunder(uint256 index) public view returns (address){
        return s_funders[index];
    }
    function getAddressToAmountFunded(address funder) public view returns(uint256){
        return s_addressToAmountFunded[funder];
    }
    function getPriceFeed() public view returns (AggregatorV3Interface){
        return s_priceFeed;
    }
    function getOwner() public view returns (address) {
        return i_owner;
    }

}
