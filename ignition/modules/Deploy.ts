import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UPDATE_INTERVAL = 10800; // 3 hours

const DeployModule = buildModule("DeployModule", (m) => {
  const register = m.contract("Register");
  const chat = m.contract("Chat", [register]);
  const priceConsumer = m.contract("PriceConsumerV3");
  const automation = m.contract("Automation", [priceConsumer, chat, UPDATE_INTERVAL]);

  m.call(chat, "setAutomationContract", [automation]);

  return { register, chat, priceConsumer, automation };
});

export default DeployModule;