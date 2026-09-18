import { EAttackType, EWinConditions, EFaction, EHeroes, EBoardUnit } from "../../enums/gameEnums";
import { ICrystal } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { roundToFive } from "../../utils/gameUtils";
import { CrystalCard } from "../cards/crystalCard";
import { FloatingText } from "../effects/floatingText";
import { HealthBar } from "../factions/healthBar";
import { Hero } from "../factions/hero";
import { Item } from "../factions/item";
import { Tile } from "./tile";
import { CrystalVisuals } from "./crystalVisuals";
import { handleCrystalClick } from "../../utils/handleCrystalClick";
import { fanAcademy } from "../../main";
import { StatusEffects, StatusTracker } from "../../utils/statuses";

export class Crystal extends Phaser.GameObjects.Container {
  context: GameScene;
  stats: ICrystal;
  status: StatusTracker;
  visuals: CrystalVisuals;
  healthBar: HealthBar;
  unitCard: CrystalCard;

  constructor(data: ICrystal) {
    const context = fanAcademy.scene.getScene('GameScene') as GameScene;
    const { x, y } = context.centerPoints[data.boardPosition];
    super(context, x, y);
    this.context = context;

    this.stats = data; // FIXME: do we need the data?
    this.status = new StatusTracker(data.status);
    this.visuals = new CrystalVisuals(context, data, this.status);
    this.healthBar = new HealthBar(context, data, -38, -75);
    this.unitCard = new CrystalCard(context, data).setVisible(false);

    this.add([this.visuals, this.healthBar, this.unitCard]).setSize(90, 95).setInteractive({ useHandCursor: true }).setDepth(this.stats.row + 9.5);
    handleCrystalClick(this, this.context);

    context.add.existing(this);
  }

  getTile(): Tile {
    const tile = this.context?.gameController?.board.getTileFromBoardPosition(this.stats.boardPosition);
    if (!tile) throw new Error('getTile() -> No tile found');

    return tile;
  }

  receiveEngineerShield(): void {
    this.status.add(StatusEffects.ENGINEER_SHIELD);
    this.visuals.engineerShieldImage.setVisible(true);
  }

  removeEngineerShield(): void {
    this.status.remove(StatusEffects.ENGINEER_SHIELD);
    this.visuals.engineerShieldImage.setVisible(false);
  }

  getsDamaged(damage: number, attackType: EAttackType, _unit: Hero | Item, splashDamage?: number): void {
    if (this.status.has(StatusEffects.ENGINEER_SHIELD)) {
      this.context.gameController?.board.updateEngineerOnShieldLost(this.stats.unitId!);
      this.removeEngineerShield();
      return;
    }

    let assaultBoostDamage = 0;

    if (this.stats.debuffLevel === 0) {
      // this.scene.sound.play(EGameSounds.CRYSTAL_DAMAGE);
    } else {
      // this.scene.sound.play(EGameSounds.CRYSTAL_DAMAGE_BUFF);

      const enemyUnitsOnAssaultTiles = this.context.gameController?.board.getAliveEnemyUnitsOnAssaultTiles(this.stats.belongsTo);

      if (enemyUnitsOnAssaultTiles?.length) enemyUnitsOnAssaultTiles.forEach(unitOnTile => {
        assaultBoostDamage += this.calculateAssaultBoost(unitOnTile);
      });
    }

    if (splashDamage) assaultBoostDamage *= splashDamage;

    const totalDamage = roundToFive(this.getLifeLost(damage, assaultBoostDamage, attackType));
    const damageTaken = totalDamage > this.stats.currentHealth ? this.stats.currentHealth : totalDamage;
    this.stats.currentHealth -= damageTaken;

    if (this.stats.currentHealth <= this.stats.maxHealth / 2) {
      this.visuals.crystalImage.setTexture('gameAtlas', 'crystalDamaged');
    }

    // Remove 1-hit buffs and debuffs
    if (attackType === EAttackType.PHYSICAL) {
      this.status.remove(StatusEffects.ANNIHILATOR_DEBUFF);
      this.visuals.annihilatorDebuffAnimationSprite.setVisible(false);
    }

    // Update hp bar
    this.healthBar.setHealth(this.stats.maxHealth, this.stats.currentHealth);

    // Show damage numbers
    if (damageTaken > 0) new FloatingText(this.context, this.x, this.y - 50, damageTaken.toString());

    this.unitCard.updateCardData(this);

    // Update player HP bar
    if (this.stats.belongsTo === 1) this.context.gameController?.banner.playerOneHpBar.setHealth();
    if (this.stats.belongsTo === 2) this.context.gameController?.banner.playerTwoHpBar.setHealth();

    if (this.stats.currentHealth <= 0) this.removeFromGame();
  }

  removeFromGame(): void {
    // this.scene.sound.play(EGameSounds.CRYSTAL_DESTROY);

    // Remove destoyed crystal from the board array
    const crystalArray = this.context.gameController!.board.crystals;
    const index = crystalArray.findIndex(crystal => crystal.stats.boardPosition === this.stats.boardPosition);
    crystalArray.splice(index, 1);

    // Update the remaining crystal or set gameOver
    if (this.isLastCrystal()) {
      this.context.gameController!.gameOver = {
        winCondition: EWinConditions.CRYSTAL,
        winner: this.context.activePlayer!
      };
    }

    // Remove animations
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.killTweensOf(this.visuals);

    this.list.forEach(child => {
      this.scene.tweens.killTweensOf(child);
    });

    // Destroy container and children
    this.destroy(true);
  }

  updateCrystalDebuffAnimation(newLevel: number): void {
    if (newLevel === this.stats.debuffLevel) return;

    switch (newLevel) {
      case 0:
        this.visuals.stopCrystalDebuffAnimation();
        break;

      case 1:
        this.visuals.playSingleCrystalDebuffAnimation();
        break;

      case 2:
        this.visuals.playDoubleCrystalDebuffAnimation();
        break;

      default:
        console.error('updateDebuffAnimation() level and case dont match', newLevel);
        break;
    }

    this.stats.debuffLevel = newLevel;
  }

  getPhysicalDamageResistance(): number {
    let total = 0;
    if (this.stats.paladinAura > 0) total += 5 * this.stats.paladinAura;
    if (this.status.has(StatusEffects.ANNIHILATOR_DEBUFF)) total -= 50;
    this.setPhysicalDamageResistance(total);
    return total;
  }

  getMagicalDamageResistance(): number {
    let total = 0;
    if (this.stats.paladinAura > 0) total += 5 * this.stats.paladinAura;
    this.setMagicalDamageResistance(total);
    return total;
  }

  setPhysicalDamageResistance(total: number): void {
    this.stats.physicalDamageResistance = total;
  }

  setMagicalDamageResistance(total: number): void {
    this.stats.magicalDamageResistance = total;
  }

  getLifeLost(damage: number, assaultBoostDamage: number, attackType: EAttackType) {
    const resistance = {
      [EAttackType.MAGICAL]: this.getMagicalDamageResistance(),
      [EAttackType.PHYSICAL]: this.getPhysicalDamageResistance()
    };

    const reduction = resistance[attackType];

    const totalDamage = resistance ? damage - damage * reduction / 100 + assaultBoostDamage : damage + assaultBoostDamage;
    return totalDamage > this.stats.currentHealth ? this.stats.currentHealth : totalDamage;
  }

  calculateAssaultBoost(unitOnTile: Hero): number {
    if (unitOnTile.stats.unitType === EHeroes.ENGINEER) return 420;

    if (unitOnTile.stats.faction === EFaction.DWARVES) return 360;

    return 300;
  }

  isLastCrystal(): boolean {
    const atLeastOneFriendlyCrystalLeft = this.context?.gameController?.board.units.find(u => u.stats.boardType === EBoardUnit.CRYSTAL && u.stats.belongsTo === this.stats.belongsTo && u.stats.unitId !== this.stats.unitId);

    if (atLeastOneFriendlyCrystalLeft) return false;
    return true;
  }
}