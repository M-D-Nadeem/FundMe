import { abi, contractAddress } from "./constant.js"
import { ethers } from "./ethers-5.6.esm.min.js"
console.log(ethers);
const connectionButton=document.getElementById("connectionButton")
connectionButton.addEventListener("click",connection)

const fundButton=document.getElementById("fundButton")
fundButton.addEventListener("click",fund)

const getBalance=document.getElementById("getBalance")
getBalance.addEventListener("click",balance)

const withdrawButton=document.getElementById("withdrawButton")
withdrawButton.addEventListener("click",withdraw)
async function connection() {
//Using window.ethereum gives us the metamask object
try{
if(typeof window.ethereum!=="undefined"){
    console.log("I see metamask");
    await window.ethereum.request({method:"eth_requestAccounts"}) //Connecting to metamask
    connectionButton.innerHTML="Conected!"
    const provider=new ethers.providers.Web3Provider(window.ethereum)
    const signer= provider.getSigner()

    console.log("Connected to account ",await signer.getAddress());
    
}
else{
    console.log("I don't see metamask");
    connectionButton.innerHTML="Please install metamask"
}
}catch(err){
    console.log(err);
    
}
}
async function balance() {
    if(typeof window.ethereum!=="undefined"){
        //This is similar to ethera.provider.jsonRpcProvider(RPC_URL og ganash or infuria)
        //Using provider we will be connected to a test net like sepolia
        const provider=new ethers.providers.Web3Provider(window.ethereum)
        const bal=await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(bal));
}
}

//What we need to fund=>
    //provider/connection to blockchain
    //signer/wallet/someone with some gas
    //contract to intract(abi,address)
async function fund() {
    const ethAmount=document.getElementById("ethAmount").value
    console.log("Funding.....");
    if(typeof window.ethereum!=="undefined"){
        //This is similar to ethera.provider.jsonRpcProvider(RPC_URL og ganash or infuria)
        //Using provider we will be connected to a test net like sepolia
        const provider=new ethers.providers.Web3Provider(window.ethereum)
  
        //This will return whichever account is connected to metamask (Account1/Account2)
        const signer=provider.getSigner()
        //Conecting with contract FundMe so we need FundMe ABI,Deployed Address
        //for ABI go to->artifacts->contract->FundMe.json cop/ paste in constant.json(frontend)
        //For deployed address do npx hardhat deploy you will det deploy address copy/paste 
        const contract=new ethers.Contract(contractAddress,abi,signer)
        console.log(contract);
        
        try{
        //To fund we need to connect your metamask to hardhat network (named hardhat-localhost)
        //Do npx hodhat node u will get list of Account and private key and rpc url
        //Go to metamask->add connection-> add network manually
        //Name ->hardhat-localhost , RPC-> http://127.0.0.1:8545/ , chainId-> 31337,currency->ETH
        //After creationg connection add network->import-> copy/peast one on private key from terminal
        const transactionResponse=await contract.fund({value:ethers.utils.parseEther(ethAmount)})
        console.log("tx=",transactionResponse);

        //Wait for the transaction to finish
        await listenForTransactionMine(transactionResponse,provider)
        console.log("Done");
        
        }catch(err){
            console.log(err);
            
        }
        
    }
    
}
async function listenForTransactionMine(transactionResponse,provider) {
    console.log(`Mining ${transactionResponse.hash}`);
    //Usinng promise-> jab tak ye resolve nahi hota mtlb jab tak transactionRecipt nahi milta
    //Don't go to next line console.log("Done");
    return new Promise((resolve,reject)=>{
    provider.once(transactionResponse.hash,(transactionRecipt)=>{
          console.log(transactionRecipt);
    resolve()     
    })
})
}
async function withdraw() {
    const provider=new ethers.providers.Web3Provider(window.ethereum)
    const signer=provider.getSigner()
    const contract=new ethers.Contract(contractAddress,abi,signer)
    console.log("Withdrawing......");
    
    try{
        const withdrawTxResponse=await contract.withdraw()
        console.log(withdrawTxResponse);
        await listenForTransactionMine(withdrawTxResponse,provider)
        
    }catch(err){
        console.log(err);
        
    }
}