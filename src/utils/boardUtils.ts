import { Crystal } from "../classes/board/crystal";
import { Tile } from "../classes/board/tile";
import { Hero } from "../classes/factions/hero";
import { Item } from "../classes/factions/item";
import { EFaction, EGameSounds, EHeroes, ETiles } from "../enums/gameEnums";
import { ITile } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";
import { playSound } from "./gameSounds";
import { checkUnitGameOver, getGridDistance } from "./gameUtils";

// Used only by the voidmonk and wizard's splash attacks
export function getAOETiles(spell: Item,  targetTile: Tile): {
  enemyHeroTiles: Tile[],
  enemyCrystalTiles: Tile[]
} {
  const board = spell.context.gameController?.board;
  if (!board) throw new Error('Inferno use() board not found');

  const areaOfEffect = board.get3x3AreaOfEffectTiles(targetTile);

  const enemyHeroTiles = areaOfEffect?.filter(tile => tile.hero && tile.hero?.belongsTo !== spell.stats.belongsTo);

  const enemyCrystalTiles = areaOfEffect?.filter(tile => tile.crystal && tile.crystal?.belongsTo !== spell.stats.belongsTo);

  return {
    enemyHeroTiles,
    enemyCrystalTiles
  };
}

export function isEnemySpawn(context: GameScene, tile: Tile | ITile): boolean {
  return tile.tileType === ETiles.SPAWN && (context.isPlayerOne ? tile.col > 5 : tile.col < 5);
}

export function specialTileCheck(hero: Hero, targetTile: ETiles, currentTile?: ETiles): void {
  let damageResistance;
  if (hero.stats.faction === EFaction.DWARVES) {
    damageResistance = hero.stats.unitType === EHeroes.ENGINEER ? 28 : 24;
  } else {
    damageResistance = 20;
  }

  // If hero is leaving a special tile
  if (currentTile === ETiles.CRYSTAL_DAMAGE) {
    hero.context.gameController?.updateCrystals(hero.stats.belongsTo, false);
    hero.visuals.crystalDebuffTileAnim.setVisible(false);
  }
  if (currentTile === ETiles.POWER) {
    hero.stats.attackTile = false;
    hero.visuals.powerTileAnim.setVisible(false);
  }
  if (currentTile === ETiles.MAGICAL_RESISTANCE) {
    hero.stats.magicalDamageResistance -= damageResistance;
    hero.visuals.magicalResistanceTileAnim.setVisible(false);
  }
  if (currentTile === ETiles.PHYSICAL_RESISTANCE) {
    hero.stats.physicalDamageResistance -= damageResistance;
    hero.visuals.physicalResistanceTileAnim.setVisible(false);
  }
  if (currentTile === ETiles.SPEED) {
    hero.stats.speedTile = false;
    hero.visuals.magicalResistanceTileAnim.setVisible(false);
  }

  // If hero is entering a special tile
  if (targetTile === ETiles.CRYSTAL_DAMAGE) {
    hero.context.gameController?.updateCrystals(hero.stats.belongsTo, true);
    hero.visuals.crystalDebuffTileAnim.setVisible(true);
    playSound(hero.scene, EGameSounds.CRYSTAL_TILE);
  }
  if (targetTile === ETiles.POWER) {
    hero.stats.attackTile = true;
    hero.visuals.powerTileAnim.setVisible(true);
    playSound(hero.scene, EGameSounds.SWORD_TILE);
  }
  if (targetTile === ETiles.MAGICAL_RESISTANCE) {
    hero.stats.magicalDamageResistance += damageResistance;
    hero.visuals.magicalResistanceTileAnim.setVisible(true);
    playSound(hero.scene, EGameSounds.HELM_TILE);
  }
  if (targetTile === ETiles.PHYSICAL_RESISTANCE) {
    hero.stats.physicalDamageResistance += damageResistance;
    hero.visuals.physicalResistanceTileAnim.setVisible(true);
    playSound(hero.scene, EGameSounds.SHIELD_TILE);
  }
  if (targetTile === ETiles.SPEED) {
    hero.stats.speedTile = true;
    hero.visuals.magicalResistanceTileAnim.setVisible(true); // Reusing the animation since it's basically the same color
  }

  hero.unitCard.updateCardData(hero);
}

export function removeSpecialTileOnKo(hero: Hero): void {
  const currentTile = hero.getTile();

  let damageResistance;
  if (hero.stats.faction === EFaction.DWARVES) {
    damageResistance = hero.stats.unitType === EHeroes.ENGINEER ? 28 : 24;
  } else {
    damageResistance = 20;
  }

  if (currentTile.tileType === ETiles.CRYSTAL_DAMAGE) {
    hero.context.gameController?.updateCrystals(hero.stats.belongsTo, false);
    hero.visuals.crystalDebuffTileAnim.setVisible(false);
  }
  if (currentTile.tileType === ETiles.POWER) {
    hero.stats.attackTile = false;
    hero.visuals.powerTileAnim.setVisible(false);
  }
  if (currentTile.tileType === ETiles.MAGICAL_RESISTANCE) {
    hero.stats.magicalDamageResistance -= damageResistance;
    hero.visuals.magicalResistanceTileAnim.setVisible(false);
  }
  if (currentTile.tileType === ETiles.PHYSICAL_RESISTANCE) {
    hero.stats.physicalDamageResistance -= damageResistance;
    hero.visuals.physicalResistanceTileAnim.setVisible(false);
  }

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

export function  removeFromBoard(hero: Hero): void {
  // Remove hero data from tile
  const tile = hero.getTile();
  tile.removeHero();

  // Remove hero from board array
  const index = hero.context.gameController!.board.units.findIndex(unit => unit.stats.unitId === hero.stats.unitId);
  if (index !== -1) { hero.context.gameController!.board.units.splice(index, 1); }

  checkUnitGameOver(hero);
}