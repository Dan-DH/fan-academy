import { EUiSounds } from "../../enums/gameEnums";
import UIScene from "../../scenes/ui.scene";

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
      this.scene.sound.play(EUiSounds.BUTTON_GENERIC);

      await context.lobbyRoom?.leave();
      await context.currentRoom?.leave();
      context.currentRoom = undefined;

      context.scene.stop('GameScene');
      context.scene.start('MainMenuScene');
    });

    context.add.existing(this);
  }
}