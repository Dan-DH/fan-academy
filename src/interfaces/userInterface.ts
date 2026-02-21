
export interface IUserPreferences {
  emailNotifications: boolean;
  sound: boolean;
  chat: boolean;
}

export interface IUserStats {
  totalGames: number,
  totalWins: number,
  councilWins: number,
  elvesWins: number,
  dwarvesWins: number
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
