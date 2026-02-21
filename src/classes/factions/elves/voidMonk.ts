import { EGameSounds, EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { Hero } from "../hero";
import { Tile } from "../../board/tile";
import { DarkElf } from "./elves";
import { Crystal } from "../../board/crystal";
import { isEnemySpawn } from "../../../utils/boardUtils";
import { playSound } from "../../../utils/gameSounds";
import { isOnBoard, canBeAttacked } from "../../../utils/gameUtils";
import { turnIfBehind } from "../../../utils/unitAnimations";

export class VoidMonk extends DarkElf {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(target: Hero | Crystal): void {
    this.flashActingUnit();
    turnIfBehind(this.context, this, target);

    const splashedEnemies: (Hero | Crystal)[] = [];

    if (this.superCharge) playSound(this.scene, EGameSounds.VOIDMONK_ATTACK_BIG);
    if (!this.superCharge) playSound(this.scene, EGameSounds.VOIDMONK_ATTACK);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (
      target instanceof Hero &&
      target.isKO &&
      isEnemySpawn(this.context, target.getTile())
    ) {
      target.removeFromGame();
    } else {
      const board = this.context.gameController!.board;

      // Get the direction of the attack and offset tiles
      const attackDirection = board.getAttackDirection(this.boardPosition, target.boardPosition);

      const offsetTiles = this.getOffsetTiles(target.boardPosition, attackDirection);

      if (!offsetTiles.length) throw new Error(`voidMonk attack() No offsetTiles: ${this.boardPosition}, ${target.boardPosition}`);

      for (const offset of offsetTiles) {
        const tileBP = target.boardPosition + offset;
        if (!isOnBoard(tileBP)) continue;

        const tile = board.getTileFromBoardPosition(tileBP);
        if (!tile) throw new Error(`voidMonk attack() No tile found`);

        if (!canBeAttacked(this, tile)) continue;

        if (tile.hero) {
          const hero = board.units.find(unit => unit.unitId === tile.hero!.unitId);
          if (hero) splashedEnemies.push(hero);
        }

        if (tile.crystal) {
          const crystal = board.crystals.find(c => c.boardPosition === tile.crystal!.boardPosition);
          if (crystal) splashedEnemies.push(crystal);
        }
      };

      // Apply damage to targets
      let damageDone = 0;
      const unitDamage = target.getsDamaged(this.getTotalPower(), this.attackType, this);
      if (unitDamage) damageDone += unitDamage;
      if (splashedEnemies.length) {
        const splashDamage = this.getTotalPower() * 0.666;
        splashedEnemies.forEach(enemy => {
          const unitDamage = enemy.getsDamaged(splashDamage, this.attackType, this);
          if (unitDamage) damageDone += unitDamage;
        });
      }

      if (damageDone) this.lifeSteal(damageDone);

      this.removeAttackModifiers();
    }

    splashedEnemies.forEach(enemy => {
      if (enemy instanceof Hero && enemy.unitType === EHeroes.PHANTOM && enemy.isKO) enemy.removeFromGame(true);
    });

    if (target && target instanceof Hero && target.isKO && target.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.gameController!.afterAction(EActionType.ATTACK, this.boardPosition, target.boardPosition);
  }

  getOffsetTiles(targetBoardPosition: number, attackDirection: number): number[] {
    const boardWidth = 9;
    let offsets: number[];

    switch (attackDirection) {
      case 1: offsets = [-1, 1, -9];
        break;
      case 3: offsets = [-9, 1, 9];
        break;
      case 5: offsets = [-1, 1, 9];
        break;
      case 7: offsets = [-9, -1, 9];
        break;
      default: offsets = [];
        break;
    }

    const isTargetOnLeftEdge = targetBoardPosition % boardWidth === 0;
    const isTargetOnRightEdge = (targetBoardPosition + 1) % boardWidth === 0;
    const isTargetOnTopRow = targetBoardPosition < boardWidth;
    const isTargetOnBottomRow = targetBoardPosition >= 5 * boardWidth - boardWidth;

    return offsets.filter(offset => {
      // Check for horizontal wrap-around
      if (isTargetOnLeftEdge && offset === -1) return false;
      if (isTargetOnRightEdge && offset === 1) return false;

      // Check for vertical wrap-around
      if (isTargetOnTopRow && offset === -9) return false;
      if (isTargetOnBottomRow && offset === 9) return false;

      return true;
    });
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
}