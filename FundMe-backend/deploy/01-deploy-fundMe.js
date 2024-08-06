const {network}=require("hardhat")
const {networkConfig,fakeDevloperChain}=require("../helper-hardhat-config.js")
const { verify } = require("../utils/verify.js")


module.exports=async function deployFundMe({ getNamedAccounts,deployments,}) {
    const {deploy,log}=deployments
    const {deployer}=await getNamedAccounts()
    const chainId=network.config.chainId

    //sol for if eth/usd has diffrent for diffrent network
    let ethToUsdAddress;
    if(fakeDevloperChain.includes(network.name)){
        const MockV3AggregatorResponse=await deployments.get("MockV3Aggregator")
        ethToUsdAddress=await MockV3AggregatorResponse.address
    }
    else{
        ethToUsdAddress=networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const fundMe=await deploy("FundMe",{
        contract:"FundMe",
        from:deployer,            //This is the address for person who deploys
        args:[ethToUsdAddress],   //gives the argument to the constructor
        log:true,
        waitConfirmation:network.config.blockConfirmation || 1
    })
    if(!fakeDevloperChain.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(fundMe.address,[ethToUsdAddress])
    }
}
module.exports.tags=["all","sepolia"]