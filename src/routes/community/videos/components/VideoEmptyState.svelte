<script lang="ts">
  interface Props {
    onReset: () => void;
  }

  let { onReset }: Props = $props();
</script>

<div
  class="text-center py-16 bg-stone-900/60 border border-stone-800 rounded-2xl p-8 max-w-lg mx-auto space-y-4"
>
  <span
    class="icon-[material-symbols--search-off] text-5xl text-amber-500/60 block mx-auto"
  ></span>
  <h3 class="text-lg font-bold text-white">No videos found</h3>
  <p class="text-sm text-stone-400">
    No gameplay or tactics videos matched your current filter or search criteria.
  </p>
  <button
    type="button"
    onclick={onReset}
    class="btn btn-warning btn-sm rounded-lg cursor-pointer"
  >
    Clear Filters
  </button>
</div>
