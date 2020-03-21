<script>
	let title = ''; 
    let description = ''; 
    let posts = []; 
    
    function setTitle(event){
		title = event.target.value;
    }
    
    function addPost(){
		const newPost = {
			title : title,
			description: description
		};
        posts = posts.concat(newPost)
        
        console.log(posts)
	}

</script>
<style>
    section {
        text-align: center;
    }

</style>
<svelte:head>
<title>New post</title>
</svelte:head>

<h1>new post</h1>

<section>
	<div> 
		<label for="title">Title</label>
		<input type="text" id="title" value={title} on:input={setTitle}/> 
	</div>

	<div>
		<label for="description">Description</label>
		<textarea rows="3" id="description" bind:value ={description}/>
	</div>

    <button on:click={addPost}>Submit post</button>
</section>

