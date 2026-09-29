<script lang="ts">
  import type { PlayerData } from '$lib/types/InfoType';
  import { generateAvatar } from '$lib/utils/helper';

  let {
    player,
    rank
  }: {
    player: PlayerData;
    rank: number;
  } = $props();

  const avatar = $derived(generateAvatar(player.username));

  const tierStyles: Record<
    string,
    { label: string; textColor: string; icon: string }
  > = {
    diamond: {
      label: 'Diamond',
      textColor: 'text-sky-400',
      icon: 'icon-[basil--diamond-solid]'
    },
    gold: {
      label: 'Gold',
      textColor: 'text-amber-400',
      icon: 'icon-[ant-design--gold-filled]'
    },
    silver: {
      label: 'Silver',
      textColor: 'text-slate-300',
      icon: 'icon-[game-icons--coins]'
    },
    bronze: {
      label: 'Bronze',
      textColor: 'text-amber-600',
      icon: 'icon-[game-icons--medal]'
    },
    iron: {
      label: 'Iron',
      textColor: 'text-stone-400',
      icon: 'icon-[icon-park-outline--heavy-metal]'
    },
    wood: {
      label: 'Wood',
      textColor: 'text-amber-700',
      icon: 'icon-[fluent-emoji-high-contrast--wood]'
    }
  };

  const currentTier = $derived(
    tierStyles[player.tier] || {
      label: player.tier,
      textColor: 'text-stone-400',
      icon: 'icon-[material-symbols--shield-outline]'
    }
  );
</script>

<tr class="hover:bg-amber-500/5 transition-colors border-b border-stone-800/60 group">
  <!-- Rank -->
  <td class="text-center font-mono text-xs sm:text-sm w-12 sm:w-16">
    {#if rank === 1}
      <span class="text-amber-400 font-black text-sm sm:text-base">1</span>
    {:else if rank === 2}
      <span class="text-slate-300 font-bold text-sm sm:text-base">2</span>
    {:else if rank === 3}
      <span class="text-amber-600 font-bold text-sm sm:text-base">3</span>
    {:else}
      <span class="text-stone-500">{rank}</span>
    {/if}
  </td>

  <!-- Player Avatar & Username -->
  <td>
    <div class="flex items-center gap-3">
      <div class="avatar shrink-0">
        <div class="mask mask-squircle h-9 w-9 sm:h-10 sm:w-10 bg-stone-800">
          <img src={avatar} alt={player.username} loading="lazy" />
        </div>
      </div>
      <div class="font-bold text-white text-xs sm:text-sm group-hover:text-amber-300 transition-colors whitespace-nowrap">
        {player.username}
      </div>
    </div>
  </td>

  <!-- Tier (Clean icon + text, no pill badges) -->
  <td>
    <div class="flex items-center gap-1.5 text-xs font-medium {currentTier.textColor} whitespace-nowrap">
      <span class="{currentTier.icon} text-sm"></span>
      <span>{currentTier.label}</span>
    </div>
  </td>

  <!-- Elo Rating -->
  <td class="font-mono text-xs sm:text-sm text-amber-300 font-semibold whitespace-nowrap">
    {player.elo.toLocaleString()}
  </td>

  <!-- Matches & Record (Wins / Losses) -->
  <td class="whitespace-nowrap text-xs">
    <span class="text-emerald-400 font-medium">{player.wins}W</span>
    <span class="text-stone-600 mx-1">/</span>
    <span class="text-rose-400 font-medium">{player.loses}L</span>
  </td>

  <!-- Win Rate -->
  <td class="font-mono text-xs sm:text-sm whitespace-nowrap text-stone-300">
    {player.win_rate}%
  </td>

  <!-- Ranked Record -->
  <td class="hidden lg:table-cell text-xs text-stone-400 whitespace-nowrap">
    {player.ranked_wins}W / {player.ranked_matches}
  </td>

  <!-- Challenge / Duel Action Button -->
  <td class="text-right">
    <button
      class="btn btn-ghost btn-circle btn-sm text-stone-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
      title="Challenge {player.username}"
      aria-label="Challenge {player.username}"
    >
      <span class="icon-[akar-icons--double-sword] text-lg"></span>
    </button>
  </td>
</tr>
