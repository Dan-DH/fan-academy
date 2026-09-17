import { GameObjects } from "phaser";
import GameScene from "../../scenes/game.scene";

export class GameOverScreen extends GameObjects.Container {
  gameOverImage: GameObjects.Image | undefined;
  gameOverEffect: GameObjects.Image | undefined;

  context: GameScene;

  constructor(context: GameScene) {
    super(context, 0, 0);
    this.context = context;
    context.add.existing(this).setDepth(999);
  }

  async init() {
    let gameOverEffectKey: string;
    let gameOverImageKey: string;
    if (this.context.currentGame.gameOver?.winner === this.context.userId) {
      gameOverEffectKey = 'gameOverVictoryEffect';
      gameOverImageKey = 'gameOverVictoryText';
    } else {
      gameOverEffectKey = 'gameOverDefeatEffect';
      gameOverImageKey = 'gameOverDefeatText';
    }

    this.gameOverEffect = this.context.add.image(880, 400, 'gameAtlas',  gameOverEffectKey)
      .setOrigin(0.5)
      .setName('gameOverEffect')
      .setScale(5);

    this.gameOverImage = this.context.add.image(900, 400, 'gameAtlas', gameOverImageKey)
      .setOrigin(0.5)
      .setScale(2.5)
      .setName('gameOverImage'); // TODO: increase quality of gameOverImage

    this.context.tweens.add({
      targets: this.gameOverEffect,
      angle: 360,
      duration: 10000,
      repeat: -1,
      ease: 'Linear'
    });

    this.add([this.gameOverEffect, this.gameOverImage]);
  }
}
