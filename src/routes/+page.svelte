<script lang="ts">
	import DiscordCard from '$lib/components/DiscordCard.svelte';
	import HeroSection from '$lib/components/HeroSection.svelte';
import PatchNotes from '$lib/components/PatchNotes.svelte';
	import TopPlayers from '$lib/components/TopPlayers.svelte';
</script>

<div class="flex flex-col gap-5 justify-center items-center">
	<HeroSection/>
	<div class="flex flex-col md:flex-row w-full gap-5 justify-center items-center">
		<PatchNotes />
		<TopPlayers />
		<DiscordCard/>
	</div>
</div>
