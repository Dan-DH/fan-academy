import { colyseusService } from "../../colyseus/colyseusService";
import { EFaction } from "../../enums/gameEnums";
import UIScene from "../../scenes/ui.scene";
import { factionArray } from "../../utils/gameUtils";

const challengePopupCoordinates = {
  x: 800,
  y: 400
};

export class ChallengeAcceptPopup extends Phaser.GameObjects.Container {
  blockingLayer: Phaser.GameObjects.Rectangle;
  backgroundImage: Phaser.GameObjects.Image;
  councilButtonImage: Phaser.GameObjects.Image;
  elvesButtonImage: Phaser.GameObjects.Image;
  dwarvesButtonImage: Phaser.GameObjects.Image;
  tribeButtonImage: Phaser.GameObjects.Image;
  randomButtonImage: Phaser.GameObjects.Image;
  cancelButtonImage: Phaser.GameObjects.Image;

  popupText: Phaser.GameObjects.Text;
  cancelButtonText: Phaser.GameObjects.Text;

  constructor(context: UIScene, gameId: string) {
    super(context, challengePopupCoordinates.x, challengePopupCoordinates.y);

    // Used to block the user from clicking on some other part of the game
    this.blockingLayer = context.add.rectangle(0, 0, 2000, 2000, 0x000000, 0.001) // Almost invisible
      .setOrigin(0.5)
      .setInteractive();

    this.backgroundImage = context.add.image(0, 0, 'gameAtlas', 'cardBackground').setDisplaySize(500, 500);

    this.councilButtonImage = context.add.image(-150, -20, 'gameAtlas', 'councilEmblem').setScale(1).setInteractive({ useHandCursor: true });
    this.elvesButtonImage = context.add.image(0, -20, 'gameAtlas', 'elvesEmblem').setScale(1).setInteractive({ useHandCursor: true });
    this.dwarvesButtonImage = context.add.image(140, -15, 'gameAtlas', 'dwarvesEmblem').setScale(1).setInteractive({ useHandCursor: true });
    this.tribeButtonImage = context.add.image(-70, 90, 'gameAtlas', 'OR-Emblem-hd').setScale(0.8).setInteractive({ useHandCursor: true });
    this.randomButtonImage = context.add.image(80, 90, 'gameAtlas', 'unknownFaction').setScale(1.3).setInteractive({ useHandCursor: true });

    this.cancelButtonImage = context.add.image(0, 190, 'gameAtlas', 'popupButton').setTint(0x990000).setDisplaySize(110, 60).setInteractive({ useHandCursor: true });

    this.popupText = context.add.text(0, -140, 'Pick a faction to accept the challenge', {
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

    this.cancelButtonText = context.add.text(0, 190, "BACK", {
      fontFamily: "proLight",
      fontSize: 30,
      color: '#ffffff'
    }).setOrigin(0.5);

    const buttonCallback = async (faction: EFaction) => {
      // context.sound.play(EUiSounds.BUTTON_GENERIC);
      this.setVisible(false);

      colyseusService.sendChallengeAcceptedMessage(gameId, context.userId, faction);
    };

    this.councilButtonImage.on('pointerdown', async () => {
      // this.scene.sound.play(EUiSounds.BUTTON_PLAY);
      await buttonCallback(EFaction.COUNCIL);
    });

    this.elvesButtonImage.on('pointerdown', async () => {
      // this.scene.sound.play(EUiSounds.BUTTON_PLAY);
      await buttonCallback(EFaction.DARK_ELVES);
    });

    this.dwarvesButtonImage.on('pointerdown', async () => {
      // this.scene.sound.play(EUiSounds.BUTTON_PLAY);
      await buttonCallback(EFaction.DWARVES);
    });

    this.tribeButtonImage.on('pointerdown', async () => {
      // this.scene.sound.play(EUiSounds.BUTTON_PLAY);
      await buttonCallback(EFaction.TRIBE);
    });

    this.randomButtonImage.on('pointerdown', async () => {
      // this.scene.sound.play(EUiSounds.BUTTON_PLAY);
      const faction = factionArray[Math.floor(Math.random() * factionArray.length)];
      await buttonCallback(faction);
    });

    this.cancelButtonImage.on('pointerdown', () => {
      // this.scene.sound.play(EUiSounds.BUTTON_FAILED);
      this.setVisible(false);
      this.destroy();
    });

    this.add([
      this.blockingLayer,
      this.backgroundImage,
      this.popupText,
      this.councilButtonImage,
      this.elvesButtonImage,
      this.dwarvesButtonImage,
      this.tribeButtonImage,
      this.randomButtonImage,
      this.cancelButtonImage,
      this.cancelButtonText
    ]);
    this.setDepth(1002);

    context.add.existing(this);
  }
}
