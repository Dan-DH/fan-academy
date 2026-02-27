import { EGameSounds } from "../../enums/gameEnums";
import { IItem } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { playSound } from "../../utils/gameSounds";
import { Hero } from "./hero";
import { Item } from "./item";

export class ShiningHelm extends Item {
  constructor(context: GameScene, data: IItem) {
    super(context, data);
  }

  use(target: Hero): void {
    target.equipShiningHelm(this.stats.boardPosition);
    playSound(this.scene, EGameSounds.ITEM_USE);
    this.removeFromGame();
  }
}

export class RuneMetal extends Item {
  constructor(context: GameScene, data: IItem) {
    super(context, data);
  }

  use(target: Hero): void {
    target.equipRunemetal(this.stats.boardPosition);
    playSound(this.scene, EGameSounds.RUNE_METAL_USE);

    this.removeFromGame();
  }
}

export class SuperCharge extends Item {
  constructor(context: GameScene, data: IItem) {
    super(context, data);
  }

  use(target: Hero): void {
    target.equipSuperCharge(this.stats.boardPosition);
    playSound(this.scene, EGameSounds.SCROLL_USE);

    this.removeFromGame();
  }
}