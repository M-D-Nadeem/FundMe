const { assert, expect } = require("chai");
const exp = require("constants");
const {deployments,getNamedAccounts,ethers}=require("hardhat");
const { fakeDevloperChain } = require("../../helper-hardhat-config");

!fakeDevloperChain.includes(network.name)?describe.skip :
describe("FundMe",()=>{
    let deployer;
    let fundMe;
    let mockV3Aggregator;
    let sendValue;
    beforeEach(async ()=>{
       deployer=(await getNamedAccounts()).deployer
       await deployments.fixture(["all"])

       const fundMeDeployment = await deployments.get("FundMe");
       fundMe = await ethers.getContractAt(fundMeDeployment.abi, fundMeDeployment.address);
       const mockV3AggregatorDeployment = await deployments.get("MockV3Aggregator");
       mockV3Aggregator = await ethers.getContractAt(mockV3AggregatorDeployment.abi, mockV3AggregatorDeployment.address);
    //    sendValue=ethers.parseEther("100") or
    sendValue="6000000000000000000000"  //60eth
       
    })
    describe("Constructor",()=>{
        it("Set the aggregator address correctly",async ()=>{
          
            const response=await fundMe.getPriceFeed()
            assert.equal(response,mockV3Aggregator.target)
        })
    })
    describe("fund",()=>{
        it("Failed to send enough eth",async ()=>{
            await expect(fundMe.fund()).to.be.revertedWith("Din't send enough")
        })
        it("Update the s_addressToAmountFunded",async ()=>{
            await fundMe.fund({value:sendValue})
            const amount=await fundMe.getAddressToAmountFunded(deployer)
            assert.equal(amount.toString(),sendValue)
        })
        it("Update the s_funders array",async ()=>{
            await fundMe.fund({value:sendValue})
            const funder=await fundMe.getFunder(0)
            assert.equal(deployer,funder)
        })
    })
    describe("withdraw",()=>{
        beforeEach(async ()=>{
            await fundMe.fund({value:sendValue})
        })
       
        it("withdraw fund from single funder",async ()=>{
            //We will cheak weather=>
            //before wethdraw (all the bal in FundMe contract+owner bal)=after withdraw
            // (owner bal+total gas spend during withdraw by the owner)

            //Getting info before withdraw
            const startingFundMeContractBalance=await ethers.provider.getBalance(fundMe.target)
            const startingDeployerBalance=await ethers.provider.getBalance(deployer)

            //Withdraw
            const withdrawTransactionResponse=await fundMe.withdraw()
            const withdrawTransactionRecept=await withdrawTransactionResponse.wait(1)

            //Calculating gas used
            const gasUsed=withdrawTransactionRecept.gasUsed
            const gasPrice=withdrawTransactionRecept.gasPrice
            const totalGasUsed=gasUsed*gasPrice
            
            //Getting info after withdraw
            const endFundMeContractBalance=await ethers.provider.getBalance(fundMe.target)
            const endDeployerBalance=await ethers.provider.getBalance(deployer) 
            
            //Now cheak
            assert.equal(endFundMeContractBalance,0)
            assert.equal((startingFundMeContractBalance+startingDeployerBalance).toString(),
                          (endDeployerBalance+totalGasUsed).toString())

        })
        it("Withdraw fund with multiple funders",async ()=>{
            //ethers.getSigners() returns a list of hardhat accounts 
          const accounts=await ethers.getSigners()
          let fundMeConnectedContract;
          //Here 0th account will be owner(Who will recive funds) and we are using only 5 funder to test
//why 0th account is owner=as in hardhat.config.js we set namedAccount:{deployer:{default:0}}
          for(let i=1;i<6;i++){
            //if we use fundMe to fund it will be wrong as funMe is connected to 
            //account 0 that is owner as we need to connect each funder first
             fundMeConnectedContract=await fundMe.connect(accounts[i])
             await fundMeConnectedContract.fund({value:sendValue})
          }

          //Getting info before withdraw
          const startingFundMeContractBalance=await ethers.provider.getBalance(fundMe.target)
          const startingDeployerBalance=await ethers.provider.getBalance(deployer)

          //Withdraw
          const withdrawTransactionResponse=await fundMe.withdraw()
          const withdrawTransactionRecept=await withdrawTransactionResponse.wait(1)

          //Calculating gas used
          const gasUsed=withdrawTransactionRecept.gasUsed
          const gasPrice=withdrawTransactionRecept.gasPrice
          const totalGasUsed=gasUsed*gasPrice
          
          //Getting info after withdraw
          const endFundMeContractBalance=await ethers.provider.getBalance(fundMe.target)
          const endDeployerBalance=await ethers.provider.getBalance(deployer) 
          
          assert.equal(endFundMeContractBalance,0)
          assert.equal((startingFundMeContractBalance+startingDeployerBalance).toString(),
                          (endDeployerBalance+totalGasUsed).toString())

           //Testing if every fundrs has 0 balance               
          for(let i=1;i<6;i++){
            assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address),0)
          }
          await expect(fundMe.getFunder(0)).to.be.reverted                
            
        })
        it("only owner can withdraw",async ()=>{
            //To test only owner can withdraw,,,, we took a example funder as accounts[1]
            //and connected that funder and if that funder trys to withdraw then error
            const accounts=await ethers.getSigners()
            const funder=accounts[1]
            const connectedFunder=await fundMe.connect(funder)
           await expect(connectedFunder.withdraw()).to.be.revertedWith("Sender is not the owner!")
        })

        it("Cheaper withdraw",async ()=>{
            //ethers.getSigners() returns a list of hardhat accounts 
          const accounts=await ethers.getSigners()
          let fundMeConnectedContract;
          //Here 0th account will be owner(Who will recive funds) and we are using only 5 funder to test
//why 0th account is owner=as in hardhat.config.js we set namedAccount:{deployer:{default:0}}
          for(let i=1;i<6;i++){
            //if we use fundMe to fund it will be wrong as funMe is connected to 
            //account 0 that is owner as we need to connect each funder first
             fundMeConnectedContract=await fundMe.connect(accounts[i])
             await fundMeConnectedContract.fund({value:sendValue})
          }

          //Getting info before withdraw
          const startingFundMeContractBalance=await ethers.provider.getBalance(fundMe.target)
          const startingDeployerBalance=await ethers.provider.getBalance(deployer)

          //Withdraw
          const withdrawTransactionResponse=await fundMe.cheaper_withdraw()
          const withdrawTransactionRecept=await withdrawTransactionResponse.wait(1)

          //Calculating gas used
          const gasUsed=withdrawTransactionRecept.gasUsed
          const gasPrice=withdrawTransactionRecept.gasPrice
          const totalGasUsed=gasUsed*gasPrice
          
          //Getting info after withdraw
          const endFundMeContractBalance=await ethers.provider.getBalance(fundMe.target)
          const endDeployerBalance=await ethers.provider.getBalance(deployer) 
          
          assert.equal(endFundMeContractBalance,0)
          assert.equal((startingFundMeContractBalance+startingDeployerBalance).toString(),
                          (endDeployerBalance+totalGasUsed).toString())

           //Testing if every fundrs has 0 balance               
          for(let i=1;i<6;i++){
            assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address),0)
          }
          await expect(fundMe.getFunder(0)).to.be.reverted                
            
        })
    })
   
})

//Run -> npx hardhat test or npx hardhat test --network hardhat