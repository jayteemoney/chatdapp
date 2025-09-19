// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./PriceConsumerV3.sol";
import "./Chat.sol";

contract Automation is AutomationCompatible {
    using Strings for uint256;

    PriceConsumerV3 public priceConsumer;
    Chat public chat;
    uint256 public immutable interval;
    uint256 public lastTimeStamp;

    error NotReady();

    constructor(address priceConsumerAddress, address chatAddress, uint256 updateInterval) {
        if (priceConsumerAddress == address(0) || chatAddress == address(0) || updateInterval == 0) {
            revert("Invalid constructor parameters");
        }
        priceConsumer = PriceConsumerV3(priceConsumerAddress);
        chat = Chat(chatAddress);
        interval = updateInterval;
        lastTimeStamp = block.timestamp;
    }

    function checkUpkeep(bytes calldata /* checkData */) 
        external 
        view 
        override 
        returns (bool upkeepNeeded, bytes memory performData) 
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        performData = ""; 
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        if ((block.timestamp - lastTimeStamp) < interval) {
            revert NotReady();
        }
        lastTimeStamp = block.timestamp;

        int btcUsd = priceConsumer.getBtcUsdPrice();
        int ethUsd = priceConsumer.getEthUsdPrice();
        int bnbUsd = priceConsumer.getBnbUsdPrice();
        int btcEth = priceConsumer.getBtcEthPrice();
        int bnbEth = priceConsumer.getBnbEthPrice();

        string memory priceMessage = string(
            abi.encodePacked(
                "BTC/USD: $", _formatPrice(btcUsd, 8), " | ",
                "ETH/USD: $", _formatPrice(ethUsd, 8), " | ",
                "BNB/USD: $", _formatPrice(bnbUsd, 8), " | ",
                "BTC/ETH: ", _formatPrice(btcEth, 18), " ETH | ",
                "BNB/ETH: ", _formatPrice(bnbEth, 18), " ETH"
            )
        );

        chat.sendAutomatedGroupMessage(priceMessage);
    }

    function _formatPrice(int _price, uint8 _decimals) internal pure returns (string memory) {
        uint256 divisor = 10 ** _decimals;
        uint256 uprice = uint256(int256(_price));
        return string(
            abi.encodePacked(
                Strings.toString(uprice / divisor),
                ".",
                Strings.toString(uprice % divisor)
            )
        );
    }
}
