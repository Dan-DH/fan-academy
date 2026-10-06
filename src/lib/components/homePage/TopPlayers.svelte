<script lang="ts">
  import InfoCard from '../InfoCard.svelte';
  import { topPlayers } from '$lib/data/placeholder';
</script>

<InfoCard title="Top 3 Players" icon="icon-[akar-icons--trophy]" class="w-80 sm:w-96 h-96">
  <div class="flex-1 flex flex-col justify-between">
    <ul class="space-y-3 w-full">
      {#each topPlayers as player}
        <li
          class="flex w-full items-center justify-between gap-4 p-2 rounded-xl bg-stone-950/60 border border-stone-800/80"
        >
          <span class="{player.icon} text-4xl text-amber-400"></span>
          <div class="flex justify-between items-center w-full">
            <h4 class="text-sm font-semibold text-white">{player.username}</h4>
            <span class="text-xs font-mono font-bold text-amber-300">{player.elo} pts</span>
          </div>
        </li>
      {/each}
    </ul>
  </div>

  {#snippet footer()}
    <a
      href="/leaderboard"
      class="w-full py-3.5 px-5 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 bg-stone-950/80 hover:bg-amber-500 hover:text-stone-950 transition-all cursor-pointer group"
    >
      <span>See All Players</span>
      <span
        class="icon-[material-symbols--arrow-forward-rounded] text-base group-hover:translate-x-1 transition-transform"
      ></span>
    </a>
  {/snippet}
</InfoCard>
