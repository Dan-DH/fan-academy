import { IItem } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { capitalize } from "../../utils/textAnimations";
import { getCardText } from "../../utils/unitCards";

export class ItemCard extends Phaser.GameObjects.Container {
  cardBackgroundImage: Phaser.GameObjects.Image;
  unitPictureImage: Phaser.GameObjects.Image;
  cardSeparatorImage: Phaser.GameObjects.Image;

  context: GameScene;

  cardFlavorText: Phaser.GameObjects.Text;
  cardTypeText: Phaser.GameObjects.Text;
  cardNameText: Phaser.GameObjects.Text;

  constructor(context: GameScene, data: IItem) {
    const cardY = data.boardPosition > 44 ? -180 : 0;
    super(context, 0, cardY);
    this.context = context;

    // Background, unit image, name and type, and separator
    this.cardBackgroundImage = context.add.image(10, 10, 'cardBackground');
    this.unitPictureImage = context.add.image(-130, -140, `${data.itemType}CardPic`).setOrigin(0.5).setScale(0.4);
    this.cardSeparatorImage = context.add.image(50, -100, 'cardSeparator').setOrigin(0.5).setScale(1.3);

    const { cardText, cardType, cardName } = getCardText(data.itemType);

    this.cardNameText = this.context.add.text(55, -170, capitalize(cardName!), {
      fontFamily: "proLight",
      fontSize: 50,
      color: '#ffffff'
    }).setOrigin(0.5);

    this.cardTypeText = this.context.add.text(55, -130, capitalize(cardType), {
      fontFamily: "proLight",
      fontSize: 30,
      color: '#ffffff'
    }).setOrigin(0.5);

    // Flavour text
    this.cardFlavorText = this.context.add.text(-170, -80, cardText, {
      fontFamily: "proLight",
      fontSize: 28,
      color: '#ffffff',
      wordWrap: {
        width: this.cardBackgroundImage.width - 50,
        useAdvancedWrap: true
      }
    }).setOrigin(0);

    this.add([
      this.cardBackgroundImage,
      this.unitPictureImage,
      this.cardSeparatorImage,
      this.cardFlavorText,
      this.cardTypeText,
      this.cardNameText
    ]);
  }
}