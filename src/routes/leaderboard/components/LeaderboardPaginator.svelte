<script lang="ts">
  import { getNumberOfPages, perPageItems } from "$lib/utils/helper";
  import { getPaginationRange, type PageItem } from "$lib/utils/helper";

  let {
    playersListLength = 0,
    currentPage = $bindable(1),
    perPage = $bindable(perPageItems[0])
  }: {
    playersListLength: number;
    currentPage?: number;
    perPage?: number;
  } = $props();

  let totalPages = $derived(getNumberOfPages(playersListLength, perPage));
  let pages = $derived<PageItem[]>(getPaginationRange(totalPages, currentPage, 1));

  let startItem = $derived(playersListLength === 0 ? 0 : (currentPage - 1) * perPage + 1);
  let endItem = $derived(Math.min(currentPage * perPage, playersListLength));

  function setPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  function handlePerPageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    perPage = Number(target.value);
    currentPage = 1;
  }
</script>

<div class="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
  <div class="flex items-center gap-3 shrink-0 whitespace-nowrap">
    <span class="font-mono text-stone-300 shrink-0 whitespace-nowrap">
      {startItem}–{endItem} of {playersListLength}
    </span>

    <div class="relative flex items-center group">
      <select
        class="appearance-none bg-stone-900 border border-stone-800 text-stone-300 group-hover:text-white focus:border-amber-400 rounded-lg cursor-pointer text-xs py-1 pl-2.5 pr-6 focus:outline-none"
        value={perPage}
        onchange={handlePerPageChange}
        aria-label="Players per page"
      >
        {#each perPageItems as count}
          <option value={count}>
            {count > 1000 ? "All" : count}
          </option>
        {/each}
      </select>
      <span
        class="icon-[material-symbols--keyboard-arrow-down] pointer-events-none absolute right-1.5 text-stone-400 text-sm group-hover:text-amber-400 transition-colors"
      ></span>
    </div>
  </div>

  {#if totalPages > 1}
    <div class="join shrink-0">
      <button
        class="join-item btn btn-xs btn-ghost text-stone-400 hover:text-white disabled:opacity-30"
        disabled={currentPage <= 1}
        onclick={() => setPage(currentPage - 1)}
        aria-label="Previous page"
      >
        «
      </button>

      {#each pages as page, idx (idx)}
        {#if page === "..."}
          <button class="join-item btn btn-xs btn-ghost text-stone-600 cursor-default" tabindex="-1">
            ...
          </button>
        {:else}
          <button
            class="join-item btn btn-xs transition-all {currentPage === page
              ? 'bg-amber-500 text-stone-950 font-bold hover:bg-amber-400'
              : 'btn-ghost text-stone-400 hover:text-white'}"
            onclick={() => setPage(page)}
          >
            {page}
          </button>
        {/if}
      {/each}

      <button
        class="join-item btn btn-xs btn-ghost text-stone-400 hover:text-white disabled:opacity-30"
        disabled={currentPage >= totalPages}
        onclick={() => setPage(currentPage + 1)}
        aria-label="Next page"
      >
        »
      </button>
    </div>
  {/if}
</div>
