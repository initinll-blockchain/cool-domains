<script lang="ts">
    import twitterLogo from '$lib/assets/twitter-logo.svg';
    
    const TWITTER_HANDLE = '_buildspace';
	const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
</script>

<div class="footer-container">
    <img alt="Twitter Logo" class="twitter-logo" src={twitterLogo} />
    <a class="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`built with @${TWITTER_HANDLE}`}</a>
</div>