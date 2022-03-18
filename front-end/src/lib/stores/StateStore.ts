import { writable } from 'svelte/store';

export const DomainStore = writable<string>();
export const RecordStore = writable<string>();
export const EditingStore = writable<boolean>(false);
export const LoadingStore = writable<boolean>(false);