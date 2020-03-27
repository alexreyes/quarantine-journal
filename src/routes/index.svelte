<script>
	import Box from './Box.svelte'; 
	import Content from '../components/Content.svelte';
	import Modal from '../components/Modal.svelte';	
	import { arweaveWallet, storedWalletAddress} from '../components/userContext.js';
    import { and, or, equals } from 'arql-ops';

	let posts = []; 

	// post sample data: 
	// const newPost = {
	// 	title : 'hello',
	// 	description: 'world'
	// };

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
			console.log(results); 

			for (var count = 0; count < results.length; count++) {
												
				const blockchainTransaction = arweave.transactions.get(results[count]).then(blockchainTransaction => {

					let returnedJson = blockchainTransaction.get('data', {decode: true, string: true});
					console.log(returnedJson); 

					try {
						posts = posts.concat(JSON.parse(returnedJson)); // add returned posts to the view
						
					} catch (ex) {
						console.error(ex);
					}
					// Get tags
					blockchainTransaction.get('tags').forEach(tag => {
						let key = tag.get('name', {decode: true, string: true});
						let value = tag.get('value', {decode: true, string: true});
						console.log(`${key} : ${value}`);
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
	{#if posts.length === 0}
		<p>
		Start by adding your first post! 
		</p>
		{:else}
		{#each posts as post}
			<Box
			postTitle={post.title} 
			postDescription={post.description}
			/>
		{/each}
	{/if}

</section>
</main>

<Modal> 
	<Content/>
</Modal>

<button on:click="{getPosts}">get posts</button>