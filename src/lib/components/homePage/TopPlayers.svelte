<script lang="ts">
  import InfoCard from '../InfoCard.svelte';
  import { topPlayers } from '$lib/data/placeholder';
</script>

<InfoCard title="Top 3 Players" icon="icon-[akar-icons--trophy]" class="w-80 sm:w-96 min-h-96">
  <div class="flex-1 flex flex-col justify-between">
    <ul class="space-y-3 w-full">
      {#each topPlayers as player}
        <li class="flex w-full items-center justify-between gap-4 p-2 rounded-xl bg-stone-950/60 border border-stone-800/80">
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
    <div class="flex items-center justify-center">
      <a href="/leaderboard" class="btn btn-ghost btn-xs text-amber-300 hover:text-white">
        See All Players
      </a>
    </div>
  {/snippet}
</InfoCard>
