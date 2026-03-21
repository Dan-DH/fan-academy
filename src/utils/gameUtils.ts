import { Crystal } from "../classes/board/crystal";
import { Tile } from "../classes/board/tile";
import { Hero } from "../classes/factions/hero";
import { Item } from "../classes/factions/item";
import { EActionType, EActionClass, EClass, EWinConditions } from "../enums/gameEnums";
import { IHero, IItem, ICrystal } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";

export function isHero(unit: IHero | IItem): boolean {
  return unit.class === "hero";
}

export function isItem(item: IHero | IItem): boolean {
  return item.class === "item";
}

export function isInHand(boardPosition: number): boolean {
  return boardPosition > 44 && boardPosition < 51;
}

export function isOnBoard(position: number): boolean {
  return position >= 0 && position <= 44;
}

export function belongsToPlayer(context: GameScene, unit: Hero | Item | IItem | Crystal | ICrystal | IHero): boolean {
  const playerNumber = context.isPlayerOne ? 1 : 2;
  if (unit instanceof Hero || unit instanceof Item || unit instanceof Crystal) return unit.stats.belongsTo === playerNumber;
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

  if (tile.hero && tile.hero.belongsTo !== attacker.stats.belongsTo && !tile.hero.isKO) result = true;
  if (tile.crystal && tile.crystal.belongsTo !== attacker.stats.belongsTo) result = true;

  return result;
}

export function isLastUnit(hero: Hero): boolean {
  const opponentData = hero.context.isPlayerOne ? hero.context.gameController!.lastTurnState.player2 : hero.context.gameController!.lastTurnState.player1;

  const handUnits = opponentData?.factionData.unitsInHand.find(unit => unit.class === EClass.HERO);
  if (handUnits) return false;

  const boardUnits = hero.context.gameController?.board.units;
  const aliveBoardUnits = boardUnits!.filter(unit => unit.stats.belongsTo === hero.stats.belongsTo).find(unit => !unit.stats.isKO);
  if (aliveBoardUnits) return false;

  return true;
}

export function checkUnitGameOver(hero: Hero): void {
  if (!isLastUnit(hero)) return;

  const attackingPlayer = hero.stats.unitId.includes(hero.context.player1!.playerId) ? hero.context.player2 : hero.context.player1;

  hero.context.gameController!.gameOver = {
    winCondition: EWinConditions.UNITS,
    winner: attackingPlayer!.playerId
  };
}

export function generateFourDigitId(): number {
  return Math.floor(1000 + Math.random() * 9000);
}
