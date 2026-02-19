import { EGameSounds, EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { turnIfBehind, playSound, isEnemySpawn } from "../../../utils/gameUtils";
import { Crystal } from "../../crystal";
import { Hero } from "../../hero";
import { Tile } from "../../tile";
import { Council } from "./council";

export class Ninja extends Council {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(target: Hero | Crystal): void {
    this.flashActingUnit();

    turnIfBehind(this.context, this, target);

    const distance = this.getDistanceToTarget(target);

    const ninjaAttackSound = () => {
      if (this.superCharge) playSound(this.scene, EGameSounds.NINJA_ATTACK_BIG);
      if (!this.superCharge) playSound(this.scene, EGameSounds.NINJA_ATTACK);
    };

    if (distance === 1) {
      // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
      if (
        target instanceof Hero &&
        target.isKO &&
        isEnemySpawn(this.context, target.getTile())
      ) {
        playSound(this.scene, EGameSounds.NINJA_ATTACK);
        target.removeFromGame();
      } else {
        ninjaAttackSound();
        target.getsDamaged(this.getTotalPower(2), this.attackType);
        this.removeAttackModifiers();
      }
    } else {
      ninjaAttackSound();
      target.getsDamaged(this.getTotalPower(), this.attackType);
      this.removeAttackModifiers();
    }

    if (target && target instanceof Hero && target.isKO && target.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.gameController!.afterAction(EActionType.ATTACK, this.boardPosition, target.boardPosition);
  }

  teleport(target: Hero): void {
    playSound(this.scene, EGameSounds.NINJA_SMOKE);
    const targetDestination = this.getTile();
    const unitDestination = target.getTile();

    // Smoke bomb animation
    this.singleTween(this.smokeAnim!, 500);
    target.singleTween(target.smokeAnim!, 500);

    target.specialTileCheck(targetDestination.tileType, unitDestination.tileType);
    target.updatePosition(targetDestination);
    targetDestination.hero = target.exportData();

    this.specialTileCheck(unitDestination.tileType, targetDestination.tileType);
    this.updatePosition(unitDestination);
    unitDestination.hero = this.exportData();

    this.context.gameController!.afterAction(EActionType.TELEPORT, targetDestination.boardPosition, unitDestination.boardPosition);
  };

  heal(_target: Hero): void {};
}