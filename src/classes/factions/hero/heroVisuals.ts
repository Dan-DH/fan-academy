import { EFaction, EHeroes, ETiles } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { isInHand } from "../../../utils/gameUtils";
import { positionHeroImage } from "../../../utils/heroImagePosition";
import { addCirclingTween, continuousAnimation } from "../../../utils/unitAnimations";
import { Tile } from "../../board/tile";

export class HeroVisuals extends Phaser.GameObjects.Container {
  characterImage: Phaser.GameObjects.Image;
  runeMetalImage: Phaser.GameObjects.Image;
  shiningHelmImage: Phaser.GameObjects.Image;
  factionBuffImage: Phaser.GameObjects.Image;
  attackReticle: Phaser.GameObjects.Image;
  healReticle: Phaser.GameObjects.Image;
  allyReticle: Phaser.GameObjects.Image;
  blockedLOS: Phaser.GameObjects.Image;
  debuffImage: Phaser.GameObjects.Image;
  crystalDebuffTileAnim: Phaser.GameObjects.Image;
  powerTileAnim: Phaser.GameObjects.Image;
  magicalResistanceTileAnim: Phaser.GameObjects.Image;
  physicalResistanceTileAnim: Phaser.GameObjects.Image;
  superChargeAnim: Phaser.GameObjects.Image;
  reviveAnim: Phaser.GameObjects.Image;
  smokeAnim?: Phaser.GameObjects.Image;
  dwarvenBrewImage: Phaser.GameObjects.Image;
  engineerShieldImage: Phaser.GameObjects.Image;
  annihilatorDebuffImage: Phaser.GameObjects.Image;

  crystalDebuffEvent: Phaser.Time.TimerEvent;
  powerTileEvent: Phaser.Time.TimerEvent;
  magicalResistanceTileEvent: Phaser.Time.TimerEvent;
  physicalResistanceTileEvent: Phaser.Time.TimerEvent;
  superChargeEvent: Phaser.Time.TimerEvent;
  reviveEvent?: Phaser.Time.TimerEvent;
  smokeEvent?: Phaser.Time.TimerEvent;
  spawnEvent?: Phaser.Time.TimerEvent;

  unitType: EHeroes;
  isKO: boolean;
  runeMetal: boolean;
  factionBuff: boolean;
  shiningHelm: boolean;

  constructor(context: GameScene, data: IHero, x: number, y: number, tile?: Tile) {
    super(context, x, y);
    this.unitType = data.unitType;
    this.isKO = data.isKO;
    this.runeMetal = data.runeMetal;
    this.factionBuff = data.factionBuff;
    this.shiningHelm = data.shiningHelm;

    const inHand = isInHand(data.boardPosition);
    const { charImageX, charImageY } = positionHeroImage(data.unitType, data.belongsTo === 1, inHand, data.isKO);
    this.characterImage = context.add.image(charImageX, charImageY, this.updateCharacterImage()).setOrigin(0.5).setName('body').setDepth(data.row + 10);
    if (inHand) this.characterImage.setScale(0.8);
    if (data.belongsTo === 2 && data.boardPosition < 45) this.characterImage.setFlipX(true);

    /**
     * EQUIPMENT AND BUFFS
     */
    this.runeMetalImage = context.add.image(33, 25, 'runeMetal').setOrigin(0.5).setScale(0.4).setName('runeMetal');
    if (!data.runeMetal) this.runeMetalImage.setVisible(false);

    this.shiningHelmImage = context.add.image(-28, 25, 'shiningHelm').setOrigin(0.5).setScale(0.4).setName('shiningHelm');
    if (!data.shiningHelm) this.shiningHelmImage.setVisible(false);

    if (data.faction === EFaction.COUNCIL || data.faction === EFaction.DWARVES) {
      this.factionBuffImage = context.add.image(5, 25, 'dragonScale').setOrigin(0.5).setScale(0.4).setName('dragonScale');
    } else {
      this.factionBuffImage = context.add.image(5, 25, 'soulStone').setOrigin(0.5).setScale(0.4).setName('soulStone');
    }
    if (!data.factionBuff) this.factionBuffImage.setVisible(false);

    // TODO: place correctly
    this.dwarvenBrewImage = context.add.image(5, 25, 'dwarvenBrew').setOrigin(0.5).setScale(0.4).setName('dwarvenBrew');
    if (!data.dwarvenBrew) this.dwarvenBrewImage.setVisible(false);

    this.annihilatorDebuffImage = context.add.image(5, 25, 'annihilatorDebuff').setOrigin(0.5).setScale(0.4).setName('annihilatorDebuff');
    if (!data.annihilatorDebuff) this.annihilatorDebuffImage.setVisible(false);

    this.engineerShieldImage = context.add.image(0, 0, 'enginnerShield').setOrigin(0.5);
    if (!data.engineerShield) this.engineerShieldImage.setVisible(false);

    /**
     * RETICLES
     */
    this.smokeAnim = context.add.image(0, 0, 'smokeAnim_1').setOrigin(0.5).setScale(2.5).setVisible(false).setTint(0x393D47);

    this.attackReticle = context.add.image(0, -10, 'attackReticle').setOrigin(0.5).setScale(0.8).setName('attackReticle').setVisible(false);
    addCirclingTween(this.attackReticle);
    this.healReticle = context.add.image(0, -10, 'healReticle').setOrigin(0.5).setScale(0.8).setName('healReticle').setVisible(false);
    addCirclingTween(this.healReticle);
    this.allyReticle = context.add.image(0, -10, 'allyReticle').setOrigin(0.5).setScale(0.6).setName('allyReticle').setVisible(false);
    addCirclingTween(this.allyReticle);
    this.debuffImage = context.add.image(0, -10, 'debuff').setOrigin(0.5).setScale(2.5).setName('debuff');
    addCirclingTween(this.debuffImage);
    if (!data.isDebuffed) this.debuffImage.setVisible(false);
    this.blockedLOS = context.add.image(0, -10, 'blockedLOS').setOrigin(0.5).setName('blockedLOS').setVisible(false);
    this.blockedLOS = context.add.image(0, -10, 'blockedLOS').setOrigin(0.5).setName('blockedLOS').setVisible(false);

    /**
     * TILE EFFECT ANIMATIONS
     */
    this.crystalDebuffTileAnim = context.add.image(0, 30, 'crystalDamageAnim_1').setOrigin(0.5).setScale(0.6);
    if (tile?.tileType === ETiles.CRYSTAL_DAMAGE && !this.isKO) {
      this.crystalDebuffTileAnim.setVisible(true);
    } else {
      this.crystalDebuffTileAnim.setVisible(false);
    }
    this.crystalDebuffEvent = continuousAnimation(this.crystalDebuffTileAnim, ['crystalDamageAnim_1', 'crystalDamageAnim_2', 'crystalDamageAnim_3']);

    this.powerTileAnim = context.add.image(0, 27, 'powerTileAnim_1').setOrigin(0.5).setScale(0.6);
    if (tile?.tileType === ETiles.POWER && !this.isKO) {
      this.powerTileAnim.setVisible(true);
    } else {
      this.powerTileAnim.setVisible(false);
    }

    this.powerTileEvent = continuousAnimation(this.powerTileAnim, ['powerTileAnim_1', 'powerTileAnim_2', 'powerTileAnim_3']);

    this.magicalResistanceTileAnim = context.add.image(0, 30, 'magicalResistanceAnim_1').setOrigin(0.5).setScale(0.6);
    if ((tile?.tileType === ETiles.MAGICAL_RESISTANCE || tile?.tileType === ETiles.SPEED) && !this.isKO) {
      this.magicalResistanceTileAnim.setVisible(true);
    } else {
      this.magicalResistanceTileAnim.setVisible(false);
    }

    this.magicalResistanceTileEvent = continuousAnimation(this.magicalResistanceTileAnim, ['magicalResistanceAnim_1', 'magicalResistanceAnim_2', 'magicalResistanceAnim_3']);

    this.physicalResistanceTileAnim = context.add.image(0, 30, 'physicalResistanceAnim_1').setOrigin(0.5).setScale(0.6);
    if (tile?.tileType === ETiles.PHYSICAL_RESISTANCE && !this.isKO) {
      this.physicalResistanceTileAnim.setVisible(true);
    } else {
      this.physicalResistanceTileAnim.setVisible(false);
    }

    this.physicalResistanceTileEvent = continuousAnimation(this.physicalResistanceTileAnim, ['physicalResistanceAnim_1', 'physicalResistanceAnim_2', 'physicalResistanceAnim_3']);

    this.superChargeAnim = context.add.image(0, -18, 'superChargeAnim_1').setOrigin(0.5).setScale(0.8);
    if (data.superCharge) {
      this.superChargeAnim.setVisible(true);
    } else {
      this.superChargeAnim.setVisible(false);
    }

    this.superChargeEvent = continuousAnimation(this.superChargeAnim, ['superChargeAnim_1', 'superChargeAnim_2', 'superChargeAnim_3']);

    this.reviveAnim = context.add.image(0, -10, 'reviveAnim_1').setOrigin(0.5).setScale(0.7).setVisible(false);
  }

  updateCharacterImage(): string {
    if (this.unitType === EHeroes.PHANTOM) return 'phantom_1';

    if (this.isKO) return `${this.unitType}_9`;

    if (this.runeMetal && this.factionBuff && this.shiningHelm) return `${this.unitType}_8`;
    if (this.runeMetal && this.shiningHelm) return `${this.unitType}_7`;
    if (this.factionBuff && this.shiningHelm) return `${this.unitType}_6`;
    if (this.factionBuff && this.runeMetal) return `${this.unitType}_5`;
    if (this.factionBuff) return `${this.unitType}_4`;
    if (this.shiningHelm) return `${this.unitType}_3`;
    if (this.runeMetal) return `${this.unitType}_2`;

    return `${this.unitType}_1`;
  }
}