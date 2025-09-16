// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Register {
    struct User {
        string name;
        string imageCid;
        address walletAddress;
    }

    mapping(address => User) public users;
    mapping(string => bool) public userNames;
    address[] private _allUserAddresses;

    event UserRegistered(address indexed walletAddress, string name, string imageCid);

    function registerUser(string calldata name, string calldata imageCid) public {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(!userNames[name], "Username is already taken");
        require(users[msg.sender].walletAddress == address(0), "User already registered");

        users[msg.sender] = User(name, imageCid, msg.sender);
        userNames[name] = true;
        _allUserAddresses.push(msg.sender);

        emit UserRegistered(msg.sender, name, imageCid);
    }

    function getUser(address wallet) public view returns (User memory) {
        require(users[wallet].walletAddress != address(0), "User not found");
        return users[wallet];
    }

    function getAllUsers() public view returns (User[] memory) {
        User[] memory allUsers = new User[](_allUserAddresses.length);
        for (uint i = 0; i < _allUserAddresses.length; i++) {
            allUsers[i] = users[_allUserAddresses[i]];
        }
        return allUsers;
    }
}