<script>
	import { storedWalletAddress, storedWalletBalance, arweaveWallet, submittedPost} from './userContext.js';
    import privateKey from './quarantine-journal-keyfile.json'
    import { onMount } from 'svelte';
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
		var postPopup = localStorage['submittedPost'] || 'false';

		if (postPopup === 'true') {
			localStorage['submittedPost'] = 'false'; 
			showNewPostModal(); 
		}

		// make API call here
		const resp = await fetch('/api/read_from_blockchain', {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'GET',
		})
			
		if (resp.status === 200) {
			const result = await resp.json(); 
			console.log("RESULT: ", result);
		} else {
			// console.log(`There was a problem saving :( ${resp.status}`); 
			alert(`There was a problem reading posts :( ${resp.status}`)
		}

		// retrieve newly made post from cache
        var recentPost = localStorage['post'] || '';

        if (recentPost) {
          console.log("Most recent post should be added");
          posts.push(JSON.parse(recentPost));
          localStorage['post'] = '';
        }
	});

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