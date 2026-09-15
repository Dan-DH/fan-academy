import GameScene from "../scenes/game.scene";

export function debugHitArea(context: GameScene, container: Phaser.GameObjects.Container, color = 0xffff00) {
  const graphic = context.add.graphics();
  const area = container.input!.hitArea;

  graphic.lineStyle(2, color, 1);
  graphic.strokeRect(
    container.x + area.x,
    container.y + area.y,
    area.width,
    area.height
  );
  graphic.setDepth(9999);
}
