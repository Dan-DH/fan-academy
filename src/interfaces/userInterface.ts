
export interface IUserPreferences {
  emailNotifications: boolean;
  sound: boolean;
  chat: boolean;
}

export interface IUserFactionStats {
  games: number,
  wins: number,
  rating: number
}

export interface IUserStats {
  totalGames: number,
  totalWins: number,
  council: IUserFactionStats,
  elves: IUserFactionStats,
  dwarves: IUserFactionStats
}

export interface IUser  {
  _id: string;
  username: string;
  email: string;
  password?: string;
  picture?: string;
  preferences: IUserPreferences;
  stats: IUserStats
}
