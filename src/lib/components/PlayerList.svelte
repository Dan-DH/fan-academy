<script lang="ts">
    import { allPlayers } from "$lib/data/placeholder";
	import PlayerCard from "./PlayerCard.svelte";
</script>

<div class="overflow-x-auto">
  <table class="table">
    <!-- head -->
    <thead>
      <tr>
        <th>Username</th>
        <th>Matches</th>
        <th>Wins</th>
        <th>Win Rate</th>
        <th>Ranked Matches</th>
        <th>Ranked Wins</th>
        <th>Elo</th>
        <th>Tier</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
    {#each allPlayers as player }
      <PlayerCard player={player}/>
    {/each}
    </tbody>
    <tfoot>
        <!-- pagination? -->

    </tfoot>
  </table>
</div>
