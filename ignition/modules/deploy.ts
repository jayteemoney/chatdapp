// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RegisterChatModule = buildModule("RegisterChatModule", (m) => {
  // Deploy Register contract
  const register = m.contract("Register", []);

  // Deploy Chat contract
  const chat = m.contract("Chat", []);

  // Return deployed contracts for tracking
  return { register, chat };
});

export default RegisterChatModule;
