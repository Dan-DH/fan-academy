import { EWinConditions, EFaction, EActionType, EActionClass, EClass, EGameModes, EGameStatus } from "../enums/gameEnum";

export interface IGameOverBE {
  winCondition: EWinConditions;
  winner: string;
}

export interface ITurnMessageBE {
  _id: string;
  currentTurn: IGameTurnBE;
  turnNumber: number; // TODO: don't need to send this, I can increment through the query
  actions: ITurnActionBE[];
  lastPlayedAt: Date; // TODO: get from FE
  newActivePlayer: string;
  gameOver?: IGameOverBE;
}

export interface IItemBE {
  unitId: string; // userId_itemName_itemNumber
  boardPosition: number; // 45-51
}

export interface IHeroBE {
  unitId: string; // userId_unitName_unitNumber
  boardPosition: number;
  currentHealth: number;
  stats: number; // bitmask. Default 0
  lastBreath?: boolean;
  unitsConsumed?: number
  engineerShield?: string;
  shieldingAlly?: string;
}

export interface IPlayerDataBE {
  userId: string;
  username?: string;
  portrait?: string;
  faction?: EFaction;
};

export interface ITurnActionBE {
  actorPosition?: number;
  targetPosition?: number; // an item can be a target for shuffle
  action: EActionType;
  actionClass: EActionClass;
}

export interface IPlayerResourcesBE {
  deck: (IHeroBE | IItemBE)[];
  hand?: (IHeroBE | IItemBE)[];
}

export interface ICrystalBE {
  unitId: string;
  // class: EClass; FIXME:
  currentHealth?: number;
  boardPosition: number;
  stats?: number; // bitmask -diff from hero bitmask
  engineerShield?: string;
}

export interface IGameTurnBE {
  turnStartSnapshot: IGameState;
  turnEndSnapshot?: IGameState; //TODO: we might not need the turn end. In the FE we can just replay the moves
  actions?: ITurnActionBE[];
}

export interface IGameState {
  p1?: IPlayerResourcesBE;
  p2?: IPlayerResourcesBE;
  boardState?: (IHeroBE | ICrystalBE)[];
}

interface IChatMessageBE {
  username: string;
  message: string;
}

export default interface IGameBE {
  _id: string;
  players: IPlayerDataBE[];
  gameMode: EGameModes;
  status: EGameStatus;

  map?: number, // maps to the differnt maps in game. No need for ITile anymore
  turnNumber: number;
  turnHistory?: IGameTurnBE[],
  currentTurn?: IGameTurnBE;
  gameOver?: IGameOverBE;
  createdAt: Date;
  finishedAt?: Date;
  lastPlayedAt?: Date;
  activePlayer?: string; // userId
  chatLog?: IChatMessageBE[];
}