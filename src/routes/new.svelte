<script>
	import { arweaveWallet, storedWalletAddress, submittedPost} from '../components/userContext.js';
  import { onMount } from 'svelte';
  import { goto } from '@sapper/app';
  import privateKey from '../components/quarantine-journal-keyfile.json' 
  import { DateTime } from "luxon";
  import GooglePlacesAutocomplete from '../components/GooglePlacesAutocomplete.svelte'; 

  let title = ''; 
  let description = ''; 
  let posts = []; 
  let currDate = '';
  let newPost = {};
  let socialLink = '';
  let name = ''; 
  let place = ''; 
  let isoDateTime; 

  let googApiKey = process.env.GOOGLE_KEY; 
  
  const navigateAndSave = async () => {
    localStorage['submittedPost'] = 'true'; 
    await goto('.');
  }
  
  function addPost(){
    console.log("submit clicked"); 

    var dt = DateTime.local();
    isoDateTime = dt.toString(); 
    currDate = dt.toLocaleString(DateTime.DATETIME_MED);

    console.log('Posted @: ', currDate);
    
    if (socialLink != '') {
      if (!socialLink.match(/^[a-zA-Z]+:\/\//))
      {
          socialLink = 'http://' + socialLink;
      }
    }

    const newPost = {
      title : title,
      name: name, 
      socialLink: socialLink,
      description: description,
      currDate: currDate,
      location: place.formatted_address
    };
    console.log(newPost);

    saveToBlockchain(newPost);

    return 1; 
    title = ''; 
    description = ''; 
    socialLink = ''; 
    name = ''; 
    location = '';
  }

	function saveToBlockchain(post) {
    const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' });
    console.log(arweave);

    let key = privateKey; 

    (async () => {
      var unixTime = Math.round((new Date()).getTime() / 1000)

      arweave.wallets.jwkToAddress(key).then((address) => {
          arweave.wallets.getBalance(address).then((balance) => {
              let winston = balance;
              console.log(winston);
          });
      });
      localStorage['post'] = JSON.stringify(post);
      console.log("Saving post to cache: ", JSON.stringify(post));  

      let transaction = await arweave.createTransaction({
          data: JSON.stringify(post),
      }, key);
      
      transaction.addTag('App-Name', 'QuarantineJournal')
      transaction.addTag('App-Version', '1.0.0')
      transaction.addTag('TestData', 'true')
      transaction.addTag('production', 'false')
      transaction.addTag('deployed', 'true')            
      transaction.addTag('ISO-Time', isoDateTime)
      transaction.addTag('loc-lat', place.geometry.location.lat())
      transaction.addTag('loc-long', place.geometry.location.lng())

      await arweave.transactions.sign(transaction, key);
      const response = await arweave.transactions.post(transaction);
      
      console.log("Status: ", response.status);

      localStorage['transactionId'] = transaction.id;

      console.log("TransactionID: ", transaction.id);

      await arweave.transactions.post(transaction);
      if (response.status === 200) {
          navigateAndSave();
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
    .theName {
        padding-bottom: 1em; 
    }
    .socialLink {
        padding-bottom: 1em; 
    }
    button {
        margin-top: 1em;
    }
</style>
<svelte:head>
    <title>New entry</title>
    <script src="https://unpkg.com/arweave/bundles/web.bundle.js"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/luxon@1.23.0/build/global/luxon.min.js"></script>

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-137191118-2"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-137191118-2');
</script>

</svelte:head>

<h1>new entry</h1>

<div class="alert alert-info" role="alert">
    <b><i>Your experiences matter.</i></b> All entries are permanent, un-editable, un-deleteable, and public. 
</div>

<form on:submit|preventDefault="{addPost}">
  <div class="form-row">
    <div class = "theName col"> 
        <label><b>Name</b></label>
        <input type="text" class="form-control" id="name" bind:value={name} placeholder="Name (or username)" required/> 
    </div>

    <div class = "socialLink col "> 
        <label >Social links</label>
        <input type="text" class="form-control" id="socialLink" bind:value={socialLink} placeholder="Plug your social media"/> 
    </div>
  </div>
    
  <label><b>Location</b></label>
    <GooglePlacesAutocomplete apiKey="{googApiKey}" bind:value={place}/>
  <br>

  <label><b>Title</b></label>
  <input type="text" class="form-control" id="title"  maxlength="140" bind:value = {title} placeholder="Title your entry" required/> 
  <br>
  <label><b>Description</b></label>
  <textarea rows="10" class="form-control" id="description" maxlength="10000" bind:value ={description}  placeholder="Write the body of your entry and share your quarantine experience!" required/>
  
  <button type="submit" class="btn btn-outline-primary">Submit entry</button>
</form>