<script> 
    import { onMount } from "svelte";
    export let fileName;
    
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

                    // document.getElementById("login").textContent = "Logged In";
                    
                    arweave.wallets.getBalance(address).then((balance) => {
                        let winston = balance;
                        let ar = arweave.ar.winstonToAr(balance);

                        console.log(winston);

                        console.log(ar);

                        // document.getElementById("dropzone").innerHTML = address + "<br><b>Balance:</b> " + ar + " <b>AR Tokens</b>";
                    });
                });

            } catch (err) {
                console.log('Error logging in: ', err);
            }
            // console.log(ev.target.result, JSON.parse(fr.result))
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
        font-size:10px;
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
        <slot>
            <p class="dropzoneDefaultSentence">
                Add keyfile to log in
            </p>
            {#if fileName}
                <p class="smallFileInfo">{fileName}</p>
            {/if}
        </slot>
    </svelte:component>
</content>
