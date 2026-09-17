import { EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { Hero } from "../hero";
import { DarkElf } from "./elves";
import { Crystal } from "../../board/crystal";
import { getDistanceToTarget, isEnemySpawn } from "../../../utils/boardUtils";
import { attackAnimation, turnIfBehind } from "../../../utils/unitAnimations";
import { StatusEffects } from "../../../utils/statuses";

export class Impaler extends DarkElf {
  constructor(data: IHero) {
    super(data);
  }

  async attack(target: Hero | Crystal): Promise<void> {
    attackAnimation(this);
    turnIfBehind(this.context, this, target); // Ensure turnIfBehind is imported/defined

    const distance = getDistanceToTarget(this, target);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (
      distance === 1 &&
      target instanceof Hero &&
      target.stats.isKO &&
      isEnemySpawn(this.context, target.getTile())
    ) {
      // this.scene.sound.play(EGameSounds.IMPALER_ATTACK_MELEE);
      target.removeFromGame();
    } else {
      if (this.status.has(StatusEffects.SUPER_CHARGE)) {
        // this.scene.sound.play(EGameSounds.IMPALER_ATTACK_BIG);
      } else {
        // if (distance === 1) this.scene.sound.play(EGameSounds.IMPALER_ATTACK_MELEE);
        // if (distance !== 1) this.scene.sound.play(EGameSounds.IMPALER_ATTACK);
      }
      const damageDone = target.getsDamaged(this.getTotalPower(), this.stats.attackType, this);

      if (damageDone) this.lifeSteal(damageDone);

      this.removeAttackModifiers();
    }

    if (target instanceof Hero && target.stats.unitType !== EHeroes.PHANTOM) this.context.gameController!.pullEnemy(this, target);

    if (target && target instanceof Hero && target.stats.isKO && target.stats.unitType === EHeroes.PHANTOM) target.removeFromGame();

    this.context.gameController!.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {}
}