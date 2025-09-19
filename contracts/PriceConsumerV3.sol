// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {
    AggregatorV3Interface internal btcUsdPriceFeed;
    AggregatorV3Interface internal ethUsdPriceFeed;
    AggregatorV3Interface internal bnbUsdPriceFeed;

    // Price feed addresses for Sepolia
    // BTC/USD: 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
    // ETH/USD: 0x694AA1769357215DE4FAC081bf1f309aDC325306
    // BNB/USD: 0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526

    constructor() {
        btcUsdPriceFeed = AggregatorV3Interface(
            0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
        );
        ethUsdPriceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        bnbUsdPriceFeed = AggregatorV3Interface(
            0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526
        );
    }

    function getBtcUsdPrice() public view returns (int) {
        (, int price, , , ) = btcUsdPriceFeed.latestRoundData();
        return price;
    }

    function getEthUsdPrice() public view returns (int) {
        (, int price, , , ) = ethUsdPriceFeed.latestRoundData();
        return price;
    }

    function getBnbUsdPrice() public view returns (int) {
        (, int price, , , ) = bnbUsdPriceFeed.latestRoundData();
        return price;
    }

    function getNormalizedPrice(AggregatorV3Interface _priceFeed)
        internal
        view
        returns (int)
    {
        (, int price, , , ) = _priceFeed.latestRoundData();
        uint8 decimals = _priceFeed.decimals();
        if (decimals < 18) {
            return price * int(10**(18 - decimals));
        } else if (decimals > 18) {
            return price / int(10**(decimals - 18));
        }
        return price;
    }

    function getBtcEthPrice() public view returns (int) {
        int normalizedBtcPrice = getNormalizedPrice(btcUsdPriceFeed);
        int normalizedEthPrice = getNormalizedPrice(ethUsdPriceFeed);

        if (normalizedEthPrice == 0) {
            revert("Normalized ETH price is zero");
        }
        return (normalizedBtcPrice * 1e18) / normalizedEthPrice;
    }

    function getBnbEthPrice() public view returns (int) {
        int normalizedBnbPrice = getNormalizedPrice(bnbUsdPriceFeed);
        int normalizedEthPrice = getNormalizedPrice(ethUsdPriceFeed);

        if (normalizedEthPrice == 0) {
            revert("Normalized ETH price is zero");
        }
        return (normalizedBnbPrice * 1e18) / normalizedEthPrice;
    }
}