import { EFaction, EHeroes, ETiles } from "../../enums/gameEnums";
import { IHero } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { isInHand } from "../../utils/gameUtils";
import { positionHeroImage } from "../../utils/heroImagePosition";
import { addPriestessDebuffTween, continuousAnimation, engineerShieldAnimation, paladinAuraAnimation } from "../../utils/unitAnimations";
import { Tile } from "../board/tile";

export class HeroVisuals extends Phaser.GameObjects.Container {
  characterImage: Phaser.GameObjects.Image;
  runeMetalImage: Phaser.GameObjects.Image;
  shiningHelmImage: Phaser.GameObjects.Image;
  factionEquipmentImage: Phaser.GameObjects.Image;
  attackReticle: Phaser.GameObjects.Image;
  healReticle: Phaser.GameObjects.Image;
  allyReticle: Phaser.GameObjects.Image;
  blockedLOS: Phaser.GameObjects.Image;
  priestessDebuffImage: Phaser.GameObjects.Image;

  specialTileAnimation: Phaser.GameObjects.Sprite;
  superChargeAnim: Phaser.GameObjects.Image;
  reviveAnim: Phaser.GameObjects.Image;
  smokeAnim?: Phaser.GameObjects.Image;
  dwarvenBrewImage: Phaser.GameObjects.Image;
  engineerShieldImage: Phaser.GameObjects.Image;
  annihilatorDebuffImage: Phaser.GameObjects.Image;
  paladinAuraImage: Phaser.GameObjects.Image;

  // TODO: turn into sprite animations
  annihilatorDebuffEvent: Phaser.Time.TimerEvent;
  superChargeEvent: Phaser.Time.TimerEvent;
  reviveEvent?: Phaser.Time.TimerEvent;
  smokeEvent?: Phaser.Time.TimerEvent;
  spawnEvent?: Phaser.Time.TimerEvent;

  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, 0, 0);

    const inHand = isInHand(data.boardPosition);
    const { charImageX, charImageY } = positionHeroImage(data.unitType, data.belongsTo === 1, inHand, data.isKO);
    this.characterImage = context.add.image(charImageX, charImageY, 'gameAtlas', this.updateCharacterImage(data)).setOrigin(0.5).setName('body').setDepth(data.row + 10);
    this.characterImage.setScale(inHand ? 1.1 : 1.2);
    if (data.belongsTo === 2 && data.boardPosition < 45) this.characterImage.setFlipX(true);

    /**
     * EQUIPMENT AND BUFFS
     */
    this.runeMetalImage = context.add.image(33, 25, 'gameAtlas', 'runeMetal').setOrigin(0.5).setScale(0.5).setName('runeMetal');
    if (!data.runeMetal) this.runeMetalImage.setVisible(false);

    this.shiningHelmImage = context.add.image(-28, 25, 'gameAtlas', 'shiningHelm').setOrigin(0.5).setScale(0.5).setName('shiningHelm');
    if (!data.shiningHelm) this.shiningHelmImage.setVisible(false);

    if (data.faction === EFaction.COUNCIL || data.faction === EFaction.DWARVES) {
      this.factionEquipmentImage = context.add.image(5, 25, 'gameAtlas', 'dragonScale').setOrigin(0.5).setScale(0.5).setName('dragonScale');
    } else {
      this.factionEquipmentImage = context.add.image(5, 25, 'gameAtlas', 'soulStone').setOrigin(0.5).setScale(0.5).setName('soulStone');
    }
    if (!data.factionEquipment) this.factionEquipmentImage.setVisible(false);

    this.dwarvenBrewImage = context.add.image(-25, -35, 'gameAtlas', 'dwarvenBrew').setOrigin(0.5).setScale(0.5).setName('dwarvenBrew');
    if (!data.dwarvenBrew) this.dwarvenBrewImage.setVisible(false);

    this.annihilatorDebuffImage = context.add.image(25, -30, 'gameAtlas', 'annihilatorDebuff_1').setOrigin(0.5).setScale(0.7).setName('annihilatorDebuff_1');
    this.annihilatorDebuffEvent = continuousAnimation(this.annihilatorDebuffImage, ['annihilatorDebuff_1', 'annihilatorDebuff_2'], 1000);
    if (!data.annihilatorDebuff) this.annihilatorDebuffImage.setVisible(false);

    this.engineerShieldImage = context.add.image(0, 0, 'gameAtlas', 'engineerShield').setOrigin(0.5).setScale(1.2);
    engineerShieldAnimation(this.engineerShieldImage);
    if (!data.engineerShield) this.engineerShieldImage.setVisible(false);

    this.paladinAuraImage = context.add.image(0, 30, 'gameAtlas', 'paladinAura').setOrigin(0.5);
    paladinAuraAnimation(this.paladinAuraImage);
    if (data.boardPosition >= 45 || data.unitType !== EHeroes.PALADIN || data.isKO) this.paladinAuraImage.setVisible(false);

    /**
     * RETICLES
     */
    this.smokeAnim = context.add.image(0, 0, 'gameAtlas', 'smokeAnim_1').setOrigin(0.5).setScale(3.5).setVisible(false).setTint(0x393D47);

    this.attackReticle = context.add.image(0, -10, 'gameAtlas', 'attackReticle').setOrigin(0.5).setScale(1).setName('attackReticle').setVisible(false);
    this.healReticle = context.add.image(0, -10, 'gameAtlas', 'healReticle').setOrigin(0.5).setScale(1).setName('healReticle').setVisible(false);
    this.allyReticle = context.add.image(0, -10, 'gameAtlas', 'allyReticle').setOrigin(0.5).setScale(0.8).setName('allyReticle').setVisible(false);
    this.priestessDebuffImage = context.add.image(0, -10, 'gameAtlas', 'priestessDebuff').setOrigin(0.5).setScale(3).setName('priestessDebuff').setVisible(false);
    if (data.priestessDebuff) addPriestessDebuffTween(this.priestessDebuffImage);
    this.blockedLOS = context.add.image(0, -10, 'gameAtlas', 'blockedLOS').setOrigin(0.5).setName('blockedLOS').setScale(1.2).setVisible(false);

    /**
     * TILE EFFECT ANIMATIONS
     */
    this.specialTileAnimation = context.add.sprite(0, 25, '').setScale(0.8).setVisible(false);

    if (tile?.tileType === ETiles.CRYSTAL_DAMAGE && !data.isKO) this.playSpecialTileAnimation(ETiles.CRYSTAL_DAMAGE);
    if (tile?.tileType === ETiles.POWER && !data.isKO) this.playSpecialTileAnimation(ETiles.POWER);
    if (tile?.tileType === ETiles.MAGICAL_RESISTANCE && !data.isKO) this.playSpecialTileAnimation(ETiles.MAGICAL_RESISTANCE);
    if (tile?.tileType === ETiles.SPEED && !data.isKO) this.playSpecialTileAnimation(ETiles.SPEED);
    if (tile?.tileType === ETiles.PHYSICAL_RESISTANCE && !data.isKO) this.playSpecialTileAnimation(ETiles.CRYSTAL_DAMAGE);

    this.superChargeAnim = context.add.image(0, -25, 'gameAtlas', 'superChargeAnim_1').setScale(1.1);
    if (data.superCharge) {
      this.superChargeAnim.setVisible(true);
    } else {
      this.superChargeAnim.setVisible(false);
    }

    this.superChargeEvent = continuousAnimation(this.superChargeAnim, ['superChargeAnim_1', 'superChargeAnim_2', 'superChargeAnim_3']);

    this.reviveAnim = context.add.image(0, -10, 'gameAtlas', 'reviveAnim_1').setScale(0.7).setVisible(false);

    this.add([
      this.paladinAuraImage,
      this.priestessDebuffImage,
      this.superChargeAnim,
      this.reviveAnim,
      this.characterImage,
      this.specialTileAnimation,
      this.runeMetalImage,
      this.factionEquipmentImage,
      this.shiningHelmImage,
      this.attackReticle,
      this.healReticle,
      this.allyReticle,
      this.engineerShieldImage,
      this.annihilatorDebuffImage,
      this.dwarvenBrewImage,
      ...this.smokeAnim ? [this.smokeAnim] : [],
      this.blockedLOS
    ]);
  }

  updateCharacterImage(data: IHero): string {
    if (data.unitType === EHeroes.PHANTOM) return 'phantom_1';

    if (data.isKO) return `${data.unitType}_9`;

    if (data.runeMetal && data.factionEquipment && data.shiningHelm) return `${data.unitType}_8`;
    if (data.runeMetal && data.shiningHelm) return `${data.unitType}_7`;
    if (data.factionEquipment && data.shiningHelm) return `${data.unitType}_6`;
    if (data.factionEquipment && data.runeMetal) return `${data.unitType}_5`;
    if (data.factionEquipment) return `${data.unitType}_4`;
    if (data.shiningHelm) return `${data.unitType}_3`;
    if (data.runeMetal) return `${data.unitType}_2`;

    return `${data.unitType}_1`;
  }

  playSpecialTileAnimation(tileType: ETiles) {
    this.specialTileAnimation?.play({
      key: tileType,
      showOnStart: true,
      hideOnComplete: true
    });
  }

  stopSpecialTileAnimation() {
    this.specialTileAnimation?.anims.complete();
  }
}