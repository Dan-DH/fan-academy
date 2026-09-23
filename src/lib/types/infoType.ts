export type PatchNote = {
    version: string;
    date: string;
    description: string[]
}

export type PlayerStat = {
        username: string,
        elo: number,
        icon: string
    }

export type PlayerData = PlayerStat & {
    wins: number;
    loses: number;
    total_matches: number;
    win_rate: number;
    ranked_matches: number;
    ranked_wins: number;
    tier: "diamond" | "gold" | "silver" | "bronze" | "iron" | "wood"
}
