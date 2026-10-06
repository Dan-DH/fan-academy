<script lang="ts">
  import InfoCard from '$lib/components/InfoCard.svelte';

  interface ChannelItem {
    name: string;
    description: string;
    icon: string;
    type: 'info' | 'chat' | 'updates' | 'support' | 'roles';
    badge: string;
  }

  interface VoiceItem {
    name: string;
    description: string;
    type: 'event' | 'voice';
  }

  const textChannels: ChannelItem[] = [
    {
      name: 'welcome',
      description: 'Server orientation, rules, and welcoming new academy commanders.',
      icon: 'icon-[material-symbols--waving-hand-outline]',
      type: 'info',
      badge: 'Start Here'
    },
    {
      name: 'faq',
      description: 'Frequently asked questions about gameplay, rules, and Fan Academy revival.',
      icon: 'icon-[akar-icons--chat-question]',
      type: 'info',
      badge: 'Knowledge'
    },
    {
      name: 'general',
      description: 'Main chat hub for strategy discussions, game banter, and player hangout.',
      icon: 'icon-[material-symbols--forum-outline]',
      type: 'chat',
      badge: 'Community'
    },
    {
      name: 'game-updates',
      description: 'Official patch releases, balance adjustments, and version changelogs.',
      icon: 'icon-[material-symbols--campaign-outline]',
      type: 'updates',
      badge: 'Patches'
    },
    {
      name: 'game-notifications',
      description: 'Automated server notices, match alerts, and community announcements.',
      icon: 'icon-[material-symbols--notifications-outline]',
      type: 'updates',
      badge: 'Alerts'
    },
    {
      name: 'bug-report',
      description: 'Direct feedback channel to report board desyncs, UI glitches, or anomalies.',
      icon: 'icon-[material-symbols--bug-report-outline]',
      type: 'support',
      badge: 'Support'
    },
    {
      name: 'roadmap',
      description: 'Preview of upcoming features, factions in development, and future milestones.',
      icon: 'icon-[material-symbols--timeline]',
      type: 'updates',
      badge: 'Future'
    },
    {
      name: 'roles',
      description: 'Select your faction roles, rank tiers, and notification preferences.',
      icon: 'icon-[material-symbols--badge-outline]',
      type: 'roles',
      badge: 'Roles'
    }
  ];

  const voiceAndEvents: VoiceItem[] = [
    {
      name: 'Events',
      description: 'Scheduled tournament brackets, community game nights, and developer Q&A.',
      type: 'event'
    },
    {
      name: 'Lobby',
      description: 'Open voice lounge to hang out and talk tactics with active players.',
      type: 'voice'
    },
    {
      name: 'Live game 1 & 2',
      description: 'Dedicated voice channels for 1v1 match commentary and private games.',
      type: 'voice'
    }
  ];
</script>

<InfoCard
  title="Server Channels"
  icon="icon-[akar-icons--discord-fill]"
  class="border-amber-500/20 shadow-lg"
>
  {#snippet headerRight()}
    <span class="text-xs text-stone-400 font-mono">
      8 Text • 3 Voice • 1 Events
    </span>
  {/snippet}

  <div class="space-y-6">
    <!-- Text Channels -->
    <div class="space-y-2.5">
      <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400/90 px-1">
        <span class="icon-[material-symbols--tag-rounded] text-base"></span>
        <span>Text Channels</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {#each textChannels as channel}
          <div
            class="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 hover:border-amber-500/40 hover:bg-stone-950/90 transition-all flex flex-col justify-between gap-1.5 group"
          >
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="text-stone-500 font-mono text-sm font-semibold select-none">#</span>
                <span class="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                  {channel.name}
                </span>
              </div>

              <span
                class="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800 shrink-0"
              >
                {channel.badge}
              </span>
            </div>

            <p class="text-xs text-stone-400 leading-relaxed line-clamp-2">
              {channel.description}
            </p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Voice Channels & Events -->
    <div class="space-y-2.5 pt-4 border-t border-stone-800/80">
      <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400/90 px-1">
        <span class="icon-[material-symbols--volume-up-outline] text-base"></span>
        <span>Voice Channels & Events</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {#each voiceAndEvents as item}
          <div
            class="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 hover:border-amber-500/40 transition-colors flex flex-col justify-between gap-1.5 group"
          >
            <div class="flex items-center gap-2">
              {#if item.type === 'event'}
                <span class="icon-[material-symbols--calendar-today-outline] text-amber-400 text-base shrink-0"></span>
              {:else}
                <span class="icon-[material-symbols--volume-up-outline] text-amber-400 text-base shrink-0"></span>
              {/if}
              <span class="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                {item.name}
              </span>
            </div>

            <p class="text-[11px] text-stone-400 leading-relaxed">
              {item.description}
            </p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</InfoCard>
