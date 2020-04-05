<script>
	export let message;

	const shareData = {
		title: 'Quarantine Notes',
		text: 'I just made a permanent note from the quarantine! Click this link to check out the site.',
		url: 'https://quaratine-notes.arweave.xyz/',
	}

	function isMobileDevice() {
		return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
	};

	function shareButton() {
		navigator.share(shareData)
			.then(() =>
				console.log("share successfully")
			)
			.catch((e) =>
				console.log("share failed. Error: ", e)
			)
	}

	window.twttr = (function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0],
			t = window.twttr || {};
		if (d.getElementById(id)) return t;
		js = d.createElement(s);
		js.id = id;
		js.src = "https://platform.twitter.com/widgets.js";
		fjs.parentNode.insertBefore(js, fjs);

		t._e = [];
		t.ready = function(f) {
			t._e.push(f);
		};

		return t;
	}(document, "script", "twitter-wjs"));

	console.log("On mobile: ", isMobileDevice()); 
	let mobile = isMobileDevice(); 
	let transactionId = localStorage['transactionId'] || '';

	let transactionLink = "https://viewblock.io/arweave/tx/" + transactionId; 

</script>

<style>
  h1 {
		font-size: 2rem;
		text-align: center;
	}
	
  h2 {
		font-size: 1.25rem;
	}	
	li {
		padding:0.1em;
	}
</style>

<head>    
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
	<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v6.0"></script>
</head>

<div id="fb-root"></div>

<h1>🎉 {message} 🍾</h1>

<br>
<h2>Where's my post?</h2>
<p>Your post is being saved to the blockchain, where it’ll be stored permanently. That's right, you just wrote to the blockchain!</p>
<p>Your post will be on the front page for all to see in a couple of minutes.</p>

<h2>View on the blockchain</h2>

<p>Your post is being stored on the blockchain! <a href = {transactionLink} target="_blank">Here's the block link</a></p>
<p>The block will be viewable in a couple of minutes.</p>

<h2>Share</h2>
{#if mobile === false}
		<ul class="list-inline">
			<li>
				<div class="fb-share-button" data-href="https://quaratine-notes.arweave.xyz/" data-layout="button_count" data-size="small"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fquaratine-notes.arweave.xyz%2F&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div>
			</li>
			<li>
				<a class="twitter-share-button" href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fquaratine-notes.arweave.xyz%2F&text=Just%20made%20a%20permanent%20note%20about%20my%20quarantine%20experience%20on%20quarantine%20notes%21"> Tweet</a>
			</li>
		</ul>
	{:else}
		<button on:click="{shareButton}" class="btn btn-primary">Share</button>
{/if}

<h2>Feel free to make more posts!</h2>
