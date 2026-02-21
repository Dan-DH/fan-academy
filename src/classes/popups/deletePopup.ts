import { EUiSounds } from "../../enums/gameEnums";
import ProfileScene from "../../scenes/profile.scene";
import { playSound } from "../../utils/gameSounds";
import { Profile } from "../profile";

const turnPopupCoordinates = {
  x: 800,
  y: 400
};

export class DeleteWarningPopup extends Phaser.GameObjects.Container {
  blockingLayer: Phaser.GameObjects.Rectangle;
  backgroundImage: Phaser.GameObjects.Image;
  okButtonImage: Phaser.GameObjects.Image;
  cancelButtonImage: Phaser.GameObjects.Image;

  popupText: Phaser.GameObjects.Text;
  okButtonText: Phaser.GameObjects.Text;
  cancelButtonText: Phaser.GameObjects.Text;

  constructor(context: ProfileScene, profile: Profile) {
    super(context, turnPopupCoordinates.x, turnPopupCoordinates.y);

    // Used to block the user from clicking on some other part of the game
    this.blockingLayer = context.add.rectangle(0, 0, 2000, 2000, 0x000000, 0.001) // Almost invisible
      .setOrigin(0.5)
      .setInteractive();

    this.backgroundImage = context.add.image(0, 0, 'popupBackground').setDisplaySize(500, 300);
    this.okButtonImage = context.add.image(-90, 60, 'popupButton').setTint(0x990000).setDisplaySize(110, 60).setInteractive({ useHandCursor: true });
    this.cancelButtonImage = context.add.image(90, 60, 'popupButton').setTint(0x007BFF).setDisplaySize(110, 60).setInteractive({ useHandCursor: true });

    // Warning text
    this.popupText = context.add.text(0, -50, "Delete account? All data will be lost", {
      fontFamily: "proLight",
      fontSize: 40,
      color: '#ffffff',
      align: 'center',
      lineSpacing: 10,
      wordWrap: {
        width: 400,
        useAdvancedWrap: true
      }
    }).setOrigin(0.5);

    // OK button
    this.okButtonText = context.add.text(-90, 60, "DELETE", {
      fontFamily: "proLight",
      fontSize: 30,
      color: '#ffffff'
    }).setOrigin(0.5);

    this.cancelButtonText = context.add.text(90, 60, "CANCEL", {
      fontFamily: "proLight",
      fontSize: 30,
      color: '#ffffff'
    }).setOrigin(0.5);

    this.okButtonImage.on('pointerdown', async () => {
      playSound(this.scene, EUiSounds.BUTTON_GENERIC);
      this.setVisible(false);
      await profile.handleDelete();
    });

    this.cancelButtonImage.on('pointerdown', () => {
      this.scene.sound.play(EUiSounds.BUTTON_FAILED);
      this.setVisible(false);
      profile.toggleFormVisibility(true);
    });

    this.add([
      this.blockingLayer,
      this.backgroundImage,
      this.popupText,
      this.okButtonImage,
      this.okButtonText,
      this.cancelButtonImage,
      this.cancelButtonText
    ]);
    this.setDepth(1002);
    this.setVisible(false);

    context.add.existing(this);
  }
}
