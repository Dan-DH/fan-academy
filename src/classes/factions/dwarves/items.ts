import { EActionType, EAttackType, EHeroes } from "../../../enums/gameEnums";
import { IItem } from "../../../interfaces/gameInterface";
import { Hero } from "../hero";
import { Item } from "../item";
import { getAOETiles } from "../../../utils/boardUtils";
import { pulverizerAnimation, useAnimation } from "../../../utils/unitAnimations";
import { roundToFive } from "../../../utils/gameUtils";
import { Crystal } from "../../board/crystal";
import { StatusEffects } from "../../../utils/statuses";

export class DwarvenBrew extends Item {
  constructor(data: IItem) {
    super(data);
  }

  use(target: Hero): void {
    if (target.stats.isKO) return;

    // this.scene.sound.play(EGameSounds.DWARVEN_BREW_USE);

    const dwarvenBrewImage = this.scene.add.image(target.x, target.y - 10, 'gameAtlas', 'dwarvenBrew').setDepth(100);
    useAnimation(dwarvenBrewImage);

    target.status.add(StatusEffects.DWARVEN_BREW);
    target.visuals.dwarvenBrewImage.setVisible(true);
    target.getsHealed(1000);

    this.removeFromGame();

    this.context.afterAction(EActionType.USE, this.stats.boardPosition, target.stats.boardPosition);
  }
}

export class Pulverizer extends Item {
  constructor(data: IItem) {
    super(data);
  }

  use(target: Hero | Crystal): void {
    const pulverizerImage = this.scene.add.image(target.x, target.y, 'gameAtlas', 'pulverizer').setDepth(100);
    pulverizerAnimation(pulverizerImage, target.y);
    // this.scene.sound.play(EGameSounds.PULVERIZER_USE);

    if (target instanceof Hero) this.directHitOnHero(target);
    if (target instanceof Crystal) this.directHitOnCrystal(target);

    this.removeFromGame();
    this.context.afterAction(EActionType.USE, this.stats.boardPosition, target.stats.boardPosition);
  }

  directHitOnHero(hero: Hero): void {
    const directHitDamage = 600;

    // FIXME: number used as boolean
    hero.getsDamaged(directHitDamage, EAttackType.PHYSICAL, this, 1);
  }

  directHitOnCrystal(crystal: Crystal): void {
    const directHitDamage = 600;
    const splashDamage = roundToFive(600 * 0.33);

    const enemyUnits = getAOETiles(this, crystal.stats.boardPosition);
    enemyUnits.forEach(u => {
      if (u instanceof Hero) {
        u!.getsDamaged(splashDamage, EAttackType.PHYSICAL, this);
        if (u.stats.unitType === EHeroes.PHANTOM && u.stats.isKO) u.removeFromGame();
        return;
      }

      if (u instanceof Crystal) {
        if (u.stats.boardPosition === crystal.stats.boardPosition) {
          u.getsDamaged(directHitDamage, EAttackType.PHYSICAL, this);
        } else {
          u.getsDamaged(splashDamage, EAttackType.PHYSICAL, this, 0.33);
        }
      }
    });
  }
}
