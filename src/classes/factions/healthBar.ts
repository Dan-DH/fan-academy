import { ICrystal, IHero } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { belongsToPlayer } from "../../utils/gameUtils";

export class HealthBar extends Phaser.GameObjects.Container {
  context: GameScene;

  background: Phaser.GameObjects.Image;
  healthBar: Phaser.GameObjects.Image;

  fullWidth: number = 78;

  constructor(context: GameScene, unit: IHero | ICrystal, x: number, y: number) {
    super(context, x, y);

    this.context = context;

    this.background = context.add.image(0, 0, 'HpBackground').setOrigin(0);
    const barType =  belongsToPlayer(context, unit) ? 'HpAlly' : 'HpEnemy';
    this.healthBar = context.add.image(0, 0, barType).setOrigin(0);

    this.setHealth(unit.maxHealth, unit.currentHealth);

    // Group into container
    this.add([this.background, this.healthBar]);
  }

  // Updates health visually
  setHealth(maxHealth: number, currentHealth: number) {
    const ratio = currentHealth / maxHealth;
    this.healthBar.displayWidth = this.fullWidth * ratio;
  }
}
