import { sendChallengeAcceptedMessage } from "../../colyseus/colyseusLobbyRoom";
import { EChallengePopup, EFaction, EGameModes, EUiSounds } from "../../enums/gameEnums";
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

  casualCheckBox: Phaser.GameObjects.DOMElement;
  rankedCheckBox: Phaser.GameObjects.DOMElement;

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

    this.backgroundImage = context.add.image(0, 0, 'popupBackground').setDisplaySize(500, 500);

    this.councilButtonImage = context.add.image(-150, -20, EFaction.COUNCIL).setScale(0.4).setInteractive({ useHandCursor: true });
    this.elvesButtonImage = context.add.image(0, -20, EFaction.DARK_ELVES).setScale(0.4).setInteractive({ useHandCursor: true });
    this.dwarvesButtonImage = context.add.image(140, -15, EFaction.DWARVES).setScale(0.4).setInteractive({ useHandCursor: true });
    this.casualCheckBox = this.createGameModeRadioButton(context, -100, 70, 'Casual');
    this.rankedCheckBox = this.createGameModeRadioButton(context, 70, 70, 'Ranked');
    this.cancelButtonImage = context.add.image(0, 150, 'popupButton').setTint(0x990000).setDisplaySize(110, 60).setInteractive({ useHandCursor: true });

    let popupString: string;

    if (challengeType === EChallengePopup.SEND) {
      popupString = `Pick a faction to challenge ${truncateText(username!, 20)}`;
    } else if (challengeType === EChallengePopup.ACCEPT) {
      popupString = 'Pick a faction to accept the challenge';
    } else {
      popupString = 'Pick a faction to search for an opponent!';
    }

    this.popupText = context.add.text(0, -120, popupString, {
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

    this.cancelButtonText = context.add.text(0, 150, "BACK", {
      fontFamily: "proLight",
      fontSize: 30,
      color: '#ffffff'
    }).setOrigin(0.5);

    const buttonCallback = async (faction: EFaction) => {
      const casualGame = (this.casualCheckBox!.getChildByName('') as HTMLInputElement).checked;

      const gameMode = casualGame ? EGameModes.CASUAL : EGameModes.RANKED;

      console.log(gameMode);

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

      if (challengeType === EChallengePopup.ACCEPT && context instanceof UIScene) sendChallengeAcceptedMessage(context.lobbyRoom!, gameId!, context.userId, faction, gameMode);

      if (challengeType === EChallengePopup.OPEN && context instanceof UIScene) {
        createNewGame(context, faction, gameMode);
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

    this.dwarvesButtonImage.on('pointerdown', async () => {
      playSound(this.scene, EUiSounds.BUTTON_PLAY);
      await buttonCallback(EFaction.DWARVES);
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
      this.cancelButtonText,
      this.casualCheckBox,
      this.rankedCheckBox
    ]);
    this.setDepth(1002);

    context.add.existing(this);
  }

  createGameModeRadioButton(context: LeaderboardScene | UIScene | GameScene, x: number, y: number, label: string) {
    const dom = context.add.dom(x, y).createFromHTML(`
    <label style="color:white; font-size: 40px; font-family: proLight; cursor: pointer;">
      <input type="radio" name="gameMode" style="width: 20px; height: 20px;"/> ${label}
    </label>
  `);
    return dom;
  }
}