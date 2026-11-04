import { EChallengePopup, EFaction, EGameModes, ETurnTimer } from "../../enums/gameEnums";
import { newGameChallenge } from "../../queries/gameQueries";
import GameScene from "../../scenes/game.scene";
import { createNewGame } from "../../scenes/gameSceneUtils/createGame";
import LeaderboardScene from "../../scenes/leaderboard.scene";
import UIScene from "../../scenes/ui.scene";
import { factionArray } from "../../utils/gameUtils";
import { truncateText, textAnimationFadeOut } from "../../utils/textAnimations";

const challengePopupCoordinates = {
  x: 800,
  y: 400
};

export class NewGamePopup extends Phaser.GameObjects.Container {
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
  brawlText: Phaser.GameObjects.Text;

  casualButton: Phaser.GameObjects.DOMElement;
  rankedButton: Phaser.GameObjects.DOMElement;
  brawlButton: Phaser.GameObjects.DOMElement;

  tunrTimerText: Phaser.GameObjects.Text;
  dailyTurn: Phaser.GameObjects.DOMElement;
  threeDayTurn: Phaser.GameObjects.DOMElement;
  weeklyTurn: Phaser.GameObjects.DOMElement;

  constructor(params: {
    context: LeaderboardScene | UIScene | GameScene,
    challengeType: EChallengePopup,
    opponentId?: string,
    username?: string,
  }) {
    const { context, opponentId, challengeType, username } = params;
    super(context, challengePopupCoordinates.x, challengePopupCoordinates.y);

    // Used to block the user from clicking on some other part of the game
    this.blockingLayer = context.add.rectangle(0, 0, 2000, 2000, 0x000000, 0.001) // Almost invisible
      .setOrigin(0.5)
      .setInteractive();

    this.backgroundImage = context.add.image(0, 0, 'gameAtlas', 'cardBackground').setDisplaySize(650, 700);

    this.councilButtonImage = context.add.image(-150, -130, 'gameAtlas', 'councilEmblem').setScale(1).setInteractive({ useHandCursor: true });
    this.elvesButtonImage = context.add.image(0, -130, 'gameAtlas', 'elvesEmblem').setScale(1).setInteractive({ useHandCursor: true });
    this.dwarvesButtonImage = context.add.image(140, -125, 'gameAtlas', 'dwarvesEmblem').setScale(1).setInteractive({ useHandCursor: true });
    this.tribeButtonImage = context.add.image(-70, -30, 'gameAtlas', 'OR-Emblem-hd').setScale(0.8).setInteractive({ useHandCursor: true });
    this.randomButtonImage = context.add.image(80, -30, 'gameAtlas', 'unknownFaction').setScale(1.3).setInteractive({ useHandCursor: true });
    this.casualButton = this.createGameModeRadioButton(context, -150, 70, 'Casual', true);
    this.rankedButton = this.createGameModeRadioButton(context, 0, 70, 'Ranked', false);
    this.brawlButton = this.createGameModeRadioButton(context, 150, 70, 'Brawl', false);

    this.dailyTurn = this.createTurnTimerRadioButton(context, -150, 195, '1 day', false);
    this.threeDayTurn = this.createTurnTimerRadioButton(context, 0, 195, '3 days', false);
    this.weeklyTurn = this.createTurnTimerRadioButton(context, 150, 195, '1 week', true);

    this.cancelButtonImage = context.add.image(0, 275, 'gameAtlas', 'popupButton').setTint(0x990000).setDisplaySize(110, 60).setInteractive({ useHandCursor: true });

    let popupString: string;

    if (challengeType === EChallengePopup.SEND) {
      popupString = `Pick a faction to challenge ${truncateText(username!, 20)}`;
    } else {
      popupString = 'Pick a faction to begin searching!';
    }

    this.popupText = context.add.text(0, -230, popupString, {
      fontFamily: "proLight",
      fontSize: 40,
      color: '#ffffff',
      align: 'center',
      lineSpacing: 10,
      wordWrap: {
        width: 500,
        useAdvancedWrap: true
      }
    }).setOrigin(0.5);

    this.cancelButtonText = context.add.text(0, 275, "BACK", {
      fontFamily: "proLight",
      fontSize: 30,
      color: '#ffffff'
    }).setOrigin(0.5);

    this.brawlText = context.add.text(170, 100, '(no crystal victory)', {
      fontFamily: "proLight",
      fontSize: 25,
      color: '#ffffff',
      align: 'center',
      lineSpacing: 10,
      wordWrap: {
        width: 300,
        useAdvancedWrap: true
      }
    }).setOrigin(0.5);

    this.tunrTimerText = context.add.text(0, 150, 'Turn timer', {
      fontFamily: "proLight",
      fontSize: 40,
      color: '#ffffff',
      align: 'center',
      lineSpacing: 10,
      wordWrap: {
        width: 500,
        useAdvancedWrap: true
      }
    }).setOrigin(0.5);

    const buttonCallback = async (faction: EFaction) => {
      const rankedGame = (this.rankedButton.node.querySelector('input') as HTMLInputElement).checked;
      const brawlGame = (this.brawlButton.node.querySelector('input') as HTMLInputElement).checked;
      const gameMode = rankedGame ? EGameModes.RANKED : brawlGame ? EGameModes.BRAWL : EGameModes.CASUAL;

      const daily = (this.dailyTurn.node.querySelector('input') as HTMLInputElement).checked;
      const threeDay = (this.threeDayTurn.node.querySelector('input') as HTMLInputElement).checked;
      const turnTimer = daily ? ETurnTimer.DAILY : threeDay ? ETurnTimer.THREE_DAYS : ETurnTimer.WEEKLY;
      // context.sound.play(EUiSounds.BUTTON_GENERIC);

      this.setVisible(false);

      if (challengeType === EChallengePopup.OPEN && context instanceof UIScene) {
        createNewGame(context, faction, gameMode, turnTimer);
      }

      if (challengeType === EChallengePopup.SEND) {
        const result = await newGameChallenge(context.userId, faction, opponentId!, gameMode, turnTimer);

        if (!result) {
          const openGameLimitText = () => {
            return context.add.text(200, 350, `Error creating game, please refresh the page`, {
              fontFamily: "proLight",
              fontSize: 60,
              color: '#fffb00'
            }).setDepth(999);
          };
          textAnimationFadeOut(openGameLimitText(), 3000);
        }
      }
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
      this.cancelButtonText,
      this.casualButton,
      this.rankedButton,
      this.brawlButton,
      this.brawlText,
      this.tunrTimerText,
      this.dailyTurn,
      this.threeDayTurn,
      this.weeklyTurn
    ]);
    this.setDepth(1002);

    context.add.existing(this);
  }

  createGameModeRadioButton(context: LeaderboardScene | UIScene | GameScene, x: number, y: number, label: string, isChecked: boolean) {
    const dom = context.add.dom(x, y).createFromHTML(`
    <label style="color:white; font-size: 40px; font-family: proLight; cursor: pointer;">
      <input type="radio" name="gameMode" ${isChecked ? 'checked' : ''} style="width: 20px; height: 20px;"/> ${label}
    </label>
  `);
    return dom;
  }

  createTurnTimerRadioButton(context: LeaderboardScene | UIScene | GameScene, x: number, y: number, label: string, isChecked: boolean) {
    const dom = context.add.dom(x, y).createFromHTML(`
    <label style="color:white; font-size: 40px; font-family: proLight; cursor: pointer;">
      <input type="radio" name="turnTimer" ${isChecked ? 'checked' : ''} style="width: 20px; height: 20px;"/> ${label}
    </label>
  `);
    return dom;
  }
}