import { EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { Hero } from "../hero";
import { DarkElf } from "./elves";
import { Crystal } from "../../board/crystal";
import { isOnBoard, canBeAttacked, isPhantomAndKO, isKoUnitOnEnemySpawn } from "../../../utils/gameUtils";
import { attackAnimation, turnIfBehind } from "../../../utils/unitAnimations";
import { StatusEffects } from "../../../utils/statuses";
import { SPIKE_ARMOR_HP_THRESHOLD } from "../../../utils/boardUtils";

export class VoidMonk extends DarkElf {
  constructor(data: IHero) {
    super(data);
  }

  attack(target: Hero | Crystal): void {
    attackAnimation(this);
    turnIfBehind(this.context, this, target);

    const splashedEnemies: (Hero | Crystal)[] = [];

    // if (this.stats.superCharge) this.scene.sound.play(EGameSounds.VOIDMONK_ATTACK_BIG);
    // if (!this.stats.superCharge) this.scene.sound.play(EGameSounds.VOIDMONK_ATTACK);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (isKoUnitOnEnemySpawn(target)) {
      target.getsStompedOrDestroyed(this);
    } else {
      const board = this.context.board!;

      // Get the direction of the attack and offset tiles
      const attackDirection = board.getAttackDirection(this.stats.boardPosition, target.stats.boardPosition);

      const offsetTiles = this.getOffsetTiles(target.stats.boardPosition, attackDirection);

      if (!offsetTiles.length) throw new Error(`voidMonk attack() No offsetTiles: ${this.stats.boardPosition}, ${target.stats.boardPosition}`);

      for (const offset of offsetTiles) {
        const tileBoardPosition = target.stats.boardPosition + offset;
        if (!isOnBoard(tileBoardPosition)) continue;

        const matchedEnemy = board.units.find(u => u.stats.boardPosition === tileBoardPosition && u.stats.belongsTo !== this.stats.belongsTo);
        if (matchedEnemy && canBeAttacked(this, matchedEnemy)) splashedEnemies.push(matchedEnemy);
      };

      // Apply damage to targets
      let lifeStealDamage = 0;
      let  totalDamageToReflect = 0;
      const unitDamage = target.getsDamaged({
        damage: this.getTotalPower(),
        attackType: this.stats.attackType,
        attacker: this
      });
      if (target instanceof Hero) lifeStealDamage += unitDamage;
      if (target.status.has(StatusEffects.SPIKE_ARMOR)) totalDamageToReflect += unitDamage;

      if (splashedEnemies.length) {
        const splashDamage = this.getTotalPower() * 0.666;
        splashedEnemies.forEach(enemy => {
          const unitDamage = enemy.getsDamaged({
            damage: splashDamage,
            attackType: this.stats.attackType,
            attacker: this,
            splashDamage: 0.666
          });
          if (enemy instanceof Hero) lifeStealDamage += unitDamage;
          if (enemy.status.has(StatusEffects.SPIKE_ARMOR)) totalDamageToReflect += unitDamage;
          if (isPhantomAndKO(enemy)) enemy.removeFromGame();
        });
      }

      if (lifeStealDamage) this.lifeSteal(lifeStealDamage);
      if (this.stats.currentHealth > SPIKE_ARMOR_HP_THRESHOLD && totalDamageToReflect > 0) this.applySpikeArmorDamage(totalDamageToReflect);
      this.removeAttackModifiers();
    }

    if (isPhantomAndKO(target)) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
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
  shieldAlly(_target: Hero | Crystal): void {}
}