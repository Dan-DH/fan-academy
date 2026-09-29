<script lang="ts">
  import { allPlayers } from "$lib/data/placeholder";
  import { perPageItems } from "$lib/utils/helper";
  import LeaderboardPaginator from "./LeaderboardPaginator.svelte";
  import PlayerCard from "./PlayerCard.svelte";

  let searchQuery = $state('');
  let selectedTier = $state('all');
  let sortBy = $state<'wins' | 'elo'>('wins');

  let currentPage = $state(1);
  let perPage = $state(perPageItems[0]);

  const sortedPlayers = $derived.by(() => {
    return [...allPlayers].sort((a, b) => {
      if (sortBy === 'wins') {
        if (b.wins !== a.wins) return b.wins - a.wins;
        return a.total_matches - b.total_matches;
      } else {
        return b.elo - a.elo;
      }
    });
  });

  const filteredPlayers = $derived.by(() => {
    let list = sortedPlayers;

    if (selectedTier !== 'all') {
      list = list.filter((p) => p.tier.toLowerCase() === selectedTier.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => p.username.toLowerCase().includes(q));
    }

    return list;
  });

  $effect(() => {
    searchQuery;
    selectedTier;
    sortBy;
    currentPage = 1;
  });

  let paginatedPlayers = $derived.by(() => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return filteredPlayers.slice(startIndex, endIndex);
  });

  const tiers = [
    { id: 'all', label: 'All Tiers' },
    { id: 'diamond', label: 'Diamond' },
    { id: 'gold', label: 'Gold' },
    { id: 'silver', label: 'Silver' },
    { id: 'bronze', label: 'Bronze' },
    { id: 'iron', label: 'Iron' },
    { id: 'wood', label: 'Wood' }
  ];
</script>

<div class="space-y-4 w-full">
  <div
    class="w-full bg-stone-900/90 border border-stone-800 focus-within:border-amber-500/40 rounded-xl shadow-xs overflow-hidden flex flex-col sm:flex-row items-stretch sm:items-center transition-colors"
  >
    <div class="relative flex-1 flex items-center min-w-0">
      <span
        class="icon-[material-symbols--search] absolute left-3.5 text-stone-400 text-lg pointer-events-none"
      ></span>
      <input
        type="search"
        bind:value={searchQuery}
        placeholder="Search player..."
        class="w-full bg-transparent border-0 text-white placeholder-stone-500 pl-10 pr-8 py-2.5 focus:outline-none text-xs sm:text-sm"
      />
      {#if searchQuery}
        <button
          onclick={() => (searchQuery = '')}
          class="btn btn-ghost btn-xs btn-circle absolute right-2 text-stone-400 hover:text-white"
          aria-label="Clear search"
        >
          ✕
        </button>
      {/if}
    </div>

    <div class="h-px sm:h-6 sm:w-px bg-stone-800 self-stretch sm:self-center shrink-0"></div>

    <!-- Tier & Sort Controls in Same Unified Element -->
    <div class="flex items-center shrink-0">
      <!-- Tier Dropdown -->
      <div class="relative flex items-center group">
        <select
          bind:value={selectedTier}
          class="appearance-none bg-transparent bg-none text-stone-300 group-hover:text-white focus:text-white text-xs cursor-pointer py-2 pl-3.5 pr-8 focus:outline-none"
          aria-label="Filter tier"
        >
          {#each tiers as tier}
            <option value={tier.id} class="bg-stone-900 text-white">{tier.label}</option>
          {/each}
        </select>
        <span
          class="icon-[material-symbols--keyboard-arrow-down] pointer-events-none absolute right-2.5 text-stone-400 group-hover:text-amber-400 text-base transition-colors"
        ></span>
      </div>

      <div class="w-px h-5 bg-stone-800 self-center shrink-0"></div>

      <!-- Sort Dropdown -->
      <div class="relative flex items-center group">
        <select
          bind:value={sortBy}
          class="appearance-none bg-transparent bg-none text-stone-300 group-hover:text-white focus:text-white text-xs cursor-pointer py-2 pl-3.5 pr-8 focus:outline-none"
          aria-label="Sort by"
        >
          <option value="wins" class="bg-stone-900 text-white">Sort: Wins</option>
          <option value="elo" class="bg-stone-900 text-white">Sort: Elo</option>
        </select>
        <span
          class="icon-[material-symbols--keyboard-arrow-down] pointer-events-none absolute right-2.5 text-stone-400 group-hover:text-amber-400 text-base transition-colors"
        ></span>
      </div>
    </div>
  </div>

  <article
    class="card bg-stone-900/90 border border-amber-500/20 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between"
  >

    <div
      class="px-5 py-3.5 bg-base-300/80 border-b border-amber-200/20 flex items-center justify-between gap-3"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <span class="icon-[akar-icons--trophy] text-xl text-amber-400 shrink-0"></span>
        <h3 class="text-base font-bold text-white">Leaderboard</h3>
      </div>
      <span class="text-xs text-stone-400 font-mono shrink-0 whitespace-nowrap">
        {filteredPlayers.length} players
      </span>
    </div>

    <!-- Table Body -->
    <div class="overflow-x-auto w-full">
      <table class="table table-sm sm:table-md w-full">
        <!-- Table Header -->
        <thead class="bg-stone-950/70 border-b border-stone-800 text-stone-300 text-xs font-mono uppercase tracking-wider">
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
                <span class="icon-[material-symbols--search-off] text-5xl mb-3 text-stone-500 block mx-auto"></span>
                <p class="font-bold text-white text-base">No players found</p>
                <p class="text-xs text-stone-400 mt-1">
                  Try clearing your search or tier filter.
                </p>
                {#if searchQuery || selectedTier !== 'all'}
                  <button
                    onclick={() => {
                      searchQuery = '';
                      selectedTier = 'all';
                    }}
                    class="btn btn-warning btn-xs sm:btn-sm mt-4 font-bold"
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
    {#if filteredPlayers.length > 0}
      <div class="px-5 py-3 border-t border-stone-800 text-xs text-stone-400 bg-stone-950/50">
        <LeaderboardPaginator
          playersListLength={filteredPlayers.length}
          bind:currentPage
          bind:perPage
        />
      </div>
    {/if}
  </article>
</div>
