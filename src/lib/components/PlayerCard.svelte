<script lang="ts">
	import type { PlayerData } from '$lib/types/infoType';
	import { generateAvatar } from '$lib/utils/helper';

    let {player} :{player: PlayerData} =$props();

    const avatar = $derived(generateAvatar(player.username));

</script>

<tr class="flex-row w-11/12 hover:bg-base-300 rounded-2xl hover:rounded-2xl">
    <td>
        <div class="flex items-center gap-3">
            <div class="avatar">
                <div class="mask mask-squircle h-12 w-12">
                <img
                    src={avatar}
                    alt={player.username} />
                </div>
            </div>
            <div>
                <span class="font-bold text-nowrap">{player.username}</span>
            </div>
        </div>
    </td>
    <td>
        <span class="text-nowrap">{player.total_matches}</span>
    </td>
    <td>
       <span class="text-nowrap">
        {player.wins}
        <span class="text-emerald-500">
            W
        </span>
       </span>
    </td>
    <td>
       <span class="text-nowrap">
            {player.loses}
            <span class="text-red-500">
                L
            </span>
       </span>
    </td>
    <td>
       <span class="text-nowrap">{player.win_rate} %</span>
    </td>
    <td>
            <span class="text-nowrap">{player.ranked_matches}</span>
    </td>
    <td>
            <span class="text-nowrap">
                {player.ranked_wins}
                <span class="text-emerald-500">
                    W
                </span>
            </span>
    </td>
    <td>
        <span class="text-nowrap">
            {player.elo} pts.
        </span>
    </td>
    <td>
        {#if player.tier === "diamond"}
        <span class="icon-[basil--diamond-solid] text-2xl text-sky-400"></span>
        {/if}
        {#if player.tier === "gold"}
        <span class="icon-[ant-design--gold-filled] text-2xl text-orange-300"></span>
        {/if}
        {#if player.tier === "silver"}
        <span class="icon-[game-icons--coins] text-2xl text-gray-100"></span>
        {/if}
        {#if player.tier === "bronze"}
        <span class="icon-[game-icons--medal] text-2xl text-amber-600"></span>
        {/if}
        {#if player.tier === "iron"}
        <span class="icon-[icon-park-outline--heavy-metal] text-2xl text-slate-400"></span>
        {/if}
        {#if player.tier === "wood"}
        <span class="icon-[fluent-emoji-high-contrast--wood] text-2xl text-amber-600"></span>
        {/if}
    </td>
    <td>
        <button class="btn">
            <span class="icon-[at-icons--swords] text-2xl text-orange-600"></span>
            Duel
        </button>
    </td>
</tr>
