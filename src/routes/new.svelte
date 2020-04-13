<script>
	import { arweaveWallet, storedWalletAddress, submittedPost} from '../components/userContext.js';
  import { onMount, onDestroy } from 'svelte';
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
  let submitDisabled = true; 
  let googApiKey = process.env.GOOGLE_KEY; 
  let recaptchaKey = process.env.RECAPTCHA; 

  const navigateAndSave = async () => {
    localStorage['submittedPost'] = 'true'; 
    await goto('.');
  }
  function verifyUser() {
    submitDisabled = false; 
  }

  onMount(() => {
    window.verifyUser = verifyUser;
  })

  onDestroy(() => {
    window.verifyUser = null;
  })

  async function addPost(){
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
      location: place.formatted_address,
      isoDateTime: isoDateTime, 
      locLat: place.geometry.location.lat(),
      locLong:  place.geometry.location.lng()
    };

    console.log(newPost);

    localStorage['post'] = JSON.stringify(post);
    console.log("Saving post to cache: ", JSON.stringify(post));  

    // fetch('/api/saveToBlockchain', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(post),
    // })

    if (resp.status === 200) {
      const result = await resp.body.json();
      localStorage['transactionId'] = result.transactionId;
      navigateAndSave();
    } else {
      alert(`There was a problem saving :( ${resp.status}`)
    }

    // Reset inputs to default (empty) on form
    title = ''; 
    description = ''; 
    socialLink = ''; 
    name = ''; 
    location = '';
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

    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    
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
  
  <br>
  <form action="?" method="POST">
    <div class="g-recaptcha" 
    data-sitekey="{recaptchaKey}"
    data-callback="verifyUser"></div>
  </form>
  <button type="submit" class="btn btn-outline-primary" disabled={submitDisabled}>Submit entry</button>

</form>