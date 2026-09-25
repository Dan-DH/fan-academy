import { EGameSceneMode } from "../../enums/gameEnums";
import GameScene from "../game.scene";

export function replayButton(context: GameScene): Phaser.GameObjects.Image {
  const replayButton = context.add.image(460, 70, 'gameAtlas', 'replayButton').setScale(1.6).setInteractive({ useHandCursor: true }).setVisible(context.gameSceneMode === EGameSceneMode.TURN_REPLAY); // FIXME:

  replayButton.on('pointerdown', () => {
    // context.sound.play(EUiSounds.BUTTON_GENERIC);

    context.scene.restart({
      userId: context.userId,
      currentGame: context.clonedGame,
      triggerReplay: true
    });
  });

  return replayButton;
}