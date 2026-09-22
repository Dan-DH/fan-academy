<script lang="ts">
	import HomeCard from "./HomeCard.svelte";
    import { topPlayers } from "$lib/data/placeholder";
</script>

<HomeCard title="Top 3 Players">
    <div class=" flex flex-col justify-between items-center h-full gap-2 p-3">
        <ul class="p-2 flex flex-col">
            {#each topPlayers as player}
                <li class="inline-flex w-full items-center justify-between gap-5">
                    <span class="{player.icon} text-5xl"></span>
                    <div class="flex justify-between items-start gap-3 w-full">
                        <h4 class="text-lg font-medium">{player.username}</h4>
                        <h5 class="text-md font-medium">{player.elo} pts.</h5>
                    </div>
                </li>
            {/each}
        </ul>
        <a href="/leaderboard" class="btn btn-ghost my-3">See All Players</a>
    </div>
</HomeCard>
