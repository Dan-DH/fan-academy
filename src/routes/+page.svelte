<script lang="ts">
	import DiscordCard from '$lib/components/homePage/DiscordCard.svelte';
	import HeroSection from '$lib/components/HeroSection.svelte';
import PatchNotes from '$lib/components/homePage/PatchNotes.svelte';
	import TopPlayers from '$lib/components/homePage/TopPlayers.svelte';
</script>

<svelte:head>
  <title>Welcome | Fan Academy</title>
  <meta
    name="description"
    content="Fan Academy. Implementation of legendary turn base tactical game 'Hero Academy'"
  />
</svelte:head>


	<HeroSection/>
	<div class="flex flex-col md:flex-row w-full flex-wrap gap-5 justify-center items-center">
		<PatchNotes />
		<TopPlayers />
		<DiscordCard/>
	</div>

