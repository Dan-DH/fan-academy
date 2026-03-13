import { ICrystal } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { addCirclingTween, continuousAnimation, engineerShieldAnimation } from "../../utils/unitAnimations";

export class CrystalVisuals extends Phaser.GameObjects.Container {
  pedestalImage: Phaser.GameObjects.Image;
  crystalImage: Phaser.GameObjects.Image;
  singleCrystalDebuff: Phaser.GameObjects.Image;
  doubleCrystalDebuff: Phaser.GameObjects.Image;
  attackReticle: Phaser.GameObjects.Image;
  healReticle: Phaser.GameObjects.Image;
  blockedLOS: Phaser.GameObjects.Image;
  engineerShieldImage: Phaser.GameObjects.Image;

  debuffEventSingle: Phaser.Time.TimerEvent;
  debuffEventDouble: Phaser.Time.TimerEvent;

  constructor(context: GameScene, data: ICrystal) {
    super(context, 0, 0);
    const isBigCrystal = data.maxHealth === 9000;

    this.pedestalImage = context.add.image(0, 10, 'pedestal').setScale(0.8);
    const crystalTexture = data.currentHealth <= data.maxHealth / 2 ? 'crystalDamaged' : 'crystalFull';
    this.crystalImage = context.add.image(0, -30, crystalTexture).setScale(isBigCrystal ? 1 : 0.8);

    this.blockedLOS = context.add.image(0, -10, 'blockedLOS').setOrigin(0.5).setName('blockedLOS').setVisible(false);

    const crystalColor = data.belongsTo === 1 ?  0x3399ff : 0x990000;
    this.crystalImage.setTint(crystalColor);

    // Debuff images and animation
    this.singleCrystalDebuff = context.add.image(0, -30, 'crystalDebuff_1').setVisible(false);
    this.doubleCrystalDebuff = context.add.image(0, -30, 'crystalDebuff_3').setVisible(false);

    const isShielded = data.engineerShield ? true : false;
    this.engineerShieldImage = context.add.image(0, -20, 'enginnerShield').setOrigin(0.5).setVisible(isShielded);
    engineerShieldAnimation(this.engineerShieldImage);

    this.debuffEventSingle = continuousAnimation(this.singleCrystalDebuff, ['crystalDebuff_1', 'crystalDebuff_2']);
    this.debuffEventDouble = continuousAnimation(this.doubleCrystalDebuff, ['crystalDebuff_3', 'crystalDebuff_4']);

    // Attack  and healing reticle animations
    this.attackReticle = context.add.image(0, -10, 'attackReticle').setOrigin(0.5).setScale(0.8).setName('attackReticle').setVisible(false);
    addCirclingTween(this.attackReticle);
    this.healReticle = context.add.image(0, -10, 'healReticle').setOrigin(0.5).setScale(0.8).setName('healReticle').setVisible(false);
    addCirclingTween(this.healReticle);

    this.add([this.pedestalImage, this.crystalImage, this.singleCrystalDebuff, this.doubleCrystalDebuff, this.attackReticle, this.healReticle, this.engineerShieldImage, this.blockedLOS]);
  }
}