import { EGameSounds, EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { turnIfBehind, isEnemySpawn, playSound, isOnBoard, canBeAttacked } from "../../../utils/gameUtils";

import { Hero } from "../hero";
import { Tile } from "../../board/tile";
import { Council } from "./council";
import { Board } from "../../board/board";
import { Crystal } from "../../board/crystal";

export class Wizard extends Council {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(target: Hero | Crystal): void {
    this.flashActingUnit();

    const gameController = this.context.gameController!;
    turnIfBehind(this.context, this, target);

    const distance = this.getDistanceToTarget(target);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (
      distance === 1 &&
      target instanceof Hero &&
      target.isKO &&
      isEnemySpawn(this.context, target.getTile())
    ) {
      playSound(this.scene, EGameSounds.WIZARD_ATTACK);
      target.removeFromGame();
    } else {
      if (this.superCharge) playSound(this.scene, EGameSounds.WIZARD_ATTACK_BIG);
      if (!this.superCharge) playSound(this.scene, EGameSounds.WIZARD_ATTACK);

      // Get directions for finding out the next targets
      const attackDirection = gameController.board.getAttackDirection(this.boardPosition, target.boardPosition);
      const opponentDirection = this.belongsTo === 1 ? [2, 3, 4] : [6, 7, 8];

      // Collect all targets
      const secondTarget = this.getNextTarget(target, attackDirection, opponentDirection, gameController.board, false);
      let thirdTarget: Hero | Crystal | undefined;
      if (secondTarget) thirdTarget = this.getNextTarget(secondTarget, attackDirection, opponentDirection, gameController.board, false, [target.boardPosition, secondTarget.boardPosition]);

      // Apply damage to targets
      target.getsDamaged(this.getTotalPower(), this.attackType, this);
      if (secondTarget) secondTarget.getsDamaged(this.getTotalPower() * 0.75, this.attackType, this);
      if (thirdTarget) thirdTarget.getsDamaged(this.getTotalPower() * 0.56, this.attackType, this);

      if (target && target instanceof Hero && target.isKO && target.unitType === EHeroes.PHANTOM) target.removeFromGame();
      if (secondTarget && secondTarget instanceof Hero && secondTarget.isKO && secondTarget.unitType === EHeroes.PHANTOM) secondTarget.removeFromGame();
      if (thirdTarget && thirdTarget instanceof Hero && thirdTarget.isKO && thirdTarget.unitType === EHeroes.PHANTOM) thirdTarget.removeFromGame();

      this.removeAttackModifiers();
    }

    this.context.gameController!.afterAction(EActionType.ATTACK, this.boardPosition, target.boardPosition);
  }

  getNextTarget(target: Hero | Crystal, attackDirection: number, opponentDirection: number[], board: Board, isLastTarget: boolean, toIgnore?: number[]): Hero | Crystal | undefined {
    const positionsToIgnore = toIgnore ? toIgnore : [target.boardPosition];
    const adjacentEnemies = this.getAdjacentEnemyTiles(target.boardPosition, positionsToIgnore);

    let maxScore = -1;
    let bestTarget: Tile | undefined;

    for (const enemyTile of adjacentEnemies) {
      const enemyTileDirection = board.getAttackDirection(target.boardPosition, enemyTile.boardPosition);

      let score = 0;

      /**
       *  An enemy unit gets points for:
       *    -being in the same direction of the attack
       *    -being in the general direction of the attack
       *    -being in the direction of the opponent's side of the board
       *    -being in an orthogonal direction (tie breaker)
       *    -having an adjacent enemy unit (the attack prioritizes number of target versus direction)
       *  */
      if (enemyTileDirection === attackDirection) score += 2;
      if (this.getGeneralDirections(attackDirection).includes(enemyTileDirection)) score += 1.5;
      if (opponentDirection.includes(enemyTileDirection)) score += 1;
      if ([1, 3, 5, 7].includes(enemyTileDirection)) score += 1;

      if (!isLastTarget) {
        const enemyHasAdjacentEnemies = this.getAdjacentEnemyTiles(enemyTile.boardPosition, [enemyTile.boardPosition]);
        if (enemyHasAdjacentEnemies.length) {
          score += 1.5;
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestTarget = enemyTile;
      }

      if (maxScore === 6) break;
    }

    if (!bestTarget) {
      console.log("getNextTarget() No suitable adjacent target found.");
      return undefined;
    }

    if (bestTarget.hero) {
      const hero = board.units.find(unit => unit.unitId === bestTarget.hero!.unitId);
      if (hero) return hero;
    }

    if (bestTarget.crystal) {
      const crystal = board.crystals.find(c => c.boardPosition === bestTarget.crystal!.boardPosition);
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

  private getGeneralDirections(direction: number): number[] {
    switch (direction) {
      case 1: return [1, 2, 8];
      case 2: return [[1, 2, 8], [2, 3, 4]].flat();
      case 3: return [2, 3, 4];
      case 4: return [[2, 3, 4], [4, 5, 6]].flat();
      case 5: return [4, 5, 6];
      case 6: return [[4, 5, 6], [6, 7, 8]].flat();
      case 7: return [6, 7, 8];
      case 8: return [[1, 2, 8], [6, 7, 8]].flat();
      default: return [];
    }
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
}