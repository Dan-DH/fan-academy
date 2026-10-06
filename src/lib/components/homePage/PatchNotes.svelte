<script lang="ts">
  import { patchNotes } from '$lib/data/placeholder';
  import InfoCard from '../InfoCard.svelte';

  const latestPatch = patchNotes[0];
</script>

<InfoCard title="Patch Notes" icon="icon-[material-symbols--history-edu]" class="w-80 sm:w-96 h-96">
  {#if latestPatch}
    <div class="flex-1 flex flex-col justify-between min-h-0">
      <div class="space-y-2.5">
        <div class="flex justify-between items-center gap-2 border-b border-stone-800/80 pb-2">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-white font-mono">v{latestPatch.version}</span>
            <span class="badge badge-warning badge-xs font-bold uppercase tracking-wider px-1.5 py-0.5">
              Latest
            </span>
          </div>
          <span class="text-xs text-stone-400 font-mono flex items-center gap-1">
            <span class="icon-[material-symbols--calendar-today-outline] text-xs text-amber-400/70"></span>
            {latestPatch.date}
          </span>
        </div>

        {#if latestPatch.title}
          <h4 class="text-xs sm:text-sm font-bold text-amber-300/90 tracking-wide line-clamp-1">
            {latestPatch.title}
          </h4>
        {/if}

        <ul class="space-y-2">
          {#each latestPatch.description.slice(0, 3) as item}
            <li class="text-xs text-stone-300 flex items-start gap-2">
              <span class="icon-[material-symbols--check-circle-outline-rounded] text-amber-400/80 text-sm shrink-0 mt-0.5"></span>
              <span class="leading-relaxed line-clamp-2">{item}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}

  {#snippet footer()}
    <a
      href="/info/patch-notes"
      class="w-full py-3.5 px-5 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 bg-stone-950/80 hover:bg-amber-500 hover:text-stone-950 transition-all cursor-pointer group"
    >
      <span>See All Patch Notes</span>
      <span
        class="icon-[material-symbols--arrow-forward-rounded] text-base group-hover:translate-x-1 transition-transform"
      ></span>
    </a>
  {/snippet}
</InfoCard>
