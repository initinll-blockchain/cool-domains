<script lang="ts">
    import { onDestroy } from 'svelte';   
    import { connectWallet, switchNetwork, updateDomain, mintDomain, fetchMints } from '$lib/services/CoolDomainService';
    import type { MintRecord } from '$lib/types/MintRecord';
    import { DomainStore, RecordStore, EditingStore, LoadingStore } from '$lib/stores/StateStore';
    import { MintStore } from '$lib/stores/MintStore'; 

    export let account:string;
    export let network:string;
    export let topLevelDomain:string;

    let domain: string;
    let record: string;
    let editing: boolean = false;
    let loading: boolean = false;

    const unsubDomain = DomainStore.subscribe((d) => {        
        domain = d;
    });

    const unsubEditing = EditingStore.subscribe((e) => {        
        editing = e;
    });

    onDestroy(() => {
        unsubDomain();
        unsubEditing();
    });

    async function mint(): Promise<void> {
		try {
			const txn = await mintDomain(domain, record);

			domain = '';
			record = '';

            DomainStore.update(() => {
                return domain;
            });

            RecordStore.update(() => {
                return record;
            });

			let mints = await fetch();

            MintStore.update(() => {
                return mints;
            });
		} catch (error) {
			console.log("mint error ", error);
		}
	}

    async function update(): Promise<void> {
		loading = true;

        LoadingStore.update(() => {
            return loading;
        });

		try {			
			const txn = await updateDomain(domain, record);
			domain = '';
			record = '';

            DomainStore.update(() => {
                return domain;
            });

            RecordStore.update(() => {
                return record;
            });

		} catch (error) {
			console.log("update error ", error);
		}

		loading = false;

        LoadingStore.update(() => {
            return loading;
        });
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

        EditingStore.update(() => {
            return editing;
        });

		domain = '';

        DomainStore.update(() => {
            return domain;
        });
	}
</script>

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