import { EGameSounds, EActionType, EAttackType, EHeroes } from "../../../enums/gameEnums";
import { IItem } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { Hero } from "../hero";
import { Item } from "../item";
import { Tile } from "../../board/tile";
import { getAOETiles } from "../../../utils/boardUtils";
import { playSound } from "../../../utils/gameSounds";
import { roundToFive } from "../../../utils/gameUtils";
import { useAnimation } from "../../../utils/unitAnimations";

export class SoulStone extends Item {
  constructor(context: GameScene, data: IItem) {
    super(context, data);
  }

  use(target: Hero): void {
    target.equipFactionEquipment(this.stats.boardPosition);
    this.removeFromGame();
  }
}

export class ManaVial extends Item {
  constructor(context: GameScene, data: IItem) {
    super(context, data);
  }

  use(target: Hero): void {
    if (target.stats.isKO) return;

    playSound(this.scene, EGameSounds.POTION_USE);
    const potionImage = this.scene.add.image(target.x, target.y - 10, 'manaVial').setDepth(100);
    useAnimation(potionImage);

    if (target.stats.manaVial) {
      target.getsHealed(1000);
    } else {
      target.healAndIncreaseHealth(1000, 50);
      target.stats.manaVial = true;
      target.updateTileData();
    }

    this.context.gameController!.afterAction(EActionType.USE, this.stats.boardPosition, target.stats.boardPosition);

    this.removeFromGame();
  }
}

export class SoulHarvest extends Item {
  constructor(context: GameScene, data: IItem) {
    super(context, data);
  }

  use(targetTile: Tile): void {
    const harvestIamge = this.scene.add.image(targetTile.x, targetTile.y - 20, 'soulHarvestShockWave').setDepth(100);
    useAnimation(harvestIamge);

    playSound(this.scene, EGameSounds.USE_HARVEST);

    const gameController = this.context.gameController;

    if (!gameController) {
      console.error('SoulHarvest use() No gamecontroller');
      return;
    }
    // Damages enemy units and crystals but doesn't remove KO'd enemy units
    const damage = 100;

    const { enemyHeroTiles, enemyCrystalTiles } = getAOETiles(this, targetTile);

    // Keep track of the cumulative damage done (not attack power used) to enemy heroes (not crystals)
    let totalDamageInflicted = 0;

    enemyHeroTiles?.forEach(tile => {
      const hero = gameController.board.units.find(unit => unit.stats.boardPosition === tile.boardPosition);

      if (!hero) throw new Error('SoulHarvest use() hero not found');
      if (hero.stats.isKO) return;

      totalDamageInflicted += hero.getsDamaged(damage, EAttackType.MAGICAL);

      if (hero && hero instanceof Hero && hero.stats.unitType === EHeroes.PHANTOM) hero.removeFromGame();
    });

    enemyCrystalTiles.forEach(tile => {
      const crystal = gameController.board.crystals.find(crystal => crystal.stats.boardPosition === tile.boardPosition);
      if (!crystal) throw new Error('SoulHarvest use() crystal not found');

      if (crystal.stats.belongsTo !== this.stats.belongsTo) crystal.getsDamaged(damage, EAttackType.MAGICAL, this);
    });

    // Get total amount of friendly units in the map, including KO'd ones
    const friendlyUnits = gameController.board.units.filter(unit => unit.stats.belongsTo === this.stats.belongsTo);

    // Divide damage dealt by that number + 3, then round to nearest 5. Formula: 1 / (units + 3) * damage
    const lifeIncreaseAmount = roundToFive(1 / (friendlyUnits.length + 3) * totalDamageInflicted);

    // Increase max health of all units, including KO'd ones, and revive them
    friendlyUnits.forEach(unit => unit.increaseMaxHealth(lifeIncreaseAmount));

    gameController.afterAction(EActionType.USE, this.stats.boardPosition, targetTile.boardPosition);
    this.removeFromGame();
  }
}
