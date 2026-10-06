<script lang="ts">
  import type { VideoCategory } from '$lib/data/placeholder';

  interface Props {
    searchQuery: string;
    selectedCategory: 'all' | VideoCategory;
    totalVideos?: number;
    filteredCount?: number;
    onSearchChange: (query: string) => void;
    onCategoryChange: (category: 'all' | VideoCategory) => void;
  }

  let {
    searchQuery,
    selectedCategory,
    onSearchChange,
    onCategoryChange
  }: Props = $props();

  const categories: { id: 'all' | VideoCategory; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'guide', label: 'Beginner Guides' },
    { id: 'tactics', label: 'Tactical Challenges' },
    { id: 'faction-guide', label: 'Faction Breakdowns' },
    { id: 'match-commentary', label: 'Match Commentary' },
    { id: 'gameplay', label: 'Gameplay' },
    { id: 'showcase', label: 'Showcase' }
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
      placeholder="Search by title or tactical concepts..."
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

  <!-- Category Pills -->
  <div>
    <span class="text-xs uppercase tracking-wider text-stone-400 font-semibold block mb-2">
      Category:
    </span>
    <div class="flex flex-wrap gap-2">
      {#each categories as cat}
        <button
          type="button"
          onclick={() => onCategoryChange(cat.id)}
          class="px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer {selectedCategory ===
          cat.id
            ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md shadow-amber-500/20'
            : 'bg-stone-950/60 text-stone-300 border-stone-800 hover:border-amber-500/50 hover:text-white'}"
        >
          {cat.label}
        </button>
      {/each}
    </div>
  </div>
</section>
