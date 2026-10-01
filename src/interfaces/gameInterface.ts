import { EActionClass, EActionType, EAttackType, EBoardUnit, EClass, EFaction, EGameModes, EGameStatus, EHeroes, EItems, ETiles, EWinConditions } from "../enums/gameEnums";

export interface IGameOver {
  winCondition: EWinConditions,
  winner: string
}

export type Coordinates = {
  x: number,
  y: number,
  row?: number,
  col?: number
  boardPosition?: number
};

export interface IItem {
  class: EClass;
  faction: EFaction;
  unitId: string; // userId_itemName_itemNumber
  itemType: EItems;
  boardPosition: number // 45-51
  belongsTo: number;
  row: number;
  canHeal: boolean;
  dealsDamage: boolean;
}

export interface IItemBE {
  class: EClass;
  faction: EFaction;
  unitId: string; // userId_itemName_itemNumber
  itemType: EItems;
  boardPosition: number // 45-51
  belongsTo: number;
}

export interface IHero {

  // BE properties
  class: EClass;
  faction: EFaction;
  unitType: EHeroes;
  unitId: string; // userId_unitName_unitNumber
  boardPosition: number;
  currentHealth: number;
  lastBreath: boolean;
  status: number;
  unitsConsumed: number;

  // FE only
  row: number;
  col: number;
  baseHealth: number;
  maxHealth: number;
  isKO: boolean;
  movement: number;
  attackRange: number;
  healingRange: number;
  buffRange: number;
  attackType: EAttackType;
  basePower: number;
  physicalDamageResistance?: number;
  basePhysicalDamageResistance: number;
  magicalDamageResistance?: number;
  baseMagicalDamageResistance: number;
  belongsTo: number;
  canHeal: boolean;
  canBuff: boolean;
  shieldingAlly?: string;
  paladinAura?: number;
}

export interface IHeroBE {
  class: EClass;
  faction: EFaction;
  unitType: EHeroes;
  unitId: string; // userId_unitName_unitNumber
  boardPosition: number;
  currentHealth?: number;
  maxHealth?: number,
  lastBreath?: boolean;
  shieldingAlly?: string;
  status: number;
  unitsConsumed?: number;
  boardType: EBoardUnit;
  belongsTo: number
}

export interface IHeroBaseStats {
  baseHealth: number,
  movement: number,
  attackType: EAttackType,
  attackRange: number,
  healingRange: number,
  buffRange: number,
  basePower: number,
  basePhysicalDamageResistance: number,
  baseMagicalDamageResistance: number,
  canHeal: boolean,
  canBuff: boolean
}

export interface IUserData {
  _id: string;
  username: string; // from populate in the BE
  picture: string; // from populate in the BE
};

export interface IPlayerData {
  userData: IUserData;
  faction: EFaction;
}

export interface ITurnAction {
  actorPosition?: number;
  targetPosition?: number; // an item can be a target for shuffle
  action: EActionType; // TODO: rename to actionType
  actionClass: EActionClass,
}

export interface IPlayerState {
  playerId: string;
  hand: (IHeroBE | IItemBE)[];
  deck: (IHeroBE | IItemBE)[];
}

export interface ICrystal {
  // BE fields
  unitId: string;
  belongsTo: number;
  maxHealth: number;
  currentHealth: number;
  boardPosition: number;
  status?: number;
  boardType: EBoardUnit;

  // FE only fields
  row: number;
  col: number;
  debuffLevel: number;
  paladinAura: number;
  physicalDamageResistance: number;
  magicalDamageResistance: number;
  basePhysicalDamageResistance: number;
  baseMagicalDamageResistance: number;
}

export interface ICrystalBE {
  unitId: string;
  belongsTo: number;
  maxHealth: number;
  currentHealth: number;
  boardPosition: number;
  status: number;
  boardType: EBoardUnit;
}

export interface ITile {
  row: number;
  col: number;
  boardPosition: number;
  tileType: ETiles;
  x: number;
  y: number;
}

export interface IGameState {
  player1: IPlayerState;
  player2?: IPlayerState;
  boardState: (IHeroBE | ICrystalBE)[];
  action?: ITurnAction;
}

export interface IChatMessage {
  username: string;
  message: string;
  createdAt: Date;
}
export interface IChat {
  _id: string;
  messages: IChatMessage[]
}

export interface ITurnHistoryAction {
  actionType: EActionType,
  actorPosition?: number;
  targetPosition?: number;
}

export interface ITurnHistoryElement {
  activePlayer: string;
  actions: ITurnHistoryAction[];
}

export interface IGame {
  _id: string;
  players: IPlayerData[];
  turnNumber: number;
  map: number;
  currentState: IGameState[];
  previousTurn: IGameState[];
  startState?: IGameState;
  turnHistory?: ITurnHistoryElement[];
  gameOver?: IGameOver,
  status: EGameStatus;
  createdAt: Date;
  finishedAt: Date;
  lastPlayedAt: Date;
  firstPlayer?: string;
  activePlayer: string;
  chatLogs: IChat;
  gameMode: EGameModes
}

export interface ISpecialTile {
  row: number,
  col: number,
  boardPosition: number,
  tileType: ETiles
}
