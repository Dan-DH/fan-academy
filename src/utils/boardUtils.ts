import { Crystal } from "../classes/board/crystal";
import { Tile } from "../classes/board/tile";
import { Hero } from "../classes/factions/hero";
import { Item } from "../classes/factions/item";
import { ETiles } from "../enums/gameEnums";
import { Coordinates, ITile } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";
import { checkUnitGameOver, getGridDistance } from "./gameUtils";

export function getAOETiles(aoeAttack: Hero | Item,  targetTile: Tile): {
  enemyHeroTiles: Tile[],
  enemyCrystalTiles: Tile[]
} {
  const board = aoeAttack.context.gameController?.board;
  if (!board) throw new Error('Inferno use() board not found');

  const areaOfEffect = board.get3x3AreaOfEffectTiles(targetTile);

  const enemyHeroTiles = areaOfEffect?.filter(tile => tile.hero && tile.hero?.belongsTo !== aoeAttack.stats.belongsTo);

  const enemyCrystalTiles = areaOfEffect?.filter(tile => tile.crystal && tile.crystal?.belongsTo !== aoeAttack.stats.belongsTo);

  return {
    enemyHeroTiles,
    enemyCrystalTiles
  };
}

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
  if (tile.tileType === ETiles.CRYSTAL_DAMAGE) hero.context.gameController?.updateCrystals(hero.stats.belongsTo, true);
  if (tile.tileType === ETiles.POWER) hero.stats.attackTile = true;
  if (tile.tileType === ETiles.MAGICAL_RESISTANCE) hero.stats.magicalResistanceTile = true;
  if (tile.tileType === ETiles.PHYSICAL_RESISTANCE) hero.stats.physicalResistanceTile = true;
  if (tile.tileType === ETiles.SPEED) hero.stats.speedTile = true;

  if (![ETiles.BASIC, !ETiles.SPAWN].includes(tile.tileType)) hero.visuals.playSpecialTileAnimation(tile.tileType);

  hero.unitCard.updateCardData(hero);
}

export function removeSpecialTile(hero: Hero, tile: Tile): void {
  if (tile.tileType === ETiles.CRYSTAL_DAMAGE) hero.context.gameController?.updateCrystals(hero.stats.belongsTo, false);
  if (tile.tileType === ETiles.POWER) hero.stats.attackTile = false;
  if (tile.tileType === ETiles.MAGICAL_RESISTANCE) hero.stats.magicalResistanceTile = false;
  if (tile.tileType === ETiles.PHYSICAL_RESISTANCE) hero.stats.physicalResistanceTile = false;
  if (tile.tileType === ETiles.SPEED) hero.stats.speedTile = false;

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

export function removeFromBoard(hero: Hero): void {
  // Remove hero data from tile
  const tile = hero.getTile();
  tile.removeHero();

  // Remove hero from board array
  const index = hero.context.gameController!.board.units.findIndex(unit => unit.stats.unitId === hero.stats.unitId);
  if (index !== -1) { hero.context.gameController!.board.units.splice(index, 1); }

  checkUnitGameOver(hero);
}

export function getKeyMapTiles(tiles: Tile[]): Tile[] {
  const result: Tile[] = [];

  for (const tile of tiles) {
    if (tile.tileType !== ETiles.BASIC) {
      result.push(tile);
      continue;
    }

    if (tile.hero) result.push(tile);
  }

  return result;
}

export function createBasicTileData(coordinates: Coordinates): ITile {
  return {
    x: coordinates.x!,
    y: coordinates.y!,
    row: coordinates.row!,
    col: coordinates.col!,
    boardPosition: coordinates.boardPosition!,
    tileType: ETiles.BASIC,
    obstacle: false,
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