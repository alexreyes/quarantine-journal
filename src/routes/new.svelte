<script>
	import { arweaveWallet, storedWalletAddress, submittedPost} from '../components/userContext.js';
  import { onMount } from 'svelte';
  import { goto } from '@sapper/app';

	let title = ''; 
  let description = ''; 
  let posts = []; 
  let currDate = '';
  let newPost = {};
  let socialLink = '';
  let name = ''; 
  let location = ''; 
      
  const navigateAndSave = async () => {
    localStorage['submittedPost'] = 'true'; 
    await goto('.');
  }

  function addPost(){
    console.log("submit clicked");     
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    
    currDate = (date.getMonth()+1) + '/' + date.getDate() + '/'+ date.getFullYear() + ' @ ' + hours + ':' + minutes + ' ' + ampm;
    
    if (name === '') {
      name = "anonymous";
    }
    
    if (location === '') {
      location = "Unkown location"; 
    }

    console.log('Posted @: ', currDate);
    const newPost = {
      title : title,
      name: name, 
      socialLink: socialLink,
      description: description,
      currDate: currDate,
      location: location
    };
    console.log(newPost);

    saveToBlockchain(newPost);

    title = ''; 
    description = ''; 
    socialLink = ''; 
    name = ''; 
    location = '';
  }

	function saveToBlockchain(post) {
    const arweave = Arweave.init();
    console.log(arweave);
    let key = $arweaveWallet; 
    
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
      transaction.addTag('App-Name', 'QuarantineNotes')
      transaction.addTag('App-Version', '0.0.1')
      transaction.addTag('TestData', 'false')
      transaction.addTag('production', 'true')
      transaction.addTag('Unix-Time', unixTime)

      await arweave.transactions.sign(transaction, key);
      const response = await arweave.transactions.post(transaction);
      
      console.log("Status: ", response.status);

      localStorage['transactionId'] = transaction.id;

      console.log(transaction.id);
      // console.log(transaction.data);
      
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

    .theDesc {
        padding-top: 1em; 
    }

    .theName {
        padding-bottom: 1em; 
    }
    .socialLink {
        padding-bottom: 1em; 
    }
    .theLocation {
        padding-bottom: 1em; 
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
    <form class="needs-validation" novalidate>
      <div class="form-row">
          <div class = "theName col"> 
              <label for="validationCustom01">Name</label>
              <input type="text" class="form-control" id="name validationCustom01" bind:value={name} placeholder="Who wrote this?" required/> 
              <div class="valid-feedback">
                Looks good!
              </div>
          </div>

          <div class = "socialLink col "> 
              <label for="validationCustom02">Your social media link</label>
              <input type="text" class="form-control" id="socialLink" bind:value={socialLink} placeholder="Plug your social media"/> 
          </div>
      </div>

      <div class = "theLocation"> 
          <label for="validationCustom03">Location</label>
          <input type="text" class="form-control" id="location validationCustom02" bind:value={location} placeholder="Pennsylvania, USA" required/> 
          <div class="valid-feedback">
            Looks good!
          </div>
      </div>

      <div class = "theTitle"> 
          <label for="validationCustom04"><b>Title</b></label>
          <input type="text" class="form-control" id="title validationCustom03" bind:value={title} placeholder="Enter a title" required/> 
          <div class="invalid-feedback">
            Can't write without a title!
          </div>
      </div>
      
      <div class="theDesc">
          <label for="validationCustom05"><b>Description</b></label>
          <textarea rows="3" class="form-control" id="description validationCustom04" bind:value ={description}  placeholder="Write the body of your post!" required/>
          <div class="invalid-feedback">
            Every post needs a description!
          </div>
      </div>
      
      <button type="button" class="btn btn-outline-primary" on:click="{addPost}">Submit post</button>
    </form>
</section>