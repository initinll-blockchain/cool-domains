<script lang="ts">
	import '../app.css';
	import twitterLogo from '$lib/assets/twitter-logo.svg';

	const TWITTER_HANDLE = '_buildspace';
	const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
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
		<div class="footer-container">
			<img alt="Twitter Logo" class="twitter-logo" src={twitterLogo} />
			<a class="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer"
				>{`built with @${TWITTER_HANDLE}`}</a>
		</div>
	</div>
</div>
