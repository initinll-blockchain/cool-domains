<script lang="ts">
	import '../app.css';
	import twitterLogo from '$lib/assets/twitter-logo.svg';

	const TWITTER_HANDLE = '_buildspace';
	const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
	
	import { onMount } from 'svelte';
	import { connectWallet, checkIfWalletIsConnected } from '$lib/services/CoolDomainService';

	let account: string;
	const topLevelDomain = '.ninja';

	let domain: string;
	let record: string;

	onMount(async() => {
		try {
			account = await checkIfWalletIsConnected();
			
		} catch (error) {
			console.log("OnMount Error", error);
		}
	});

</script>

<div class="App">
	<div class="container">
		<div class="header-container">
			<header>
				<div class="left">
					<p class="title">🐱‍👤 Ninja Name Service</p>
					<p class="subtitle">Your immortal API on the blockchain!</p>
				</div>
			</header>
		</div>
		{#if !account}
			<div class="connect-wallet-container">
				<img src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif" alt="Ninja gif" />
				<button onClick={connectWallet} class="cta-button connect-wallet-button"> Connect Wallet </button>
			</div>
		{/if}
		{#if account}
			<div class="form-container">
				<div class="first-row">
					<input type="text" placeholder='domain' bind:value={domain}/>
					<p class='tld'> {topLevelDomain} </p>
				</div>
				<input type="text" placeholder='whats ur ninja power' bind:value={record}/>
				<div class="button-container">
					<button class='cta-button mint-button' disabled={null} onClick={null}>
						Mint
					</button>  
					<button class='cta-button mint-button' disabled={null} onClick={null}>
						Set data
					</button>  
				</div>
			</div>
		{/if}		
		<div class="footer-container">
			<img alt="Twitter Logo" class="twitter-logo" src={twitterLogo} />
			<a class="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`built with @${TWITTER_HANDLE}`}</a>
		</div>
	</div>
</div>
