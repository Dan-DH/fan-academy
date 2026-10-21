import { EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { Hero } from "../hero";
import { Council } from "./council";
import { Crystal } from "../../board/crystal";
import { getDistanceToTarget, SPIKE_ARMOR_HP_THRESHOLD } from "../../../utils/boardUtils";
import { attackAnimation, turnIfBehind } from "../../../utils/unitAnimations";
import { isKoUnitOnEnemySpawn, isPhantomAndKO } from "../../../utils/gameUtils";

export class Archer extends Council {
  constructor(data: IHero) {
    super(data);
  }

  attack(target: Hero | Crystal): void {
    attackAnimation(this);
    const distance = getDistanceToTarget(this, target);
    turnIfBehind(this.context, this, target);

    let damageDealt = 0;
    if (distance === 1) {
      // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
      if (isKoUnitOnEnemySpawn(target)) {
        // this.scene.sound.play(EGameSounds.ARCHER_ATTACK_MELEE);
        target.getsStompedOrDestroyed();
      } else {
        // this.scene.sound.play(EGameSounds.ARCHER_ATTACK_MELEE);

        damageDealt = target.getsDamaged({
          damage: this.getTotalPower(0.5),
          attackType: this.stats.attackType,
          attacker: this
        });
        this.removeAttackModifiers();
      }
    } else {
      // if (this.stats.superCharge) this.scene.sound.play(EGameSounds.ARCHER_ATTACK_BIG);
      // if (!this.stats.superCharge) this.scene.sound.play(EGameSounds.ARCHER_ATTACK);

      damageDealt = target.getsDamaged({
        damage: this.getTotalPower(),
        attackType: this.stats.attackType,
        attacker: this
      });
      this.removeAttackModifiers();
    }

    if (this.stats.currentHealth > SPIKE_ARMOR_HP_THRESHOLD) this.checkForDamageToReflect(target, damageDealt);
    if (isPhantomAndKO(target)) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {}
}
