<script>
    import { fly } from 'svelte/transition';	
    import Popup from '../components/Popup.svelte';
    import {getContext} from 'svelte';
	import { loggedIn, storedWalletAddress, storedWalletBalance, arweaveWallet} from './userContext.js';
    import privateKey from './main-keyfile.json'
    const { open } = getContext('simple-modal');

    // const showPopup = () => {
    //     open(Popup);
    // };
    
    function login(files) {
        try {
            const arweave = Arweave.init();

            console.log("login button"); 
            
            let wallet = privateKey;
            console.log(wallet);
            arweaveWallet.set(wallet); 

            arweave.wallets.jwkToAddress(wallet).then((address) => {
                let walletAddress = address;
                
                loggedIn.set("log out"); 
                storedWalletAddress.set(walletAddress);

                arweave.wallets.getBalance(address).then((balance) => {
                    let winston = balance;
                    let arBalance = arweave.ar.winstonToAr(balance);

                    storedWalletBalance.set(arBalance);
                });
            });
        } catch (err) {
            console.log('Error logging in: ', err);
        }
    }
    
    function logOut() {
        loggedIn.set("log in");
        storedWalletAddress.set('wallet address');
        storedWalletBalance.set('wallet balance');
        arweaveWallet.set('wallet');
    }

</script>
<svelte:head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <script src="https://unpkg.com/arweave/bundles/web.bundle.js"></script>

</svelte:head>

{#if $loggedIn === "log in"}
	<button type="button" class="btn btn-primary" id ="logInButton" on:click={login}>{$loggedIn}</button>
{/if}

{#if $loggedIn === "log out"}
	<button type="button" class="btn btn-primary" id ="logInButton" on:click={logOut}>{$loggedIn}</button>
{/if}