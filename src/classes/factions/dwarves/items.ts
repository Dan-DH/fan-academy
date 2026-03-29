import { EGameSounds, EActionType, EAttackType, EHeroes } from "../../../enums/gameEnums";
import { IItem } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { Hero } from "../hero";
import { Item } from "../item";
import { Tile } from "../../board/tile";
import { getAOETiles } from "../../../utils/boardUtils";
import { playSound } from "../../../utils/gameSounds";
import { pulverizerAnimation, useAnimation } from "../../../utils/unitAnimations";
import { roundToFive } from "../../../utils/gameUtils";

export class DragonScale extends Item {
  constructor(context: GameScene, data: IItem) {
    super(context, data);
  }

  use(target: Hero): void {
    target.equipFactionEquipment(this.stats.boardPosition);
    this.removeFromGame();
  }
}

export class DwarvenBrew extends Item {
  constructor(context: GameScene, data: IItem) {
    super(context, data);
  }

  use(target: Hero): void {
    if (target.stats.isKO) return;

    playSound(this.scene, EGameSounds.DWARVEN_BREW_USE);

    const dwarvenBrewImage = this.scene.add.image(target.x, target.y - 10, 'dwarvenBrew').setDepth(100);
    useAnimation(dwarvenBrewImage);

    target.stats.dwarvenBrew = true;
    target.visuals.dwarvenBrewImage.setVisible(true);
    target.getsHealed(1000);

    this.removeFromGame();

    this.context.gameController!.afterAction(EActionType.USE, this.stats.boardPosition, target.stats.boardPosition);
  }
}

export class Pulverizer extends Item {
  constructor(context: GameScene, data: IItem) {
    super(context, data);
  };

  use(targetTile: Tile): void {
    const pulverizerImage = this.scene.add.image(targetTile.x, targetTile.y, 'pulverizer').setDepth(100);
    pulverizerAnimation(pulverizerImage, targetTile.y);
    playSound(this.scene, EGameSounds.PULVERIZER_USE);

    if (targetTile.hero) this.directHitOnHero(targetTile);
    if (targetTile.crystal) this.directHitOnCrystal(targetTile);

    this.removeFromGame();
    this.context.gameController!.afterAction(EActionType.USE, this.stats.boardPosition, targetTile.boardPosition);
  }

  directHitOnHero(targetTile: Tile): void {
    const hero = this.context.gameController?.board.units.find(unit => unit.stats.boardPosition === targetTile.boardPosition);
    if (!hero) throw new Error(`directHitOnHero() - no target found in units`);
    const directHitDamage = 600;

    hero.getsDamaged(directHitDamage, EAttackType.PHYSICAL, this, true);
  }

  directHitOnCrystal(targetTile: Tile): void {
    const { enemyHeroTiles, enemyCrystalTiles } = getAOETiles(this, targetTile);

    const directHitDamage = 600;
    const splashDamage = roundToFive(600 * 0.33);

    enemyHeroTiles?.forEach(tile => {
      const hero = this.context.gameController!.board.units.find(unit => unit.stats.boardPosition === tile.boardPosition);
      hero!.getsDamaged(splashDamage, EAttackType.PHYSICAL, this);
      if (hero && hero instanceof Hero && hero.stats.unitType === EHeroes.PHANTOM && hero.stats.isKO) hero.removeFromGame();
    });

    enemyCrystalTiles.forEach(tile => {
      const crystal = this.context.gameController!.board.crystals.find(crystal => crystal.stats.boardPosition === tile.boardPosition);
      if (crystal?.stats.boardPosition === targetTile.boardPosition) {
        crystal?.getsDamaged(directHitDamage, EAttackType.PHYSICAL, this, true);
      } else {
        crystal?.getsDamaged(splashDamage, EAttackType.PHYSICAL, this, true);
      }
    });
  }
}
