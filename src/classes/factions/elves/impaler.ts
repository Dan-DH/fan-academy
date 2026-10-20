import { EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { Hero } from "../hero";
import { DarkElf } from "./elves";
import { Crystal } from "../../board/crystal";
import { getDistanceToTarget, SPIKE_ARMOR_HP_THRESHOLD } from "../../../utils/boardUtils";
import { attackAnimation, turnIfBehind } from "../../../utils/unitAnimations";
import { StatusEffects } from "../../../utils/statuses";
import { isKoUnitOnEnemySpawn, isPhantomAndKO } from "../../../utils/gameUtils";

export class Impaler extends DarkElf {
  constructor(data: IHero) {
    super(data);
  }

  async attack(target: Hero | Crystal): Promise<void> {
    attackAnimation(this);
    turnIfBehind(this.context, this, target); // Ensure turnIfBehind is imported/defined

    const distance = getDistanceToTarget(this, target);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (distance === 1 && isKoUnitOnEnemySpawn(target)) {
      // this.scene.sound.play(EGameSounds.IMPALER_ATTACK_MELEE);
      target.getsStompedOrDestroyed();
    } else {
      if (this.status.has(StatusEffects.SUPER_CHARGE)) {
        // this.scene.sound.play(EGameSounds.IMPALER_ATTACK_BIG);
      } else {
        // if (distance === 1) this.scene.sound.play(EGameSounds.IMPALER_ATTACK_MELEE);
        // if (distance !== 1) this.scene.sound.play(EGameSounds.IMPALER_ATTACK);
      }
      const damageDealt = target.getsDamaged({
        damage: this.getTotalPower(),
        attackType: this.stats.attackType,
        attacker: this
      });

      if (damageDealt) this.lifeSteal(damageDealt);
      if (this.stats.currentHealth > SPIKE_ARMOR_HP_THRESHOLD) this.checkForDamageReflected(target, damageDealt);
      this.removeAttackModifiers();
    }

    if (target instanceof Hero && target.stats.unitType !== EHeroes.PHANTOM) this.context.board!.displaceUnit({
      attackerCoords: {
        row: this.stats.row,
        col: this.stats.col
      },
      target,
      isPush: false
    });
    if (isPhantomAndKO(target)) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {}
}