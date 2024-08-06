async function withdrawScript() {

    const fundMeDeployment=await deployments.get("FundMe")
    const fundMe=await ethers.getContractAt(fundMeDeployment.abi,fundMeDeployment.address)
    console.log("waithdrawing...."); 
    const response=await fundMe.withdraw()
    await response.wait(1)
    console.log("Withdraw sucessfull");
    

}
withdrawScript()

//Run -> npx hardhat run scripts\withdraw.js --network localhost