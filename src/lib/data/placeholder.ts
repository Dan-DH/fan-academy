import { PatchNote, PlayerStat } from "$lib/types/infoType";

export const topPlayers: PlayerStat[] = [
        {username: "damsa",elo: 8967,icon: "icon-[at-icons--medal-1st] bg-yellow-300"},
        {username: "dadzbk",elo: 7842,icon: "icon-[at-icons--medal-2nd] bg-slate-400"},
        {username: "ljn",elo: 4559,icon: "icon-[at-icons--medal-3rd] bg-orange-300"},
    ]

export const patchNotes: PatchNote[] = [
    {version: "1.1.50", date: "20/09/2026", description:[
        "New fraction is added.",
        "Fixed a case where chat messages not appeared.",
         "Players can see all moves."]
    },
    {version: "1.0.13", date: "14/03/2026", description:[
        "New character added.",
        "New map added."]
    }
]
