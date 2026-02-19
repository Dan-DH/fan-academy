import { EGameSounds, EActionType, EAttackType, EHeroes } from "../../../enums/gameEnums";
import { IItem } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { playSound, useAnimation, getAOETiles } from "../../../utils/gameUtils";
import { Hero } from "../../hero";
import { Item } from "../../item";
import { Tile } from "../../tile";

export class DragonScale extends Item {
  constructor(context: GameScene, data: IItem) {
    super(context, data);
  }

  use(target: Hero): void {
    target.equipFactionBuff(this.boardPosition);
    this.removeFromGame();
  }
}

export class HealingPotion extends Item {
  constructor(context: GameScene, data: IItem) {
    super(context, data);
  }

  use(target: Hero): void {
    playSound(this.scene, EGameSounds.POTION_USE);

    const potionImage = this.scene.add.image(target.x, target.y - 10, 'healingPotion').setDepth(100);
    useAnimation(potionImage);

    const healingAmount = target.isKO ? 100 : 1000;
    target.getsHealed(healingAmount);

    this.removeFromGame();

    this.context.gameController!.afterAction(EActionType.USE, this.boardPosition, target.boardPosition);
  }
}

export class Inferno extends Item {
  constructor(context: GameScene, data: IItem) {
    super(context, data);
  };

  use(targetTile: Tile): void {
    const infernoImage = this.scene.add.image(targetTile.x, targetTile.y, 'infernoShockWave').setDepth(100);
    useAnimation(infernoImage, 3);
    playSound(this.scene, EGameSounds.INFERNO_USE);

    // Damages enemy units and crystals, and removes enemy KO'd units
    const damage = 350;

    const { enemyHeroTiles, enemyCrystalTiles } = getAOETiles(this.context, this, targetTile);

    enemyHeroTiles?.forEach(tile => {
      const hero = this.context.gameController!.board.units.find(unit => unit.boardPosition === tile.boardPosition);
      if (!hero) throw new Error('Inferno use() hero not found');

      // Inferno removes KO'd enemy units
      if (hero.isKO){
        hero.removeFromGame(true);
        return;
      }

      hero.getsDamaged(damage, EAttackType.MAGICAL);

      if (hero && hero instanceof Hero && hero.unitType === EHeroes.PHANTOM) hero.removeFromGame();
    });

    enemyCrystalTiles.forEach(tile => {
      const crystal = this.context.gameController!.board.crystals.find(crystal => crystal.boardPosition === tile.boardPosition);
      if (!crystal) throw new Error('Inferno use() crystal not found');

      if (crystal.belongsTo !== this.belongsTo) crystal.getsDamaged(damage, EAttackType.MAGICAL);
    });

    this.removeFromGame();
    this.context.gameController!.afterAction(EActionType.USE, this.boardPosition, targetTile.boardPosition);
  }
}
