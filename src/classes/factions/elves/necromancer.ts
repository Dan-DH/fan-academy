import { EGameSounds, EActionType, EHeroes } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { Hero } from "../hero";
import { Tile } from "../../board/tile";
import { createElvesPhantomData, DarkElf } from "./elves";
import { Phantom } from "./phantom";
import { Crystal } from "../../board/crystal";
import { playSound } from "../../../utils/gameSounds";
import { generateFourDigitId } from "../../../utils/gameUtils";
import { actionAnimation, turnIfBehind } from "../../../utils/unitAnimations";

export class Necromancer extends DarkElf {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(target: Hero | Crystal): void {
    actionAnimation(this);
    turnIfBehind(this.context, this, target);

    if (target instanceof Hero && target.stats.isKO) {
      const tile = target.getTile();

      playSound(this.scene, EGameSounds.PHANTOM_SPAWN);

      const phantom = new Phantom(this.context, createElvesPhantomData({
        unitId: `${this.context.userId}_phantom_${generateFourDigitId()}`,
        boardPosition: target.stats.boardPosition,
        belongsTo: this.stats.belongsTo,
        row: target.stats.row,
        col: target.stats.col
      }), tile, true);

      target.removeFromGame(true);

      this.context.gameController?.board.units.push(phantom);
      tile.hero = phantom.exportData();

      this.context.gameController!.afterAction(EActionType.SPAWN_PHANTOM, this.stats.boardPosition, target.stats.boardPosition);

      return;
    } else {
      if (this.stats.superCharge) playSound(this.scene, EGameSounds.NECROMANCER_ATTACK_BIG);
      if (!this.stats.superCharge) playSound(this.scene, EGameSounds.NECROMANCER_ATTACK);

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
