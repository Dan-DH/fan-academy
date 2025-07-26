import { EActionType } from "../enums/gameEnums";
import GameScene from "../scenes/game.scene";

export class TurnButton {
  context: GameScene;
  buttonImage: Phaser.GameObjects.Image;
  constructor(context: GameScene) {
    this.context = context;
    this.buttonImage =  context.add.image(1300, 725, 'turnButton').setOrigin(0.5).setScale(1.1).setInteractive({ useHandCursor: true });

    // Sending a turn
    this.buttonImage.on('pointerdown', async () => {
      if (context.currentGame && context.activePlayer === context.userId) {
        console.log('Clicked on send turn');

        if (context.gameController!.hasActionsLeft()) {
          context.gameController!.turnPopup.setVisible(true);
          return;
        }

        await this.handleSendingTurn();
      }
    });
  }

  async handleSendingTurn(): Promise<void> {
    const gameController = this.context.gameController!;
    if (this.context.currentTurnAction === 1) gameController.addActionToState(EActionType.PASS);

    // Remove KO'd units before end of turn actions to handle a possible game over
    await gameController.removeKOUnits();

    await gameController.endOfTurnActions();
  }
}