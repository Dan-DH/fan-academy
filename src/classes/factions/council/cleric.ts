import { EGameSounds, EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { Hero } from "../hero";
import { Tile } from "../../board/tile";
import { Council } from "./council";
import { Crystal } from "../../board/crystal";
import { getDistanceToTarget, isEnemySpawn } from "../../../utils/boardUtils";
import { playSound } from "../../../utils/gameSounds";
import { turnIfBehind } from "../../../utils/unitAnimations";

export class Cleric extends Council {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(target: Hero | Crystal): void {
    this.flashActingUnit();

    turnIfBehind(this.context, this, target);

    const distance = getDistanceToTarget(this, target);

    if (
      distance === 1 &&
      target instanceof Hero &&
      target.stats.isKO &&
      isEnemySpawn(this.context, target.getTile())
    ) {
      if (!this.stats.superCharge) playSound(this.scene, EGameSounds.CLERIC_ATTACK);
      target.removeFromGame();
    } else {
      if (this.stats.superCharge) playSound(this.scene, EGameSounds.CLERIC_ATTACK_BIG);
      if (!this.stats.superCharge) playSound(this.scene, EGameSounds.CLERIC_ATTACK);
      target.getsDamaged(this.getTotalPower(), this.stats.attackType, this);
      this.removeAttackModifiers();
    }

    if (target && target instanceof Hero && target.stats.isKO && target.stats.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.gameController!.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  heal(target: Hero): void {
    this.flashActingUnit();

    if (!this.stats.superCharge) playSound(this.scene, EGameSounds.HEAL);
    if (this.stats.superCharge) playSound(this.scene, EGameSounds.HEAL_EXTRA);

    turnIfBehind(this.context, this, target);

    if (target.stats.isKO) {
      const healingAmount = this.getTotalHealing(2);
      target.getsHealed(healingAmount);
    } else {
      const healingAmount = this.getTotalHealing(3);
      target.getsHealed(healingAmount);
    }

    this.removeAttackModifiers();

    this.context.gameController?.afterAction(EActionType.HEAL, this.stats.boardPosition, target.stats.boardPosition);
  };

  teleport(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {}
}
