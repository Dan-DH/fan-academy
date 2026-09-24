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

<div class=" w-11/12 mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-base-100 rounded-box border border-base-200">

  <div class="flex items-center gap-2">
    <span class="text-sm opacity-70 text-nowrap">Players per page:</span>
    <select
      class="select select-bordered select-sm"
      value={perPage}
      onchange={handlePerPageChange}
    >
      {#each perPageItems as count}
        <option value={count}>
          {count > 1000 ? "All" : count}
        </option>
      {/each}
    </select>
  </div>

  <div class="join">
    <button
      class="join-item btn btn-sm"
      disabled={currentPage <= 1}
      onclick={() => setPage(currentPage - 1)}
      aria-label="Previous page"
    >
      «
    </button>
    {#each pages as page, idx (idx)}
      {#if page === "..."}
        <button class="join-item btn btn-sm btn-disabled opacity-50 cursor-default" tabindex="-1">
          ...
        </button>
      {:else}
        <button
          class="join-item btn btn-sm {currentPage === page ? 'btn-active btn-primary' : ''}"
          onclick={() => setPage(page)}
        >
          {page}
        </button>
      {/if}
    {/each}

    <button
      class="join-item btn btn-sm"
      disabled={currentPage >= totalPages}
      onclick={() => setPage(currentPage + 1)}
      aria-label="Next page"
    >
      »
    </button>
  </div>

</div>
