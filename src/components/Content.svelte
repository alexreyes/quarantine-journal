<script>
    import { fly } from 'svelte/transition';	
    import Popup from './Popup.svelte';
    import {getContext} from 'svelte';
    import Nested from './Nested.svelte';


    const { open } = getContext('simple-modal');

    const showPopup = () => {
        open(Popup);
    };
	
</script>

<button on:click={showPopup}>log in </button>