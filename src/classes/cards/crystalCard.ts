import { ICrystal } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";

export class CrystalCard extends Phaser.GameObjects.Container {
  cardBackgroundImage: Phaser.GameObjects.Image;
  unitPictureImage: Phaser.GameObjects.Image;
  cardSeparatorImage: Phaser.GameObjects.Image;
  hpBackgroundImage: Phaser.GameObjects.Image;
  hpBarImage: Phaser.GameObjects.Image;
  magicalResistanceImage: Phaser.GameObjects.Image;
  physicalResistanceImage: Phaser.GameObjects.Image;
  hpIconImage: Phaser.GameObjects.Image;

  context: GameScene;

  currentHpText: Phaser.GameObjects.Text;
  magicalResistanceText: Phaser.GameObjects.Text;
  physicalResistanceText: Phaser.GameObjects.Text;
  cardFlavorText: Phaser.GameObjects.Text;
  cardTypeText: Phaser.GameObjects.Text;
  cardNameText: Phaser.GameObjects.Text;

  constructor(context: GameScene, data: ICrystal) {
    super(context, 0, 0);
    this.context = context;

    // Background, unit image, name and type, and separator
    this.cardBackgroundImage = context.add.image(10, 10, 'cardBackground');
    this.unitPictureImage = context.add.image(-130, -140, 'crystalCardPic').setOrigin(0.5).setScale(0.4);
    this.cardSeparatorImage = context.add.image(50, -100, 'cardSeparator').setOrigin(0.5).setScale(1.3);

    this.cardNameText = this.context.add.text(55, -170, 'Crystal', {
      fontFamily: "proLight",
      fontSize: 50,
      color: '#ffffff'
    }).setOrigin(0.5);

    this.cardTypeText = this.context.add.text(55, -130, 'Victory Unit', {
      fontFamily: "proLight",
      fontSize: 30,
      color: '#ffffff'
    }).setOrigin(0.5);

    // Health
    this.hpBackgroundImage = context.add.image(-60, -60, 'hpBackground').setOrigin(0.5);
    this.hpBarImage = context.add.image(-118, -72, 'hpBar').setOrigin(0);
    this.setHealthBar(data.currentHealth, data.maxHealth);
    this.currentHpText = this.context.add.text(100, -60, `${data.currentHealth}/${data.maxHealth}`, {
      fontFamily: "proLight",
      fontSize: 35,
      color: '#ffffff'
    }).setOrigin(0.5);
    this.hpIconImage = context.add.image(-150, -60, 'hpIcon').setOrigin(0.5);

    // Resistances
    this.magicalResistanceImage = context.add.image(40, -10, 'magicalResistance').setOrigin(0.5);
    this.magicalResistanceText = this.context.add.text(100, -10, '0%', {
      fontFamily: "proLight",
      fontSize: 35,
      color: '#ffffff'
    }).setOrigin(0.5);

    this.physicalResistanceImage = context.add.image(-150, -10, 'physicalResistance').setOrigin(0.5);
    this.physicalResistanceText = this.context.add.text(-85, -10, '0%', {
      fontFamily: "proLight",
      fontSize: 35,
      color: '#ffffff'
    }).setOrigin(0.5);

    // Flavour text
    this.cardFlavorText = this.context.add.text(0, 50, 'Destroy all crystals to win the game!', {
      fontFamily: "proLight",
      fontSize: 30,
      color: '#ffffff',
      wordWrap: {
        width: this.cardBackgroundImage.width - 50,
        useAdvancedWrap: true
      }
    }).setOrigin(0.5);

    this.add([
      this.cardBackgroundImage,
      this.unitPictureImage,
      this.cardSeparatorImage,
      this.hpBackgroundImage,
      this.hpBarImage,
      this.magicalResistanceImage,
      this.physicalResistanceImage,
      this.hpIconImage,
      this.currentHpText,
      this.cardFlavorText,
      this.cardTypeText,
      this.cardNameText,
      this.physicalResistanceText,
      this.magicalResistanceText
    ]);
  }

  updateCardHealth(newHealth: number, maxHealth: number): void {
    this.currentHpText.setText(`${newHealth}/${maxHealth}`);
    this.setHealthBar(newHealth, maxHealth);
  }

  setHealthBar(currentHealth: number, maxHealth: number) {
    const fullWidth = this.hpBackgroundImage.width - 10;
    const ratio = currentHealth / maxHealth;
    this.hpBarImage.displayWidth = fullWidth * ratio;
  }
}