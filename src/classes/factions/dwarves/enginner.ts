/**
 * engineer will have a nullable activeShield field with the id of the ally.
 * the ally will have a nullbale engineerShield field with the id of the engie
 *
 * a change in status of either triggers a util function that will update the value on the other
 * status changes:
 *  ally is damages
 *  engie creates a new bubnle
 *  engie dies
 *
 */

import { EGameSounds, EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { Hero } from "../hero";
import { Tile } from "../../board/tile";
import { Crystal } from "../../board/crystal";
import { isEnemySpawn } from "../../../utils/boardUtils";
import { playSound } from "../../../utils/gameSounds";
import { turnIfBehind } from "../../../utils/unitAnimations";
import { Dwarf } from "./dwarves";

export class Engineer extends Dwarf {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(target: Hero | Crystal): void {
    this.flashActingUnit();
    turnIfBehind(this.context, this, target);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (
      target instanceof Hero &&
      target.isKO &&
      isEnemySpawn(this.context, target.getTile())
    ) {
      playSound(this.scene, EGameSounds.KNIGHT_ATTACK);
      target.removeFromGame();
    } else {
      if (this.superCharge) playSound(this.scene, EGameSounds.KNIGHT_ATTACK_BIG);
      if (!this.superCharge)playSound(this.scene, EGameSounds.ARCHER_ATTACK_MELEE);

      target.getsDamaged(this.getTotalPower(), this.attackType, this);

      this.removeAttackModifiers();
    }

    if (target && target instanceof Hero && target.isKO && target.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.gameController!.afterAction(EActionType.ATTACK, this.boardPosition, target.boardPosition);
  }

  shieldAlly(target: Hero | Crystal): void {
    if (this.shieldingAlly) {
      this.context.gameController?.board.removeEngineerShield(this.shieldingAlly);
    }
    target.getEngineerShield(this.unitId);
    this.shieldingAlly = target.unitId;
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
}
