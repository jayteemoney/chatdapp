// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Register.sol";

contract Chat {
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
    }

    Register private _registerContract;
    address public owner;
    address public automationContract;

    Message[] public groupMessages;

    mapping(address => mapping(address => Message[])) public privateMessages;

    event GroupMessageSent(address indexed sender, string content, uint256 timestamp);
    event PrivateMessageSent(address indexed sender, address indexed recipient, string content, uint256 timestamp);

    constructor(address registerContractAddress) {
        require(registerContractAddress != address(0), "Invalid register contract address");
        _registerContract = Register(registerContractAddress);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyRegisteredUser() {
        require(
            _registerContract.getUser(msg.sender).walletAddress != address(0),
            "You must be registered to send messages"
        );
        _;
    }

    modifier onlyAutomation() {
        require(msg.sender == automationContract, "Only automation contract can call this");
        _;
    }

    function setAutomationContract(address _automationContract) public onlyOwner {
        automationContract = _automationContract;
    }

    function sendGroupMessage(string calldata content) public onlyRegisteredUser {
        require(bytes(content).length > 0, "Message content cannot be empty");
        groupMessages.push(Message(msg.sender, content, block.timestamp));
        emit GroupMessageSent(msg.sender, content, block.timestamp);
    }

    function sendAutomatedGroupMessage(string calldata content) public onlyAutomation {
        require(bytes(content).length > 0, "Message content cannot be empty");
        // Using automationContract as sender
        groupMessages.push(Message(automationContract, content, block.timestamp));
        emit GroupMessageSent(automationContract, content, block.timestamp);
    }

    function getGroupMessages() public view returns (Message[] memory) {
        return groupMessages;
    }

    function sendPrivateMessage(
        address recipient,
        string calldata content
    ) public onlyRegisteredUser {
        require(recipient != address(0), "Invalid recipient address");
        require(
            bytes(content).length > 0,
            "Message content cannot be empty"
        );

        privateMessages[msg.sender][recipient].push(
            Message(msg.sender, content, block.timestamp)
        );
        privateMessages[recipient][msg.sender].push(
            Message(msg.sender, content, block.timestamp)
        );

        emit PrivateMessageSent(
            msg.sender,
            recipient,
            content,
            block.timestamp
        );
    }

    function getPrivateMessages(
        address user1,
        address user2
    ) public view returns (Message[] memory) {
        return privateMessages[user1][user2];
    }
}