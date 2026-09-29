<script lang="ts">
  import type { UnitGuide } from '$lib/types/GuideType';

  let { unit }: { unit: UnitGuide } = $props();

  function handleImageError(event: Event, fallbackSrc?: string) {
    const target = event.currentTarget as HTMLImageElement;
    if (fallbackSrc && target.src !== fallbackSrc) {
      target.src = fallbackSrc;
    } else {
      target.style.display = 'none';
      const fallbackDiv = target.parentElement?.querySelector('.image-fallback');
      if (fallbackDiv) {
        fallbackDiv.classList.remove('hidden');
      }
    }
  }
</script>

<article
  class="card bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all group"
>
  <div>
    <!-- Tactical Card Top Header Bar -->
    <div class="px-5 py-3.5 bg-base-300/80 border-b border-amber-200/20 flex items-center justify-between">
      <h4 class="font-bold text-white text-base">
        {unit.name}
      </h4>
      <span class="text-xs text-stone-400">
        {unit.role} • {#if unit.count > 0}×{unit.count} in deck{:else}Summoned{/if}
      </span>
    </div>

    <!-- Hero Identity & Vitals Section -->
    <div class="p-5 pb-3 flex items-start gap-4">
      <!-- Unit Portrait -->
      <div
        class="w-20 h-20 rounded-xl overflow-hidden border-2 border-stone-700 bg-stone-950 shrink-0 shadow-md relative group-hover:border-amber-400 transition-colors"
      >
        <img
          src={unit.image}
          alt={unit.name}
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onerror={(e) => handleImageError(e, unit.localFallback)}
        />
        <div
          class="image-fallback hidden w-full h-full bg-stone-950 flex items-center justify-center text-amber-400"
        >
          <span class="icon-[material-symbols--person] text-4xl"></span>
        </div>
      </div>

      <!-- Combat Values -->
      <div class="flex-1 min-w-0 space-y-2">

        <!-- Combat Vitals Row -->
        <div class="flex items-center gap-2 flex-wrap">
          <div
            class="inline-flex items-center gap-1.5 text-xs font-bold text-rose-300 border border-rose-500/30 bg-rose-950/40 px-2.5 py-1 rounded-md"
            title="Health Points"
          >
            <span class="icon-[material-symbols--favorite] text-xs text-rose-400"></span>
            <span>{unit.hp} HP</span>
          </div>

          <div
            class="inline-flex items-center gap-1.5 text-xs font-bold {unit.attackType === 'Physical'
              ? 'text-amber-300 border-amber-500/30 bg-amber-950/40'
              : 'text-purple-300 border-purple-500/30 bg-purple-950/40'} border px-2.5 py-1 rounded-md"
            title="{unit.attackType} Attack Power"
          >
            <span class="icon-[akar-icons--double-sword] text-xs"></span>
            <span>{unit.attack} ({unit.attackType})</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 4-Stat Attributes Grid -->
    <div class="px-5 py-2.5 bg-stone-950/70 border-y border-stone-800 grid grid-cols-4 gap-2 text-center text-xs">
      <div>
        <span class="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">Range</span>
        <span class="font-bold text-white font-mono">{unit.range} sq</span>
      </div>
      <div>
        <span class="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">Move</span>
        <span class="font-bold text-white font-mono">{unit.move} sq</span>
      </div>
      <div>
        <span class="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">P. Resist</span>
        <span class="font-bold {unit.physicalResist > 0 ? 'text-emerald-400' : 'text-stone-400'} font-mono">
          {unit.physicalResist}%
        </span>
      </div>
      <div>
        <span class="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">M. Resist</span>
        <span class="font-bold {unit.magicalResist > 0 ? 'text-indigo-400' : 'text-stone-400'} font-mono">
          {unit.magicalResist}%
        </span>
      </div>
    </div>

    <!-- Combat Traits & Ability -->
    <div class="p-5 space-y-2">
      <p class="text-stone-200 text-xs sm:text-sm leading-relaxed">
        {unit.special}
      </p>
    </div>
  </div>

  <!-- Tactical Tip Footer -->
  {#if unit.tacticalTip}
    <div class="px-5 py-3 bg-stone-950/90 border-t border-stone-800 text-xs text-amber-300/90 flex items-start gap-2">
      <span class="icon-[material-symbols--lightbulb-outline] text-amber-400 text-sm shrink-0 mt-0.5"></span>
      <span><strong>Tactic:</strong> {unit.tacticalTip}</span>
    </div>
  {/if}
</article>
