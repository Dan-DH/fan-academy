import { ICrystal } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { engineerShieldAnimation } from "../../utils/unitAnimations";

export class CrystalVisuals extends Phaser.GameObjects.Container {
  pedestalImage: Phaser.GameObjects.Image;
  crystalImage: Phaser.GameObjects.Image;
  attackReticle: Phaser.GameObjects.Image;
  healReticle: Phaser.GameObjects.Image;
  blockedLOS: Phaser.GameObjects.Image;
  engineerShieldImage: Phaser.GameObjects.Image;
  annihilatorDebuffAnimationSprite: Phaser.GameObjects.Sprite;
  crystalDebuffAnimationSprite: Phaser.GameObjects.Sprite;

  constructor(context: GameScene, data: ICrystal) {
    super(context, 0, 0);
    const isBigCrystal = data.maxHealth === 9000;

    this.pedestalImage = context.add.image(0, 10, 'gameAtlas', 'crystalPedestal');
    const crystalTexture = data.currentHealth <= data.maxHealth / 2 ? 'crystalDamaged' : 'crystalFull';
    this.crystalImage = context.add.image(0, -30, 'gameAtlas', crystalTexture).setScale(isBigCrystal ? 1.2 : 1);

    this.blockedLOS = context.add.image(0, -10, 'gameAtlas', 'blockedLOS').setOrigin(0.5).setName('blockedLOS').setScale(1.2).setVisible(false);

    const crystalColor = data.belongsTo === 1 ?  0x3399ff : 0x990000;
    this.crystalImage.setTint(crystalColor);

    // Debuff images and animation
    this.crystalDebuffAnimationSprite = context.add.sprite(0, -30, 'gameAtlas', '').setVisible(false).setScale(1.1);
    if (data.debuffLevel === 1) this.playSingleCrystalDebuffAnimation();
    if (data.debuffLevel === 2) this.playDoubleCrystalDebuffAnimation();

    const isShielded = data.engineerShield ? true : false;
    this.engineerShieldImage = context.add.image(0, -20, 'gameAtlas', 'engineerShield').setOrigin(0.5).setVisible(isShielded);
    engineerShieldAnimation(this.engineerShieldImage);

    this.annihilatorDebuffAnimationSprite = context.add.sprite(25, -35, 'gameAtlas', 'annihilatorDebuff_1').setOrigin(0.5).setScale(0.8).setName('annihilatorDebuff_1');
    if (!data.annihilatorDebuff) this.annihilatorDebuffAnimationSprite.setVisible(false);

    // Attack  and healing reticle animations
    this.attackReticle = context.add.image(0, -10, 'gameAtlas', 'attackReticle').setOrigin(0.5).setScale(1).setName('attackReticle').setVisible(false);
    this.healReticle = context.add.image(0, -10, 'gameAtlas', 'healReticle').setOrigin(0.5).setScale(1).setName('healReticle').setVisible(false);

    this.add([this.pedestalImage, this.crystalImage, this.crystalDebuffAnimationSprite, this.annihilatorDebuffAnimationSprite, this.attackReticle, this.healReticle, this.engineerShieldImage, this.blockedLOS]);
  }

  playAnnihilatorDebuffAnimation() {
    this.annihilatorDebuffAnimationSprite.play({
      key: 'annihilatorDebuffAnim',
      showOnStart: true,
      hideOnComplete: true
    });
  }

  stopAnnihilatorDebuffAnimation() {
    this.annihilatorDebuffAnimationSprite.anims.complete();
  }

  playSingleCrystalDebuffAnimation() {
    this.crystalDebuffAnimationSprite.play({
      key: 'singleCrystalDebuffAnim',
      showOnStart: true,
      hideOnComplete: true
    });
  }

  playDoubleCrystalDebuffAnimation() {
    this.crystalDebuffAnimationSprite.play({
      key: 'doubleCrystalDebuffAnim',
      showOnStart: true,
      hideOnComplete: true
    });
  }

  stopCrystalDebuffAnimation() {
    this.crystalDebuffAnimationSprite.anims.complete();
  }
}