import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RegisterChatModule = buildModule("RegisterChatModule", (m) => {
  // Deploy Register contract
  const register = m.contract("Register", []);

  // Deploy Chat contract, passing Register contract address as constructor argument
  const chat = m.contract("Chat", [register]);

  return { register, chat };
});

export default RegisterChatModule;
