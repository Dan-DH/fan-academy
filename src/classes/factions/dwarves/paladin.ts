import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { Crystal } from "../../board/crystal";
import { Tile } from "../../board/tile";
import { Hero } from "../hero";
import { Dwarf } from "./dwarves";

export class Paladin extends Dwarf {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  /**
 * everyone has a paladinAura field. on hero move, check if there is one of more adjacent paladins, then stack the multiplier
 * paladinAura is an int, with the number of paladins currently triggering the aura. add to defense computation functions
 */
  attack(_target: Hero | Crystal): void {

  }

  heal(_target: Hero): void {
    // TODO:
  };

  teleport(_target: Hero): void {};
  shieldAlly(_arget: Hero | Crystal): void {}
}