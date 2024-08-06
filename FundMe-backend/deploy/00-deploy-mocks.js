const {network}=require("hardhat")
const {fakeDevloperChain,DECIMAL,INITIAL_ANSWER}=require("../helper-hardhat-config")

module.exports =async({ getNamedAccounts,deployments})=> {
    const {deploy,log}=deployments
    const {deployer}=await getNamedAccounts()
    const chainId=await getChainId()
    if(fakeDevloperChain.includes(network.name)){
        log("Local network detected----Deploying mock contract")
        await deploy("MockV3Aggregator",{
            contract:"MockV3Aggregator",
            from:deployer,
            args:[DECIMAL,INITIAL_ANSWER],
            log:true,
        })
        log("Mock deployed")
        log("--------------------------------------------------------------")
    }
}
module.exports.tags=["all","mocks"]