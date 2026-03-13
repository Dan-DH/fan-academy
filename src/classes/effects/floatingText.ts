import GameScene from "../../scenes/game.scene";

export class FloatingText extends Phaser.GameObjects.Container {
  constructor(context: GameScene, x: number, y: number, text: string, isHealing = false) {
    super(context, x, y);

    const fontKey = isHealing ? 'greenFont' : 'redFont';
    const scale = isHealing ? 0.7 : 0.5;

    // Measure scaled width
    let totalWidth = 0;
    for (const char of text) {
      const frame = context.textures.get(fontKey).get(char);
      if (frame) totalWidth += frame.width * scale;
    }

    let offsetX = -totalWidth / 2;

    for (const char of text) {
      const sprite = context.add.image(0, 0, fontKey, char)
        .setOrigin(0, 0.7)
        .setScale(scale);

      const frameWidth = sprite.frame.width * scale;
      sprite.x = offsetX;
      sprite.y = 0;

      this.add(sprite);
      offsetX += frameWidth;
    }

    this.setDepth(1000);
    context.add.existing(this);

    context.tweens.add({
      targets: this,
      y: y - 30,
      duration: 1800,
      ease: 'easeOut',
      alpha: 0,
      onComplete: () => this.destroy()
    });
  }
}
