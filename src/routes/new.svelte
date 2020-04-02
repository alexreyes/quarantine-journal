<script>
	import { arweaveWallet, storedWalletAddress} from '../components/userContext.js';

	let title = ''; 
    let description = ''; 
    let posts = []; 
    let currDate = '';
	let newPost = {};
    let socialLink = '';
    let name = ''; 
    
    function addPost(){
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        
        currDate = (date.getMonth()+1) + '/' + date.getDate() + '/'+ date.getFullYear() + ' @ ' + hours + ':' + minutes + ' ' + ampm;
        
        if (name === '') {
            name = 'anonymous'; 
        }
        
        console.log('Posted @: ', currDate);
		const newPost = {
            title : title,
            name: name, 
            socialLink: socialLink,
            description: description,
            currDate: currDate
		};
        saveToBlockchain(newPost);
        title = ''; 
        description = ''; 
        socialLink = ''; 
        name = ''; 
	}

	function saveToBlockchain(post)
    {
        const arweave = Arweave.init();
        
        let key = $arweaveWallet; 
        (async () => {

            var unixTime = Math.round((new Date()).getTime() / 1000)

            arweave.wallets.jwkToAddress(key).then((address) => {
                arweave.wallets.getBalance(address).then((balance) => {
                    let winston = balance;
                });
            });
            let transaction = await arweave.createTransaction({
                data: JSON.stringify(post),
            }, key);
            transaction.addTag('App-Name', 'QuarantineNotes')
            transaction.addTag('App-Version', '0.0.1')
            transaction.addTag('TestData', 'false')
            transaction.addTag('production', 'true')
            transaction.addTag('Unix-Time', unixTime)

            await arweave.transactions.sign(transaction, key);
            const response = await arweave.transactions.post(transaction);
            
            console.log("Status: ", response.status);
            // console.log(transaction.id);
            // console.log(transaction.data);
            await arweave.transactions.post(transaction);
            if (response.status === 200) {
                alert('Note saved to blockchain!');
            }
            if (response.status == 400) {
                alert("400: The transaction is invalid, couldn't be verified, or the wallet does not have suffucuent funds.")
            }
            if (response.status == 429) {
                alert("429: The request has exceeded the clients rate limit quota.")
            }
            if (response.status == 503) {
                alert("503: The nodes was unable to verify the transaction.")
            }
        })()
    }
</script>
<style>
    h1 {
        padding-bottom: 0.2em;
    }

    .theDesc {
        padding-top: 1em; 
    }

    .theName {
        padding-top: 1em; 
    }
    .socialLink {
        padding-top: 1em; 
    }
    button {
        margin-top: 1em;
    }
</style>
<svelte:head>
    <title>New post</title>
    <script src="https://unpkg.com/arweave/bundles/web.bundle.js"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
</svelte:head>

<h1>new post</h1>

<div class="alert alert-info" role="alert">
    Note: All posts stored on the <a href="https://www.arweave.org/" target="_blank" class="alert-link">arweave blockchain</a> are permanent, un-editable, un-deleteable, and public. 
</div>

<section>
    <div class = "theTitle"> 
        <label for="title">Title</label>
        <input type="text" class="form-control" id="title" bind:value={title} placeholder="Enter a title"/> 
    </div>

    <div class = "theName"> 
        <label for="title">Name</label>
        <input type="text" class="form-control" id="name" bind:value={name} placeholder="Who wrote this?"/> 
    </div>

    <div class = "socialLink"> 
        <label for="title">Link</label>
        <input type="text" class="form-control" id="socialLink" bind:value={socialLink} placeholder="Link to your social! (optional)"/> 
    </div>

    <div class="theDesc">
        <label for="description">Description</label>
        <textarea rows="3" class="form-control" id="description" bind:value ={description}  placeholder="Write the body of your post!"/>
    </div>
    
    <button type="button" class="btn btn-outline-primary" on:click={addPost}>Submit post</button>
    
</section>

