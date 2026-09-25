import { EActionType, EHeroes } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { Hero } from "../hero";
import { DarkElf } from "./elves";
import { Crystal } from "../../board/crystal";
import { attackAnimation, turnIfBehind } from "../../../utils/unitAnimations";

export class Necromancer extends DarkElf {
  constructor(data: IHero) {
    super(data);
  }

  attack(target: Hero | Crystal): void {
    attackAnimation(this);
    turnIfBehind(this.context, this, target);

    if (target instanceof Hero && target.stats.isKO) {
      const tile = target.getTile();

      // this.scene.sound.play(EGameSounds.PHANTOM_SPAWN);

      // FIXME:
      console.log(tile);
      // const phantom = new Phantom(this.context, createElvesPhantomData({
      //   unitId: `${this.context.userId}_phantom_${generateFourDigitId()}`,
      //   boardPosition: target.stats.boardPosition,
      //   belongsTo: this.stats.belongsTo,
      //   row: target.stats.row,
      //   col: target.stats.col
      // }), tile, true);

      target.removeFromGame(true);

      // FIXME:
      // this.context.gameController?.board.units.push(phantom);
      // tile.hero = phantom.exportData();

      this.context.afterAction(EActionType.SPAWN_PHANTOM, this.stats.boardPosition, target.stats.boardPosition);

      return;
    } else {
      // if (this.stats.superCharge) this.scene.sound.play(EGameSounds.NECROMANCER_ATTACK_BIG);
      // if (!this.stats.superCharge) this.scene.sound.play(EGameSounds.NECROMANCER_ATTACK);

      const damageDone = target.getsDamaged(this.getTotalPower(), this.stats.attackType, this);
      if (damageDone) this.lifeSteal(damageDone);
      this.removeAttackModifiers();
    }

    if (target && target instanceof Hero && target.stats.isKO && target.stats.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {}
}
