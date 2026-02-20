import { IUserData } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { Banner } from "./banner";
import { Board } from "./board";

export class GameUI {
  itemRack: Phaser.GameObjects.Image;
  banner: Banner;

  constructor(context: GameScene, board: Board, playerData: IUserData[]) {
    // Game map
    const gameMap = context.add.image(0, 0, 'gameBoard').setOrigin(0).setInteractive();
    gameMap.x = 1434 - gameMap.width - 14;
    gameMap.y += 14;

    // Item rack
    this.itemRack = context.add.image(0, 0, 'itemRack').setOrigin(0.5).setPosition(900, 736).setScale(0.9);

    // Player banners
    this.banner = new Banner(context, board, playerData);
  }
}