import { EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { getDistanceToTarget, SPIKE_ARMOR_HP_THRESHOLD } from "../../../utils/boardUtils";
import { getGridDistance, isKoUnitOnEnemySpawn, isPhantomAndKO } from "../../../utils/gameUtils";
import { attackAnimation, flashActingUnit, turnIfBehind } from "../../../utils/unitAnimations";
import { Crystal } from "../../board/crystal";
import { Hero } from "../hero";
import { Tribe } from "./tribe";

export class Shaman extends Tribe {
  constructor(data: IHero) {
    super(data);
  }

  attack(target: Hero | Crystal): void {
    attackAnimation(this);
    turnIfBehind(this.context, this, target);
    const distance = getDistanceToTarget(this, target);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (distance === 1 && isKoUnitOnEnemySpawn(target)) {
      // this.scene.sound.play(EGameSounds.ARCHER_ATTACK_MELEE); // FIXME: add audio bits
      target.getsStompedOrDestroyed(this);
    } else {
      // this.scene.sound.play(EGameSounds.ARCHER_ATTACK_MELEE);
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

  async heal(target: Hero): Promise<void> {
    flashActingUnit(this);
    turnIfBehind(this.context, this, target);
    // if (!this.stats.superCharge) this.scene.sound.play(EGameSounds.HEAL);
    // if (this.stats.superCharge) this.scene.sound.play(EGameSounds.HEAL_EXTRA);

    // First target
    await this.applyHealing(target, 2, 0.5);
    // Second target
    const secondTarget = this.getNextTarget(target);
    if (secondTarget) await this.applyHealing(secondTarget, 1, 0.25);

    let thirdTarget: Hero | undefined = undefined;
    if (secondTarget) thirdTarget = this.getNextTarget(secondTarget);
    if (thirdTarget) await this.applyHealing(thirdTarget, 0.5, 0.125);

    this.removeAttackModifiers();

    this.context.afterAction(EActionType.HEAL, this.stats.boardPosition, target.stats.boardPosition);
  };

  private async applyHealing(unit: Hero, healingModifier: number, reviveModifier: number): Promise<void> {
    await new Promise(resolve => this.context.time.delayedCall(100, resolve));
    const healingAmount = this.getTotalHealing(unit.stats.isKO ? reviveModifier : healingModifier);
    unit.getsHealed(healingAmount);
  }

  getNextTarget(target: Hero): Hero | undefined {
    const board = this.context.board!;
    const healDirection = board.getAttackDirection(this.stats.boardPosition, target.stats.boardPosition);
    const unitsToRate = board.units.filter((u): u is Hero => {
      if (u instanceof Crystal || u.stats.belongsTo !== this.stats.belongsTo || u === this) return false; // BEWARE: this won't work if u references a different instance of the Hero, but it shouldn't be the case.

      const distance = getGridDistance(target.stats.row, target.stats.col, u.stats.row, u.stats.col);

      return distance > 0 && distance <= 2;
    });

    let maxScore = -1;
    let bestTarget = undefined;
    unitsToRate?.forEach(u => {
      let score = 0;

      /**
       *  An unit gets points for:
       *    -being KO or hurt (max priority)
       *    -being orthogonally adjacent to the target
       *    -being in the general direction of the heal
       *  */
      if (u.stats.isKO) {
        score += 50;
      } else if (u.stats.currentHealth < u.stats.maxHealth) {
        score += 30;
      }

      if (board.isOrthogonalAdjacent(target, u)) maxScore += 10;

      const directionFromTargetToUnit = board.getAttackDirection(target.stats.boardPosition, u.stats.boardPosition);

      if (this.getGeneralDirections(healDirection).includes(directionFromTargetToUnit)) maxScore += 5;

      // console.log('UNIT', u.stats.unitId, score);
      if (score > maxScore) {
        maxScore = score;
        bestTarget = u;
      }
    });

    return bestTarget;
  };

  private getGeneralDirections(direction: number): number[] {
    switch (direction) {
      case 1: return [2, 8];
      case 2: return [[1, 8], [ 3, 4]].flat();
      case 3: return [2, 4];
      case 4: return [[2, 3], [5, 6]].flat();
      case 5: return [4, 6];
      case 6: return [[4, 5], [7, 8]].flat();
      case 7: return [6, 8];
      case 8: return [[1, 2], [6, 7]].flat();
      default: return [];
    }
  }

  checkForValidShamanHealingPath(target: Hero): boolean {
    const secondTarget = this.getNextTarget(target);
    let thirdTarget = undefined;
    if (secondTarget) thirdTarget = this.getNextTarget(secondTarget);

    if (!secondTarget && !thirdTarget) return false;
    if (secondTarget?.isFullHP() && thirdTarget?.isFullHP()) return false;
    return true;
  };

  teleport(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {};
}