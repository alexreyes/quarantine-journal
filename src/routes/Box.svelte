<script>
    export let postTitle;
    export let postDescription;
</script>
<style>
	.box {
		width: 500px;
		border: 1px solid #aaa;
		border-radius: 2px;
		box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
		padding: 1em;
        margin: 0 0 1em 0;
        text-align: center;
        margin: 0 auto;
        margin-bottom: 30px; 
	}
</style>

<div class="box">
	<slot></slot>
    <h1> {postTitle} </h1>
    <p> {postDescription}</p>
</div>