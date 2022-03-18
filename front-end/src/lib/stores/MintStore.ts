import { writable } from 'svelte/store';

import type { MintRecord } from '$lib/types/MintRecord';

export const MintStore = writable<MintRecord[]>([]);