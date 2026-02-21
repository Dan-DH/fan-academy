import { Crystal } from "../classes/board/crystal";
import { Tile } from "../classes/board/tile";
import { Hero } from "../classes/factions/hero";
import { Item } from "../classes/factions/item";
import { EActionType, EActionClass, EClass, EItems, EWinConditions } from "../enums/gameEnums";
import { IHero, IItem, ICrystal, IPlayerState } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";

export function isHero(hero: IHero | IItem): hero is Hero {
  return hero.class === "hero";
}

export function isItem(item: IHero | IItem): item is Item {
  return item.class === "item";
}

export function isInHand(boardPosition: number): boolean {
  return boardPosition > 44 && boardPosition < 51;
}

export function isOnBoard(position: number): boolean {
  return position >= 0 && position <= 44;
}

export function belongsToPlayer(context: GameScene, unit: Hero | IHero | Item | IItem | Crystal | ICrystal): boolean {
  const playerNumber = context.isPlayerOne ? 1 : 2;
  return unit.belongsTo === playerNumber;
}

// Rounds a number to the nearest multiple of 5
export function roundToFive(amount: number): number {
  return Math.round(amount / 5) * 5;
}

export function getGridDistance(startRow: number, startColumn: number, targetRow: number, targetColumn: number): number {
  return Math.abs(startRow - targetRow) + Math.abs(startColumn - targetColumn);
}

// Not used at the moment, could be useful when animations are added. Otherwise remove
export function pauseCode(scene: Phaser.Scene, delay: number): Promise<void> {
  return new Promise(resolve => {
    scene.time.delayedCall(delay, resolve);
  });
}

export function getActionClass(action: EActionType): EActionClass {
  return [EActionType.PASS, EActionType.DRAW, EActionType.REMOVE_UNITS].includes(action) ? EActionClass.AUTO : EActionClass.USER;
}

export function canBeAttacked(attacker: Hero, tile: Tile): boolean {
  let result = false;

  if (tile.hero && tile.hero.belongsTo !== attacker.belongsTo && !tile.hero.isKO) result = true;
  if (tile.crystal && tile.crystal.belongsTo !== attacker.belongsTo) result = true;

  return result;
}

export function isLastUnit(context: GameScene, hero: Hero): boolean {
  let attackingPlayer: IPlayerState | undefined;
  let defendingPlayer: IPlayerState | undefined;

  if (hero.unitId.includes(context.player1!.playerId)) {
    attackingPlayer = context.player2;
    defendingPlayer = context.player1;
  } else {
    attackingPlayer = context.player1;
    defendingPlayer = context.player2;
  }

  if (!attackingPlayer || !defendingPlayer) throw new Error('updateUnitsLeft() No player found');

  const unitsArray = context.gameController?.board.units;
  if (!unitsArray) throw new Error('updateUnitsLeft() no units array found');

  // Get remaining units of defending player. Populate gameOver flag if there are none left and the player has no revives in hand
  const remainingAwakeBoardUnits: Hero[] = [];
  const remainingKoBoardUnits: Hero[] = [];

  unitsArray.filter(unit => unit.belongsTo === hero.belongsTo).map(unit => unit.isKO ? remainingKoBoardUnits.push(unit) : remainingAwakeBoardUnits.push(unit));

  let hand;
  let remainingHandUnits;
  const defendingPlayerIsActivePlayer = defendingPlayer.playerId === context.activePlayer;
  if (defendingPlayerIsActivePlayer) {
    hand = context.gameController?.hand.getHand();
    remainingHandUnits = hand!.find(unit => unit.belongsTo === hero.belongsTo && unit.class === EClass.HERO);
  } else {
    hand = defendingPlayer.factionData.unitsInHand;
    remainingHandUnits = hand.find(unit => unit.belongsTo === hero.belongsTo && unit.class === EClass.HERO);
  }

  const remainingDeckUnits = defendingPlayer.factionData.unitsInDeck.find(unit => unit.belongsTo === hero.belongsTo && unit.class === EClass.HERO);

  const reviveItems = [EItems.HEALING_POTION, EItems.SOUL_HARVEST];
  const hasReviveInHand = hand ? hand.find(unit => reviveItems.includes((unit as Item)?.itemType)) : undefined;

  if (remainingAwakeBoardUnits || remainingHandUnits || remainingDeckUnits || remainingKoBoardUnits && hasReviveInHand) return false;

  return true;
}

export function checkUnitGameOver(context: GameScene, hero: Hero): void {
  if (!isLastUnit(context, hero)) return;

  const attackingPlayer = hero.unitId.includes(context.player1!.playerId) ? context.player2 : context.player1;

  context.gameController!.gameOver = {
    winCondition: EWinConditions.UNITS,
    winner: attackingPlayer!.playerId
  };
}

export function generateFourDigitId(): number {
  return Math.floor(1000 + Math.random() * 9000);
}
