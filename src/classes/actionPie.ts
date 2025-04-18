import GameScene from "../scenes/game.scene";

const actionPieCoordinates = {
  x: 550,
  y: 730
};

export class ActionPie extends Phaser.GameObjects.Container {
  actionCircle;
  actionPie1: Phaser.GameObjects.Image;
  actionPie2: Phaser.GameObjects.Image;
  actionPie3: Phaser.GameObjects.Image;
  actionPie4: Phaser.GameObjects.Image;
  actionPie5: Phaser.GameObjects.Image;
  actionArrow: Phaser.GameObjects.Image;
  context: GameScene;

  constructor(context: GameScene) {
    super(context, actionPieCoordinates.x, actionPieCoordinates.y);

    this.context = context; // REVIEW: used only for debugging atm

    this.actionCircle = context.add.image(0, 0, 'actionCircle').setOrigin(0.5).setName('actionCircle');
    this.actionPie1 = context.add.image(12, -19, 'actionPie').setOrigin(0.5).setRotation(-0.3).setName('actionPie1');
    this.actionPie2 = context.add.image(24, 6, 'actionPie').setOrigin(0.5).setRotation(0.9).setName('actionPie2');
    this.actionPie3 = context.add.image(4, 25, 'actionPie').setOrigin(0.5).setRotation(2.2).setName('actionPie3');
    this.actionPie4 = context.add.image(-18, 13, 'actionPie').setOrigin(0.5).setRotation(3.4).setName('actionPie4');
    this.actionPie5 = context.add.image(-15, -15, 'actionPie').setOrigin(0.5).setRotation(4.7).setName('actionPie5');
    this.actionArrow = context.add.image(-35, 0, 'actionArrow').setOrigin(0.5).setRotation(-0.1).setName('actionArrow').setVisible(false);

    this.add([this.actionCircle, this.actionPie1, this.actionPie2, this.actionPie3, this.actionPie4, this.actionPie5, this.actionArrow]);

    context.add.existing(this);
    context.currentGameContainer?.add(this);
  }

  resetActionPie() {
    this.actionPie1.setVisible(true);
    this.actionPie2.setVisible(true);
    this.actionPie3.setVisible(true);
    this.actionPie4.setVisible(true);
    this.actionPie5.setVisible(true);
    this.actionArrow.setVisible(false);
    this.removeInteractive();
  }

  hideActionSlice(actionNumber: number) {
    switch (actionNumber) {
      case 1:
        this.actionPie1.setVisible(false);
        this.actionArrow.setVisible(true);
        break;
      case 2:
        this.actionPie2.setVisible(false);
        break;
      case 3:
        this.actionPie3.setVisible(false);
        break;
      case 4:
        this.actionPie4.setVisible(false);
        break;
      case 5:
        this.actionPie5.setVisible(false);
        break;
    }

    this.setSize(90, 90).setInteractive();

    this.on('pointerdown', () => {
      this.resetActionPie();
      this.context.gameController!.resetTurn();
    });
  };
}