/* When using JavaScript, all the properties in the HRE are injected into the global scope, 
and are also available by getting the HRE explicitly. When using TypeScript nothing will be 
available in the global scope and you will need to import everything explicitly.
https://hardhat.org/guides/typescript.html */

import { ethers } from "hardhat";

const main = async() => {
    const domainContractFactory = await ethers.getContractFactory('Domains');
    const domainContract = await domainContractFactory.deploy();
    await domainContract.deployed();
    console.log("Contract deployed to:", domainContract.address);
}

const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
runMain();