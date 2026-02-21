import { EGameSounds, EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { turnIfBehind, isEnemySpawn, playSound } from "../../../utils/gameUtils";
import { Hero } from "../hero";
import { Tile } from "../../board/tile";
import { DarkElf } from "./elves";
import { Crystal } from "../../board/crystal";

export class Impaler extends DarkElf {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  async attack(target: Hero | Crystal): Promise<void> {
    this.flashActingUnit();
    turnIfBehind(this.context, this, target); // Ensure turnIfBehind is imported/defined

    const distance = this.getDistanceToTarget(target);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (
      distance === 1 &&
      target instanceof Hero &&
      target.isKO &&
      isEnemySpawn(this.context, target.getTile())
    ) {
      playSound(this.scene, EGameSounds.IMPALER_ATTACK_MELEE);
      target.removeFromGame();
    } else {
      if (this.superCharge) {
        playSound(this.scene, EGameSounds.IMPALER_ATTACK_BIG);
      } else {
        if (distance === 1) playSound(this.scene, EGameSounds.IMPALER_ATTACK_MELEE);
        if (distance !== 1) playSound(this.scene, EGameSounds.IMPALER_ATTACK);
      }
      const damageDone = target.getsDamaged(this.getTotalPower(), this.attackType, this);

      if (damageDone !== undefined) this.lifeSteal(damageDone);

      this.removeAttackModifiers();
    }

    if (target instanceof Hero && target.unitType !== EHeroes.PHANTOM) this.context.gameController!.pullEnemy(this, target);

    if (target && target instanceof Hero && target.isKO && target.unitType === EHeroes.PHANTOM) target.removeFromGame();

    this.context.gameController!.afterAction(EActionType.ATTACK, this.boardPosition, target.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
}