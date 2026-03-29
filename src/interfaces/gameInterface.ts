import { EActionClass, EActionType, EAttackType, EClass, EFaction, EGameStatus, EHeroes, EItems, ETiles, EWinConditions } from "../enums/gameEnums";

/**
 * Game Over Interface
 */
export interface IGameOver {
  winCondition: EWinConditions,
  winner: string
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
 * Item Interface
 */
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
  buffRange: number;
  attackType: EAttackType;
  basePower: number;
  physicalDamageResistance: number;
  basePhysicalDamageResistance: number;
  magicalDamageResistance: number;
  baseMagicalDamageResistance: number;
  factionEquipment: boolean;
  runeMetal: boolean;
  shiningHelm: boolean;
  superCharge: boolean;
  belongsTo: number;
  canHeal: boolean;
  canBuff: boolean;
  unitsConsumed: number;
  priestessDebuff: boolean;
  attackTile: boolean;
  magicalResistanceTile: boolean;
  physicalResistanceTile: boolean;
  manaVial: boolean;
  speedTile: boolean;
  dwarvenBrew: boolean;
  engineerShield?: string;
  shieldingAlly?: string;
  annihilatorDebuff: boolean;
  paladinAura: number;
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
 * Crystal Interface
 */
export interface ICrystal {
  unitId?: string;
  belongsTo: number;
  maxHealth: number;
  currentHealth: number;
  row: number;
  col: number;
  isDestroyed: boolean;
  isLastCrystal: boolean;
  boardPosition: number;
  debuffLevel: number;
  engineerShield?: string;
  paladinAura: number;
  annihilatorDebuff: boolean;
  physicalDamageResistance: number;
  magicalDamageResistance: number;
  basePhysicalDamageResistance: number;
  baseMagicalDamageResistance: number;
}

/**
 * Tile Interface
 */
export interface ITile {
  row: number;
  col: number;
  boardPosition: number;
  tileType: ETiles;
  x: number;
  y: number;
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
 * Chat message interface
 */
export interface IChatMessage {
  username: string;
  message: string;
  createdAt: Date;
}
export interface IChat {
  _id: string;
  messages: IChatMessage[]
}

/**
 * Game Interface
 */
export interface IGame {
  _id: string;
  players: IPlayerData[];
  turnNumber: number;
  currentState: IGameState[];
  previousTurn: IGameState[];
  gameOver?: IGameOver,
  status: EGameStatus;
  createdAt: Date;
  finishedAt: Date;
  lastPlayedAt: Date;
  activePlayer: string;
  chatLogs: IChat;
}
