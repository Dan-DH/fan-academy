<script lang="ts">
	import { patchNotes } from '$lib/data/placeholder';
import HomeCard from './HomeCard.svelte';
</script>

<HomeCard title="Patch Notes">
	<div class=" flex flex-col justify-between items-center h-full gap-2 p-3">
		<ul class="p-2 flex flex-col gap-3">
			{#each patchNotes as patchNote }
			<li>
				<div class="flex justify-between items-center">
					<h4 class="text-lg">
						Version: {patchNote.version}
					</h4>
					<span class="text-sm">{patchNote.date}</span>
				</div>
				<ol class="px-5">
					{#each patchNote.description as item }
						<li class="text-sm list-disc">{item}</li>
					{/each}
				</ol>
			</li>
			{/each}
		</ul>
		<a href="/leaderboard" class="btn btn-ghost my-3">See All Patch Notes</a>
	</div>
</HomeCard>
