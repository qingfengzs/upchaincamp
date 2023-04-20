require("@nomiclabs/hardhat-waffle");
// require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const account = process.env.GOERLI_PRIVATE_KEY;
const alchemyApiKey = process.env.ALCHEMY_API_KEY;
const alchemySepoliaApiKey = process.env.ALCHEMY_API_KEY;
const etherscanKey = process.env.ETHERSCAN_KEY;
const mumbaiKey = process.env.MUMBAI_KEY;
const mumbaiScanApiKey = process.env.MUMBAI_POLYGON_API_KEY;

module.exports = {
  networks: {
    hardhat:{},
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
  etherscan: {
    apiKey: `${etherscanKey}`
  },
  defaultNetwork: "localhost",
  solidity: {
    compilers: [
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
    ]
  }
};
