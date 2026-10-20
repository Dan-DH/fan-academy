import { EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { getDistanceToTarget, SPIKE_ARMOR_HP_THRESHOLD } from "../../../utils/boardUtils";
import { isKoUnitOnEnemySpawn, isPhantomAndKO } from "../../../utils/gameUtils";
import { attackAnimation, turnIfBehind } from "../../../utils/unitAnimations";
import { Crystal } from "../../board/crystal";
import { Hero } from "../hero";
import { Tribe } from "./tribe";

export class AxeThrower extends Tribe {
  constructor(data: IHero) {
    super(data);
  }

  attack(target: Hero | Crystal): void {
    attackAnimation(this);
    const distance = getDistanceToTarget(this, target);
    turnIfBehind(this.context, this, target);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (distance === 1 && isKoUnitOnEnemySpawn(target)) {
      // this.scene.sound.play(EGameSounds.ARCHER_ATTACK_MELEE); // FIXME: add audio bits
      target.getsStompedOrDestroyed();
    } else {
      // this.scene.sound.play(EGameSounds.ARCHER_ATTACK_MELEE);
      const damage = this.getTotalPower() + (this.triggersExtraDamage(target) ? 200 : 0);
      const damageDealt = target.getsDamaged({
        damage,
        attackType: this.stats.attackType,
        attacker: this
      });
      this.removeAttackModifiers();
      if (this.stats.currentHealth > SPIKE_ARMOR_HP_THRESHOLD) this.checkForDamageReflected(target, damageDealt);
    }

    if (isPhantomAndKO(target)) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  private triggersExtraDamage(target: Hero | Crystal): boolean {
    if (target instanceof Hero && target.getCurrentHealthPercent() > 0.5) return true;
    if (target instanceof Crystal && target.getCurrentHealthPercent() > 0.25) return true;
    return false;
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {};
}