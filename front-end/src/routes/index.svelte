<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import InputForm from '$lib/components/InputForm.svelte';
	import Mints from '$lib/components/Mints.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';

	import '../app.css';
	import { checkIfWalletIsConnected, getNetwork, onChainChanged, fetchMints } from '$lib/services/CoolDomainService';	
	
	const topLevelDomain = '.ninja';

	let account: string;
	let network: string;

	onMount(async() => {
		try {			
			account = await checkIfWalletIsConnected();
			network = await getNetwork();			
			onChainChanged(handleChainChanged);
		} catch (error) {
			console.log("OnMount Error", error);
		}
	});

	function handleChainChanged(_chainId) {
		window.location.reload();
	}
</script>

<div class="App">
	<div class="container">
		<Header {account} {network} />
		<InputForm {account} {network} {topLevelDomain} />		
		<Mints {account} {topLevelDomain} />		
		<Footer />
		<LoadingIndicator />
	</div>
</div>
