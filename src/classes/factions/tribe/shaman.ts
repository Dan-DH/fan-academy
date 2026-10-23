import { EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { getDistanceToTarget, SPIKE_ARMOR_HP_THRESHOLD } from "../../../utils/boardUtils";
import { isKoUnitOnEnemySpawn, isOnBoard, isPhantomAndKO } from "../../../utils/gameUtils";
import { attackAnimation, flashActingUnit, turnIfBehind } from "../../../utils/unitAnimations";
import { Board } from "../../board/board";
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

  heal(target: Hero): void {
    flashActingUnit(this);
    turnIfBehind(this.context, this, target);
    const healDirection = this.context.board!.getAttackDirection(this.stats.boardPosition, target.stats.boardPosition);

    // if (!this.stats.superCharge) this.scene.sound.play(EGameSounds.HEAL);
    // if (this.stats.superCharge) this.scene.sound.play(EGameSounds.HEAL_EXTRA);

    // First target
    this.applyHealing(target, 2, 0.5);
    // Second target
    const secondTarget = this.getNextTarget(target, healDirection, this.context.board!, false);
    if (secondTarget) this.applyHealing(secondTarget, 1, 0.25);

    let thirdTarget: Hero | undefined = undefined;
    if (secondTarget) thirdTarget = this.getNextTarget(secondTarget, healDirection, this.context.board!, true);
    if (thirdTarget) this.applyHealing(thirdTarget, 0.5, 0.125);

    this.removeAttackModifiers();

    this.context.afterAction(EActionType.HEAL, this.stats.boardPosition, target.stats.boardPosition);
  };

  private applyHealing(unit: Hero, healingModifier: number, reviveModifier: number): void {
    const healingAmount = this.getTotalHealing(unit.stats.isKO ? reviveModifier : healingModifier);
    unit.getsHealed(healingAmount);
  }

  private getNextTarget(target: Hero | Crystal, attackDirection: number, board: Board, isLastTarget: boolean): Hero | undefined {
    const positionsToIgnore = [this.stats.boardPosition];
    const adjacentFriendlies = this.getAdjacentFriendlyUnits(target.stats.boardPosition, positionsToIgnore);

    let maxScore = -1;
    let bestTarget: Hero | Crystal | undefined;

    for (const unit of adjacentFriendlies) {
      const friendlyTileDirection = board.getAttackDirection(target.stats.boardPosition, unit.stats.boardPosition);

      let score = 0;

      /**
       *  An unit gets points for:
       *    -being KO or hurt (max priority)
       *    -being orthogonally adjacent to the target
       *    -being in the orthogonal direction of the heal
       *    -being in the diagonal direction of the heal
       *    -having an adjacent friendly unit that's KO or hurt (high priority)
       *  */
      if (unit.stats.isKO) {
        score += 50;
      } else if (unit.stats.currentHealth < unit.stats.maxHealth) {
        score += 30;
      }
      if ([1, 3, 5, 7].includes(friendlyTileDirection)) score += 3;
      if (friendlyTileDirection === attackDirection) score += 3;
      if (this.getGeneralDirections(attackDirection).includes(friendlyTileDirection)) score += 2.5;

      if (!isLastTarget) {
        const enemyHasAdjacentFriendlies = this.getAdjacentFriendlyUnits(unit.stats.boardPosition, [...positionsToIgnore, unit.stats.boardPosition]);
        const adjacentKO = enemyHasAdjacentFriendlies.find(u => u.stats.isKO);
        if (adjacentKO) {
          score += 20;
        } else {
          const adjacentHurt = enemyHasAdjacentFriendlies.find(u => u.stats.currentHealth < u.stats.maxHealth);
          if (adjacentHurt) score += 10;
        }

        if (score > maxScore) {
          maxScore = score;
          bestTarget = unit;
        }
      }}

    if (!bestTarget) {
      console.log("getNextTarget() No suitable adjacent target found.");
      return undefined;
    }

    return board.units.find((u): u is Hero => u.stats.boardPosition === bestTarget?.stats.boardPosition);
  }

  getAdjacentFriendlyUnits(boardPosition: number, ignorePosition: number[] = []): Hero[] {
    const adjacentOffsets = [-10, -9, -8, -1, +1, +8, +9, +10];
    const leftOffset = [-10, -1, +8];
    const rightOffset = [+10, +1, -8];
    const adjacentEnemyHeroes: Hero[] = [];
    const boardWidth = 9;

    const isOnLeftEdge = boardPosition % boardWidth === 0;
    const isOnRightEdge = (boardPosition + 1) % boardWidth === 0;

    for (const offset of adjacentOffsets) {
      if (isOnLeftEdge && leftOffset.includes(offset) ||
          isOnRightEdge && rightOffset.includes(offset)) continue;

      const tilePosition = boardPosition + offset;

      if (isOnBoard(tilePosition) && !ignorePosition.includes(tilePosition)) {
        const matchedUnit = this.context.board!.units.find((u): u is Hero => u instanceof Hero && u.stats.belongsTo === this.stats.belongsTo && u.stats.boardPosition === tilePosition);
        if (matchedUnit) adjacentEnemyHeroes.push(matchedUnit);
      }
    }
    return adjacentEnemyHeroes;
  }

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

  teleport(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {};
}