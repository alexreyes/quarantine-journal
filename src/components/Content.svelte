<script>
    import { getContext } from 'svelte';
    import { fly } from 'svelte/transition';	
    import Popup from './Popup.svelte';
    
    const { open } = getContext('simple-modal');

    const showPopup = () => {
        open(Popup);
    };
	
</script>

<p>
    <button on:click={showPopup}>Login</button>
</p>