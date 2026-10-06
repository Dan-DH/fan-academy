<script lang="ts">
  import InfoCard from '$lib/components/InfoCard.svelte';
  import type { DiscordRule } from './types';

  const rules: DiscordRule[] = [
    {
      title: 'Honor on the Battlefield',
      description: 'Treat fellow tacticians and opponents with respect. Toxic behavior, harassment, and hate speech result in immediate moderation.'
    },
    {
      title: 'Fair Play & Integrity',
      description: 'No match throwing, cheating, exploiting desync glitches, or stream-sniping during live community tournament events.'
    },
    {
      title: 'Constructive Theorycrafting',
      description: 'Share unit balance critique constructively. Include game replays or match context when proposing adjustments.'
    },
    {
      title: 'Channel Organization',
      description: 'Keep matchmaking requests in #lfg-matchmaking and report technical anomalies in #bug-reports to ensure prompt responses.'
    }
  ];
</script>

<InfoCard
  title="Server Guidelines & Fair Play"
  icon="icon-[material-symbols--shield]"
  class="border-amber-500/20"
>
  <div class="space-y-3">
    {#each rules as rule, i}
      <div class="flex items-start gap-3 p-3 rounded-xl bg-stone-950/60 border border-stone-800/80">
        <span
          class="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5"
        >
          {i + 1}
        </span>
        <div class="space-y-1">
          <h4 class="text-xs sm:text-sm font-bold text-white">
            {rule.title}
          </h4>
          <p class="text-xs text-stone-400 leading-relaxed">
            {rule.description}
          </p>
        </div>
      </div>
    {/each}
  </div>
</InfoCard>
