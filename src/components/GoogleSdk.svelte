<script>
  // import loader from '@beyonk/async-script-loader'
  import { onMount, createEventDispatcher } from 'svelte'
  import { mapsLoaded, mapsLoading } from './userContext.js'

  const dispatch = createEventDispatcher()

  export let apiKey
  
  $: $mapsLoaded && dispatch('ready')

  onMount(() => {
    window.byGmapsReady = () => {
      mapsLoaded.set(true)
      delete window['byGmapsReady']
    }

    if ($mapsLoaded) {
      dispatch('ready')
    }

    // Only do this if we are not already loading, or if we 
    // haven't already loaded 

    if (!$mapsLoading && !$mapsLoaded) {

      // Build url the same way. 

      const url = [
        '//maps.googleapis.com/maps/api/js?',
        apiKey ? `key=${apiKey}&` : '',
        `libraries=places&callback=byGmapsReady`
      ].join('')

      
      // Create script element, set src attribute, and add to the document
      // as a child of the <head> element.
      const docHeadElement = document.querySelector('head');
      
      const scriptElement = document.createElement('script'); 
      scriptElement.setAttribute('src', url);

      docHeadElement.appendChild(scriptElement);

      mapsLoading.set(true)

      /*loader(
        url,
        () => { return $mapsLoaded }
      )*/
      
    }
  })
</script>
