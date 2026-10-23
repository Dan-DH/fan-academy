import { EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { getDistanceToTarget, SPIKE_ARMOR_HP_THRESHOLD } from "../../../utils/boardUtils";
import { isKoUnitOnEnemySpawn, isPhantomAndKO } from "../../../utils/gameUtils";
import { StatusEffects } from "../../../utils/statuses";
import { addWhirlwindTween, attackAnimation, turnIfBehind } from "../../../utils/unitAnimations";
import { Crystal } from "../../board/crystal";
import { Tile } from "../../board/tile";
import { Hero } from "../hero";
import { Tribe } from "./tribe";

export class Chieftain extends Tribe {
  constructor(data: IHero) {
    super(data);
  }

  async attack(target: Hero | Crystal): Promise<void> {
    attackAnimation(this);
    const distance = getDistanceToTarget(this, target);

    let damageToReflect = 0;
    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (distance === 1) {
      if (isKoUnitOnEnemySpawn(target)) {
        turnIfBehind(this.context, this, target);
        target.getsStompedOrDestroyed(this);
      } else {
        turnIfBehind(this.context, this, target);
        damageToReflect += await this.whirlwind(target);
        this.removeAttackModifiers();
      }
    } else {
      damageToReflect += await this.charge(target);
      this.removeAttackModifiers();
    }

    if (this.stats.currentHealth > SPIKE_ARMOR_HP_THRESHOLD) this.checkForDamageToReflect(target, damageToReflect);
    if (isPhantomAndKO(target)) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  whirlwind(target: Hero | Crystal): number {
    // this.scene.sound.play(EGameSounds.ARCHER_ATTACK_MELEE); // FIXME: add audio bits
    addWhirlwindTween(this.visuals.characterImage);
    let totalDamageToReflect = 0;

    const damageDealt = target.getsDamaged({
      damage: this.getTotalPower(),
      attackType: this.stats.attackType,
      attacker: this
    });
    if (target.status.has(StatusEffects.SPIKE_ARMOR)) totalDamageToReflect += damageDealt;

    const adjacentUnits = this.context.board!.getAliveAdjacentFriendlyUnitsOnBoard(target);
    adjacentUnits.forEach(u => {
      const damageDealt = u.getsDamaged({
        damage: this.getTotalPower(0.66),
        attackType: this.stats.attackType,
        attacker: this
      });

      if (u instanceof Hero && u.status.has(StatusEffects.SPIKE_ARMOR)) totalDamageToReflect += damageDealt;
    });

    this.pullUnitsCloser();

    return totalDamageToReflect;
  }

  charge(target: Hero | Crystal): number {
    // this.scene.sound.play(EGameSounds.ARCHER_ATTACK_MELEE);
    this.move(this.getLandingTile(target), true);
    turnIfBehind(this.context, this, target);

    return target.getsDamaged({
      damage: this.getTotalPower(),
      attackType: this.stats.attackType,
      attacker: this
    });
  }

  private getLandingTile(target: Hero | Crystal): Tile {
    const landingBoardPosition = target.stats.boardPosition + (target.stats.col > this.stats.col ? -1 : 1);
    return this.context.board!.getTileFromBoardPosition(landingBoardPosition);
  }

  private pullUnitsCloser(): void {
    const board = this.context.board!;
    const thisRow = this.stats.row;
    const thisCol = this.stats.col;

    // Diagonal check
    const diagonalRows = [-1,  1];
    for (const r of diagonalRows) {
      const colArray = [-1, 1];
      for (const c of colArray) {
        const isOccupied = board.units.find(u => u.stats.row === thisRow + r && u.stats.col === thisCol + c);
        if (isOccupied) return;

        const newRow = thisRow + (r < 0 ? -2 : 2);
        const newCol = thisCol + (c < 0 ? -2 : 2);
        const unitToMove = board.units.find((u): u is Hero => u instanceof Hero && u.stats.belongsTo !== this.stats.belongsTo && u.stats.row === newRow && u.stats.col === newCol);
        if (unitToMove) {
          board.displaceUnit({
            attackerCoords: {
              row: this.stats.row,
              col: this.stats.col
            },
            target: unitToMove,
            isPush: false
          });
        }
      };
    };

    // Orthogonal check
    const myArrayCols = [ -2, 2 ];
    const myArrayRows = [ -2,  2];
    for (const c of myArrayCols) {
      const row = [1, 0, -1];
      for (let i = 0; i <= row.length - 1; i++) {
        const r = row[i];
        const matchingUnit = board.units.find((u): u is Hero => u instanceof Hero && u.stats.belongsTo !== this.stats.belongsTo && u.stats.row === thisRow + r && u.stats.col === thisCol + c);
        if (matchingUnit) {
          board.displaceUnit({
            attackerCoords: {
              row: thisRow,
              col: thisCol
            },
            target: matchingUnit,
            isPush: false
          });
          break;
        }
      }
    };

    for (const r of myArrayRows) {
      const col = [-1, 0, 1];
      for (let i = 0; i <= col.length - 1; i++) {
        const c = col[i];
        const matchingUnit = board.units.find((u): u is Hero => u instanceof Hero && u.stats.belongsTo !== this.stats.belongsTo && u.stats.col === thisCol + c && u.stats.row === thisRow + r);
        if (matchingUnit) {
          board.displaceUnit({
            attackerCoords: {
              row: this.stats.row,
              col: this.stats.col
            },
            target: matchingUnit,
            isPush: false
          });
          break;
        }
      }
    };
  }

  heal(_target: Hero): void {}
  teleport(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {};
}