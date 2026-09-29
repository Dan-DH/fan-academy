<script lang="ts">
  let {
    selectedFactionId,
    onSelect
  }: {
    selectedFactionId: string;
    onSelect: (id: string) => void;
  } = $props();

  const factions = [
    { id: 'all', label: 'All', activeColor: 'bg-amber-500 text-stone-950' },
    { id: 'council', label: 'Council', activeColor: 'bg-amber-500 text-stone-950' },
    { id: 'dark-elves', label: 'Dark Elves', activeColor: 'bg-purple-600 text-white' },
    { id: 'dwarves', label: 'Dwarves', activeColor: 'bg-orange-600 text-white' }
  ];
</script>

<div class="tabs tabs-box bg-stone-950/80 border border-amber-500/30 p-1 rounded-xl">
  {#each factions as f (f.id)}
    <button
      onclick={() => onSelect(f.id)}
      class="tab {selectedFactionId === f.id ? `tab-active ${f.activeColor} font-bold` : 'text-stone-300'}"
    >
      {f.label}
    </button>
  {/each}
</div>
