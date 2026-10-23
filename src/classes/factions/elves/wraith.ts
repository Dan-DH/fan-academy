import { EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { Hero } from "../hero";
import { DarkElf } from "./elves";
import { Crystal } from "../../board/crystal";
import { attackAnimation, turnIfBehind } from "../../../utils/unitAnimations";
import { isPhantomAndKO } from "../../../utils/gameUtils";
import { SPIKE_ARMOR_HP_THRESHOLD } from "../../../utils/boardUtils";

export class Wraith extends DarkElf {
  constructor(data: IHero) {
    super(data);
  }

  attack(target: Hero | Crystal): void {
    attackAnimation(this);
    turnIfBehind(this.context, this, target);

    if (target instanceof Hero && target.stats.isKO) {
      // this.scene.sound.play(EGameSounds.WRAITH_CONSUME);
      target.getsStompedOrDestroyed(this);

      if (this.stats.unitsConsumed! < 3) {
        this.stats.basePower += 50;
        this.stats.unitsConsumed!++;
        this.increaseMaxHealth(100);
        this.unitCard.updateCardData(this);
      }
    } else {
      // if (this.stats.superCharge) this.scene.sound.play(EGameSounds.WRAITH_ATTACK_BIG);
      // if (!this.stats.superCharge) this.scene.sound.play(EGameSounds.WRAITH_ATTACK);

      const damageDealt = target.getsDamaged({
        damage: this.getTotalPower(),
        attackType: this.stats.attackType,
        attacker: this
      });

      if (damageDealt) this.lifeSteal(damageDealt);
      if (this.stats.currentHealth > SPIKE_ARMOR_HP_THRESHOLD) this.checkForDamageToReflect(target, damageDealt);
      this.removeAttackModifiers();
    }

    if (isPhantomAndKO(target)) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {}
}
