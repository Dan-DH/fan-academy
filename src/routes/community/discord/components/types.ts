export interface DiscordChannel {
  name: string;
  category: string;
  description: string;
  icon: string;
  tag: string;
}

export interface DiscordServerStat {
  label: string;
  value: string;
  icon: string;
}

export interface DiscordRule {
  title: string;
  description: string;
}
