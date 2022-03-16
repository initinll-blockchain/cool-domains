import { Contract, ethers, Signer, type ContractInterface } from 'ethers';
import abi from '$lib/abi/CoolDomain.json';
import { Constants } from '$lib/helpers/Constants';

declare const window: any;

export function getContractAddress() {    
    return Constants.CONTRACT_ADDRESS_POLYGONTESTNET;
}

export async function checkIfWalletIsConnected(): Promise<string> {
    let account:string;

    try {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        const accounts: string[] = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
            account = accounts[0];
            console.log("Found an authorized account:", account);
            return account;            
        } else {
            console.log("No authorized account found")
        }
    } catch (error) {
        throw error;
    }
}

export async function connectWallet(): Promise<string> {
    let account:string;

    try {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Make sure you have metamask!");
            return;
        }

        const accounts: string[] = await ethereum.request({ method: "eth_requestAccounts" });

        if (accounts.length !== 0) {
            account = accounts[0];
            console.log("Found an authorized account:", account);
            return account;            
        } else {
            console.log("No authorized account found")
        }     
    } catch (error) {
        throw error;
    }
}

function getContract(): Contract {
    try {
        const { ethereum } = window;                
        let contractABI: ContractInterface = abi.abi;
        let coolDomainContract: Contract;

        if (ethereum) {
            const provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(ethereum);
            const signer: Signer = provider.getSigner();
            let contractAddress: string = getContractAddress();
            coolDomainContract = new ethers.Contract(contractAddress, contractABI, signer);
            console.log("CoolDomainContract", coolDomainContract.address);
        }
        return coolDomainContract;
    } catch (error) {
        console.log("getContract", error);
    }
}