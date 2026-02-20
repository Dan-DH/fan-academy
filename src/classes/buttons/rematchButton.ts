import { EChallengePopup } from "../../enums/gameEnums";
import GameScene from "../../scenes/game.scene";
import { ChallengePopup } from "../popups/challengePopup";

export class RematchButton extends Phaser.GameObjects.Container {
  buttonImage: Phaser.GameObjects.Image;
  buttonText: Phaser.GameObjects.Text;
  context: GameScene;
  constructor(context: GameScene) {
    super(context, 1300, 725);
    this.context = context;
    this.buttonImage = context.add.image(0, 0, 'popupBackground').setOrigin(0.5).setScale(1.1).setInteractive({ useHandCursor: true });

    this.buttonText = context.add.text(0, -5, "Again!", {
      fontFamily: "proHeavy",
      fontSize: 55,
      color: '#ffffff'
    }).setOrigin(0.5);

    this.buttonImage.on('pointerdown', async () => {
      new ChallengePopup({
        context,
        opponentId: context.opponentId!,
        challengeType: EChallengePopup.SEND,
        username: context.gameController!.playerData.find( player => player._id === context.opponentId!)?.username
      });
      return;
    });

    this.add([this.buttonImage, this.buttonText]);

    context.add.existing(this);
  }
}