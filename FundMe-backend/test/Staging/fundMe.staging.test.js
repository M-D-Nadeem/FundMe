const { assert } = require("chai");
const { getNamedAccounts, ethers, deployments, network } = require("hardhat");
const { fakeDevloperChain } = require("../../helper-hardhat-config");

//During staging test we assume that our contract in deployed in a testnet not locally or hardhat 
fakeDevloperChain.includes(network.name)?describe.skip :
describe("FundMe Staging Tests",()=>{
    let deployer;
    let fundMe;
    const sendValue="20000000000000000"
    beforeEach(async ()=>{
        deployer=(await getNamedAccounts).deployer
        const fundMeDeployment=await deployments.get("FundMe")
        fundMe=await ethers.getContractAt(fundMeDeployment.abi,fundMeDeployment.address)

    })
    it("allows people to fund and withdraw",async ()=>{
          await fundMe.fund({value:sendValue})
          await fundMe.withdraw()
          const endFundMeBalance=await ethers.provider.getBalance(fundMe.target)
          assert.equal(endFundMeBalance.toString(),"0")
    })
})

//Run-> npx hardhat test --network sepolia