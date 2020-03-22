<script> 
    import { onMount } from "svelte";
    export let fileName;
    export let arBalance; 
    export let walletAddress; 
    export let loginStatus = "Log in";

    const init = () => console.log("dropzone init ! 😍");
    const addedfile = file => {
        fileName = file.name;
        login(file);
    }

    export let dropzoneEvents = {addedfile, init};
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

                let wallet = JSON.parse(ev.target.result);

                arweave.wallets.jwkToAddress(wallet).then((address) => {
                    console.log(`Arweave wallet address: ${address}`)
                    walletAddress = address;
                    
                    // document.getElementById("login").textContent = "Logged In";
                    loginStatus = "Logged in"; 

                    arweave.wallets.getBalance(address).then((balance) => {
                        let winston = balance;
                        arBalance = arweave.ar.winstonToAr(balance);

                        console.log(winston);

                        console.log(arBalance);
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
                <p class="smallFileInfo">Address: {walletAddress}</p>
                <p class="smallFileInfo">Balance: {arBalance}</p>

                {:else}
                    <p class="dropzoneDefaultSentence">
                        Add keyfile to log in
                    </p>
            {/if}
        </div>
    </svelte:component>
</content>
