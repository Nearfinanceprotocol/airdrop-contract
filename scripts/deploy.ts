import { ethers } from "hardhat";

async function main() {
    const NRF_TOKEN_ADDRESS = "";
    const AIRDROP_AMOUNT = "";
    const Verify = await ethers.getContractFactory("NRFAirdrop");
    const verify = await Verify.deploy();
    await verify.deployed();
    console.log(`ADDRESS: ${verify.address}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});