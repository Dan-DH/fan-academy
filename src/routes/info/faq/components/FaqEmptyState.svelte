<script lang="ts">
  interface Props {
    searchQuery?: string;
    onReset?: () => void;
  }

  let { searchQuery = '', onReset }: Props = $props();
</script>

<div class="rounded-2xl border border-stone-800 bg-base-200/60 p-10 text-center max-w-md mx-auto shadow-xl space-y-4">
  <div class="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-800 mx-auto flex items-center justify-center text-amber-400">
    <span class="icon-[material-symbols--search-off-rounded] text-3xl"></span>
  </div>
  <h3 class="text-xl font-bold text-white">No Questions Found</h3>
  <p class="text-sm text-stone-400">
    {#if searchQuery}
      No questions matched <strong class="text-stone-200">"{searchQuery}"</strong> in this category.
    {:else}
      No questions available in this category yet.
    {/if}
    Try selecting another category or clearing your search.
  </p>
  {#if onReset}
    <button
      type="button"
      onclick={onReset}
      class="btn btn-warning btn-sm font-bold text-xs uppercase tracking-wider px-5 shadow-md gap-1.5 cursor-pointer"
    >
      <span class="icon-[material-symbols--refresh-rounded] text-base"></span>
      Reset Filters
    </button>
  {/if}
</div>
