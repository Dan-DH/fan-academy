export type PatchChangeGroup = {
    category: string;
    badge?: string;
    icon?: string;
    items: string[];
};

export type PatchNote = {
    version: string;
    date: string;
    title?: string;
    tag?: string;
    isLatest?: boolean;
    type?: 'major' | 'minor' | 'patch';
    summary?: string;
    description: string[];
    groups?: PatchChangeGroup[];
};

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

export type HeroAcademyFaction =
  | 'council'
  | 'dark-elves'
  | 'dwarves'
  | 'tribe'
  | 'tf2'
  | 'shaolin'
  | 'general';

export type VideoCategory =
  | 'guide'
  | 'tactics'
  | 'faction-guide'
  | 'match-commentary'
  | 'gameplay'
  | 'showcase';

export interface HeroAcademyVideo {
  id: string;
  youtubeId: string;
  title: string;
  channelTitle: string;
  channelUrl?: string;
  youtubeUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  category: VideoCategory;
  categoryLabel: string;
  factions: HeroAcademyFaction[];
  duration?: string;
  publishedDate?: string;
  featured?: boolean;
  description: string;
  tacticsSummary: string;
  tacticsCovered: string[];
}

export type FaqCategory = 'general' | 'combat' | 'factions' | 'matchmaking';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  categoryLabel?: string;
  badge?: string;
  highlight?: string;
}
