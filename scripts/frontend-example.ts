const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
import { ethers } from "hardhat";
const fs = require("fs");



async function main() {
    fs.readFile(`${__dirname}/valid.json`, async (err: any, data: any) => {
        if(err) {
          console.log("File can't be read", err)
          return
        }
        try{
          let whiteListedAddresses : any[] =  JSON.parse(data);

          // Using keccak256 hashing algorithm to hash the leavves of the trees
          const leaf_nodes = whiteListedAddresses.map(signer => keccak256(signer)); //this line of code would handle all the hashing
      
          // now creating the merkle tree object
          const merkleTree = new MerkleTree(leaf_nodes, keccak256, { sortPairs: true});
      
          // obtaining the root hash
          const rootHash = merkleTree.getHexRoot();

          // claiming address
          const address = keccak256("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");

          const hexProof = merkleTree.getHexProof(address);

        //   deploying the token contract 
        const Token = await ethers.getContractFactory("Token");
        const token = await Token.deploy();

        // Deploying the verifing contract 
        const Verify = await ethers.getContractFactory("NRFAirdrop");
        const verify = await Verify.deploy(ethers.utils.parseEther("8888"), token.address);

        // transfering token to the airdrop contract 
        const e = await token.transfer(verify.address, ethers.utils.parseEther("150000"));
        e.wait();

        // calling the claim
        const a = await verify.claim(hexProof);
        a.wait();

        // const b = await verify.claim(hexProof);
        // b.wait();

        //checking the balance of the airdroped address
        let bal = await token.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
        console.log(bal);

      
          
        }
        catch(err) {
          console.log("Error parsing JSON string:", err)
        }
       })
}




main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });