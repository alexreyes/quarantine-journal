<script> 
    import { onMount } from "svelte";
    import { loggedIn, storedWalletAddress, storedWalletBalance, arweaveWallet } from './userContext.js';

    export let fileName;
    export let arBalance; 
    export let walletAddress; 
    
    const addedfile = file => {
        fileName = file.name;
        login(file);
    }

    export let dropzoneEvents = {addedfile};
    export let options = { previewTemplate: "<div/>" };
    export let dropzoneClass = "dropzone";
    export let hooveringClass = "dropzone-hoovering";
    export let id = "dropId";
    
    let DROPZONESSR;
    onMount(async () => {
        const dropzone = await import("./dropzone.svelte");
        DROPZONESSR = dropzone.default;
    });

    function login(files) {
        const fr = new FileReader()
        fr.onload = function (ev) {
            try {
                const arweave = Arweave.init();

                // let wallet = JSON.parse(ev.target.result);
                // arweaveWallet.set(wallet);

                arweave.wallets.jwkToAddress(wallet).then((address) => {
                    walletAddress = address;
                    
                    loggedIn.set("log out"); 
                    storedWalletAddress.set(walletAddress);

                    arweave.wallets.getBalance(address).then((balance) => {
                        let winston = balance;
                        arBalance = arweave.ar.winstonToAr(balance);

                        storedWalletBalance.set(arBalance);
                    });
                });
            } catch (err) {
                console.log('Error logging in: ', err);
            }
        };

        fr.readAsText(files);
    }
</script>

<style>
content {
        font-size: 2rem;
        text-align: center;
    }
    p.dropzoneDefaultSentence {
        font-size: 30px;
    }
    p.smallFileInfo {
        font-size:20px;
        text-align: left;
    }
</style>

<svelte:head>
    <script src="https://unpkg.com/arweave/bundles/web.bundle.js"></script>
</svelte:head>

<content>
    <svelte:component
        this={DROPZONESSR}
        {dropzoneEvents}
        {options}
        {dropzoneClass}
        {hooveringClass}
        {id}>
        <div>
            {#if fileName}
                <p class="smallFileInfo"><b>Filename:</b> {fileName}</p>
                <p class="smallFileInfo"><b>Address:</b> {walletAddress}</p>
                <p class="smallFileInfo"><b>Balance:</b> {arBalance}</p>

                {:else}
                    <p class="dropzoneDefaultSentence">
                        Drop your arweave keyfile to log in
                    </p>
            {/if}
        </div>
    </svelte:component>
</content>
