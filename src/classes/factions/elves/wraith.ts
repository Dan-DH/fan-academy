import { EGameSounds, EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { turnIfBehind, playSound } from "../../../utils/gameUtils";
import { Hero } from "../hero";
import { Tile } from "../../board/tile";
import { DarkElf } from "./elves";
import { Crystal } from "../../board/crystal";

export class Wraith extends DarkElf {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(target: Hero | Crystal): void {
    this.flashActingUnit();

    turnIfBehind(this.context, this, target);

    if (target instanceof Hero && target.isKO) {
      playSound(this.scene, EGameSounds.WRAITH_CONSUME);
      target.removeFromGame(true);

      if (this.unitsConsumed < 3) {
        this.basePower += 50;
        this.unitsConsumed++;
        this.increaseMaxHealth(100);
        this.updateTileData();
        this.unitCard.updateCardData(this);
      }
    } else {
      if (this.superCharge) playSound(this.scene, EGameSounds.WRAITH_ATTACK_BIG);
      if (!this.superCharge) playSound(this.scene, EGameSounds.WRAITH_ATTACK);

      const damageDone = target.getsDamaged(this.getTotalPower(), this.attackType, this);

      if (damageDone) this.lifeSteal(damageDone);

      this.removeAttackModifiers();
    }

    if (target && target instanceof Hero && target.isKO && target.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.gameController!.afterAction(EActionType.ATTACK, this.boardPosition, target.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
}
