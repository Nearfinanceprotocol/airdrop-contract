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
      
          // printing the merkle tree on the console
          console.log('Whitelist Merkle Tree\n', merkleTree.toString());
          console.log("Root Hash: ", rootHash);
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