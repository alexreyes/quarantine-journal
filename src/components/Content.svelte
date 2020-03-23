<script>
    import { fly } from 'svelte/transition';	
    import Popup from './Popup.svelte';
    import {getContext} from 'svelte';
    import Nested from './Nested.svelte';
	import { loggedIn, storedWalletAddress, storedWalletBalance } from './userContext.js';

    const { open } = getContext('simple-modal');

    const showPopup = () => {
        if (loggedIn === true) {
            console.log('fasd');
            loggedIn.set(false);
        }
        else {
            console.log('asdf');

            open(Popup);
        }        
    };
	
</script>

<button on:click={showPopup}>{$loggedIn}</button>
<p>{$loggedIn}</p>
<p>{$storedWalletAddress}</p>
<p>{$storedWalletBalance}</p>
