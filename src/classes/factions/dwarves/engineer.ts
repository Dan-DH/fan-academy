import { EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { Crystal } from "../../board/crystal";
import { attackAnimation, flashActingUnit, turnIfBehind } from "../../../utils/unitAnimations";
import { Hero } from "../hero";
import { Dwarf } from "./dwarves";
import { isKoUnitOnEnemySpawn, isPhantomAndKO } from "../../../utils/gameUtils";
import { SPIKE_ARMOR_HP_THRESHOLD } from "../../../utils/boardUtils";

export class Engineer extends Dwarf {
  constructor(data: IHero) {
    super(data);
  }

  attack(target: Hero | Crystal): void {
    attackAnimation(this);
    turnIfBehind(this.context, this, target);
    // this.scene.sound.play(EGameSounds.ENGINEER_ATTACK);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (isKoUnitOnEnemySpawn(target)) {
      target.getsStompedOrDestroyed();
    } else {
      const damageDealt = target.getsDamaged({
        damage: this.getTotalPower(),
        attackType: this.stats.attackType,
        attacker: this
      });

      this.removeAttackModifiers();
      if (this.stats.currentHealth > SPIKE_ARMOR_HP_THRESHOLD) this.checkForDamageToReflect(target, damageDealt);
    }

    if (isPhantomAndKO(target)) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  shieldAlly(target: Hero | Crystal): void {
    flashActingUnit(this);
    turnIfBehind(this.context, this, target);
    // this.scene.sound.play(EGameSounds.ENGINEER_SHIELD_CAST);

    if (this.stats.shieldingAlly) {
      if (this.stats.shieldingAlly === target.stats.unitId) return;
      this.context.board!.removeEngineerShield(this.stats.shieldingAlly);
    }

    target.receiveEngineerShield();
    this.stats.shieldingAlly = target.stats.unitId;
    this.context.afterAction(EActionType.BUFF, this.stats.boardPosition, target.stats.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
}
