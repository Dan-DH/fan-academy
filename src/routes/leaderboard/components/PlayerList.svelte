<script lang="ts">
  import type { PlayerData } from '$lib/types/InfoType';
  import { perPageItems } from '$lib/utils/helper';
  import LeaderboardPaginator from './LeaderboardPaginator.svelte';
  import PlayerCard from './PlayerCard.svelte';

  interface Props {
    players: PlayerData[];
    searchQuery?: string;
    selectedTier?: string;
    onResetFilters?: () => void;
  }

  let {
    players,
    searchQuery = '',
    selectedTier = 'all',
    onResetFilters
  }: Props = $props();

  let currentPage = $state(1);
  let perPage = $state(perPageItems[0]);

  $effect(() => {
    // Reset page to 1 whenever filtered players list changes
    players;
    currentPage = 1;
  });

  let paginatedPlayers = $derived.by(() => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return players.slice(startIndex, endIndex);
  });
</script>

<div class="space-y-4 w-full">
  <article
    class="card bg-stone-900/90 border border-amber-500/20 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between"
  >
    <div
      class="px-5 py-3.5 bg-base-300/80 border-b border-amber-200/20 flex items-center justify-between gap-3"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <span class="icon-[akar-icons--trophy] text-xl text-amber-400 shrink-0"></span>
        <h3 class="text-base font-bold text-white">Leaderboard Rankings</h3>
      </div>
      <span class="text-xs text-stone-400 font-mono shrink-0 whitespace-nowrap">
        {players.length} players
      </span>
    </div>

    <!-- Table Body -->
    <div class="overflow-x-auto w-full">
      <table class="table table-sm sm:table-md w-full">
        <!-- Table Header -->
        <thead
          class="bg-stone-950/70 border-b border-stone-800 text-stone-300 text-xs font-mono uppercase tracking-wider"
        >
          <tr>
            <th class="text-center w-12 sm:w-16">#</th>
            <th>Player</th>
            <th>Tier</th>
            <th>Elo</th>
            <th>W / L</th>
            <th>Win %</th>
            <th class="hidden lg:table-cell">Ranked</th>
            <th class="text-right w-14"></th>
          </tr>
        </thead>

        <!-- Table Rows -->
        <tbody>
          {#if paginatedPlayers.length === 0}
            <tr>
              <td colspan="8" class="text-center py-16 text-stone-400">
                <span
                  class="icon-[material-symbols--search-off] text-5xl mb-3 text-stone-500 block mx-auto"
                ></span>
                <p class="font-bold text-white text-base">No players found</p>
                <p class="text-xs text-stone-400 mt-1">
                  Try clearing your search or tier filter.
                </p>
                {#if searchQuery || selectedTier !== 'all'}
                  <button
                    onclick={() => onResetFilters?.()}
                    class="btn btn-warning btn-xs sm:btn-sm mt-4 font-bold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                {/if}
              </td>
            </tr>
          {:else}
            {#each paginatedPlayers as player, index (player.username)}
              <PlayerCard
                {player}
                rank={(currentPage - 1) * perPage + index + 1}
              />
            {/each}
          {/if}
        </tbody>
      </table>
    </div>

    <!-- Footer Bar with Paginator -->
    {#if players.length > 0}
      <div class="px-5 py-3 border-t border-stone-800 text-xs text-stone-400 bg-stone-950/50">
        <LeaderboardPaginator
          playersListLength={players.length}
          bind:currentPage
          bind:perPage
        />
      </div>
    {/if}
  </article>
</div>
