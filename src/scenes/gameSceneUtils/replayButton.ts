import GameScene from "../game.scene";

export function replayButton(context: GameScene): Phaser.GameObjects.Image {
  const replayButton = context.add.image(460, 70, 'replayButton').setScale(1.3).setInteractive({ useHandCursor: true }).setVisible(!context.triggerReplay);

  replayButton.on('pointerdown', () => {
    context.thinkingMusic.stop()
    context.scene.restart({
      userId: context.userId,
      colyseusClient: context.colyseusClient,
      currentGame: context.currentGame,
      currentRoom: context.currentRoom,
      triggerReplay: true
    });
  });

  return replayButton;
}