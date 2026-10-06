<script lang="ts">
  import type { FaqCategory } from '$lib/types/InfoType';
  import { FAQ_CATEGORIES } from './types';

  interface Props {
    selectedCategory: FaqCategory;
    onCategoryChange: (category: FaqCategory) => void;
    categoryCounts?: Partial<Record<FaqCategory, number>>;
  }

  let {
    selectedCategory,
    onCategoryChange,
    categoryCounts = {}
  }: Props = $props();
</script>

<div class="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 w-full">
  {#each FAQ_CATEGORIES as cat}
    {@const count = categoryCounts[cat.id]}
    <button
      type="button"
      onclick={() => onCategoryChange(cat.id)}
      class="btn btn-sm text-xs sm:text-sm font-semibold transition-all rounded-xl gap-2 cursor-pointer {selectedCategory === cat.id
        ? 'btn-warning bg-amber-500 text-stone-950 shadow-md font-bold border-amber-400'
        : 'btn-ghost text-stone-300 hover:text-white hover:bg-stone-800/80 bg-stone-900/80 border border-stone-700/60'}"
    >
      <span class="{cat.icon} text-base"></span>
      <span>{cat.label}</span>
      {#if count !== undefined}
        <span
          class="badge badge-sm text-[11px] font-mono {selectedCategory === cat.id
            ? 'badge-neutral bg-stone-950 text-amber-300'
            : 'badge-ghost text-stone-400'}"
        >
          {count}
        </span>
      {/if}
    </button>
  {/each}
</div>
