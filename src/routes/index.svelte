<script>
	import Content from '../components/Content.svelte';
	import Modal from 'svelte-simple-modal';
</script>

<svelte:head>
	<title>Quarantine Journal</title>
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=UA-137191118-2"></script>
	<script>
	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date());

	gtag('config', 'UA-137191118-2');
</script>

</svelte:head>

<Modal><Content/></Modal>