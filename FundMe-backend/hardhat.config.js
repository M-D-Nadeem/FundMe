require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("@nomicfoundation/hardhat-verify");
require("hardhat-gas-reporter");
require('solidity-coverage')
const dotenv=require("dotenv")
dotenv.config()
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers:[
      {version:"0.8.0"},
      {version:"0.8.6"},
      {version:"0.6.6"},
    ]
  },
  defaultNetwork:"hardhat",
  networks:{
     sepolia:{
      url:process.env.SEPOLIA_RPC_URL,
      accounts:[process.env.SEPOLIA_PRIVATE_KEY],
      chainId:11155111,
      blockConfirmation:6,
     }
  },
  etherscan:{
    apiKey:process.env.ETHERSCAN_API_KEY
  },
  gasReporter:{
    enabled:true,
    outputFile:"gas-reporter.txt",
    noColors:true,
    currency:"USD",
    coinmarketcap:"9af45011-aef4-408e-8e2d-0def31ec3bd4",
    offline:true,
    token: "ETH",
  },
  namedAccounts:{
    deployer:{
      default:0
    },
    users:{
      default:1
    }
  }
};
