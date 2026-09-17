import { Crystal } from "../classes/board/crystal";
import { Tile } from "../classes/board/tile";
import { Hero } from "../classes/factions/hero";
import { Item } from "../classes/factions/item";
import { ETiles } from "../enums/gameEnums";
import { Coordinates, ITile } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";
import { checkUnitGameOver, getGridDistance } from "./gameUtils";
import { StatusEffects } from "./statuses";

export function getAOETiles(aoeAttack: Hero | Item,  boardPosition: number): (Hero | Crystal)[] {
  const board = aoeAttack.context.gameController?.board;
  if (!board) throw new Error('Inferno use() board not found');

  const areaOfEffect = board.get3x3AreaOfEffectTiles(boardPosition);

  const result: (Hero | Crystal)[] = [];
  areaOfEffect?.forEach(tile => {
    board.units.forEach(u => {
      if (u.stats.boardPosition === tile.boardPosition && u.stats.belongsTo !== aoeAttack.stats.belongsTo) result.push(u);
    });
  });

  return result;
}

export function isUnitOnEnemySpawn(context: GameScene, unit: Hero | Crystal): boolean {
  const spawnMatch = context.gameController?.board.grid.find(t => t.boardPosition === unit.stats.boardPosition && t.tileType === ETiles.SPAWN);

  if (spawnMatch) return context.isPlayerOne ? spawnMatch.col > 5 : spawnMatch.col < 5;

  return false;
}

// FIXME: replace with isUnitOnEnemySpawn if possible
export function isEnemySpawn(context: GameScene, tile: Tile | ITile): boolean {
  return tile.tileType === ETiles.SPAWN && (context.isPlayerOne ? tile.col > 5 : tile.col < 5);
}

export function exitSpecialTileCheck(hero: Hero, tile: Tile): void {
  removeSpecialTile(hero, tile);
}

export function enterSpecialTileCheck(hero: Hero, tile: Tile): void {
  specialTileCheck(hero, tile);
}

export function moveSpecialTileCheck(hero: Hero, endTile: Tile, startTile: Tile): void {
  exitSpecialTileCheck(hero, startTile);
  enterSpecialTileCheck(hero, endTile);
}

export function specialTileCheck(hero: Hero, tile: Tile): void {
  if (tile.tileType === ETiles.CRYSTAL_DAMAGE) {
    hero.context.gameController?.updateCrystals(hero.stats.belongsTo, true);
    // this.scene.sound.play(EGameSounds.CRYSTAL_TILE);
  };
  if (tile.tileType === ETiles.POWER) {
    hero.status.add(StatusEffects.POWER_TILE);
    // this.scene.sound.play(EGameSounds.SWORD_TILE);
  };
  if (tile.tileType === ETiles.MAGICAL_RESISTANCE) {
    hero.status.add(StatusEffects.MAGICAL_RESISTANCE_TILE);
    // this.scene.sound.play(EGameSounds.HELM_TILE);
  };
  if (tile.tileType === ETiles.PHYSICAL_RESISTANCE) {
    hero.status.add(StatusEffects.PHYSICAL_RESISTANCE_TILE);
    // this.scene.sound.play(EGameSounds.SHIELD_TILE);
  };
  if (tile.tileType === ETiles.SPEED) {
    hero.status.add(StatusEffects.SPEED_TILE);
    // TODO: missing sound bite
  };

  if (![ETiles.BASIC, !ETiles.SPAWN].includes(tile.tileType)) hero.visuals.playSpecialTileAnimation(tile.tileType);

  hero.unitCard.updateCardData(hero);
}

export function removeSpecialTile(hero: Hero, tile: Tile): void {
  if (tile.tileType === ETiles.CRYSTAL_DAMAGE) hero.context.gameController?.updateCrystals(hero.stats.belongsTo, false);
  if (tile.tileType === ETiles.POWER) hero.status.remove(StatusEffects.POWER_TILE);
  if (tile.tileType === ETiles.MAGICAL_RESISTANCE) hero.status.remove(StatusEffects.MAGICAL_RESISTANCE_TILE);
  if (tile.tileType === ETiles.PHYSICAL_RESISTANCE) hero.status.remove(StatusEffects.PHYSICAL_RESISTANCE_TILE);
  if (tile.tileType === ETiles.SPEED) hero.status.remove(StatusEffects.SPEED_TILE);

  hero.visuals.stopSpecialTileAnimation();
  hero.unitCard.updateCardData(hero);
}

export function getDistanceToTarget(hero: Hero, target: Hero | Crystal): number {
  const gameController = hero.context.gameController!;

  const attackerTile = gameController.board.getTileFromBoardPosition(hero.stats.boardPosition);
  const targetTile = gameController.board.getTileFromBoardPosition(target.stats.boardPosition);

  if (!attackerTile || !targetTile) {
    console.error('Archer attack() No attacker or target tile found');
    return 0;
  }

  return getGridDistance(attackerTile.row, attackerTile.col, targetTile.row, targetTile.col );
}

// FIXME: may be able to remove this method and use the code in-line
export function removeFromBoard(hero: Hero): void {
  const index = hero.context.gameController!.board.heroes.findIndex(unit => unit.stats.unitId === hero.stats.unitId);
  if (index !== -1) { hero.context.gameController!.board.heroes.splice(index, 1); }

  checkUnitGameOver(hero);
}

export function createBasicTileData(coordinates: Coordinates): ITile {
  return {
    x: coordinates.x!,
    y: coordinates.y!,
    row: coordinates.row!,
    col: coordinates.col!,
    boardPosition: coordinates.boardPosition!,
    tileType: ETiles.BASIC,
    hero: undefined,
    crystal: undefined
  };
}

export function adjustUnitCardPositionAndMakeVisible(unit: Hero | Item | Tile | Crystal): void {
  const boardPosition = unit instanceof Tile ? unit.boardPosition : unit.stats.boardPosition;

  if (boardPosition <= 44) {
    const lastColumPositions = [8, 17, 26, 35, 44];
    const lastRowPositions = [36, 37, 38, 39, 40, 41, 42, 43, 44];

    if (lastColumPositions.includes(boardPosition)) {
      unit.unitCard?.setX(-70);
    } else {
      unit.unitCard?.setX(0);
    }

    if (lastRowPositions.includes(boardPosition)) {
      unit.unitCard?.setY(-50);
    } else {
      unit.unitCard?.setY(0);
    }
  }

  unit.unitCard?.setVisible(true);
}