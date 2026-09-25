import { EActionType } from "../../enums/gameEnums";
import GameScene from "../../scenes/game.scene";

export class TurnButton {
  context: GameScene;
  buttonImage: Phaser.GameObjects.Image;
  constructor(context: GameScene) {
    this.context = context;
    this.buttonImage =  context.add.image(1300, 725, 'gameAtlas', 'turnButton').setOrigin(0.5).setScale(1.3).setInteractive({ useHandCursor: true });

    // Sending a turn
    this.buttonImage.on('pointerdown', async () => {
      if (this.context.clonedGame! && context.activePlayer === context.userId) {
        // context.sound.play(EUiSounds.BUTTON_PLAY);

        console.log('Clicked on send turn');

        if (context.hasActionsLeft()) {
          context.turnPopup!.setVisible(true);
          return;
        }

        await this.handleSendingTurn();
      }
    });
  }

  async handleSendingTurn(): Promise<void> {
    if (this.context.currentTurnAction!  < 5 ) this.context.addActionToState(EActionType.PASS);

    const status = this.context.registry.get('networkStatus');
    if (status === 'online') {
      await this.context.endOfTurnActions();
    } else {
      console.log('No internet connection detected, unable to send turn');
    }
  }
}