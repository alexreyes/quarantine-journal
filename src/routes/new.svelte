<script>
	import { arweaveWallet, storedWalletAddress} from '../components/userContext.js';
    // import Arweave from 'arweave/web';
    import { and, or, equals } from 'arql-ops';


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
            transaction.addTag('TestData', 'true')
            // transaction.addTag('Unix-Time', unixTime)

            await arweave.transactions.sign(transaction, key);
            const response = await arweave.transactions.post(transaction);
            console.log(response.status);
            console.log(transaction.id);
            console.log(transaction.data);
            await arweave.transactions.post(transaction);
            alert('Note saved to blockchain!');

            const myQuery = and(
                equals('from', $storedWalletAddress),
                equals('App-Name', 'QuarantineNotes'),
                or(
                    equals('App-Version', '0.0.1'),
                    equals('TestData', 'true'),
                )
            );
            
            const results = await arweave.arql(myQuery);
            console.log(results); 

            for (var count = 0; count < results.length; count++) {
                                                 
                const blockchainTransaction = arweave.transactions.get(results[count]).then(blockchainTransaction => {

                    // Use the get method to get a specific transaction field.
                    // console.log(blockchainTransaction.get('signature'));
                    // NLiRQSci56KVNk-x86eLT1TyF1ST8pzE-s7jdCJbW-V...

                    // console.log(blockchainTransaction.get('data'));
                    //CjwhRE9DVFlQRSBodG1sPgo8aHRtbCBsYW5nPSJlbiI-C...

                    // Get the data base64 decoded as a Uint8Array byte array.
                    // console.log(blockchainTransaction.get('data', {decode: true}));
                    //Uint8Array[10,60,33,68,79,67,84,89,80,69...

                    // Get the data base64 decoded as a string.
                    console.log(blockchainTransaction.get('data', {decode: true, string: true}));
                    //<!DOCTYPE html>
                    //<html lang="en">
                    //<head>
                    //    <meta charset="UTF-8">
                    //    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    //    <title>ARWEAVE / PEER EXPLORER</title>

                    // blockchainTransaction.get('tags').forEach(tag => {
                    //     let key = tag.get('name', {decode: true, string: true});
                    //     let value = tag.get('value', {decode: true, string: true});
                    //     console.log(`${key} : ${value}`);
                    // });
                    // Content-Type : text/html
                    // User-Agent : ArweaveDeploy/1.1.0
                });
            }
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

