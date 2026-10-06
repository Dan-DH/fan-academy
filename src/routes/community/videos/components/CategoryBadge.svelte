<script lang="ts">
  import type { VideoCategory } from '$lib/data/placeholder';

  interface Props {
    category: VideoCategory;
    label?: string;
    class?: string;
  }

  let { category, label, class: customClass = '' }: Props = $props();

  const colorMap: Record<VideoCategory, string> = {
    guide: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    tactics: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    'faction-guide': 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    'match-commentary': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    gameplay: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    showcase: 'bg-stone-500/15 text-stone-300 border-stone-500/30'
  };

  const defaultLabelMap: Record<VideoCategory, string> = {
    guide: 'Beginner Guide',
    tactics: 'Tactics & Challenges',
    'faction-guide': 'Faction Guide',
    'match-commentary': 'Match Commentary',
    gameplay: 'Gameplay',
    showcase: 'Showcase'
  };

  const displayLabel = $derived(label ?? defaultLabelMap[category] ?? category);
  const colorClasses = $derived(colorMap[category] ?? 'bg-amber-500/15 text-amber-300 border-amber-500/30');
</script>

<span
  class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold leading-none border {colorClasses} {customClass}"
>
  {displayLabel}
</span>
