import GameScene from "../game.scene";

export function replayButton(context: GameScene): Phaser.GameObjects.Image {
  const replayButton = context.add.image(460, 70, 'gameAtlas', 'replayButton').setScale(1.6).setInteractive({ useHandCursor: true }).setVisible(!context.triggerReplay);

  replayButton.on('pointerdown', () => {
    // context.sound.play(EUiSounds.BUTTON_GENERIC);

    context.scene.restart({
      userId: context.userId,
      colyseusClient: context.colyseusClient,
      currentGame: context.currentGame,
      triggerReplay: true
    });
  });

  return replayButton;
}