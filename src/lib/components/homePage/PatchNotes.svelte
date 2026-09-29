<script lang="ts">
  import { patchNotes } from '$lib/data/placeholder';
  import InfoCard from '../InfoCard.svelte';
</script>

<InfoCard title="Patch Notes" icon="icon-[material-symbols--history-edu]" class="w-80 sm:w-96 min-h-96">
  <div class="flex-1 flex flex-col justify-between">
    <ul class="space-y-4">
      {#each patchNotes as patchNote}
        <li class="space-y-1">
          <div class="flex justify-between items-center text-sm font-semibold">
            <span class="text-white">Version: {patchNote.version}</span>
            <span class="text-xs text-stone-400 font-mono">{patchNote.date}</span>
          </div>
          <ul class="pl-4 space-y-1">
            {#each patchNote.description as item}
              <li class="text-xs text-stone-300 list-disc">{item}</li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>
  </div>

  {#snippet footer()}
    <div class="flex items-center justify-center">
      <a href="/leaderboard" class="btn btn-ghost btn-xs text-amber-300 hover:text-white">
        See All Patch Notes
      </a>
    </div>
  {/snippet}
</InfoCard>
