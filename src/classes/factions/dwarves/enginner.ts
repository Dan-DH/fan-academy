import { EGameSounds, EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { Tile } from "../../board/tile";
import { Crystal } from "../../board/crystal";
import { isEnemySpawn } from "../../../utils/boardUtils";
import { playSound } from "../../../utils/gameSounds";
import { turnIfBehind } from "../../../utils/unitAnimations";
import { Hero } from "../hero";
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
      target.stats.isKO &&
      isEnemySpawn(this.context, target.getTile())
    ) {
      playSound(this.scene, EGameSounds.KNIGHT_ATTACK);
      target.removeFromGame();
    } else {
      if (this.stats.superCharge) playSound(this.scene, EGameSounds.KNIGHT_ATTACK_BIG);
      if (!this.stats.superCharge)playSound(this.scene, EGameSounds.ARCHER_ATTACK_MELEE);

      target.getsDamaged(this.getTotalPower(), this.stats.attackType, this);

      this.removeAttackModifiers();
    }

    if (target && target instanceof Hero && target.stats.isKO && target.stats.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.gameController!.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  shieldAlly(target: Hero | Crystal): void {
    this.flashActingUnit();
    turnIfBehind(this.context, this, target);

    if (this.stats.shieldingAlly) {
      if (this.stats.shieldingAlly === target.stats.unitId) return;
      this.context.gameController?.board.removeEngineerShield(this.stats.shieldingAlly);
    }

    target.receiveEngineerShield(this.stats.unitId);
    this.stats.shieldingAlly = target.stats.unitId;
    this.updateTileData();
    this.context.gameController!.afterAction(EActionType.BUFF, this.stats.boardPosition, target.stats.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
}
