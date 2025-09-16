// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Chat {
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
    }

    Message[] public groupMessages;

    mapping(address => mapping(address => Message[])) public privateMessages;

    event GroupMessageSent(address indexed sender, string content, uint256 timestamp);
    event PrivateMessageSent(address indexed sender, address indexed recipient, string content, uint256 timestamp);

    function sendGroupMessage(string calldata content) public {
        require(bytes(content).length > 0, "Message content cannot be empty");
        groupMessages.push(Message(msg.sender, content, block.timestamp));
        emit GroupMessageSent(msg.sender, content, block.timestamp);
    }

    function getGroupMessages() public view returns (Message[] memory) {
        return groupMessages;
    }

    function sendPrivateMessage(address recipient, string calldata content) public {
        require(recipient != address(0), "Invalid recipient address");
        require(bytes(content).length > 0, "Message content cannot be empty");
        
        privateMessages[msg.sender][recipient].push(Message(msg.sender, content, block.timestamp));
        privateMessages[recipient][msg.sender].push(Message(msg.sender, content, block.timestamp));

        emit PrivateMessageSent(msg.sender, recipient, content, block.timestamp);
    }

    function getPrivateMessages(address user1, address user2) public view returns (Message[] memory) {
        return privateMessages[user1][user2];
    }
}