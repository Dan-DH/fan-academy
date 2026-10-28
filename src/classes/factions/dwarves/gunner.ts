import { EActionType, EAttackType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { getDistanceToTarget, SPIKE_ARMOR_HP_THRESHOLD } from "../../../utils/boardUtils";
import { isKoUnitOnEnemySpawn, isPhantomAndKO } from "../../../utils/gameUtils";
import { StatusEffects } from "../../../utils/statuses";
import { attackAnimation, turnIfBehind } from "../../../utils/unitAnimations";
import { Crystal } from "../../board/crystal";
import { Hero } from "../hero";
import { Dwarf } from "./dwarves";

export class Gunner extends Dwarf {
  constructor(data: IHero) {
    super(data);
  }

  attack(target: Hero | Crystal): void {
    attackAnimation(this);
    turnIfBehind(this.context, this, target);

    const distance = getDistanceToTarget(this, target);

    if (distance === 1) {
      this.singleTargetAttack(target);
    } else {
      this.multiTargetAttack(target);
    }

    if (isPhantomAndKO(target)) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  singleTargetAttack(target: Hero | Crystal): void {
    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (isKoUnitOnEnemySpawn(target)) {
      // this.scene.sound.play(EGameSounds.GRENADIER_ATTACK_MELEE);
      target.getsStompedOrDestroyed(this);
    } else {
      // this.scene.sound.play(EGameSounds.GUNNER_ATTACK);
      const damageDealt = target.getsDamaged({
        damage: this.getTotalPower(),
        attackType: this.stats.attackType,
        attacker: this
      });
      this.removeAttackModifiers();
      if (this.stats.currentHealth > SPIKE_ARMOR_HP_THRESHOLD) this.checkForDamageToReflect(target, damageDealt);
    }
  }

  multiTargetAttack(target: Hero | Crystal): void {
    // this.scene.sound.play(EGameSounds.GUNNER_ATTACK);
    // this.context.time.delayedCall(100, () => this.scene.sound.play(EGameSounds.GUNNER_ATTACK));
    // this.context.time.delayedCall(200, () => this.scene.sound.play(EGameSounds.GUNNER_ATTACK));
    let totalDamageToReflect = 0;
    const damageDealt = target.getsDamaged({
      damage: this.getTotalPower(0.6667),
      attackType: EAttackType.PHYSICAL,
      attacker: this
    });
    if (target.status.has(StatusEffects.SPIKE_ARMOR)) totalDamageToReflect += damageDealt;

    const splashedUnits = this.context.board!.getGunnerSplashTargets(this, target);
    splashedUnits?.forEach(unit =>  {
      const damageDealt = unit.getsDamaged({
        damage: this.getTotalPower(0.6667),
        attackType: EAttackType.PHYSICAL,
        attacker: this,
        splashDamage: 0.6667
      });
      if (isPhantomAndKO(unit)) unit.removeFromGame();
      if (target.status.has(StatusEffects.SPIKE_ARMOR)) totalDamageToReflect += damageDealt;
    });

    if (this.stats.currentHealth > SPIKE_ARMOR_HP_THRESHOLD && totalDamageToReflect > 0) this.applySpikeArmorDamage(totalDamageToReflect);
    this.removeAttackModifiers();
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_arget: Hero | Crystal): void {}
}