import { IUserData } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { getPlayersKey } from "../../utils/playerUtils";
import { truncateText } from "../../utils/textAnimations";
import { PlayerHealthBar } from "../playerHealthBar";
import { DeckPopup } from "../popups/deckPopup";
import { Board } from "./board";

export class Banner extends Phaser.GameObjects.Container {
  playerOneHpBar: PlayerHealthBar;
  playerTwoHpBar: PlayerHealthBar;

  playerOneBanner: Phaser.GameObjects.Image;
  playerTwoBanner: Phaser.GameObjects.Image;

  playerOnePortrait: Phaser.GameObjects.Image;
  playerTwoPortrait: Phaser.GameObjects.Image;

  playerOneName: Phaser.GameObjects.Text;
  playerTwoName: Phaser.GameObjects.Text;

  deckPopup: DeckPopup;

  vsBanner: Phaser.GameObjects.Image;
  constructor(context: GameScene, board: Board, playerData: IUserData[]) {
    super(context, 0, 0);

    this.playerOneBanner = context.add.image(0, 0, 'playerBanner').setOrigin(0.5).setPosition(705, 80).setFlipX(true).setTint(0x3399ff);
    this.playerTwoBanner = context.add.image(0, 0, 'playerBanner').setOrigin(0.5).setPosition(1095, 80).setTint(0x990000);

    this.playerOnePortrait = context.add.image(0, 0, playerData[0].picture).setOrigin(0.5).setPosition(600, 73).setDisplaySize(256 * 0.3, 256 * 0.3).setDepth(1).setInteractive({ useHandCursor: true });
    this.playerTwoPortrait = context.add.image(0, 0, playerData[1].picture).setOrigin(0.5).setPosition(1200, 73).setDisplaySize(256 * 0.3, 256 * 0.3).setFlipX(true).setDepth(1).setInteractive({ useHandCursor: true });

    this.deckPopup = new DeckPopup(context);

    const showDeck = (playerData: IUserData) => {
      if (playerData._id === context.userId) {
        this.deckPopup.showDeckContents(context.gameController!.deck.getDeck());
      } else {
        const { opponent } = getPlayersKey(context);
        const opponentUnits = [...context[opponent]!.factionData.unitsInDeck, ...context[opponent]!.factionData.unitsInHand];

        this.deckPopup.showDeckContents(opponentUnits);
      }
    };
    this.playerOnePortrait.on('pointerdown', () => {
      showDeck(playerData[0]);
    });
    this.playerTwoPortrait.on('pointerdown', () => {
      showDeck(playerData[1]);
    });

    this.playerOneHpBar = new PlayerHealthBar(context, board, 1);
    this.playerTwoHpBar = new PlayerHealthBar(context, board, 2);

    this.playerOneName = context.add.text(645, 35, truncateText(playerData[0].username, 14), {
      fontFamily: "proLight",
      color: '#ffffff',
      fontSize: 40
    });

    this.playerTwoName = context.add.text(950, 35, truncateText(playerData[1].username, 14), {
      fontFamily: "proLight",
      color: '#ffffff',
      fontSize: 40
    });

    this.vsBanner = context.add.image(0, 0, 'vsBanner').setOrigin(0.5).setPosition(900, 75);

    this.add([this.playerOneBanner, this.playerTwoBanner, this.playerOneHpBar, this.playerTwoHpBar, this.playerOneName, this.playerTwoName, this.playerOnePortrait, this.playerTwoPortrait, this.vsBanner]);

    context.add.existing(this);
  }
}