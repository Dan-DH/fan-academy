<script lang="ts">
  import type { SpecialTileGuide } from '$lib/types/GuideType';

  let { tile }: { tile: SpecialTileGuide } = $props();
</script>

<article
  class="card bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between transition-all group"
>
  <div>
    <!-- Tile Card Header Bar -->
    <div class="px-5 py-3.5 bg-base-300/80 border-b border-amber-200/20 flex items-center gap-3">
        <span class="{tile.iconName} text-xl"></span>
      <h3 class="font-bold text-white text-base">
        {tile.name}
      </h3>
    </div>

    <!-- Tile Body -->
    <div class="p-5 space-y-2">
      <div class="text-amber-300 font-semibold text-xs sm:text-sm">
        {tile.effect}
      </div>
      <p class="text-stone-300 text-xs sm:text-sm leading-relaxed">
        {tile.details}
      </p>
    </div>
  </div>

  <div class="px-5 py-3 bg-stone-950/90 border-t border-stone-800 text-xs text-amber-300/90 flex items-start gap-2">
    <span class="icon-[material-symbols--lightbulb-outline] text-amber-400 text-sm shrink-0 mt-0.5"></span>
    <span><strong>Pro Tip:</strong> {tile.tacticalTip}</span>
  </div>
</article>
