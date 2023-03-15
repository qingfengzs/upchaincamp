require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const account = process.env.GOERLI_PRIVATE_KEY;
const alchemyApiKey = process.env.ALCHEMY_API_KEY;
const etherscanKey = process.env.ETHERSCAN_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat:{},
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${alchemyApiKey}`,
      accounts: [account]
    }
  },
  paths:{
    sources: 'src',
  },
  etherscan: {
    apiKey: `${etherscanKey}`
  },
};
