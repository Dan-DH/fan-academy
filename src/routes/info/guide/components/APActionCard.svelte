<script lang="ts">
  import type { APActionGuide } from '$lib/types/GuideType';

  let { action }: { action: APActionGuide } = $props();
</script>

<article
  class="bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between transition-all group"
>
  <!-- Action Card Header Bar -->
  <div class="px-4 py-3 bg-base-300/80 border-b border-amber-200/20 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span class="{action.icon} text-amber-400 text-lg"></span>
      <h4 class="font-bold text-white text-sm">
        {action.action}
      </h4>
    </div>
    <span class="text-xs text-stone-400 font-mono">
      {action.cost}
    </span>
  </div>

  <!-- Action Body -->
  <div class="p-5">
    <p class="text-xs text-stone-300 leading-relaxed">
      {action.description}
    </p>
  </div>
</article>
