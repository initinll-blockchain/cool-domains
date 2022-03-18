<script lang="ts">
    import polygonLogo from '$lib/assets/polygonlogo.png';
	import ethLogo from '$lib/assets/ethlogo.png';
    
    export let account:string;
    export let network:string;
</script>

<div class="header-container">
    <header>
        <div class="left">
            <p class="title">🐱‍👤 Ninja Name Service</p>
            <p class="subtitle">Your immortal API on the blockchain!</p>
        </div>
        <div class="right">
            <img alt="Network logo" class="logo" src={ network !== undefined && network.includes("Polygon") ? polygonLogo : ethLogo} />
            {#if account}
                <p> Wallet: {account.slice(0, 6)}...{account.slice(-4)} </p>
            {:else}
                <p> Not connected </p>
            {/if}					
        </div>
    </header>
</div>