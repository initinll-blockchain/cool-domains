<script lang="ts">
	import { onMount } from 'svelte';
	import Header from "$lib/components/Header.svelte";

	import '../app.css';
	import twitterLogo from '$lib/assets/twitter-logo.svg';
	import type { MintRecord } from '$lib/types/MintRecord';
	import { connectWallet, checkIfWalletIsConnected, 
		mintDomain, updateDomain, 
		getNetwork, onChainChanged, 
		switchNetwork, fetchMints,
		getContractAddress } from '$lib/services/CoolDomainService';

	const TWITTER_HANDLE = '_buildspace';
	const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

	let account: string;
	const topLevelDomain = '.ninja';

	let domain: string;
	let record: string;
	let network: string;
	let editing: boolean = false;
	let loading: boolean = false;
	let mints: MintRecord[];
	let CONTRACT_ADDRESS:string;

	onMount(async() => {
		try {
			CONTRACT_ADDRESS = getContractAddress();
			account = await checkIfWalletIsConnected();
			network = await getNetwork();			
			onChainChanged(handleChainChanged);
			mints = await fetch();			
			// if (network === 'Polygon Mumbai Testnet') {
			// 	mints = await fetch();
			// }			
		} catch (error) {
			console.log("OnMount Error", error);
		}
	});

	function handleChainChanged(_chainId) {
		window.location.reload();
	}

	async function mint(): Promise<void> {
		try {
			const txn = await mintDomain(domain, record);
			domain = '';
			record = '';
			mints = await fetch();
		} catch (error) {
			console.log("mint error ", error);
		}
	}

	async function update(): Promise<void> {
		loading = true;
		try {			
			const txn = await updateDomain(domain, record);
			domain = '';
			record = '';
		} catch (error) {
			console.log("update error ", error);
		}
		loading = false;
	}

	async function fetch(): Promise<MintRecord[]> {	
		let result:MintRecord[];
		try {			
			result = await fetchMints();
		} catch (error) {
			console.log("fetch error ", error);
		}
		return result;
	}

	function cancel() {
		editing = false;
		domain = '';
	}

	function editRecord(name: string) {
		console.log("Editing record for", name);
		editing = true;
		domain = name;
	}

</script>

<div class="App">
	<div class="container">
		<Header {account} {network} />
		
		{#if network !== undefined && network !== 'Polygon Mumbai Testnet'}
			<div class="connect-wallet-container">
				<p>Please connect to the Polygon Mumbai Testnet</p>
				<button class='cta-button mint-button' on:click={switchNetwork}>Click here to switch</button>
			</div>
		{:else if !account}
			<div class="connect-wallet-container">
				<img src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif" alt="Ninja gif" />
				<button onClick={connectWallet} class="cta-button connect-wallet-button"> Connect Wallet </button>
			</div>
		{:else}
			<div class="form-container">
				<div class="first-row">
					<input type="text" placeholder='domain' bind:value={domain}/>
					<p class='tld'> {topLevelDomain} </p>
				</div>
				<input type="text" placeholder='whats ur ninja power' bind:value={record}/>
				{#if editing}
					<div class="button-container">
						<!-- This will call the updateDomain function we just made -->
						<button class='cta-button mint-button' disabled={loading} on:click={update}>
							Set record
						</button>  
						<!-- This will let us get out of editing mode by setting editing to false -->
						<button class='cta-button mint-button' on:click={cancel}>
							Cancel
						</button>  
					</div>
				{:else}
					<div class="button-container">
						<button class='cta-button mint-button' disabled={loading} on:click={mint}>
							Mint
						</button>  
					</div>
				{/if}				
			</div>
		{/if}	
		{#if account && mints && mints.length > 0}
			<div class="mint-container">
				<p class="subtitle"> Recently minted domains!</p>
				<div class="mint-list">
					{#each mints as mint}
						<div class="mint-item">
							<div class='mint-row'>
								<a class="link" href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`} target="_blank" rel="noopener noreferrer">
									<p class="underlined">{' '}{mint.name}{topLevelDomain}{' '}</p>
								</a>
								{#if mint.owner.toLowerCase() === account.toLowerCase()}
									<button class="edit-button" on:click={() => editRecord(mint.name)}>
										<img class="edit-icon" src="https://img.icons8.com/metro/26/000000/pencil.png" alt="Edit button" />
									</button>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>		
		{/if}
		<div class="footer-container">
			<img alt="Twitter Logo" class="twitter-logo" src={twitterLogo} />
			<a class="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`built with @${TWITTER_HANDLE}`}</a>
		</div>
	</div>
</div>
