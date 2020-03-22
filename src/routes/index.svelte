<script>
	import Box from './Box.svelte'; 
	import Add from './Add.svelte'; 
	import Content from '../components/Content.svelte';
	import Modal from '../components/Modal.svelte';	
	
	let posts = [];
	
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
