<script lang="ts">
	import { onMount } from 'svelte';
	import Header from "$lib/components/Header.svelte";
	import InputForm from "$lib/components/InputForm.svelte";
	import Footer from "$lib/components/Footer.svelte";

	import '../app.css';
	
	import type { MintRecord } from '$lib/types/MintRecord';
	import { checkIfWalletIsConnected, 
		getNetwork, onChainChanged, 
		fetchMints, getContractAddress } from '$lib/services/CoolDomainService';	

	let account: string;
	const topLevelDomain = '.ninja';

	let domain: string;
	let network: string;
	let editing: boolean = false;
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

	async function fetch(): Promise<MintRecord[]> {	
		let result:MintRecord[];
		try {			
			result = await fetchMints();
		} catch (error) {
			console.log("fetch error ", error);
		}
		return result;
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
		<InputForm {account} {network} />		
		
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
		<Footer />
	</div>
</div>
