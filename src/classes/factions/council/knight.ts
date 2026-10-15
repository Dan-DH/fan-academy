import { EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { Hero } from "../hero";
import { Council } from "./council";
import { Crystal } from "../../board/crystal";
import { attackAnimation, turnIfBehind } from "../../../utils/unitAnimations";
import { isKoUnitOnEnemySpawn, isPhantomAndKO } from "../../../utils/gameUtils";

export class Knight extends Council {
  constructor(data: IHero) {
    super(data);
  }

  async attack(target: Hero | Crystal): Promise<void> {
    attackAnimation(this);

    turnIfBehind(this.context, this, target);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (isKoUnitOnEnemySpawn(target)) {
      // this.scene.sound.play(EGameSounds.KNIGHT_ATTACK);
      target.removeFromGame();
    } else {
      // if (this.stats.superCharge) this.scene.sound.play(EGameSounds.KNIGHT_ATTACK_BIG);
      // if (!this.stats.superCharge)this.scene.sound.play(EGameSounds.ARCHER_ATTACK_MELEE);

      target.getsDamaged({
        damage: this.getTotalPower(),
        attackType: this.stats.attackType,
        attacker: this
      });

      if (target instanceof Hero && target.stats.unitType !== EHeroes.PHANTOM) this.context.board!.pushEnemy({
        row: this.stats.row,
        col: this.stats.col
      }, target);

      this.removeAttackModifiers();
    }

    if (isPhantomAndKO(target)) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {}
}