<script>
    import { fly } from 'svelte/transition';	
    import Popup from '../components/Popup.svelte';
    import {getContext} from 'svelte';
	import { loggedIn, storedWalletAddress, storedWalletBalance, arweaveWallet} from './userContext.js';

    const { open } = getContext('simple-modal');

    const showPopup = () => {
        open(Popup);
    };
    
    function logOut() {
        loggedIn.set("log in");
        storedWalletAddress.set('wallet address');
        storedWalletBalance.set('wallet balance');
        arweaveWallet.set('wallet');
    }

</script>
<svelte:head>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
</svelte:head>

{#if $loggedIn === "log in"}
	<button type="button" class="btn btn-primary" id ="logInButton" on:click={showPopup}>{$loggedIn}</button>
{/if}

{#if $loggedIn === "log out"}
	<button type="button" class="btn btn-primary" id ="logInButton" on:click={logOut}>{$loggedIn}</button>
{/if}