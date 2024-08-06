// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConvertor {
    function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {
        //  abi
        // Addreess : 0x694AA1769357215DE4FAC081bf1f309aDC325306
       
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        return uint256(answer * 1e10);
    }

    function getVersion() internal view returns (uint256) {
        AggregatorV3Interface aa = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        return aa.version();
    }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 currEthPrice = getPrice(priceFeed);
        uint256 ethAmountInUsd = (ethAmount * currEthPrice) / 1e18;
        return ethAmountInUsd;
    }
}
