<script lang="ts">
  import type { GameStatusGuide } from '$lib/types/GuideType';

  let { statusItem }: { statusItem: GameStatusGuide } = $props();
</script>

<article
  class="bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between transition-all group"
>
  <!-- Status Card Header Bar -->
  <div class="px-5 py-3.5 bg-base-300/80 border-b border-amber-200/20 flex items-center gap-2.5">
    <span class="{statusItem.icon} text-amber-400 text-lg"></span>
    <h4 class="font-bold text-white text-sm">
      {statusItem.status}
    </h4>
  </div>

  <!-- Status Body -->
  <div class="p-5">
    <p class="text-xs sm:text-sm text-stone-300 leading-relaxed">
      {statusItem.description}
    </p>
  </div>
</article>
