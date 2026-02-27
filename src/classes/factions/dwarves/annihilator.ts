import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { Tile } from "../../board/tile";
import { Crystal } from "../../board/crystal";
import { Dwarf } from "./dwarves";
import { Hero } from "../hero";

export class Annihilator extends Dwarf {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(_target: Hero | Crystal): void {

  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_arget: Hero | Crystal): void {}
}
