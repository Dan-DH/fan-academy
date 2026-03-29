import { EClass, EUiSounds } from "../../enums/gameEnums";
import { IHero, IItem } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { playSound } from "../../utils/gameSounds";

const turnPopupCoordinates = {
  x: 800,
  y: 400
};

export class DeckPopup extends Phaser.GameObjects.Container {
  blockingLayer: Phaser.GameObjects.Rectangle;
  backgroundRectangle: Phaser.GameObjects.Rectangle;
  cardImages: Phaser.GameObjects.Image[] = [];
  context: GameScene;

  constructor(context: GameScene) {
    super(context, turnPopupCoordinates.x, turnPopupCoordinates.y);
    this.context = context;

    // Used to block the user from clicking on some other part of the game
    this.blockingLayer = context.add.rectangle(0, 0, 2000, 2000, 0x000000, 0.001).setOrigin(0.5).setInteractive();

    this.blockingLayer.on('pointerdown', () => {
      playSound(this.scene, EUiSounds.BUTTON_GENERIC);

      this.setVisible(false);
    });

    this.backgroundRectangle = context.add.rectangle(50, 0, 700, 700, 0x222222, 0.5).setStrokeStyle(2, 0xffffff);

    this.add([
      this.blockingLayer,
      this.backgroundRectangle
    ]);
    this.setDepth(1002);
    this.setVisible(false);

    context.add.existing(this);
  }

  showDeckContents(deck: (IHero | IItem)[]) {
    // Clear old card images
    this.cardImages.forEach(img => img.destroy());
    this.cardImages = [];

    // Sort deck: heroes first, then alphabetically
    const classOrder = {
      [EClass.HERO]: 0,
      [EClass.ITEM]: 1
    };

    const sortedDeck = [...deck].sort((a, b) => {
      const classCompare = classOrder[a.class] - classOrder[b.class];
      if (classCompare !== 0) return classCompare;

      return a.unitId.localeCompare(b.unitId);
    });

    // Layout config
    const startX = -150;
    const startY = -250;
    const spacingX = 100;
    const spacingY = 100;
    const cardsPerRow = 5;

    // Calculate number of rows
    const totalCards = sortedDeck.length;
    const numRows = Math.ceil(totalCards / cardsPerRow);

    // Dynamically update background height
    const paddingY = 100; // Extra top/bottom padding
    const cardAreaHeight = numRows * spacingY;
    const newHeight = cardAreaHeight + paddingY;

    this.backgroundRectangle.setSize(this.backgroundRectangle.width, newHeight);

    // Center background around origin
    this.backgroundRectangle.setOrigin(0.5);

    // Position cards
    sortedDeck.forEach((card, index) => {
      const row = Math.floor(index / cardsPerRow);
      const col = index % cardsPerRow;

      const x = startX + col * spacingX;
      const y = startY + row * spacingY;

      let imageKey: string;
      if (card.class === EClass.HERO) {
        imageKey = `${(card as IHero).unitType}CardPic`;
      } else {
        imageKey = `${(card as IItem).itemType}CardPic`;
      }

      const cardImage = this.context.add.image(x, y, imageKey)
        .setDisplaySize(90, 90)
        .setOrigin(0.5);

      this.add(cardImage);
      this.cardImages.push(cardImage);
    });

    this.backgroundRectangle.y = startY + cardAreaHeight / 2 - spacingY / 2;

    this.setVisible(true);
  }
}
