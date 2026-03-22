import { EGameSounds, EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { isEnemySpawn } from "../../../utils/boardUtils";
import { playSound } from "../../../utils/gameSounds";
import { actionAnimation, turnIfBehind } from "../../../utils/unitAnimations";
import { Crystal } from "../../board/crystal";
import { Tile } from "../../board/tile";
import { Hero } from "../hero";
import { Dwarf } from "./dwarves";

export class Paladin extends Dwarf {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(target: Hero | Crystal): void {
    actionAnimation(this);
    turnIfBehind(this.context, this, target);
    playSound(this.scene, EGameSounds.PALADIN_ATTACK);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (
      target instanceof Hero &&
      target.stats.isKO &&
      isEnemySpawn(this.context, target.getTile())
    ) {
      target.removeFromGame();
    } else {
      target.getsDamaged(this.getTotalPower(), this.stats.attackType, this);
      this.removeAttackModifiers();
    }

    if (target && target instanceof Hero && target.stats.isKO && target.stats.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.gameController!.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  heal(target: Hero): void {
    actionAnimation(this);
    turnIfBehind(this.context, this, target);

    if (!this.stats.superCharge) playSound(this.scene, EGameSounds.HEAL);
    if (this.stats.superCharge) playSound(this.scene, EGameSounds.HEAL_EXTRA);

    let actualHealingDone: number;
    if (target.stats.isKO) {
      const healingAmount = this.getTotalHealing(0.5);
      actualHealingDone = target.getsHealed(healingAmount);
    } else {
      const healingAmount = this.getTotalHealing(2);
      actualHealingDone = target.getsHealed(healingAmount);
    }

    this.getsHealed(actualHealingDone / 2);
    this.removeAttackModifiers();

    this.context.gameController?.afterAction(EActionType.HEAL, this.stats.boardPosition, target.stats.boardPosition);
  };

  teleport(_target: Hero): void {};
  shieldAlly(_arget: Hero | Crystal): void {}
}