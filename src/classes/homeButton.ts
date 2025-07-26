import UIScene from "../scenes/ui.scene";
import { EGameSounds } from "../enums/gameEnums";
import { effectSequence } from "../utils/gameUtils";
// Import the backgroundMusicInstance from ui.scene.ts
import { backgroundMusicInstance } from "../scenes/ui.scene"; // <-- ADD THIS IMPORT

export class HomeButton extends Phaser.GameObjects.Container {
  button: Phaser.GameObjects.Image;
  buttonText: Phaser.GameObjects.Text;
  constructor(context: UIScene) {
    const x = 50;
    const y = 50;
    super(context, x, y);

    this.button = context.add.image(10, -25, 'playButton').setDisplaySize(100, 50).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.buttonText = context.add.text(10, -25, "Home", {
      fontFamily: "proLight",
      fontSize: 35,
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add([this.button, this.buttonText]).setScale(0.8);

    this.button.on('pointerdown', async() => {
      effectSequence(this.scene, EGameSounds.BUTTON_PRESS_GENERIC);

      await context.lobbyRoom?.leave();
      await context.currentRoom?.leave();
      context.currentRoom = undefined;

      // Stop and destroy the background music instance
      if (backgroundMusicInstance && backgroundMusicInstance.isPlaying) {
        backgroundMusicInstance.stop();
      }

      context.scene.stop('GameScene');
      context.scene.start('MainMenuScene');
    });

    context.add.existing(this);
  }
}