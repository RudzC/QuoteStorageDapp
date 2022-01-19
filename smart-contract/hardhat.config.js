require('@nomiclabs/hardhat-waffle');
require('dotenv').config();
const {ALCHEMY_RINKEBY_URL , RINKEBY_PRIVATE_KEY} = process.env;
module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: ALCHEMY_RINKEBY_URL,
      accounts: [`${RINKEBY_PRIVATE_KEY}`]
    }
  }
};
