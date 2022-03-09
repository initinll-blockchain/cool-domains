/* When using JavaScript, all the properties in the HRE are injected into the global scope, 
and are also available by getting the HRE explicitly. When using TypeScript nothing will be 
available in the global scope and you will need to import everything explicitly.
https://hardhat.org/guides/typescript.html */

import { ethers } from "hardhat";

const main = async() => {
    const [owner, randomPerson] = await ethers.getSigners();

    const domainContractFactory = await ethers.getContractFactory('Domains');
    const domainContract = await domainContractFactory.deploy();
    await domainContract.deployed();

    console.log("Contract deployed to:", domainContract.address);
    console.log("Contract deployed by:", owner.address);

    let txn = await domainContract.register("doom");
    await txn.wait();

    const domainOwner = await domainContract.getAddress("doom");
    console.log("Owner of domain:", domainOwner);

    txn = await domainContract.connect(randomPerson).setRecord("doom", "Haha my domain now!");
    await txn.wait();
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