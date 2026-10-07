<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/store/auth.svelte';
	import DiscordCard from '$lib/components/homePage/DiscordCard.svelte';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import PatchNotes from '$lib/components/homePage/PatchNotes.svelte';
	import TopPlayers from '$lib/components/homePage/TopPlayers.svelte';

	$effect(() => {
		if (browser && auth.isAuthenticated) {
			goto('/dashboard', { replaceState: true });
		}
	});
</script>

<svelte:head>
  <title>Welcome | Fan Academy</title>
  <meta
    name="description"
    content="Fan Academy. Implementation of legendary turn base tactical game 'Hero Academy'"
  />
</svelte:head>

{#if !auth.isAuthenticated}
	<HeroSection/>
	<div class="flex flex-col md:flex-row w-full flex-wrap gap-5 justify-center items-center">
		<PatchNotes />
		<TopPlayers />
		<DiscordCard/>
	</div>
{/if}

