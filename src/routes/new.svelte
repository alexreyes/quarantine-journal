<script>
	import { arweaveWallet, storedWalletAddress, loggedIn} from '../components/userContext.js';

	let title = ''; 
    let description = ''; 
    let posts = []; 
	let newPost = {};
	
    function setTitle(event){
		title = event.target.value;
    }
    
    function addPost(){
		const newPost = {
			title : title,
			description: description
		};
        
        saveToBlockchain(newPost);
        title = ''; 
        description = ''; 
	}

	function saveToBlockchain(post)
    {
        const arweave = Arweave.init();
        let key = $arweaveWallet; 
        (async () => {

            arweave.wallets.jwkToAddress(key).then((address) => {

                arweave.wallets.getBalance(address).then((balance) => {
                    let winston = balance;

                });
            });

            let transaction = await arweave.createTransaction({
                data: JSON.stringify(post),
            }, key);

            transaction.addTag('App-Name', 'QuarantineNotes')
            transaction.addTag('App-Version', '0.0.1')
            transaction.addTag('TestData', 'false')
            // transaction.addTag('Unix-Time', unixTime)

            await arweave.transactions.sign(transaction, key);
            const response = await arweave.transactions.post(transaction);
            console.log("Status: ", response.status);
            // console.log(transaction.id);
            // console.log(transaction.data);
            await arweave.transactions.post(transaction);

            if (response.status === 200) {
                alert('Note saved to blockchain!');
            }
            if (response.status == 400) {
                alert("400: The transaction is invalid, couldn't be verified, or the wallet does not have suffucuent funds.")
            }
            if (response.status == 429) {
                alert("429: The request has exceeded the clients rate limit quota.")
            }
            if (response.status == 503) {
                alert("503: The nodes was unable to verify the transaction.")
            }
        })()
    }
</script>
<style>

    h1 {
        padding-bottom: 0.2em;
    }

    .theDesc {
        padding-top: 1em; 
    }

    button {
        margin-top: 1em;
    }

</style>
<svelte:head>
    <title>New post</title>
    <script src="https://unpkg.com/arweave/bundles/web.bundle.js"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

</svelte:head>

<h1>new post</h1>




{#if $loggedIn === "log in"}
    <div class="alert alert-danger" role="alert">
        You need to log in before submitting a post!
    </div>

    {:else}
        <div class="alert alert-info" role="alert">
            Note: All posts stored on the <a href="https://www.arweave.org/" target="_blank" class="alert-link">arweave blockchain</a> are permanent, un-editable, un-deleteable, and public. 
        </div>

        <section>
        <div class = "theTitle"> 
            <label for="title">Title</label>
            <input type="text" class="form-control" id="title" bind:value={title} placeholder="Enter a title"/> 
        </div>

        <div class="theDesc">
            <label for="description">Description</label>
            <textarea rows="3" class="form-control" id="description" bind:value ={description}  placeholder="Write the body of your post!"/>
        </div>
        <button type="button" class="btn btn-outline-primary" on:click={addPost}>Submit post</button>
        
</section>

{/if}

