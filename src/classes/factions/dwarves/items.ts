import { EActionType, EAttackType, EHeroes } from "../../../enums/gameEnums";
import { IItem } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { Hero } from "../hero";
import { Item } from "../item";
import { getAOETiles } from "../../../utils/boardUtils";
import { pulverizerAnimation, useAnimation } from "../../../utils/unitAnimations";
import { roundToFive } from "../../../utils/gameUtils";
import { Crystal } from "../../board/crystal";

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

    // this.scene.sound.play(EGameSounds.DWARVEN_BREW_USE);

    const dwarvenBrewImage = this.scene.add.image(target.x, target.y - 10, 'gameAtlas', 'dwarvenBrew').setDepth(100);
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

  use(target: Hero | Crystal): void {
    const pulverizerImage = this.scene.add.image(target.x, target.y, 'gameAtlas', 'pulverizer').setDepth(100);
    pulverizerAnimation(pulverizerImage, target.y);
    // this.scene.sound.play(EGameSounds.PULVERIZER_USE);

    if (target instanceof Hero) this.directHitOnHero(target);
    if (target instanceof Crystal) this.directHitOnCrystal(target);

    this.removeFromGame();
    this.context.gameController!.afterAction(EActionType.USE, this.stats.boardPosition, target.stats.boardPosition);
  }

  directHitOnHero(hero: Hero): void {
    const directHitDamage = 600;

    // FIXME: number used as boolean
    hero.getsDamaged(directHitDamage, EAttackType.PHYSICAL, this, 1);
  }

  directHitOnCrystal(crystal: Crystal): void {
    const { enemyHeroes, enemyCrystals } = getAOETiles(this, crystal.stats.boardPosition);

    const directHitDamage = 600;
    const splashDamage = roundToFive(600 * 0.33);

    enemyHeroes?.forEach(h => {
      h!.getsDamaged(splashDamage, EAttackType.PHYSICAL, this);
      if (h.stats.unitType === EHeroes.PHANTOM && h.stats.isKO) h.removeFromGame();
    });

    enemyCrystals.forEach(c => {
      if (c.stats.boardPosition === crystal.stats.boardPosition) {
        c.getsDamaged(directHitDamage, EAttackType.PHYSICAL, this);
      } else {
        c.getsDamaged(splashDamage, EAttackType.PHYSICAL, this, 0.33);
      }
    });
  }
}
