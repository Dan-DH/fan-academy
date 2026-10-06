<script lang="ts">
  import type { FaqCategory } from '$lib/types/InfoType';
  import { FAQ_CATEGORIES } from './types';

  interface Props {
    searchQuery: string;
    activeCategory: FaqCategory;
    filteredCount?: number;
    onSearchChange: (query: string) => void;
    onCategoryChange: (category: FaqCategory) => void;
  }

  let {
    searchQuery,
    activeCategory,
    onSearchChange,
    onCategoryChange
  }: Props = $props();
</script>

<section
  class="bg-stone-900/80 border border-amber-500/30 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-4 w-full max-w-4xl mt-2 text-left"
>
  <!-- Search Input -->
  <div class="relative w-full">
    <span
      class="icon-[material-symbols--search] absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 text-xl pointer-events-none"
    ></span>
    <input
      type="search"
      value={searchQuery}
      oninput={(e) => onSearchChange(e.currentTarget.value)}
      placeholder="Search questions by keyword, rule, or faction..."
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

  <!-- Category Filter Pills -->
  <div>
    <span class="text-xs uppercase tracking-wider text-stone-400 font-semibold block mb-2">
      Category:
    </span>
    <div class="flex flex-wrap gap-2">
      {#each FAQ_CATEGORIES as cat (cat.id)}
        <button
          type="button"
          onclick={() => onCategoryChange(cat.id)}
          class="px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 {activeCategory ===
          cat.id
            ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md shadow-amber-500/20'
            : 'bg-stone-950/60 text-stone-300 border-stone-800 hover:border-amber-500/50 hover:text-white'}"
        >
          <span class="{cat.icon} text-sm"></span>
          <span>{cat.label}</span>
        </button>
      {/each}
    </div>
  </div>
</section>
