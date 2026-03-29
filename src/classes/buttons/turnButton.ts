import { EUiSounds, EActionType } from "../../enums/gameEnums";
import GameScene from "../../scenes/game.scene";

export class TurnButton {
  context: GameScene;
  buttonImage: Phaser.GameObjects.Image;
  constructor(context: GameScene) {
    this.context = context;
    this.buttonImage =  context.add.image(1300, 725, 'turnButton').setOrigin(0.5).setScale(1.1).setInteractive({ useHandCursor: true });

    // Sending a turn
    this.buttonImage.on('pointerdown', async () => {
      if (context.currentGame && context.activePlayer === context.userId) {
        context.sound.play(EUiSounds.BUTTON_PLAY);

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
    if (this.context.currentTurnAction!  < 5 ) gameController.addActionToState(EActionType.PASS);

    const status = this.context.registry.get('networkStatus');
    if (status === 'online') {
      await gameController.endOfTurnActions();
    } else {
      console.log('No internet connection detected, unable to send turn');
    }
  }
}