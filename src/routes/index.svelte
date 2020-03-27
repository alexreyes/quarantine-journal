<script>
	import Box from './Box.svelte'; 
	import Content from '../components/Content.svelte';
	import Modal from '../components/Modal.svelte';	
	import { loggedIn, arweaveWallet, storedWalletAddress} from '../components/userContext.js';
    import { and, or, equals } from 'arql-ops';
	
	let posts = []; 

	// post sample data: 
	// const newPost = {
	// 	title : 'hello',
	// 	description: 'world'
	// };
	$: $loggedIn && getPosts();

	function getPosts() {
		(async () => {
			const arweave = Arweave.init();

			const myQuery = and(
				equals('from', $storedWalletAddress),
				equals('App-Name', 'QuarantineNotes'),
				equals('TestData', 'false'),
				or(
					equals('App-Version', '0.0.1'),
				)
			);
					
			const results = await arweave.arql(myQuery);

			for (var count = 0; count < results.length; count++) {
												
				const blockchainTransaction = arweave.transactions.get(results[count]).then(blockchainTransaction => {

					let returnedJson = blockchainTransaction.get('data', {decode: true, string: true});

					try {
						posts = posts.concat(JSON.parse(returnedJson)); // add returned posts to the view
						
					} catch (ex) {
						console.error(ex);
					}
					// Get tags
					blockchainTransaction.get('tags').forEach(tag => {
						let key = tag.get('name', {decode: true, string: true});
						let value = tag.get('value', {decode: true, string: true});
					});

				});
			}
        })()
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
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

<svelte:head>
	<title>Quarantine Notes</title>
	<script src="https://unpkg.com/arweave/bundles/web.bundle.js"></script>
</svelte:head>

<main>
	<h1>Quarantine Notes</h1>
	<section>
	{#if $loggedIn === "log out"}
		{#if posts.length === 0}
			<p>
			You don't have any posts yet! Click new to write a new post.
			</p>
			{:else}
			{#each posts as post}
				<Box
				postTitle={post.title} 
				postDescription={post.description}
				/>
			{/each}
		{/if}
		{:else}
			<p>Please log in to view your posts. Don't have an arweave wallet? Get one <a href="ht	tps://www.arweave.org/wallet">here</a></p>
	{/if}
</section>
</main>

<Modal> 
	<Content/>
</Modal>