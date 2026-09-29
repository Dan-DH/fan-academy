<script lang="ts">
  import type { ItemGuide } from '$lib/types/GuideType';

  let { item }: { item: ItemGuide } = $props();
</script>

<article
  class="card bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between transition-all group"
>
  <div>
    <!-- Item Top Header Bar -->
    <div class="px-5 py-3.5 bg-base-300/80 border-b border-amber-200/20 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <span
          class="{item.type === 'Upgrade'
            ? 'icon-[material-symbols--shield-outline] text-emerald-400'
            : 'icon-[material-symbols--science-outline] text-amber-400'} text-lg"
        ></span>
        <h4 class="font-bold text-white text-base">
          {item.name}
        </h4>
      </div>
      <span class="text-xs text-stone-400">
        {item.type} • ×{item.count}
      </span>
    </div>

    <!-- Item Content -->
    <div class="p-5 space-y-3">

      <div class="text-xs text-stone-400 flex items-center gap-1.5 font-medium">
        <span class="icon-[material-symbols--target] text-amber-400 text-sm"></span>
        <span>Target: <strong class="text-stone-300">{item.target}</strong></span>
      </div>

      <p class="text-stone-200 text-xs sm:text-sm leading-relaxed">
        {item.effect}
      </p>
    </div>
  </div>

  {#if item.tacticalTip}
    <div class="px-5 py-3 bg-stone-950/90 border-t border-stone-800 text-xs text-amber-300/80 flex items-start gap-1.5">
      <span class="icon-[material-symbols--lightbulb-outline] text-amber-400 text-xs shrink-0 mt-0.5"></span>
      <span><strong>Tactic:</strong> {item.tacticalTip}</span>
    </div>
  {/if}
</article>
