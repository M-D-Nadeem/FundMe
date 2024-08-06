const { deployments, ethers } = require("hardhat");

async function fundMeScript() {
    const  sendValue="6000000000000000000000"
    const fundMeDeployment = await deployments.get("FundMe");
    const fundMe=await ethers.getContractAt(fundMeDeployment.abi,fundMeDeployment.address)
    console.log("Funding....");
    const response=await fundMe.fund({value:sendValue})
    await response.wait(1);
    console.log("Funded sucessfully...");
    
    
}
fundMeScript()

//Run -> npx hardhat run scripts\fundMe.js --network localhost