<script lang="ts">
    import { onMount, onDestroy } from 'svelte';    
    import type { MintRecord } from '$lib/types/MintRecord';
    import { MintStore } from '$lib/stores/MintStore'; 
    import { getContractAddress, fetchMints } from '$lib/services/CoolDomainService';
    import { DomainStore, EditingStore } from '$lib/stores/StateStore';

    export let account:string;
    export let topLevelDomain:string;

    let mints:MintRecord[] = [];
    let CONTRACT_ADDRESS:string;

    const unsub = MintStore.subscribe((m) => {        
        mints = m;
    });

    onMount(async () => {
        mints = await fetch();
        // if (network === 'Polygon Mumbai Testnet') {
        // 	mints = await fetch();
        // }
        CONTRACT_ADDRESS = getContractAddress();
    });

    onDestroy(() => {
        unsub();
    });

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

        EditingStore.update(() => {
            return true;
        });

        DomainStore.update(() => {
            return name;
        });
	}
</script>

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