<script lang="ts">
  export type GuideTabId = 'all' | 'about' | 'lobby' | 'mechanics' | 'tiles' | 'tactics' | 'factions';

  let {
    activeTab = 'all',
    onTabChange
  }: {
    activeTab: GuideTabId;
    onTabChange: (tabId: GuideTabId) => void;
  } = $props();

  const tabs: { id: GuideTabId; label: string; icon: string }[] = [
    { id: 'all', label: 'All Sections', icon: 'icon-[material-symbols--grid-view-outline]' },
    { id: 'about', label: 'About', icon: 'icon-[material-symbols--menu-book-outline]' },
    { id: 'lobby', label: 'Lobby & Menus', icon: 'icon-[material-symbols--dashboard-outline]' },
    { id: 'mechanics', label: 'Core Rules (5 AP)', icon: 'icon-[material-symbols--auto-awesome-outline]' },
    { id: 'tiles', label: 'Map Tiles', icon: 'icon-[material-symbols--grid-on-outline]' },
    { id: 'tactics', label: 'Combat Tactics', icon: 'icon-[akar-icons--double-sword]' },
    { id: 'factions', label: 'Faction Codex', icon: 'icon-[material-symbols--shield]' }
  ];
</script>

<div class="w-full flex justify-center py-2">
  <div
    role="tablist"
    class="tabs tabs-box bg-base-300/80 border border-amber-200/20 p-1.5 rounded-2xl max-w-full overflow-x-auto shadow-md gap-1"
    aria-label="Guide Sections"
  >
    {#each tabs as tab (tab.id)}
      <button
        role="tab"
        onclick={() => onTabChange(tab.id)}
        class="tab flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap transition-all {activeTab === tab.id
          ? 'tab-active bg-amber-500 text-stone-950 font-bold'
          : 'text-stone-300 hover:text-white'}"
      >
        <span class="{tab.icon} text-base"></span>
        <span>{tab.label}</span>
      </button>
    {/each}
  </div>
</div>
