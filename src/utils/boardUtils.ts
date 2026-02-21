import { Tile } from "../classes/board/tile";
import { Item } from "../classes/factions/item";
import { ETiles } from "../enums/gameEnums";
import { ITile } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";

// Used only by the voidmonk and wizard's splash attacks
export function getAOETiles(context: GameScene, spell: Item,  targetTile: Tile): {
  enemyHeroTiles: Tile[],
  enemyCrystalTiles: Tile[]
} {
  const board = context.gameController?.board;
  if (!board) throw new Error('Inferno use() board not found');

  const areaOfEffect = board.get3x3AreaOfEffectTiles(targetTile);

  const enemyHeroTiles = areaOfEffect?.filter(tile => tile.hero && tile.hero?.belongsTo !== spell.belongsTo);

  const enemyCrystalTiles = areaOfEffect?.filter(tile => tile.crystal && tile.crystal?.belongsTo !== spell.belongsTo);

  return {
    enemyHeroTiles,
    enemyCrystalTiles
  };
}

export function isEnemySpawn(context: GameScene, tile: Tile | ITile): boolean {
  return tile.tileType === ETiles.SPAWN && (context.isPlayerOne ? tile.col > 5 : tile.col < 5);
}