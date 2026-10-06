<script lang="ts">
  export type GuideTabId = 'about' | 'lobby' | 'mechanics' | 'tiles' | 'tactics' | 'factions';

  interface Props {
    searchQuery: string;
    activeTab: GuideTabId;
    onSearchChange: (query: string) => void;
    onTabChange: (tabId: GuideTabId) => void;
  }

  let {
    searchQuery,
    activeTab,
    onSearchChange,
    onTabChange
  }: Props = $props();

  const tabs: { id: GuideTabId; label: string; icon: string }[] = [
    { id: 'about', label: 'About', icon: 'icon-[material-symbols--menu-book-outline]' },
    { id: 'lobby', label: 'Lobby & Menus', icon: 'icon-[material-symbols--dashboard-outline]' },
    { id: 'mechanics', label: 'Core Rules (5 AP)', icon: 'icon-[material-symbols--auto-awesome-outline]' },
    { id: 'tiles', label: 'Map Tiles', icon: 'icon-[material-symbols--grid-on-outline]' },
    { id: 'tactics', label: 'Combat Tactics', icon: 'icon-[akar-icons--double-sword]' },
    { id: 'factions', label: 'Faction Codex', icon: 'icon-[material-symbols--shield]' }
  ];
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
      placeholder="Search units, abilities, tiles, or tactics..."
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

  <!-- Section Filter Pills -->
  <div>
    <span class="text-xs uppercase tracking-wider text-stone-400 font-semibold block mb-2">
      Section:
    </span>
    <div class="flex flex-wrap gap-2">
      {#each tabs as tab (tab.id)}
        <button
          type="button"
          onclick={() => onTabChange(tab.id)}
          class="px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 {activeTab ===
          tab.id
            ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md shadow-amber-500/20'
            : 'bg-stone-950/60 text-stone-300 border-stone-800 hover:border-amber-500/50 hover:text-white'}"
        >
          <span class="{tab.icon} text-sm"></span>
          <span>{tab.label}</span>
        </button>
      {/each}
    </div>
  </div>
</section>
