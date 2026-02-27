import { EGameSounds, EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { Hero } from "../hero";
import { Tile } from "../../board/tile";
import { DarkElf } from "./elves";
import { Crystal } from "../../board/crystal";
import { playSound } from "../../../utils/gameSounds";
import { turnIfBehind } from "../../../utils/unitAnimations";

export class Wraith extends DarkElf {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(target: Hero | Crystal): void {
    this.flashActingUnit();

    turnIfBehind(this.context, this, target);

    if (target instanceof Hero && target.stats.isKO) {
      playSound(this.scene, EGameSounds.WRAITH_CONSUME);
      target.removeFromGame(true);

      if (this.stats.unitsConsumed! < 3) {
        this.stats.basePower += 50;
        this.stats.unitsConsumed!++;
        this.increaseMaxHealth(100);
        this.updateTileData();
        this.unitCard.updateCardData(this);
      }
    } else {
      if (this.stats.superCharge) playSound(this.scene, EGameSounds.WRAITH_ATTACK_BIG);
      if (!this.stats.superCharge) playSound(this.scene, EGameSounds.WRAITH_ATTACK);

      const damageDone = target.getsDamaged(this.getTotalPower(), this.stats.attackType, this);

      if (damageDone) this.lifeSteal(damageDone);

      this.removeAttackModifiers();
    }

    if (target && target instanceof Hero && target.stats.isKO && target.stats.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.gameController!.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {}
}
