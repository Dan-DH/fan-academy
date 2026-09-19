<script lang="ts">
	import PatchNotes from '$lib/components/PatchNotes.svelte';
	import TopPlayers from '$lib/components/TopPlayers.svelte';
</script>

<div class="flex flex-col gap-5 justify-center items-center">
	<h1>home</h1>
	<div class="flex w-full gap-5 justify-center items-center">
		<PatchNotes />
		<TopPlayers />
	</div>
</div>
