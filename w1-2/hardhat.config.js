require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const account = process.env.GOERLI_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat:{},
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [account]
    }
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_KEY}`
  },
};
