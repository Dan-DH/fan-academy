import { EActionType, EItems } from "../../../enums/gameEnums";
import { IItem } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { typhoonAnimation, useAnimation } from "../../../utils/unitAnimations";
import { Tile } from "../../board/tile";
import { Hero } from "../hero";
import { Item } from "../item";

export class Typhoon extends Item {
  constructor(data: IItem) {
    super(data);
  }

  use(targetTile: Tile): void {
    const scene = targetTile.scene as GameScene;
    const typhoonImage = this.scene.add.image(targetTile.x + 15, 400, 'gameAtlas', 'Typhoon_Wave2-hd').setScale(2.5).setDepth(100);
    typhoonAnimation(typhoonImage, targetTile.col);

    const isPlayerOne = scene.isPlayerOne;
    const belongsTo = isPlayerOne ? 1 : 2;

    const enemyUnits = scene.board?.units.filter((u): u is Hero => u.stats.belongsTo !== belongsTo && u instanceof Hero);
    if (!enemyUnits) return;

    if (targetTile.col !== 0) for (let i = 0; i < targetTile.col; i++) this.handlePushing(scene, enemyUnits as Hero[], i, false);
    if (targetTile.col !== 8) for (let i = 8; i > targetTile.col; i--) this.handlePushing(scene, enemyUnits as Hero[], i, true);

    enemyUnits.forEach(u => {
      if (u.stats.col === targetTile.col) {
        let goingRight = isPlayerOne!;
        if (targetTile.col === 8 && isPlayerOne) goingRight = false;
        if (targetTile.col === 0 && !isPlayerOne) goingRight = true;

        this.handlePushing(scene, [u] as Hero[], targetTile.col, goingRight);
      }
    });

    this.context.afterAction(EActionType.USE, this.stats.boardPosition, targetTile.boardPosition);
    this.removeFromGame();
  }

  private handlePushing(scene: GameScene, enemyUnits: Hero[], col: number, goingRight: boolean): void {
    const matchingUnits = enemyUnits.filter(u => u.stats.col === col);
    const offset = goingRight ? -1 : 1;
    matchingUnits.forEach(u => {
      const pushTarget = {
        row: u.stats.row,
        col: u.stats.col + offset
      };

      if (scene.board?.pushEnemy(pushTarget, u as Hero, 0)) scene.board?.pushEnemy(pushTarget, u as Hero, 0);
    });
  }
}

export class Meat extends Item {
  constructor(data: IItem) {
    super(data);
  }

  use(target: Hero): void {
    // this.scene.sound.play(EGameSounds.POTION_USE);
    const meatImage = this.scene.add.image(target.x, target.y - 10, 'gameAtlas', EItems.MEAT).setDepth(100);
    useAnimation(meatImage);

    target.consumeMeat();

    this.context.afterAction(EActionType.USE, this.stats.boardPosition, target.stats.boardPosition);
    this.removeFromGame();
  }
}