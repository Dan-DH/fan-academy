import { sendChallengeAcceptedMessage } from "../../colyseus/colyseusLobbyRoom";
import { EChallengePopup, EFaction, EUiSounds } from "../../enums/gameEnums";
import { newGameChallenge } from "../../queries/gameQueries";
import GameScene from "../../scenes/game.scene";
import { createNewGame } from "../../scenes/gameSceneUtils/createGame";
import LeaderboardScene from "../../scenes/leaderboard.scene";
import UIScene from "../../scenes/ui.scene";
import { playSound } from "../../utils/gameSounds";
import { truncateText, textAnimationFadeOut } from "../../utils/textAnimations";

const challengePopupCoordinates = {
  x: 800,
  y: 400
};

export class ChallengePopup extends Phaser.GameObjects.Container {
  blockingLayer: Phaser.GameObjects.Rectangle;
  backgroundImage: Phaser.GameObjects.Image;
  councilButtonImage: Phaser.GameObjects.Image;
  elvesButtonImage: Phaser.GameObjects.Image;
  dwarvesButtonImage: Phaser.GameObjects.Image;
  cancelButtonImage: Phaser.GameObjects.Image;

  popupText: Phaser.GameObjects.Text;
  cancelButtonText: Phaser.GameObjects.Text;

  constructor(params: {
    context: LeaderboardScene | UIScene | GameScene,
    opponentId?: string,
    challengeType: EChallengePopup,
    username?: string,
    gameId?: string
  }) {
    const { context, opponentId, challengeType, username, gameId } = params;
    super(context, challengePopupCoordinates.x, challengePopupCoordinates.y);

    // Used to block the user from clicking on some other part of the game
    this.blockingLayer = context.add.rectangle(0, 0, 2000, 2000, 0x000000, 0.001) // Almost invisible
      .setOrigin(0.5)
      .setInteractive();

    this.backgroundImage = context.add.image(0, 0, 'popupBackground').setDisplaySize(500, 400);
    this.councilButtonImage = context.add.image(-150, 30, EFaction.COUNCIL).setScale(0.4).setInteractive({ useHandCursor: true });
    this.elvesButtonImage = context.add.image(0, 30, EFaction.DARK_ELVES).setScale(0.4).setInteractive({ useHandCursor: true });
    this.dwarvesButtonImage = context.add.image(140, 35, EFaction.DWARVES).setScale(0.4).setInteractive({ useHandCursor: true });
    this.cancelButtonImage = context.add.image(0, 120, 'popupButton').setTint(0x990000).setDisplaySize(110, 60).setInteractive({ useHandCursor: true });

    let popupString: string;

    if (challengeType === EChallengePopup.SEND) {
      popupString = `Pick a faction to challenge ${truncateText(username!, 20)}`;
    } else if (challengeType === EChallengePopup.ACCEPT) {
      popupString = 'Pick a faction to accept the challenge';
    } else {
      popupString = 'Pick a faction to search for an opponent!';
    }

    this.popupText = context.add.text(0, -85, popupString, {
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

    this.cancelButtonText = context.add.text(0, 120, "BACK", {
      fontFamily: "proLight",
      fontSize: 30,
      color: '#ffffff'
    }).setOrigin(0.5);

    const buttonCallback = async (faction: EFaction) => {
      context.sound.play(EUiSounds.BUTTON_GENERIC);

      this.setVisible(false);
      if (challengeType === EChallengePopup.SEND) {
        const result = await newGameChallenge(context.userId, faction, opponentId!);
        if (!result) {
          const openGameLimitText = () => {
            return context.add.text(200, 350, `A player has reached the max amount of open games`, {
              fontFamily: "proLight",
              fontSize: 60,
              color: '#fffb00'
            }).setDepth(999);
          };
          textAnimationFadeOut(openGameLimitText(), 3000);
        }
      }

      if (challengeType === EChallengePopup.ACCEPT && context instanceof UIScene) sendChallengeAcceptedMessage(context.lobbyRoom!, gameId!, context.userId, faction);

      if (challengeType === EChallengePopup.OPEN && context instanceof UIScene) {
        createNewGame(context, faction);
      }
    };

    this.councilButtonImage.on('pointerdown', async () => {
      playSound(this.scene, EUiSounds.BUTTON_PLAY);
      await buttonCallback(EFaction.COUNCIL);
    });

    this.elvesButtonImage.on('pointerdown', async () => {
      playSound(this.scene, EUiSounds.BUTTON_PLAY);
      await buttonCallback(EFaction.DARK_ELVES);
    });

    this.cancelButtonImage.on('pointerdown', () => {
      this.scene.sound.play(EUiSounds.BUTTON_FAILED);
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
      this.cancelButtonImage,
      this.cancelButtonText
    ]);
    this.setDepth(1002);

    context.add.existing(this);
  }
}