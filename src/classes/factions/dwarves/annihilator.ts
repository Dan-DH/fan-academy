import { IHero } from "../../../interfaces/gameInterface";
import { Crystal } from "../../board/crystal";
import { Dwarf } from "./dwarves";
import { Hero } from "../hero";
import { EActionType } from "../../../enums/gameEnums";
import { getDistanceToTarget, SPIKE_ARMOR_HP_THRESHOLD } from "../../../utils/boardUtils";
import { attackAnimation, turnIfBehind } from "../../../utils/unitAnimations";
import { StatusEffects } from "../../../utils/statuses";
import { isKoUnitOnEnemySpawn, isPhantomAndKO } from "../../../utils/gameUtils";

export class Annihilator extends Dwarf {
  constructor(data: IHero) {
    super(data);
  }

  attack(target: Hero | Crystal): void {
    attackAnimation(this);
    turnIfBehind(this.context, this, target);

    const distance = getDistanceToTarget(this, target);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (distance === 1 && isKoUnitOnEnemySpawn(target)) {
      // this.scene.sound.play(EGameSounds.GRENADIER_ATTACK_MELEE);
      target.removeFromGame();
    } else {
      // this.scene.sound.play(EGameSounds.ANNIHILATOR_ATTACK);
      let totalDamageReflected = 0;
      const isTargetShielded = target.status.has(StatusEffects.ENGINEER_SHIELD);
      const damageDealt = target.getsDamaged({
        damage: this.getTotalPower(),
        attackType: this.stats.attackType,
        attacker: this
      });
      if (target.status.has(StatusEffects.SPIKE)) totalDamageReflected += damageDealt;

      if (!isTargetShielded && target.active) {
        target.status.add(StatusEffects.ANNIHILATOR_DEBUFF);
        target.visuals.playAnnihilatorDebuffAnimation();
        if (target instanceof Hero) target.unitCard.updateCardData(target);
        if (target instanceof Crystal) target.unitCard.updateCardData(target);
      }

      const adjacentFriendlyUnits = this.context.board!.getAliveAdjacentFriendlyUnitsOnBoard(target);

      if (adjacentFriendlyUnits.length) {
        adjacentFriendlyUnits.forEach(unit =>{
          const damageDealt = unit.getsDamaged({
            damage: this.getTotalPower(0.2),
            attackType: this.stats.attackType,
            attacker: this,
            splashDamage: 0.2
          });

          if (unit instanceof Hero) {
            if (!unit.stats.isKO) this.context.board!.pushEnemy({
              row: target.stats.row,
              col: target.stats.col
            }, unit, 360);
            if (unit.status.has(StatusEffects.SPIKE)) totalDamageReflected += damageDealt;
            if (isPhantomAndKO(unit)) unit.removeFromGame();
          }});
      }

      this.removeAttackModifiers();
      if (this.stats.currentHealth > SPIKE_ARMOR_HP_THRESHOLD && totalDamageReflected > 0) {
        this.getsDamaged({
          damage: totalDamageReflected,
          attackType: this.stats.attackType
        });
      }
    }

    if (isPhantomAndKO(target)) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_arget: Hero | Crystal): void {}
}
