<script>
	import { arweaveWallet, storedWalletAddress} from '../components/userContext.js';

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
        
		console.log(newPost);
		saveToBlockchain(newPost);
	}

	function saveToBlockchain(post)
    {
        const arweave = Arweave.init();
        let key = $arweaveWallet; 
        (async () => {

            arweave.wallets.jwkToAddress(key).then((address) => {
                console.log(`Arweave wallet address: ${address}`)

                arweave.wallets.getBalance(address).then((balance) => {
                    let winston = balance;

                    console.log(winston);
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
            console.log(response.status);
            console.log(transaction.id);
            console.log(transaction.data);
            await arweave.transactions.post(transaction);
            alert('Note saved to blockchain!');

        })()
    }
</script>
<style>
    section {
        text-align: center;
    }

</style>
<svelte:head>
    <title>New post</title>
    <script src="https://unpkg.com/arweave/bundles/web.bundle.js"></script>
</svelte:head>

<h1>new post</h1>

<section>
	<div> 
		<label for="title">Title</label>
		<input type="text" id="title" bind:value={title}/> 
	</div>

	<div>
		<label for="description">Description</label>
		<textarea rows="3" id="description" bind:value ={description}/>
	</div>

    <button on:click={addPost}>Submit post</button>
</section>

<p>{title}</p>
<p>{description}</p>

