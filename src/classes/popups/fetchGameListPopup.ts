import { fanAcademy } from "../../main";

const challengePopupCoordinates = {
  x: 800,
  y: 400
};

export class FetchGameListPopup extends Phaser.GameObjects.Container {
  blockingLayer: Phaser.GameObjects.Rectangle | undefined;
  fetchingGamesPopup: Phaser.GameObjects.Image | undefined;
  fetchingGamesText: Phaser.GameObjects.Text | undefined;

  constructor() {
    const context = fanAcademy.scene.getScene('MainMenuScene');
    super(context, challengePopupCoordinates.x, challengePopupCoordinates.y);

    this.blockingLayer = context.add.rectangle(0, 0, 2000, 2000, 0x000000, 0.001)
      .setOrigin(0.5)
      .setInteractive();

    this.fetchingGamesPopup = context.add.image(0, 0, 'gameAtlas', 'cardBackground').setDisplaySize(500, 250);

    this.fetchingGamesText = context.add.text(0, -15, 'Fetching game list...', {
      fontFamily: "proHeavy",
      fontSize: 60,
      color: '#ffffff',
      align: 'center',
      lineSpacing: 10,
      wordWrap: {
        width: 400,
        useAdvancedWrap: true
      }
    }).setOrigin(0.5);

    this.add([
      this.blockingLayer,
      this.fetchingGamesPopup,
      this.fetchingGamesText
    ]);
    this.setDepth(1002);

    context.add.existing(this);
  }
}