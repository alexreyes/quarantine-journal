<script>
	import { storedWalletAddress, storedWalletBalance, arweaveWallet, submittedPost} from './userContext.js';
    import privateKey from './testKeyfile.json'
    import { onMount } from 'svelte';
    import { and, or, equals } from 'arql-ops';
	import Box from './Box.svelte'; 
	import PopupMessage from './PopupMessage.svelte'; 
	import { getContext } from 'svelte';

	const { open } = getContext('simple-modal');

	const showNewPostModal = () => {
		open(PopupMessage, { message: "You just made a post!" });
	};

	let posts = []; 
	
    onMount(async () => {
		login().then(function() {
			  return getPosts();
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
				var recentPost = localStorage['post'] || ''; 
				
				if (recentPost) {
					console.log("Most recent post should be added");
					posts.push(JSON.parse(recentPost));
					localStorage['post'] = ''; 
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
		<h1>Quarantine Notes</h1>
		<p class = "history">Write history onto the blockchain</p>
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