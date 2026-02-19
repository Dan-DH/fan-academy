import { EGameSounds, EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { turnIfBehind, isEnemySpawn, playSound } from "../../../utils/gameUtils";
import { Crystal } from "../../crystal";
import { Hero } from "../../hero";
import { Tile } from "../../tile";
import { Council } from "./council";

export class Cleric extends Council {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(target: Hero | Crystal): void {
    this.flashActingUnit();

    turnIfBehind(this.context, this, target);

    const distance = this.getDistanceToTarget(target);

    if (
      distance === 1 &&
      target instanceof Hero &&
      target.isKO &&
      isEnemySpawn(this.context, target.getTile())
    ) {
      if (!this.superCharge) playSound(this.scene, EGameSounds.CLERIC_ATTACK);
      target.removeFromGame();
    } else {
      if (this.superCharge) playSound(this.scene, EGameSounds.CLERIC_ATTACK_BIG);
      if (!this.superCharge) playSound(this.scene, EGameSounds.CLERIC_ATTACK);
      target.getsDamaged(this.getTotalPower(), this.attackType);
      this.removeAttackModifiers();
    }

    if (target && target instanceof Hero && target.isKO && target.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.gameController!.afterAction(EActionType.ATTACK, this.boardPosition, target.boardPosition);
  }

  heal(target: Hero): void {
    this.flashActingUnit();

    if (!this.superCharge) playSound(this.scene, EGameSounds.HEAL);
    if (this.superCharge) playSound(this.scene, EGameSounds.HEAL_EXTRA);

    turnIfBehind(this.context, this, target);

    if (target.isKO) {
      const healingAmount = this.getTotalHealing(2);
      target.getsHealed(healingAmount);
    } else {
      const healingAmount = this.getTotalHealing(3);
      target.getsHealed(healingAmount);
    }

    this.removeAttackModifiers();

    this.context.gameController?.afterAction(EActionType.HEAL, this.boardPosition, target.boardPosition);
  };

  teleport(_target: Hero): void {};
}
