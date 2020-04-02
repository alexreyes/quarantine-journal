<script>
    import { fly } from 'svelte/transition';	
    import {getContext} from 'svelte';
	import { storedWalletAddress, storedWalletBalance, arweaveWallet} from './userContext.js';
    import privateKey from './main-keyfile.json'
    import { onMount } from 'svelte';
    import { and, or, equals } from 'arql-ops';
	import Box from './Box.svelte'; 

	let posts = []; 
    
    onMount(async () => {
        login();
    });
    
    function login() {
        try {
            const arweave = Arweave.init();
            
            console.log("signing in....");

            let wallet = privateKey;

            arweaveWallet.set(wallet); 

            arweave.wallets.jwkToAddress(wallet).then((address) => {
                let walletAddress = address;
            
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
    };

    function getPosts() {
		try {
			(async () => {
				const arweave = Arweave.init();

				const myQuery = and(
					equals('from', $storedWalletAddress),
					equals('App-Name', 'QuarantineNotes'),
					equals('TestData', 'false'),
					equals('production', 'true'),
					or(
						equals('App-Version', '0.0.1'),
					)
				);
						
				const results = await arweave.arql(myQuery);

				for (var count = 0; count < results.length; count++) {
													
					const blockchainTransaction = arweave.transactions.get(results[count]).then(blockchainTransaction => {

						let returnedJson = blockchainTransaction.get('data', {decode: true, string: true});

						posts = posts.concat(JSON.parse(returnedJson)); // add returned posts to the view
							
						// Get tags
						blockchainTransaction.get('tags').forEach(tag => {
							let key = tag.get('name', {decode: true, string: true});
							let value = tag.get('value', {decode: true, string: true});
						});

					});
				}
			})()
		}
		catch (exception) {
			console.log("getting posts error: ", exception); 
		}
	}
    
</script>
<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto; 
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
		padding-bottom: 1em;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

<svelte:head>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
	<script src="https://unpkg.com/arweave/bundles/web.bundle.js"></script>
</svelte:head>

<main>
	<h1>Quarantine Notes</h1>
	<section>
        {#each posts as post}
            <Box
            postTitle={post.title} 
            postName={post.name}
            postLink={post.socialLink}
            postDate={post.currDate}
            postDescription={post.description}
            />
        {/each}
</section>
</main>


<button on:click={getPosts}>get posts</button>