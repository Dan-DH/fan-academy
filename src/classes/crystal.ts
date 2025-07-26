import { EGameSounds, ETiles, EWinConditions } from "../enums/gameEnums";
import { ICrystal, ITile } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";
import { roundToFive, effectSequence, timeDelay } from "../utils/gameUtils";
import { makeCrystalClickable } from "../utils/makeUnitClickable";
import { CrystalCard } from "./crystalCard";
import { FloatingText } from "./floatingText";
import { HealthBar } from "./healthBar";
import { Tile } from "./tile";

export class Crystal extends Phaser.GameObjects.Container {
  belongsTo: number;
  maxHealth: number;
  currentHealth: number;
  isDestroyed: boolean;
  isLastCrystal: boolean;
  boardPosition: number;
  row: number;
  col: number;
  debuffLevel: number;

  context: GameScene;

  pedestalImage: Phaser.GameObjects.Image;
  crystalImage: Phaser.GameObjects.Image;
  singleCrystalDebuff: Phaser.GameObjects.Image;
  doubleCrystalDebuff: Phaser.GameObjects.Image;
  attackReticle: Phaser.GameObjects.Image;
  blockedLOS: Phaser.GameObjects.Image;

  debuffEventSingle: Phaser.Time.TimerEvent;
  debuffEventDouble: Phaser.Time.TimerEvent;

  healthBar: HealthBar;
  unitCard: CrystalCard;

  constructor(context: GameScene, data: ICrystal, tile: ITile) {
    const { x, y } = context.centerPoints[data.boardPosition];
    super(context, x, y);
    this.context = context;

    this.maxHealth = data.maxHealth;
    this.currentHealth = data.currentHealth;
    this.isDestroyed = data.isDestroyed;
    this.isLastCrystal = data.isLastCrystal;
    this.boardPosition = data.boardPosition;
    this.row = tile.row;
    this.col = tile.col;
    this.belongsTo = data.belongsTo;
    this.debuffLevel = data.debuffLevel < 0 ? 0 : data.debuffLevel; // safeguard for bug that keeps making debuff level negative. Remove when fixed

    this.healthBar = new HealthBar(context, data, -38, -70);
    this.unitCard = new CrystalCard(context, data).setVisible(false);

    this.pedestalImage = context.add.image(0, 0, 'pedestal').setScale(0.8);
    const crystalTexture = data.currentHealth <= data.maxHealth / 2 ? 'crystalDamaged' : 'crystalFull';
    this.crystalImage = context.add.image(0, -30, crystalTexture).setScale(0.8);

    this.blockedLOS = context.add.image(0, -10, 'blockedLOS').setOrigin(0.5).setName('blockedLOS').setVisible(false);

    const crystalColor = this.belongsTo === 1 ?  0x3399ff : 0x990000;
    this.crystalImage.setTint(crystalColor);

    // Debuff images and animation
    this.singleCrystalDebuff = context.add.image(0, -30, 'crystalDebuff_1').setVisible(false);
    this.doubleCrystalDebuff = context.add.image(0, -30, 'crystalDebuff_3').setVisible(false);

    const crystalDebuffEvent = (debuffImage: Phaser.GameObjects.Image, texture1: string, texture2: string) => {
      let frame = 0;
      return this.scene.time.addEvent({
        delay: 100, // milliseconds between frames
        loop: true,
        callback: () => {
          frame = 1 - frame; // Toggle between 0 and 1
          debuffImage.setTexture(frame === 0 ? texture1 : texture2);
        }
      });};

    this.debuffEventSingle = crystalDebuffEvent(this.singleCrystalDebuff, 'crystalDebuff_1', 'crystalDebuff_2');
    this.debuffEventDouble = crystalDebuffEvent(this.doubleCrystalDebuff, 'crystalDebuff_3', 'crystalDebuff_4');

    // Attack reticle and animation
    this.attackReticle = context.add.image(0, -10, 'attackReticle').setOrigin(0.5).setScale(0.8).setName('attackReticle').setVisible(false);
    const addTween = (reticle: Phaser.GameObjects.Image) => {
      context.tweens.add({
        targets: reticle,
        angle: 360,
        duration: 7000,
        repeat: -1,
        ease: 'Linear',
        onRepeat: () => {
          // Reset the angle to 0 each time to prevent overflow
          reticle.angle = 0;
        }
      });
    };
    addTween(this.attackReticle);

    this.add([this.pedestalImage, this.crystalImage, this.singleCrystalDebuff, this.doubleCrystalDebuff, this.healthBar, this.attackReticle, this.blockedLOS, this.unitCard]).setSize(90, 95).setInteractive({ useHandCursor: true }).setDepth(this.boardPosition + 10);
    makeCrystalClickable(this, this.context);

    context.add.existing(this);
  }

  updateDebuffAnimation(newLevel: number): void {
    switch (newLevel) {
      case 0:
        this.singleCrystalDebuff.setVisible(false);
        this.doubleCrystalDebuff.setVisible(false);
        break;

      case 1:
        this.singleCrystalDebuff.setVisible(true);
        this.doubleCrystalDebuff.setVisible(false);
        break;

      case 2:
        this.singleCrystalDebuff.setVisible(false);
        this.doubleCrystalDebuff.setVisible(true);
        break;

      default:
        console.error('updateDebuffAnimation() level and case dont match', newLevel);
        break;
    }

    if (newLevel !== this.debuffLevel) {
      this.debuffLevel = newLevel;
      this.updateTileData();
    }
  }

  getTile(): Tile {
    const tile = this.context?.gameController?.board.getTileFromBoardPosition(this.boardPosition);
    if (!tile) throw new Error('getTile() -> No tile found');

    return tile;
  }

  updateTileData(): void {
    const tile = this.getTile();

    if (this.debuffLevel < 0) {
      this.debuffLevel = 0;
      this.updateDebuffAnimation(this.debuffLevel);
    }

    tile.crystal = {
      belongsTo: this.belongsTo,
      maxHealth: this.maxHealth,
      currentHealth: this.currentHealth,
      isDestroyed: this.isDestroyed,
      isLastCrystal: this.isLastCrystal,
      boardPosition: this.boardPosition,
      row: this.row,
      col: this.col,
      debuffLevel: this.debuffLevel
    };
  }

  //attackType and hitSound included to match hero.getsDamaged to simplify calls
  getsDamaged(damage: number, _attackType: any, delay = 0, hitSound = true): [Promise<void>, number] {
    const totalDamage = roundToFive(damage + 300 * this.debuffLevel);
    const damageTaken = totalDamage > this.currentHealth ? this.currentHealth : totalDamage;
    this.currentHealth -= damageTaken;

    if (this.currentHealth <= this.maxHealth / 2 && this.currentHealth + totalDamage >= this.maxHealth / 2) {
      this.crystalImage.setTexture('crystalDamaged');
    }

    const replayDelay = this.showDamage(damageTaken, delay, hitSound);

    return [replayDelay, 0]
  }

  async showDamage(damageTaken: number, delay: number, hitSound: boolean){
    let replayWait = 0;
    if (this.currentHealth <= 0) {
      replayWait = 2000
      this.removeFromGame(delay);
      await timeDelay(this.context, delay);
    } else {
      await timeDelay(this.context, delay);
      replayWait = 100
      if (hitSound) {
        const damageSounds = [EGameSounds.DAMAGE_CRYSTAL_1, EGameSounds.DAMAGE_CRYSTAL_2] 
        effectSequence(this.scene, Phaser.Math.RND.pick(damageSounds));
      }
    }

    // Update hp bar
    this.healthBar.setHealth(this.maxHealth, this.currentHealth);

    // Show damage numbers
    if (damageTaken > 0) new FloatingText(this.context, this.x, this.y - 50, damageTaken.toString());        


    this.unitCard.updateCardHealth(this.currentHealth, this.maxHealth);
    this.updateTileData();

    // Update player HP bar
    if (this.belongsTo === 1) this.context.gameController?.gameUI.banner.playerOneHpBar.setHealth();
    if (this.belongsTo === 2) this.context.gameController?.gameUI.banner.playerTwoHpBar.setHealth();

    await timeDelay(this.context, replayWait);
  }

  async removeFromGame(delay: number): Promise<void> {
    // Remove destoyed crystal from the board array
    const crystalArray = this.context.gameController!.board.crystals;
    const index = crystalArray.findIndex(crystal => crystal.boardPosition === this.boardPosition);
    crystalArray.splice(index, 1);

    // Update the remaining crystal or set gameOver
    if (this.isLastCrystal) {
      this.context.gameController!.gameOver = {
        winCondition: EWinConditions.CRYSTAL,
        winner: this.context.activePlayer!
      };
    } else {
      const otherCrystal = crystalArray.find(crystal => crystal.belongsTo === this.belongsTo);
      if (!otherCrystal) throw new Error('Crystal getsDestroyed() No other crystal found');

      otherCrystal.isLastCrystal = true;
      otherCrystal.updateTileData();
    }

    await timeDelay(this.context, delay);

    effectSequence(this.scene, EGameSounds.DESTROY_CRYSTAL);

    await timeDelay(this.context, 1000); // TODO: sync with animations when added

    const tile = this.getTile();
    tile.crystal = undefined;
    tile.obstacle = false;
    tile.tileType = ETiles.BASIC;

    // Remove animations
    this.scene.tweens.killTweensOf(this);

    this.list.forEach(child => {
      this.scene.tweens.killTweensOf(child);
    });

    // Remove events
    this.debuffEventSingle.remove(false);
    this.debuffEventDouble.remove(false);

    // Destroy container and children
    this.destroy(true);
  }
}