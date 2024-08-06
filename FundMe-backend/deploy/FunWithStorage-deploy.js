const { network, ethers } = require("hardhat")
const { fakeDevloperChain } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

 async function funWithStorageDeploy() {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------")
    log("Deploying FunWithStorage and waiting for confirmations...")
    const funWithStorage = await deploy("FunWithStorage", {
        from: deployer,
        args: [],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmation || 1,
    })
    
    if (!fakeDevloperChain.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(funWithStorage.address, [])
    }

    log("Logging storage...")
    for (let i = 0; i < 10; i++) {
        log(
            `Location ${i}: ${await ethers.provider.getStorage(
                funWithStorage.address,
                i
            )}`
        )
    }
}
module.exports =funWithStorageDeploy
module.exports.tags = ["storage"]