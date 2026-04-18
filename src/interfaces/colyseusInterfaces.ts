import { EFaction, EGameModes } from "../enums/gameEnum";

export interface IColyseusOnCreate {
  userId: string,
  username: string,
  portrait: string,
  faction: EFaction,
  // token: string,
  gameMode: EGameModes,
  // roomId?: string,
  opponentId?: string
}