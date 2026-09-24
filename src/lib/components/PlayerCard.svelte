<script lang="ts">
	import type { PlayerData } from '$lib/types/infoType';
	import { generateAvatar } from '$lib/utils/helper';

    let {player} :{player: PlayerData} =$props();

    const avatar = $derived(generateAvatar(player.username));

</script>

<tr class="flex-row hover:bg-base-300 rounded-2xl">
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
                <div class="font-bold">{player.username}</div>
            </div>
        </div>
    </td>
    <td>
        Zemlak, Daniel and Leannon
        <br />
        <span class="badge badge-ghost badge-sm">Desktop Support Technician</span>
    </td>
    <td>Purple</td>
    <th>
        <button class="btn btn-ghost btn-xs">details</button>
    </th>
</tr>
