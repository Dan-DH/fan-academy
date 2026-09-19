

<script lang="ts">
	import type { PlayerStat } from "$lib/types/infoType";
	import HomeCard from "./HomeCard.svelte";

    const topPlayers: PlayerStat[] = [
        {username: "damsa",elo: 8967,icon: "icon-[at-icons--medal-1st] bg-yellow-300"},
        {username: "dadzbk",elo: 7842,icon: "icon-[at-icons--medal-2nd] bg-slate-400"},
        {username: "ljn",elo: 4559,icon: "icon-[at-icons--medal-3rd] bg-orange-300"},
        {username: "felicita", elo: 3512, icon: "icon-[at-icons--medal] bg-gray-600"}
    ]
</script>

<HomeCard title="Top 3 Players">
    <ul class="h-full p-2 flex flex-col gap-3">
        {#each topPlayers as player}
            <li class="inline-flex w-full items-center justify-between gap-5">
                <span class="{player.icon} text-5xl"></span>
                <div class="flex justify-between items-start gap-3 w-full">
                    <h4 class="text-xl font-medium">{player.username}</h4>
                    <h5 class="text-xl font-medium">{player.elo} pts.</h5>
                </div>
            </li>
        {/each}
    </ul>
        <a href="/leaderboard" class="btn btn-accent my-3">See all leaderboard</a>
</HomeCard>
