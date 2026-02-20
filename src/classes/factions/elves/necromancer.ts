import { EGameSounds, EActionType, EHeroes } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { turnIfBehind, playSound, generateFourDigitId } from "../../../utils/gameUtils";
import { Hero } from "../hero";
import { Tile } from "../../board/tile";
import { createElvesPhantomData, DarkElf } from "./elves";
import { Phantom } from "./phantom";
import { Crystal } from "../../board/crystal";

export class Necromancer extends DarkElf {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(target: Hero | Crystal): void {
    this.flashActingUnit();

    turnIfBehind(this.context, this, target);

    if (target instanceof Hero && target.isKO) {
      const tile = target.getTile();

      playSound(this.scene, EGameSounds.PHANTOM_SPAWN);

      const phantom = new Phantom(this.context, createElvesPhantomData({
        unitId: `${this.context.userId}_phantom_${generateFourDigitId()}`,
        boardPosition: target.boardPosition,
        belongsTo: this.belongsTo,
        row: target.row,
        col: target.col
      }), tile, true);

      target.removeFromGame(true);

      this.context.gameController?.board.units.push(phantom);
      tile.hero = phantom.exportData();

      this.context.gameController!.afterAction(EActionType.SPAWN_PHANTOM, this.boardPosition, target.boardPosition);

      return;
    } else {
      if (this.superCharge) playSound(this.scene, EGameSounds.NECROMANCER_ATTACK_BIG);
      if (!this.superCharge) playSound(this.scene, EGameSounds.NECROMANCER_ATTACK);

      const damageDone = target.getsDamaged(this.getTotalPower(), this.attackType);
      if (damageDone) this.lifeSteal(damageDone);
      this.removeAttackModifiers();
    }

    if (target && target instanceof Hero && target.isKO && target.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.gameController!.afterAction(EActionType.ATTACK, this.boardPosition, target.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
}
