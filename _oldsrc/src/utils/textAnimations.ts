import { GameObjects } from "phaser";
import GameScene from "../scenes/game.scene";
import UIScene from "../scenes/ui.scene";

export function textAnimationSizeIncrease(text: GameObjects.Text, scale = 2): Promise<void> {
  return new Promise((resolve) => {
    text.scene.tweens.add({
      targets: text,
      scale,
      alpha: 50,
      duration: 1000,
      onComplete: () => {
        text.destroy();
        resolve();
      }
    });
  });
}

export function textAnimationFadeOut(text: GameObjects.Text, duration = 1000): Promise<void> {
  return new Promise((resolve) => {
    text.scene.tweens.add({
      targets: text,
      alpha: 0,
      duration,
      ease: 'Linear',
      onComplete: () => {
        text.destroy();
        resolve();
      }
    });
  });
}

export function gameListFadeOutText(context: UIScene | GameScene, x: number, y: number, message: string): Phaser.GameObjects.Text {
  return context.add.text(x, y, message, {
    fontFamily: "proLight",
    fontSize: 60,
    color: '#fffb00'
  }).setDepth(9999);
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function truncateText(text: string, maxLength: number) {
  return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
}