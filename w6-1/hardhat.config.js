require("@nomicfoundation/hardhat-toolbox");
require('hardhat-abi-exporter');

let dotenv = require('dotenv')
dotenv.config({ path: "./.env" })

const account = process.env.GOERLI_PRIVATE_KEY;
const alchemyApiKey = process.env.ALCHEMY_API_KEY;
const alchemySepoliaApiKey = process.env.ALCHEMY_API_KEY;
const etherscanKey = process.env.ETHERSCAN_KEY;
const mumbaiKey = process.env.MUMBAI_KEY;
const mumbaiScanApiKey = process.env.MUMBAI_POLYGON_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",

  networks: {
    hardhat:{},
    dev: {
      url: 'http://127.0.0.1:7545',
      chainId: 1337
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${alchemyApiKey}`,
      accounts: [account]
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${alchemySepoliaApiKey}`,
      accounts: [account]
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${alchemySepoliaApiKey}`,
      accounts: [account]
    },
  },
  abiExporter: {
    path: "./deployments/abi",
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: true,
  },
  defaultNetwork: 'dev',
  etherscan: {
    apiKey: `${etherscanKey}`
  },
};
