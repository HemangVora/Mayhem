import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    baseTestnet: {
      url: "https://sepolia.base.org", // Base testnet (Sepolia) RPC
      chainId: 84532, // Base Sepolia testnet chain ID
      accounts: [process.env.PRIVATE_KEY as string], // Your private key
      gas: 5000000, // Gas limit
      gasPrice: 10000000000, // Gas price in wei (10 gwei)
      timeout: 60000, // Timeout in ms
    },
  },
};

export default config;
