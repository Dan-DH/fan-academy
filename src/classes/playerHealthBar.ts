import GameScene from "../scenes/game.scene";
import { Board } from "./board";

export class PlayerHealthBar extends Phaser.GameObjects.Container {
  context: GameScene;
  board: Board;

  background: Phaser.GameObjects.Image;
  healthBar: Phaser.GameObjects.Image;

  maxHealth = 9000;
  currentHealth = 0;
  player: number;

  fullWidth: number;

  constructor(context: GameScene, board: Board, player: 1 | 2, x: number, y: number) {
    super(context, x, y);

    this.context = context;
    this.board = board;
    this.player = player;

    const coordMap = {
      1: {
        x: 640,
        y: 55
      },
      2: {
        x: 930,
        y: 55
      }
    };

    this.background = context.add.image(coordMap[player].x, coordMap[player].y, 'HpBackground').setScale(3).setOrigin(0);
    this.healthBar = context.add.image(coordMap[player].x, coordMap[player].y, 'HpAlly').setScale(3).setOrigin(0);

    this.fullWidth = this.healthBar.displayWidth;

    this.setHealth();

    // Group into container
    this.add([this.background, this.healthBar]);

    context.add.existing(this);
  }

  // Updates health visually
  setHealth() {
    this.currentHealth = 0;
    this.board.crystals.forEach(crystal => {if (crystal.belongsTo === this.player) this.currentHealth += crystal.currentHealth;});

    const ratio = this.currentHealth / this.maxHealth;
    this.healthBar.displayWidth = this.fullWidth * ratio;

    // Adjust x so bar depletes from the correct side
    if (this.player === 1) this.healthBar.x = this.background.x + (this.fullWidth - this.healthBar.displayWidth);
  }
}
