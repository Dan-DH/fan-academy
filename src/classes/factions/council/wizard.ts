import { EGameSounds, EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";

import { Hero } from "../hero";
import { Tile } from "../../board/tile";
import { Council } from "./council";
import { Board } from "../../board/board";
import { Crystal } from "../../board/crystal";
import { getDistanceToTarget, isEnemySpawn } from "../../../utils/boardUtils";
import { playSound } from "../../../utils/gameSounds";
import { isOnBoard, canBeAttacked } from "../../../utils/gameUtils";
import { attackAnimation, turnIfBehind } from "../../../utils/unitAnimations";

export class Wizard extends Council {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(target: Hero | Crystal): void {
    attackAnimation(this);

    const gameController = this.context.gameController!;
    turnIfBehind(this.context, this, target);

    const distance = getDistanceToTarget(this, target);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (
      distance === 1 &&
      target instanceof Hero &&
      target.stats.isKO &&
      isEnemySpawn(this.context, target.getTile())
    ) {
      playSound(this.scene, EGameSounds.WIZARD_ATTACK);
      target.removeFromGame();
    } else {
      if (this.stats.superCharge) playSound(this.scene, EGameSounds.WIZARD_ATTACK_BIG);
      if (!this.stats.superCharge) playSound(this.scene, EGameSounds.WIZARD_ATTACK);

      // Get directions for finding out the next targets
      const attackDirection = gameController.board.getAttackDirection(this.stats.boardPosition, target.stats.boardPosition);

      // Collect all targets
      const secondTarget = this.getNextTarget(target, attackDirection, gameController.board, false);
      let thirdTarget: Hero | Crystal | undefined;
      if (secondTarget) thirdTarget = this.getNextTarget(secondTarget, attackDirection, gameController.board, true, [target.stats.boardPosition, secondTarget.stats.boardPosition]);

      // Apply damage to targets
      target.getsDamaged(this.getTotalPower(), this.stats.attackType, this);
      if (secondTarget) secondTarget.getsDamaged(this.getTotalPower() * 0.75, this.stats.attackType, this);
      if (thirdTarget) thirdTarget.getsDamaged(this.getTotalPower() * 0.56, this.stats.attackType, this);

      if (target && target instanceof Hero && target.stats.isKO && target.stats.unitType === EHeroes.PHANTOM) target.removeFromGame();
      if (secondTarget && secondTarget instanceof Hero && secondTarget.stats.isKO && secondTarget.stats.unitType === EHeroes.PHANTOM) secondTarget.removeFromGame();
      if (thirdTarget && thirdTarget instanceof Hero && thirdTarget.stats.isKO && thirdTarget.stats.unitType === EHeroes.PHANTOM) thirdTarget.removeFromGame();

      this.removeAttackModifiers();
    }

    this.context.gameController!.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  getNextTarget(target: Hero | Crystal, attackDirection: number, board: Board, isLastTarget: boolean, toIgnore?: number[]): Hero | Crystal | undefined {
    const positionsToIgnore = toIgnore ? toIgnore : [target.stats.boardPosition];
    const adjacentEnemies = this.getAdjacentEnemyTiles(target.stats.boardPosition, positionsToIgnore);

    let maxScore = -1;
    let bestTarget: Tile | undefined;

    for (const enemyTile of adjacentEnemies) {
      const enemyTileDirection = board.getAttackDirection(target.stats.boardPosition, enemyTile.boardPosition);

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
        const enemyHasAdjacentEnemies = this.getAdjacentEnemyTiles(enemyTile.boardPosition, [...positionsToIgnore, enemyTile.boardPosition]);
        console.log('adjacent enemies', enemyHasAdjacentEnemies);
        if (enemyHasAdjacentEnemies.length) {
          score += 2.5;
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestTarget = enemyTile;
      }

      // if (maxScore === 6) break;
    }

    if (!bestTarget) {
      console.log("getNextTarget() No suitable adjacent target found.");
      return undefined;
    }

    if (bestTarget.hero) {
      const hero = board.units.find(unit => unit.stats.unitId === bestTarget.hero!.unitId);
      if (hero) return hero;
    }

    if (bestTarget.crystal) {
      const crystal = board.crystals.find(c => c.stats.boardPosition === bestTarget.crystal!.boardPosition);
      if (crystal) return crystal;
    }

    throw new Error("getNextTarget() Target found on tile, but not in board units or crystals");
  }

  getAdjacentEnemyTiles(boardPosition: number, ignorePosition: number[] = []): Tile[] {
    const adjacentOffsets = [-10, -9, -8, -1, +1, +8, +9, +10];
    const leftOffset = [-10, -1, +8];
    const rightOffset = [+10, +1, -8];
    const adjacentTiles: Tile[] = [];
    const boardWidth = 9;

    const isOnLeftEdge = boardPosition % boardWidth === 0;
    const isOnRightEdge = (boardPosition + 1) % boardWidth === 0;

    for (const offset of adjacentOffsets) {
      if (isOnLeftEdge && leftOffset.includes(offset) ||
          isOnRightEdge && rightOffset.includes(offset)) continue;

      const tilePosition = boardPosition + offset;

      if (isOnBoard(tilePosition) && !ignorePosition.includes(tilePosition)) {
        const tile = this.context.gameController!.board.getTileFromBoardPosition(tilePosition);
        if (canBeAttacked(this, tile)) adjacentTiles.push(tile);
      }
    }
    return adjacentTiles;
  }

  // private getGeneralDirections(direction: number): number[] {
  //   switch (direction) {
  //     case 1: return [1, 2, 8];
  //     case 2: return [[1, 2, 8], [2, 3, 4]].flat();
  //     case 3: return [2, 3, 4];
  //     case 4: return [[2, 3, 4], [4, 5, 6]].flat();
  //     case 5: return [4, 5, 6];
  //     case 6: return [[4, 5, 6], [6, 7, 8]].flat();
  //     case 7: return [6, 7, 8];
  //     case 8: return [[1, 2, 8], [6, 7, 8]].flat();
  //     default: return [];
  //   }
  // }

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