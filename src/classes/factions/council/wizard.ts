import { EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";

import { Hero } from "../hero";
import { Council } from "./council";
import { Board } from "../../board/board";
import { Crystal } from "../../board/crystal";
import { getDistanceToTarget, SPIKE_ARMOR_HP_THRESHOLD } from "../../../utils/boardUtils";
import { isOnBoard, canBeAttacked, isKoUnitOnEnemySpawn, isPhantomAndKO } from "../../../utils/gameUtils";
import { attackAnimation, turnIfBehind } from "../../../utils/unitAnimations";

export class Wizard extends Council {
  constructor(data: IHero) {
    super(data);
  }

  attack(target: Hero | Crystal): void {
    attackAnimation(this);

    turnIfBehind(this.context, this, target);

    const distance = getDistanceToTarget(this, target);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (distance === 1 && isKoUnitOnEnemySpawn(target)) {
      // this.scene.sound.play(EGameSounds.WIZARD_ATTACK);
      target.getsStompedOrDestroyed();
    } else {
      // if (this.stats.superCharge) this.scene.sound.play(EGameSounds.WIZARD_ATTACK_BIG);
      // if (!this.stats.superCharge) this.scene.sound.play(EGameSounds.WIZARD_ATTACK);

      const attackDirection = this.context.board!.getAttackDirection(this.stats.boardPosition, target.stats.boardPosition);

      // First target
      const damageDealt = target.getsDamaged({
        damage: this.getTotalPower(),
        attackType: this.stats.attackType,
        attacker: this
      });
      if (this.stats.currentHealth > SPIKE_ARMOR_HP_THRESHOLD) this.checkForDamageReflected(target, damageDealt);
      if (isPhantomAndKO(target)) target.removeFromGame();

      // Second target
      const secondTarget = this.getNextTarget(target, attackDirection, this.context.board!, false);
      if (secondTarget) {
        const damageDealt = secondTarget.getsDamaged({
          damage: this.getTotalPower() * 0.75,
          attackType: this.stats.attackType,
          attacker: this,
          splashDamage: 0.75
        });
        if (this.stats.currentHealth > SPIKE_ARMOR_HP_THRESHOLD) this.checkForDamageReflected(secondTarget, damageDealt);
        if (isPhantomAndKO(secondTarget)) secondTarget.removeFromGame();
      }

      // Third target
      let thirdTarget: Hero | Crystal | undefined;
      if (secondTarget) thirdTarget = this.getNextTarget(secondTarget, attackDirection, this.context.board!, true, [target.stats.boardPosition, secondTarget.stats.boardPosition]);
      if (thirdTarget) {
        const damageDealt = thirdTarget.getsDamaged({
          damage: this.getTotalPower() * 0.56,
          attackType: this.stats.attackType,
          attacker: this,
          splashDamage: 0.56
        });
        if (this.stats.currentHealth > SPIKE_ARMOR_HP_THRESHOLD) this.checkForDamageReflected(thirdTarget, damageDealt);
        if (isPhantomAndKO(thirdTarget)) thirdTarget.removeFromGame();
      }

      this.removeAttackModifiers();
    }

    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  getNextTarget(target: Hero | Crystal, attackDirection: number, board: Board, isLastTarget: boolean, toIgnore?: number[]): Hero | Crystal | undefined {
    const positionsToIgnore = toIgnore ? toIgnore : [target.stats.boardPosition];
    const adjacentEnemies = this.getAdjacentEnemyTiles(target.stats.boardPosition, positionsToIgnore);

    let maxScore = -1;
    let bestTarget: Hero | Crystal | undefined;

    for (const enemy of adjacentEnemies) {
      const enemyTileDirection = board.getAttackDirection(target.stats.boardPosition, enemy.stats.boardPosition);

      let score = 0;

      /**
       *  An enemy unit gets points for:
       *    -being orthogonally adjacent to the target
       *    -being in the orthogonal direction of the attack
       *    -being in the diagonal direction of the attack
       *    -having an adjacent enemy unit (the attack prioritizes number of targets versus direction)
       *    -in case of tie, the attack goes towards the top of the board
       *  */
      if ([1, 3, 5, 7].includes(enemyTileDirection)) score += 3;
      if (enemyTileDirection === attackDirection) score += 3;
      if (this.getGeneralDirections(attackDirection).includes(enemyTileDirection)) score += 2.5;

      if (!isLastTarget) {
        const enemyHasAdjacentEnemies = this.getAdjacentEnemyTiles(enemy.stats.boardPosition, [...positionsToIgnore, enemy.stats.boardPosition]);
        if (enemyHasAdjacentEnemies.length) {
          score += 2.5;
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestTarget = enemy;
      }
    }

    if (!bestTarget) {
      console.log("getNextTarget() No suitable adjacent target found.");
      return undefined;
    }

    return board.units.find(u => u.stats.boardPosition === bestTarget?.stats.boardPosition);
  }

  getAdjacentEnemyTiles(boardPosition: number, ignorePosition: number[] = []): (Hero | Crystal)[] {
    const adjacentOffsets = [-10, -9, -8, -1, +1, +8, +9, +10];
    const leftOffset = [-10, -1, +8];
    const rightOffset = [+10, +1, -8];
    const adjacentEnemyHeroes: (Hero | Crystal)[] = [];
    const boardWidth = 9;

    const isOnLeftEdge = boardPosition % boardWidth === 0;
    const isOnRightEdge = (boardPosition + 1) % boardWidth === 0;

    for (const offset of adjacentOffsets) {
      if (isOnLeftEdge && leftOffset.includes(offset) ||
          isOnRightEdge && rightOffset.includes(offset)) continue;

      const tilePosition = boardPosition + offset;

      if (isOnBoard(tilePosition) && !ignorePosition.includes(tilePosition)) {
        const matchedUnit = this.context.board!.units.find(u => u.stats.belongsTo !== this.stats.belongsTo && u.stats.boardPosition === tilePosition);
        if (matchedUnit && canBeAttacked(this, matchedUnit)) adjacentEnemyHeroes.push(matchedUnit);
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
  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {}
}