<script>
    export let postTitle;
    export let postDescription;
    export let postDate; 
    export let postName; 
    export let postLink; 
    export let postLocation; 
</script>
<style>
	.box {
		border: 1px solid #aaa;
		border-radius: 2px;
		box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
		padding: 1em;
        margin: 0 0 1em 0;
        text-align: center;
        margin: 0 auto;
        margin-bottom: 1.5em; 
	}
    .date {
        color: #808080; 
    }
    p {
        font-size:120%
    }
</style>

<head>
</head>
<main>
<div class="box">
    <slot></slot>
    <h1> {postTitle} </h1>
    <p class="date">{postLocation} on {postDate} EST</p>
    
    {#if postLink}   
        <p>By: <a href = {postLink} target="_blank" >{postName}</a></p>
        {:else}
            <p>By: {postName}</p>
    {/if}
    <p> {postDescription}</p>
</div>
</main>