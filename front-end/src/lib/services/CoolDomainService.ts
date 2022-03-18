import { Contract, ethers, Signer, type ContractInterface } from 'ethers';
import abi from '$lib/abi/CoolDomain.json';
import { Constants } from '$lib/helpers/Constants';
import { networks } from '$lib/utils/networks';
import type { MintRecord } from '$lib/types/MintRecord';

declare const window: any;

export function getContractAddress() {    
    return Constants.CONTRACT_ADDRESS_LOCALHOST;
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

export async function mintDomain(domain: string, record:string): Promise<void> {
    if (!domain) {
        return;
    }

    if (domain.length < 3) {
        alert('Domain must be at least 3 characters long');
		return;
    }

    const price = domain.length === 3 ? '0.5' : domain.length === 4 ? '0.3' : '0.1';
    console.log("Minting Domain", domain, "with price", price);

    try {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contractAddress: string = getContractAddress();
            const contract = new ethers.Contract(contractAddress, abi.abi, signer);

            let txn = await contract.register(domain, {value: ethers.utils.parseEther(price)});
            const receipt = await txn.wait();

            if (receipt.status === 1) {
                console.log(`Domain minted! https://mumbai.polygonscan.com/tx/${txn.hash}`);

                txn = await contract.setRecord(domain, record);
                await txn.wait();

                console.log(`Record set! https://mumbai.polygonscan.com/tx/${txn.hash}`);
            }
            else {
                alert("Transaction failed! Please try again");
            }
        }
        else {
            alert("Make sure you have metamask!");
            return;
        }
    } catch (error) {
        throw error;
    }
}

export async function updateDomain(domain: string, record: string): Promise<void> {
    if (!domain || !record) {
        return;
    }
    console.log("Updating domain", domain, "with record", record);

    try {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contractAddress: string = getContractAddress();
            const contract = new ethers.Contract(contractAddress, abi.abi, signer);

            let txn = await contract.setRecord(domain, record);
            await txn.wait();

			console.log(`Record set https://mumbai.polygonscan.com/tx/${txn.hash}`);
        }
        else {
            alert("Make sure you have metamask!");
            return;
        }
    } catch (error) {
        throw error;
    }
}

export async function fetchMints(): Promise<MintRecord[]> { 
    let mintRecords:MintRecord[];   

    try {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contractAddress: string = getContractAddress();
            const contract = new ethers.Contract(contractAddress, abi.abi, signer);

            const names:string[] = await contract.getAllNames();

            const promises = names.map(async function(name) {
                const record:string = await contract.records(name);
                const owner:string = await contract.domains(name);

                const mintRecord: MintRecord = {
                    id: names.indexOf(name),
                    name: name,
                    record: record,
                    owner: owner
                };
                return mintRecord;
            });

            mintRecords = await Promise.all(promises);
            console.log("MINTS FETCHED ", mintRecords);
        }
        else {
            alert("Make sure you have metamask!");
            return;
        }
    } catch (error) {
        throw error;
    }
    
    return mintRecords;
}

export async function getNetwork(): Promise<string> {
    let network: string;

    try {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Make sure you have metamask!");
            return;
        }

        const chainId = await ethereum.request({ method: 'eth_chainId'});        
        network = networks[chainId];
    } catch (error) {
        throw error;
    }

    return network;
}

export function onChainChanged(handleChainChanged: any){
    try {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Make sure you have metamask!");
            return;
        }

        ethereum.on('chainChanged', handleChainChanged);
    } catch (error) {
        throw error;
    }
}

export async function switchNetwork(): Promise<void> {
    try {
        const { ethereum } = window;

        if (ethereum) {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x13881' }],
            });
        }
        else {
            alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
        }
    } catch (error) {
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {	
                            chainId: '0x13881',
                            chainName: 'Polygon Mumbai Testnet',
                            rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                            nativeCurrency: {
                                    name: "Mumbai Matic",
                                    symbol: "MATIC",
                                    decimals: 18
                            },
                            blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
                        },
                    ],
                });
            } catch (error) {
                console.log(error);
            }
        }
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