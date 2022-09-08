import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    bnb: {
      url: process.env.NODE_URL,
      // @ts-ignore
      accounts: [process.env.PRIVATE_KEY]
    },
    testnet: {
      url: process.env.NODE_URL_TEST,
      // @ts-ignore
      accounts: [process.env.PRIVATE_KEY_TEST]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY
  }
};

export default config;