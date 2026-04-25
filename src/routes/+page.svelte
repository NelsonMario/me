<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import MasonryGrid from '$lib/components/MasonryGrid.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Loader from '$lib/components/Loader.svelte';
</script>

<Loader />
<Header />
<main>
  <MasonryGrid />
</main>
<Footer />
