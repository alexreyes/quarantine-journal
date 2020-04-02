<script>
	import { arweaveWallet, storedWalletAddress} from '../components/userContext.js';

	let title = ''; 
    let description = ''; 
    let posts = []; 
    let currDate = '';
	let newPost = {};
    let socialLink = '';
    let name = ''; 
    let location = ''; 

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
            currDate: currDate,
            location: location
		};
        saveToBlockchain(newPost);
        title = ''; 
        description = ''; 
        socialLink = ''; 
        name = ''; 
        location = '';
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

    // (function() {
    //     'use strict';
    //     window.addEventListener('load', function() {
    //         // Fetch all the forms we want to apply custom Bootstrap validation styles to
    //         var forms = document.getElementsByClassName('needs-validation');
    //         // Loop over them and prevent submission
    //         var validation = Array.prototype.filter.call(forms, function(form) {
    //         form.addEventListener('submit', function(event) {
    //             if (form.checkValidity() === false) {
    //             event.preventDefault();
    //             event.stopPropagation();
    //             }
    //             form.classList.add('was-validated');
    //         }, false);
    //         });
    //     }, false);
    // })();
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
    <form>
    
    <div class="form-row">
        <div class = "theName col"> 
            <label for="title">Name</label>
            <input type="text" class="form-control" id="name" bind:value={name} placeholder="Who wrote this?"/> 
        </div>

        <div class = "socialLink col "> 
            <label for="title">Link</label>
            <input type="text" class="form-control" id="socialLink" bind:value={socialLink} placeholder="Link to your social!"/> 
        </div>
    </div>

    </form>
    <div class = "theLocation"> 
        <label for="title">Location</label>
        <input type="text" class="form-control" id="location" bind:value={location} placeholder="Pennsylvania, USA"/> 
    </div>

    <div class = "theTitle"> 
        <label for="title"><b>Title</b></label>
        <input type="text" class="form-control" id="title" bind:value={title} placeholder="Enter a title"/> 
    </div>
    <div class="theDesc">
        <label for="description"><b>Description</b></label>
        <textarea rows="3" class="form-control" id="description" bind:value ={description}  placeholder="Write the body of your post!"/>
    </div>
    
    <button type="button" class="btn btn-outline-primary" on:click={addPost}>Submit post</button>
    
</section>

<!-- <form class="needs-validation" novalidate>
  <div class="form-row">
    <div class="col-md-4 mb-3">
      <label for="validationCustom01">First name</label>
      <input type="text" class="form-control" id="validationCustom01" placeholder="First name" value="Mark" required>
      <div class="valid-feedback">
        Looks good!
      </div>
    </div>
    <div class="col-md-4 mb-3">
      <label for="validationCustom02">Last name</label>
      <input type="text" class="form-control" id="validationCustom02" placeholder="Last name" value="Otto" required>
      <div class="valid-feedback">
        Looks good!
      </div>
    </div>
    <div class="col-md-4 mb-3">
      <label for="validationCustomUsername">Username</label>
      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text" id="inputGroupPrepend">@</span>
        </div>
        <input type="text" class="form-control" id="validationCustomUsername" placeholder="Username" aria-describedby="inputGroupPrepend" required>
        <div class="invalid-feedback">
          Please choose a username.
        </div>
      </div>
    </div>
  </div>
  <div class="form-row">
    <div class="col-md-6 mb-3">
      <label for="validationCustom03">City</label>
      <input type="text" class="form-control" id="validationCustom03" placeholder="City" required>
      <div class="invalid-feedback">
        Please provide a valid city.
      </div>
    </div>
    <div class="col-md-3 mb-3">
      <label for="validationCustom04">State</label>
      <input type="text" class="form-control" id="validationCustom04" placeholder="State" required>
      <div class="invalid-feedback">
        Please provide a valid state.
      </div>
    </div>
    <div class="col-md-3 mb-3">
      <label for="validationCustom05">Zip</label>
      <input type="text" class="form-control" id="validationCustom05" placeholder="Zip" required>
      <div class="invalid-feedback">
        Please provide a valid zip.
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="invalidCheck" required>
      <label class="form-check-label" for="invalidCheck">
        Agree to terms and conditions
      </label>
      <div class="invalid-feedback">
        You must agree before submitting.
      </div>
    </div>
  </div>
  <button class="btn btn-primary" type="submit">Submit form</button>
</form> -->