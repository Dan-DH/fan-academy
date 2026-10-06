<script lang="ts">
  interface Props {
    searchQuery: string;
    selectedTier: string;
    sortBy: 'wins' | 'elo';
    onSearchChange: (query: string) => void;
    onTierChange: (tier: string) => void;
    onSortChange: (sort: 'wins' | 'elo') => void;
  }

  let {
    searchQuery,
    selectedTier,
    sortBy,
    onSearchChange,
    onTierChange,
    onSortChange
  }: Props = $props();

  const tiers = [
    { id: 'all', label: 'All Tiers' },
    { id: 'diamond', label: 'Diamond' },
    { id: 'gold', label: 'Gold' },
    { id: 'silver', label: 'Silver' },
    { id: 'bronze', label: 'Bronze' },
    { id: 'iron', label: 'Iron' },
    { id: 'wood', label: 'Wood' }
  ];

  const sortOptions: { id: 'wins' | 'elo'; label: string }[] = [
    { id: 'wins', label: 'Most Wins' },
    { id: 'elo', label: 'Highest Elo' }
  ];
</script>

<section
  class="bg-stone-900/80 border border-amber-500/30 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-4 w-full max-w-4xl mt-2 text-left"
>
  <!-- Search Bar -->
  <div class="relative w-full">
    <span
      class="icon-[material-symbols--search] absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 text-xl pointer-events-none"
    ></span>
    <input
      type="search"
      value={searchQuery}
      oninput={(e) => onSearchChange(e.currentTarget.value)}
      placeholder="Search player username..."
      class="w-full bg-stone-950/90 text-white placeholder-stone-400 pl-11 pr-10 py-3 rounded-xl border border-amber-500/40 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm sm:text-base transition-colors"
    />
    {#if searchQuery}
      <button
        type="button"
        onclick={() => onSearchChange('')}
        class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-sm cursor-pointer p-1"
        aria-label="Clear search"
      >
        ✕
      </button>
    {/if}
  </div>

  <!-- Filters Row: Tier Pills & Sort Dropdown -->
  <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
    <!-- Tier Filter Pills -->
    <div class="flex-1">
      <span class="text-xs uppercase tracking-wider text-stone-400 font-semibold block mb-2">
        Tier:
      </span>
      <div class="flex flex-wrap gap-2">
        {#each tiers as tier}
          <button
            type="button"
            onclick={() => onTierChange(tier.id)}
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer {selectedTier ===
            tier.id
              ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md shadow-amber-500/20'
              : 'bg-stone-950/60 text-stone-300 border-stone-800 hover:border-amber-500/50 hover:text-white'}"
          >
            {tier.label}
          </button>
        {/each}
      </div>
    </div>

    <!-- Sort Dropdown Section -->
    <div class="shrink-0">
      <span class="text-xs uppercase tracking-wider text-stone-400 font-semibold block mb-2">
        Sort By:
      </span>
      <div class="relative inline-flex items-center">
        <select
          value={sortBy}
          onchange={(e) => onSortChange(e.currentTarget.value as 'wins' | 'elo')}
          class="appearance-none bg-stone-950/90 text-stone-200 hover:text-white focus:text-white border border-amber-500/40 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 rounded-xl px-4 py-2 pr-9 text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
          aria-label="Sort players by"
        >
          {#each sortOptions as option}
            <option value={option.id} class="bg-stone-900 text-white font-medium">
              {option.label}
            </option>
          {/each}
        </select>
        <span
          class="icon-[material-symbols--keyboard-arrow-down] pointer-events-none absolute right-2.5 text-amber-400 text-lg"
        ></span>
      </div>
    </div>
  </div>
</section>
