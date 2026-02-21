import { EGameSounds, EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { Hero } from "../hero";
import { Tile } from "../../board/tile";
import { DarkElf } from "./elves";
import { Crystal } from "../../board/crystal";
import { isEnemySpawn } from "../../../utils/boardUtils";
import { playSound } from "../../../utils/gameSounds";
import { turnIfBehind } from "../../../utils/unitAnimations";

export class Priestess extends DarkElf {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(target: Hero | Crystal): void {
    this.flashActingUnit();

    turnIfBehind(this.context, this, target);

    const distance = this.getDistanceToTarget(target);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (
      distance === 1 &&
      target instanceof Hero &&
      target.isKO &&
      isEnemySpawn(this.context, target.getTile())
    ) {
      playSound(this.scene, EGameSounds.PRIESTESS_ATTACK);
      target.removeFromGame();
    } else {
      playSound(this.scene, EGameSounds.PRIESTESS_ATTACK);

      const damageDone = target.getsDamaged(this.getTotalPower(), this.attackType, this);

      if (damageDone) this.lifeSteal(damageDone);

      // Apply a 50% debuff to the target's next attack or heal
      if (target instanceof Hero) {
        target.isDebuffed = true;
        target.debuffImage.setVisible(true);
        target.updateTileData();
        target.unitCard.updateCardData(target);
      }

      this.removeAttackModifiers();
    }

    if (target && target instanceof Hero && target.isKO && target.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.gameController!.afterAction(EActionType.ATTACK, this.boardPosition, target.boardPosition);
  }

  async heal(target: Hero): Promise<void> {
    this.flashActingUnit();
    turnIfBehind(this.context, this, target);
    if (!this.superCharge) playSound(this.scene, EGameSounds.HEAL);
    if (this.superCharge)  playSound(this.scene, EGameSounds.HEAL_EXTRA);

    if (target.isKO) {
      const healingAmount = this.getTotalHealing(0.5);
      target.getsHealed(healingAmount);
    } else {
      const healingAmount = this.getTotalHealing(2);
      target.getsHealed(healingAmount);
    }

    this.removeAttackModifiers();

    this.context.gameController?.afterAction(EActionType.HEAL, this.boardPosition, target.boardPosition);
  };

  teleport(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {}
}