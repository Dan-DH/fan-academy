import { EActionClass, EActionType, EAttackType, EClass, EFaction, EGameStatus, EHeroes, EItems, ETiles, EWinConditions } from "../enums/gameEnums";

/**
 * Game Over Interface
 */
export interface IGameOver {
  winCondition: EWinConditions,
  winner: string
}

/**
 * Turn Sent interface
 */
export interface ITurnSentMessage {
  roomId: string;
  previousTurn: IGameState[],
  turnNumber: number,
  newActivePlayer: string,
  gameOver?: IGameOver
}

/**
 * Last Turn Recevied interface
 */
export interface ILastTurnMessage {
  roomId: string;
  previousTurn: IGameState[],
  finishedAt: Date,
  winCondition: EWinConditions,
  winner: string,
  userIds: string[]
}

/**
 * Coordinates Interface
 */
export type Coordinates = {
  x: number,
  y: number,
  row?: number,
  col?: number
  boardPosition?: number
};

/**
 * Crystal Interface
 */
export interface ICrystal {
  belongsTo: number;
  maxHealth: number;
  currentHealth: number;
  isDestroyed: boolean;
  isLastCrystal: boolean;
  boardPosition: number;
  debuffLevel: number;
  row: number;
  col: number;
}

/**
 * Item Interface
 */
export interface IItem {
  class: EClass;
  faction: EFaction;
  unitId: string; // userId_itemName_itemNumber
  itemType: EItems;
  boardPosition: number // 45-51
  belongsTo: number;
  canHeal: boolean;
  dealsDamage: boolean;
}

/**
 * Unit Interface
 */
export interface IHero {
  class: EClass;
  faction: EFaction;
  unitType: EHeroes;
  unitId: string; // userId_unitName_unitNumber
  boardPosition: number;
  row: number;
  col: number;
  baseHealth: number;
  maxHealth: number;
  currentHealth: number;
  isKO: boolean;
  lastBreath: boolean;
  movement: number;
  attackRange: number;
  healingRange: number;
  attackType: EAttackType;
  basePower: number;
  power: number;
  powerModifier: number;
  physicalDamageResistance: number;
  magicalDamageResistance: number;
  basePhysicalDamageResistance: number;
  baseMagicalDamageResistance: number;
  factionBuff: boolean;
  runeMetal: boolean;
  shiningHelm: boolean;
  superCharge: boolean;
  belongsTo: number;
  canHeal: boolean;
  unitsConsumed?: number;
  isDebuffed: boolean;
}

/**
 * Faction Interface
 */
export interface IFaction {
  userId?: string;
  factionName: string;
  unitsInHand: (IHero | IItem)[];
  unitsInDeck: (IHero | IItem)[];
  unitsLeft: number;
}

/**
 * User and player data Interface
 */
export interface IUserData {
  _id: string;
  username: string; // from populate in the BE
  picture: string; // from populate in the BE
};

export interface IPlayerData {
  userData: IUserData;
  faction: EFaction;
}

/**
 * TurnAction Interface
 */
export interface ITurnAction {
  actorPosition?: number;
  targetPosition?: number; // an item can be a target for shuffle
  action: EActionType;
  actionClass: EActionClass,
}

/**
 * UserState Interface
 */
export interface IPlayerState {
  playerId: string;
  factionData: IFaction;
}

/**
 * Tile Interface
 */
export interface ITile {
  row: number;
  col: number;
  tileType: ETiles;
  x: number;
  y: number;
  boardPosition: number;
  occupied: boolean;
  obstacle: boolean;
  hero?: IHero | undefined;
  crystal?: ICrystal | undefined;
}

/**
 * GameState Interface
 */
export interface IGameState {
  player1: IPlayerState;
  player2?: IPlayerState;
  boardState: ITile[];
  action?: ITurnAction;
}

/**
 * Game Interface
 */
export interface IGame {
  _id: string;
  players: IPlayerData[];
  currentState: IGameState[];
  previousTurn: IGameState[];
  turnNumber: number;
  gameOver?: IGameOver,
  status: EGameStatus;
  createdAt: Date;
  finishedAt: Date;
  lastPlayedAt: Date;
  activePlayer: string;
}
