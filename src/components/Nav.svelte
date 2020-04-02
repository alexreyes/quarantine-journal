  
<script>
	export let segment;
	import { storedWalletAddress, storedWalletBalance, arweaveWallet } from './userContext.js';
	import { fly } from 'svelte/transition';	
	import {getContext} from 'svelte';
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
	}
	ul {
		margin: 0;
		padding: 0;
	}
	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}
	li {
		display: block;
		
	}
	.home, .new {
		float: left;
	}
	[aria-current] {
		position: relative;
		display: inline-block;
	}
	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}
	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}

</style>

<nav>
	<ul>
		<li><a aria-current='{segment === "" ? "page" : undefined}' class="text-decoration-none home" href='.' >home</a></li>
		<li><a aria-current='{segment === "about" ? "page" : undefined}' class="text-decoration-none new" href='about'>about</a></li>
		<li><a aria-current='{segment === "new" ? "page" : undefined}' class="text-decoration-none new" href='new'>new</a></li>
	</ul>
</nav>
