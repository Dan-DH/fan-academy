<script lang="ts">
  import { allPlayers } from "$lib/data/placeholder";
  import { perPageItems } from "$lib/utils/helper";
  import LeaderboardPaginator from "./LeaderboardPaginator.svelte";
  import PlayerCard from "./PlayerCard.svelte";

  const allPlayersLength = allPlayers.length;

  let currentPage = $state(1);
  let perPage = $state(perPageItems[0]);

  let paginatedPlayers = $derived.by(() => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return allPlayers.slice(startIndex, endIndex);
  });
</script>

<div class="overflow-x-auto space-y-4" >
  <table class="table p-4">

    <thead>
      <tr>
        <th>Username</th>
        <th>Matches</th>
        <th>Wins</th>
        <th>Loses</th>
        <th>Win Rate</th>
        <th>Ranked Matches</th>
        <th>Ranked Wins</th>
        <th>Elo</th>
        <th>Tier</th>
        <th></th>
      </tr>
    </thead>

    <tbody>
      {#each paginatedPlayers as player}
        <PlayerCard {player} />
      {/each}
    </tbody>
  </table>

  <LeaderboardPaginator
    playersListLength={allPlayersLength}
    bind:currentPage
    bind:perPage
  />
</div>
