<script lang="ts">
  let { params } = $props();
</script>

<svelte:head>
  <title>Battle #{params.id} | Fan Academy</title>
  <meta
    name="description"
    content="Live turn-based tactics match in Fan Academy. Deploy units, command abilities, and destroy enemy power crystals."
  />
</svelte:head>

<div class="">
  <h1>Game {params.id}</h1>
</div>
