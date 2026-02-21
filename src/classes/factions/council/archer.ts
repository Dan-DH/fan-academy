import { EGameSounds, EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { Hero } from "../hero";
import { Tile } from "../../board/tile";
import { Council } from "./council";
import { Crystal } from "../../board/crystal";
import { isEnemySpawn } from "../../../utils/boardUtils";
import { playSound } from "../../../utils/gameSounds";
import { turnIfBehind } from "../../../utils/unitAnimations";

export class Archer extends Council {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(target: Hero | Crystal): void {
    this.flashActingUnit();

    const distance = this.getDistanceToTarget(target);

    turnIfBehind(this.context, this, target);

    if (distance === 1) {
      // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
      if (
        target instanceof Hero &&
        target.isKO &&
        isEnemySpawn(this.context, target.getTile())
      ) {
        playSound(this.scene, EGameSounds.ARCHER_ATTACK_MELEE);

        target.removeFromGame();
      } else {
        playSound(this.scene, EGameSounds.ARCHER_ATTACK_MELEE);

        target.getsDamaged(this.getTotalPower(0.5), this.attackType, this);
        this.removeAttackModifiers();
      }
    } else {
      if (this.superCharge) playSound(this.scene, EGameSounds.ARCHER_ATTACK_BIG);
      if (!this.superCharge) playSound(this.scene, EGameSounds.ARCHER_ATTACK);

      target.getsDamaged(this.getTotalPower(), this.attackType, this);
      this.removeAttackModifiers();
    }

    if (target && target instanceof Hero && target.isKO && target.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.gameController!.afterAction(EActionType.ATTACK, this.boardPosition, target.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {}
}
