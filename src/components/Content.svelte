<script>
	import { storedWalletAddress, storedWalletBalance, arweaveWallet, submittedPost} from './userContext.js';
    import privateKey from './testKeyfile.json'
    import { onMount } from 'svelte';
    import { and, or, equals } from 'arql-ops';
	import Box from './Box.svelte'; 
	import PopupMessage from './PopupMessage.svelte'; 
	import { getContext } from 'svelte';
	import { retryWithBackoff } from "promises-tho";

	const { open } = getContext('simple-modal');

	const showNewPostModal = () => {
		open(PopupMessage, { message: "You just made a post!" });
	};

	let posts = []; 
	
    onMount(async () => {
		login().then(function() {
			const getPostsWithRetries = retryWithBackoff(getPosts)

			getPostsWithRetries(); 
		});

		var postPopup = localStorage['submittedPost'] || 'false';
		console.log("Popup: ", postPopup); 

		if (postPopup === 'true') {
			localStorage['submittedPost'] = 'false'; 
			showNewPostModal(); 
		}
	});

    function login() { 
		return new Promise(function(resolve, reject) {
			try {
				const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' });
				
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
						console.log("end of login");
						resolve("logged in");
					});
				});
			
			} catch (err) {
				console.log('Error logging in: ', err);
				reject("loggin failed");
			}
		});
    };

    function getPosts() {
		console.log("get posts called")

		return new Promise(function(resolve, reject) {
			try {
				(async () => {
					const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' });

					const myQuery = and(
						equals('from', $storedWalletAddress),
						equals('App-Name', 'QuarantineNotes'),
						equals('TestData', 'true'),
						equals('production', 'false'),
						or(
							equals('App-Version', '0.0.1'),
						)
					);
							
					const results = await arweave.arql(myQuery);

					// If arql returns an empty array, it's gonna need a retry 
					if (results.length === 0) { throw new Error('No results') }

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

					// retrieve newly made post from cache
					var recentPost = localStorage['post'] || ''; 
					
					if (recentPost) {
						console.log("Most recent post should be added");
						posts.push(JSON.parse(recentPost));
						localStorage['post'] = ''; 
					}
					resolve("get posts worked");

				})()
			}
			catch (exception) {
				console.log("getting posts error: ", exception); 
			}
		});
	}
    
</script>
<style>
	main {
        margin: 24px auto;
        max-width: 240px;
        color: #222;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
	.titleStuff {
		padding-bottom:3em; 
		text-align: center;
	}
	.history {
		  color: #424949;
		  font-style: italic;
		  font-size:1.3em; 
		  font-weight: 200; 
	}
	@media (min-width: 340px) {
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
	<div class = "titleStuff">
		<h1>Quarantine Journal</h1>
		<p class = "history">Write your quarantine stories and save them permanently</p>
	</div>
	<section>
        {#each posts as post}
            <Box
            postTitle={post.title} 
            postName={post.name}
            postLink={post.socialLink}
            postDate={post.currDate}
            postDescription={post.description}
            postLocation={post.location}
            />
        {/each}
</section>
</main>