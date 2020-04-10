<script>
	import { storedWalletAddress, storedWalletBalance, arweaveWallet, submittedPost} from './userContext.js';
    import privateKey from './quarantine-journal-keyfile.json'
    import { onMount } from 'svelte';
    import { and, equals } from 'arql-ops';
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
					
					console.log("Address: ", walletAddress);

					arweave.wallets.getBalance(address).then((balance) => {
						let winston = balance;
						let arBalance = arweave.ar.winstonToAr(balance);

						storedWalletBalance.set(arBalance);

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
		return new Promise(function(resolve, reject) {
			try {
				(async () => {
					const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' });

					const myQuery = and(
						equals('from', $storedWalletAddress),
						equals('App-Name', 'QuarantineJournal'),
						equals('TestData', 'true'),
						equals('production', 'false'), 
						equals('deployed', 'true')
					);
							
					const results = await arweave.arql(myQuery);
					console.log(results); 

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
		/* text-transform: uppercase;	 */
		color: #FF4500;
		font-size: 5em;
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
		<p class = "history">Write your quarantine experiences and save them permanently</p>
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