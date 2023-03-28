require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const account = process.env.GOERLI_PRIVATE_KEY;
const alchemyApiKey = process.env.ALCHEMY_API_KEY;
const alchemySepoliaApiKey = process.env.ALCHEMY_API_KEY;
const etherscanKey = process.env.ETHERSCAN_KEY;
const mumbaiKey = process.env.MUMBAI_KEY;
const mumbaiScanApiKey = process.env.MUMBAI_POLYGON_API_KEY;

// https://eth-goerli.g.alchemy.com/v2/
// https://eth-sepolia.g.alchemy.com/v2/

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
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
  paths:{
    sources: 'src',
  },
  etherscan: {
    apiKey: `${mumbaiScanApiKey}`
  },
};
