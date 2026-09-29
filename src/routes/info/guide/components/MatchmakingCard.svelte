<script lang="ts">
  import type { GameStatusGuide } from '$lib/types/GuideType';
  import GameStatusCard from './GameStatusCard.svelte';

  let { statuses }: { statuses: GameStatusGuide[] } = $props();
</script>

<div class="card bg-stone-900/90 border border-amber-500/20 rounded-2xl overflow-hidden shadow-md">
  <div class="px-6 py-3.5 bg-base-300/80 border-b border-amber-200/20 flex items-center gap-3">
    <span class="icon-[material-symbols--rocket-launch-outline] text-2xl text-emerald-400"></span>
    <div>
      <h3 class="text-base font-bold text-white">How to Play & Find Games</h3>
      <p class="text-xs text-stone-400">Instant matchmaking and open challenge lobbies</p>
    </div>
  </div>

  <div class="p-6 space-y-4">
    <p class="text-stone-300 text-sm sm:text-base leading-relaxed">
      You can create a game by clicking on the icon of the faction you want to play as. Matchmaking
      happens automatically: if there is already an open game looking for players, you will be paired
      immediately! If not, your game will appear under the <strong class="text-amber-300">"Searching for players"</strong>
      section until an opponent joins.
    </p>

    <!-- Game Statuses Grid -->
    <div class="pt-2">
      <h4 class="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <span class="icon-[material-symbols--view-agenda-outline] text-sm"></span>
        Game List Status Sections (Appearance Order)
      </h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each statuses as statusItem (statusItem.status)}
          <GameStatusCard {statusItem} />
        {/each}
      </div>
    </div>
  </div>
</div>
