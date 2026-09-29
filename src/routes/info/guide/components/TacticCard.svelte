<script lang="ts">
  import type { AdvancedTacticGuide } from '$lib/types/GuideType';

  let { tactic }: { tactic: AdvancedTacticGuide } = $props();
</script>

<article
  class="card bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between transition-all group"
>
  <!-- Card Header Bar -->
  <div class="px-5 py-3.5 bg-base-300/80 border-b border-amber-200/20 flex items-center gap-2.5">
    <span class="{tactic.icon} text-amber-400 text-xl shrink-0"></span>
    <h3 class="font-bold text-white text-base">
      {tactic.title}
    </h3>
  </div>

  <!-- Card Body -->
  <div class="p-5 space-y-2.5">
    <p class="text-amber-200/90 text-xs sm:text-sm font-semibold">
      {tactic.summary}
    </p>

    <p class="text-stone-300 text-xs sm:text-sm leading-relaxed">
      {tactic.details}
    </p>
  </div>
</article>
