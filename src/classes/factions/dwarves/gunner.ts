import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { Crystal } from "../../board/crystal";
import { Tile } from "../../board/tile";
import { Hero } from "../hero";
import { Dwarf } from "./dwarves";

export class Gunner extends Dwarf {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(_target: Hero | Crystal): void {
    // add check for splash attack damage on crystals
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_arget: Hero | Crystal): void {}
}