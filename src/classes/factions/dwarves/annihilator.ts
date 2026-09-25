import { IHero } from "../../../interfaces/gameInterface";
import { Crystal } from "../../board/crystal";
import { Dwarf } from "./dwarves";
import { Hero } from "../hero";
import { EActionType, EHeroes } from "../../../enums/gameEnums";
import { getDistanceToTarget, isEnemySpawn } from "../../../utils/boardUtils";
import { attackAnimation, turnIfBehind } from "../../../utils/unitAnimations";
import { StatusEffects } from "../../../utils/statuses";

export class Annihilator extends Dwarf {
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
      // this.scene.sound.play(EGameSounds.GRENADIER_ATTACK_MELEE);
      target.removeFromGame();
    } else {
      // this.scene.sound.play(EGameSounds.ANNIHILATOR_ATTACK);

      const isTargetShielded = target.status.has(StatusEffects.ENGINEER_SHIELD);
      target.getsDamaged(this.getTotalPower(), this.stats.attackType, this);

      if (!isTargetShielded && target.active) {
        target.status.add(StatusEffects.ANNIHILATOR_DEBUFF);
        target.visuals.playAnnihilatorDebuffAnimation();
        if (target instanceof Hero) target.unitCard.updateCardData(target);
        if (target instanceof Crystal) target.unitCard.updateCardData(target);
      }

      const adjacentFriendlyUnits = this.context.board!.getAliveAdjacentFriendlyUnitsOnBoard(target);

      if (adjacentFriendlyUnits.length) {
        adjacentFriendlyUnits.forEach(unit =>{
          unit.getsDamaged(this.getTotalPower(0.2), this.stats.attackType, this, 0.2);
          if (unit instanceof Hero && !unit.stats.isKO) this.context.board!.pushEnemy(target, unit, 360);
          if (unit instanceof Hero && unit.stats.isKO && unit.stats.unitType === EHeroes.PHANTOM) unit.removeFromGame();
        });
      }

      this.removeAttackModifiers();
    }

    if (target && target instanceof Hero && target.stats.isKO && target.stats.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_arget: Hero | Crystal): void {}
}
