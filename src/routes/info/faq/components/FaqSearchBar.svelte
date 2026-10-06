<script lang="ts">
  interface Props {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    placeholder?: string;
  }

  let {
    searchQuery,
    onSearchChange,
    placeholder = 'Search questions by keyword, rule, or faction...'
  }: Props = $props();
</script>

<div class="relative w-full max-w-2xl">
  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
    <span class="icon-[material-symbols--search-rounded] text-xl text-amber-400/80"></span>
  </div>

  <input
    type="text"
    value={searchQuery}
    oninput={(e) => onSearchChange(e.currentTarget.value)}
    placeholder={placeholder}
    class="w-full pl-11 pr-24 py-3.5 bg-stone-900/90 hover:bg-stone-900 focus:bg-stone-900 border border-stone-700/80 focus:border-amber-400 focus:outline-none rounded-xl text-stone-100 placeholder-stone-400 text-sm sm:text-base shadow-lg transition-all"
  />

  {#if searchQuery.trim().length > 0}
    <button
      type="button"
      onclick={() => onSearchChange('')}
      class="absolute inset-y-0 right-2 px-3 my-1.5 flex items-center text-xs font-semibold text-stone-400 hover:text-white bg-stone-800/80 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
      aria-label="Clear search"
    >
      <span class="icon-[material-symbols--close-rounded] text-base mr-1"></span>
      Clear
    </button>
  {/if}
</div>
