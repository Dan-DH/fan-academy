<script lang="ts">
  import type { FactionGuide } from '$lib/types/GuideType';
  import UnitCard from './UnitCard.svelte';
  import ItemCard from './ItemCard.svelte';

  let { faction }: { faction: FactionGuide } = $props();

  function handleImageError(event: Event) {
    const target = event.currentTarget as HTMLImageElement;
    target.style.display = 'none';
    const fallbackDiv = target.parentElement?.querySelector('.image-fallback');
    if (fallbackDiv) {
      fallbackDiv.classList.remove('hidden');
    }
  }
</script>

<div class="flex flex-col gap-6">
  <!-- Faction Header Banner -->
  <div
    class="relative isolate rounded-3xl overflow-hidden border-2 {faction.borderAccent} bg-linear-to-r {faction.color} p-6 sm:p-8 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6"
  >
    <div class="relative z-1 space-y-3 max-w-2xl text-center lg:text-left">
      <div class="flex items-center justify-center lg:justify-start gap-3">
        <span class="text-xs font-bold uppercase tracking-widest text-amber-300 border-b border-amber-400/40 pb-0.5">
          {faction.title}
        </span>
        <span class="text-xs font-mono text-stone-300">
          • 5 Heroes + 1 Unique
        </span>
      </div>

      <h3 class="text-3xl sm:text-4xl font-black text-white tracking-wide">
        {faction.name}
      </h3>

      <p class="text-stone-200 text-sm sm:text-base leading-relaxed font-medium">
        {faction.description}
      </p>

      <!-- Faction Passive Box -->
      <div class="bg-black/50 border border-white/20 rounded-2xl p-4 flex items-start gap-3 backdrop-blur-sm text-left">
        <div class="p-2 rounded-xl bg-white/10 text-amber-300 shrink-0">
          <span class="icon-[material-symbols--auto-awesome-outline] text-xl"></span>
        </div>
        <div>
          <h4 class="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Faction Passive: {faction.passiveName}
          </h4>
          <p class="text-xs sm:text-sm text-stone-200 mt-0.5">
            {faction.passiveDescription}
          </p>
        </div>
      </div>
    </div>

    <!-- Faction Splash Art -->
    <div class="relative w-full max-w-xs sm:max-w-sm rounded-2xl overflow-hidden border border-white/20 shadow-2xl shrink-0 group">
      <img
        src={faction.splashImage}
        alt="{faction.name} Splash"
        class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
        onerror={handleImageError}
      />
      <div class="image-fallback hidden w-full h-44 bg-stone-900 flex items-center justify-center text-stone-500">
        <span class="icon-[material-symbols--shield] text-6xl"></span>
      </div>
    </div>
  </div>

  <!-- Unit Roster Grid -->
  {#if faction.units.length > 0}
    <div class="space-y-4">
      <h4 class="text-xl font-bold text-white flex items-center gap-2">
        <span class="icon-[material-symbols--group-outline] text-amber-400"></span>
        Hero Roster
      </h4>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each faction.units as unit (unit.name)}
          <UnitCard {unit} />
        {/each}
      </div>
    </div>
  {/if}

  <!-- Armory & Spellbook Grid -->
  {#if faction.items.length > 0}
    <div class="space-y-4">
      <h4 class="text-xl font-bold text-white flex items-center gap-2">
        <span class="icon-[material-symbols--science-outline] text-amber-400"></span>
        {faction.name} Armory & Spells
      </h4>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {#each faction.items as item (item.name)}
          <ItemCard {item} />
        {/each}
      </div>
    </div>
  {/if}
</div>
