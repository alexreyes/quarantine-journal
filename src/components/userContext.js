import { writable } from 'svelte/store';

export const loggedIn = writable("log in");
export const storedWalletAddress = writable('wallet address');
export const storedWalletBalance = writable('wallet balance');
export const arweaveWallet = writable('wallet');