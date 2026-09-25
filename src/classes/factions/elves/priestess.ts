import { EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { Hero } from "../hero";
import { DarkElf } from "./elves";
import { Crystal } from "../../board/crystal";
import { getDistanceToTarget, isEnemySpawn } from "../../../utils/boardUtils";
import { addPriestessDebuffTween, attackAnimation, flashActingUnit, turnIfBehind } from "../../../utils/unitAnimations";
import { StatusEffects } from "../../../utils/statuses";

export class Priestess extends DarkElf {
  constructor(data: IHero) {
    super(data);
  }

  attack(target: Hero | Crystal): void {
    attackAnimation(this);
    turnIfBehind(this.context, this, target);

    const distance = getDistanceToTarget(this, target);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (
      distance === 1 &&
      target instanceof Hero &&
      target.stats.isKO &&
      isEnemySpawn(this.context, target.getTile())
    ) {
      // this.scene.sound.play(EGameSounds.PRIESTESS_ATTACK);
      target.removeFromGame();
    } else {
      // this.scene.sound.play(EGameSounds.PRIESTESS_ATTACK);

      const isTargetShielded = target.status.has(StatusEffects.ENGINEER_SHIELD);
      const damageDone = target.getsDamaged(this.getTotalPower(), this.stats.attackType, this);
      if (damageDone) this.lifeSteal(damageDone);

      // Apply a 50% debuff to the target's next attack or heal
      if (target instanceof Hero && !isTargetShielded) {
        target.status.add(StatusEffects.PRIESTESS_DEBUFF);
        addPriestessDebuffTween(target.visuals.priestessDebuffImage);
        target.unitCard.updateCardData(target);
      }

      this.removeAttackModifiers();
    }

    if (target && target instanceof Hero && target.stats.isKO && target.stats.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  async heal(target: Hero): Promise<void> {
    flashActingUnit(this);
    turnIfBehind(this.context, this, target);

    // if (!this.stats.superCharge) this.scene.sound.play(EGameSounds.HEAL);
    // if (this.stats.superCharge) this.scene.sound.play(EGameSounds.HEAL_EXTRA);

    if (target.stats.isKO) {
      const healingAmount = this.getTotalHealing(0.5);
      target.getsHealed(healingAmount);
    } else {
      const healingAmount = this.getTotalHealing(2);
      target.getsHealed(healingAmount);
    }

    this.removeAttackModifiers();

    this.context.afterAction(EActionType.HEAL, this.stats.boardPosition, target.stats.boardPosition);
  };

  teleport(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {}
}