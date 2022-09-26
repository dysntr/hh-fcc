// Get Funds from users
// Withdraw funds
// Set a minimum funding value in USD
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./PriceConverter.sol";
error NotOwner();

contract FundMe {
    using PriceConverter for uint256;
    uint256 public constant MINIMUM_USD = 50 * 1e18; // 1* 10 ** 18

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    address public immutable i_owner;

    constructor() {
        i_owner = msg.sender;
    }

    function fund() public payable {
        // Want to be able to set a minimum fund amount in USD
        // 1. How do we send ETH to contract.
        // msg.value will have 18 decimail places for eth
        //require (getConversionRate(msg.value) >= minimumUsd, "Didn't send enough"); //1e18 = 1 * 10^18 = 1 ETH
        require(
            msg.value.getConversionRate() >= MINIMUM_USD,
            "Didn't send enough"
        ); //1e18 = 1 * 10^18 = 1 ETH
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function getPrice() public view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        );
        (
            uint80 roundId,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        //price of eth in terms of USD
        //eg. 3000.00000000
        // to make the decimal places of msg.value and price to match you need to multiple it by 1e10
        return uint256(price * 1e10);
    }

    function getVersion() public view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        );
        return priceFeed.version();
    }

    function getConversionRate(uint256 ethAmount)
        public
        view
        returns (uint256)
    {
        uint256 ethPrice = getPrice();
        //3000_000000000000000000 => 18 decimal places ETH/ USD Price
        //   1_000000000000000000 => 1 ETH

        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }

    function withdraw() public onlyOwner {
        // for loop
        // [1, 2, 3, ,4]
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex = funderIndex + 1
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        //reset the array
        funders = new address[](0);

        // 3 ways to send eth
        // transfer - simplest way to send
        // (2300 gas, throws errors (reverts))
        // payable(msg.sender).transfer(address(this).balance);

        // send
        // (2300 gas, retuns a boolean (won't reverts if send fails))
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require (sendSuccess, "Send failed");

        // call (recommended way to send/receive)
        // lower level command, can call any function
        // foward all gas or set gas, returns bool
        (bool callSuccess, bytes memory dataReturned) = payable(msg.sender)
            .call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }

    modifier onlyOwner() {
        //require (owner == msg.sender, "Sender is not owner!");
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        _;
    }
}
