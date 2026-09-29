<script lang="ts">
  import type { AboutData } from '$lib/types/GuideType';

  let {
    disclaimer,
    citation
  }: {
    disclaimer: AboutData['disclaimer'];
    citation: AboutData['citation'];
  } = $props();
</script>

<div
  class="card bg-base-200/80 border border-amber-200/30 rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row items-start gap-4"
>
  <div class="p-3 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
    <span class="icon-[material-symbols--warning-outline] text-3xl"></span>
  </div>
  <div class="space-y-2">
    <div class="flex items-center gap-2.5">
      <h4 class="text-lg font-bold text-amber-200">{disclaimer.title}</h4>
    </div>
    <p class="text-stone-300 text-sm leading-relaxed">
      {disclaimer.content}
    </p>
    <div class="pt-2 text-xs text-amber-300/80 flex items-center gap-1.5">
      <span class="icon-[material-symbols--menu-book-outline] text-sm"></span>
      <span>{citation.note}</span>
    </div>
  </div>
</div>
