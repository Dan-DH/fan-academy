

<script lang="ts">
    type PlayerStat = {
        username: string,
        elo: number,
        rank: "gold" | "silver" | "bronze"
    }

    let topPlayers: PlayerStat[] = [
        {username: "damsa",elo: 8967,rank: "gold"},
        {username: "dadzbk",elo: 7842,rank: "silver"},
        {username: "ljn",elo: 4559,rank: "bronze"},
    ]
</script>

<article class="md:w-1/3 min-w-72 rounded-lg bg-slate-600/50 flex flex-col justify-start h-96 items-center text-white">
    <div class=" flex w-full items-center justify-center bg-slate-500 border-b rounded-t-lg border-amber-200 h-20">
    <h1 class="text-2xl font-medium">Top 3 Players</h1>
    </div>
    <ul class="h-full p-2 flex flex-col gap-3">
        {#each topPlayers as player}
            <li class="inline-flex w-full items-center justify-between gap-5">
                {#if player.rank == "gold"}
                <span class="icon-[at-icons--medal-1st] bg-yellow-300 text-5xl"></span>
                {:else if player.rank == "silver"}
                <span class="icon-[at-icons--medal-2nd] bg-slate-400 text-5xl"></span>
                {:else}
                <span class="icon-[at-icons--medal-3rd] bg-orange-300 text-5xl"></span>
                {/if}
                <div class="flex justify-between items-start gap-3 w-full">
                    <h4 class="text-xl font-medium">{player.username}</h4>
                    <h5 class="text-xl font-medium">{player.elo} pts.</h5>
                </div>
            </li>
        {/each}
    </ul>
        <a href="/leaderboard" class="btn btn-accent my-3">See all leaderboard</a>
</article>
