import { GameObjects } from "phaser";
import GameScene from "../../scenes/game.scene";
import { CDN_PATH } from "../../scenes/preloader.scene";

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
    await this.loadImages();

    let gameOverEffectKey: string;
    let gameOverImageKey: string;
    if (this.context.currentGame.gameOver?.winner === this.context.userId) {
      gameOverEffectKey = 'gameOverVictoryEffect';
      gameOverImageKey = 'gameOverVictoryText';
    } else {
      gameOverEffectKey = 'gameOverDefeatEffect';
      gameOverImageKey = 'gameOverDefeatText';
    }

    this.gameOverEffect = this.context.add.image(880, 400, gameOverEffectKey)
      .setOrigin(0.5)
      .setName('gameOverEffect')
      .setScale(1.5);

    this.gameOverImage = this.context.add.image(900, 400, gameOverImageKey)
      .setOrigin(0.5)
      .setName('gameOverImage');

    this.context.tweens.add({
      targets: this.gameOverEffect,
      angle: 360,
      duration: 10000,
      repeat: -1,
      ease: 'Linear'
    });

    this.add([this.gameOverEffect, this.gameOverImage]);
  }

  private loadImages(): Promise<void> {
    return new Promise((resolve) => {
      if (this.context.currentGame.gameOver?.winner === this.context.userId) {
        this.context.load.image('gameOverVictoryText', `${CDN_PATH}/images/gameItems/gameOverVictoryText.webp`);
        this.context.load.image('gameOverVictoryEffect', `${CDN_PATH}/images/gameItems/gameOverVictoryEffect.webp`);
      } else {
        this.context.load.image('gameOverDefeatText', `${CDN_PATH}/images/gameItems/gameOverDefeatText.webp`);
        this.context.load.image('gameOverDefeatEffect', `${CDN_PATH}/images/gameItems/gameOverDefeatEffect.webp`);
      }

      this.context.load.once('complete', () => resolve());
      this.context.load.start();
    });
  }
}
