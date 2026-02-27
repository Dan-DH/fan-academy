import { EGameSounds, EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { Hero } from "../hero";
import { Tile } from "../../board/tile";
import { Council } from "./council";
import { Crystal } from "../../board/crystal";
import { getDistanceToTarget, isEnemySpawn, specialTileCheck } from "../../../utils/boardUtils";
import { playSound } from "../../../utils/gameSounds";
import { singleTween, turnIfBehind } from "../../../utils/unitAnimations";

export class Ninja extends Council {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(target: Hero | Crystal): void {
    this.flashActingUnit();

    turnIfBehind(this.context, this, target);

    const distance = getDistanceToTarget(this, target);

    const ninjaAttackSound = () => {
      if (this.stats.superCharge) playSound(this.scene, EGameSounds.NINJA_ATTACK_BIG);
      if (!this.stats.superCharge) playSound(this.scene, EGameSounds.NINJA_ATTACK);
    };

    if (distance === 1) {
      // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
      if (
        target instanceof Hero &&
        target.stats.isKO &&
        isEnemySpawn(this.context, target.getTile())
      ) {
        playSound(this.scene, EGameSounds.NINJA_ATTACK);
        target.removeFromGame();
      } else {
        ninjaAttackSound();
        target.getsDamaged(this.getTotalPower(2), this.stats.attackType, this);
        this.removeAttackModifiers();
      }
    } else {
      ninjaAttackSound();
      target.getsDamaged(this.getTotalPower(), this.stats.attackType, this);
      this.removeAttackModifiers();
    }

    if (target && target instanceof Hero && target.stats.isKO && target.stats.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.gameController!.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  teleport(target: Hero): void {
    playSound(this.scene, EGameSounds.NINJA_SMOKE);
    const targetDestination = this.getTile();
    const unitDestination = target.getTile();

    // Smoke bomb animation
    singleTween(this.visuals.smokeAnim!, 500);
    singleTween(target.visuals.smokeAnim!, 500);

    specialTileCheck(target, targetDestination.tileType, unitDestination.tileType);
    target.updatePosition(targetDestination);
    targetDestination.hero = target.exportData();

    specialTileCheck(this, unitDestination.tileType, targetDestination.tileType);
    this.updatePosition(unitDestination);
    unitDestination.hero = this.exportData();

    this.context.gameController!.afterAction(EActionType.TELEPORT, targetDestination.boardPosition, unitDestination.boardPosition);
  };

  heal(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {}
}