require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Load variables from .env

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28", // Matches your contract's pragma ^0.8.28
  networks: {
    hardhat: {}, // Local development network (default)
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org", // Fallback to public RPC if .env not set
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111, // Sepolia chain ID (optional, for clarity)
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "", // For contract verification on Etherscan
    },
  },
};