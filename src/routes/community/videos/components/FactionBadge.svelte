<script lang="ts">
  import type { HeroAcademyFaction } from '$lib/data/placeholder';

  interface Props {
    faction: HeroAcademyFaction;
    label?: string;
    class?: string;
  }

  let { faction, label, class: customClass = '' }: Props = $props();

  const factionInfo: Record<HeroAcademyFaction, { label: string; style: string }> = {
    council: {
      label: 'Council',
      style: 'bg-amber-950/40 text-amber-200 border-amber-600/40'
    },
    'dark-elves': {
      label: 'Dark Elves',
      style: 'bg-purple-950/40 text-purple-200 border-purple-600/40'
    },
    dwarves: {
      label: 'Dwarves',
      style: 'bg-cyan-950/40 text-cyan-200 border-cyan-600/40'
    },
    tribe: {
      label: 'The Tribe',
      style: 'bg-red-950/40 text-red-200 border-red-600/40'
    },
    tf2: {
      label: 'TF2',
      style: 'bg-orange-950/40 text-orange-200 border-orange-600/40'
    },
    shaolin: {
      label: 'Shaolin',
      style: 'bg-emerald-950/40 text-emerald-200 border-emerald-600/40'
    },
    general: {
      label: 'All Factions',
      style: 'bg-stone-800 text-stone-300 border-stone-700'
    }
  };

  const current = $derived(
    factionInfo[faction] ?? { label: faction, style: 'bg-stone-800 text-stone-300 border-stone-700' }
  );
  const displayLabel = $derived(label ?? current.label);
</script>

<span
  class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium leading-none border {current.style} {customClass}"
>
  {displayLabel}
</span>
