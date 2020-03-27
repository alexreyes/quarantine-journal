import { writable } from 'svelte/store';

export const loggedIn = writable(false);
export const storedWalletAddress = writable('wallet address');
export const storedWalletBalance = writable('wallet balance');
export const arweaveWallet = writable('wallet');

