import { ETiles, EAttackType, EGameSounds, EWinConditions, EFaction, EHeroes } from "../../enums/gameEnums";
import { ICrystal, IHero } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { roundToFive } from "../../utils/gameUtils";
import { playSound } from "../../utils/gameSounds";
import { CrystalCard } from "../cards/crystalCard";
import { FloatingText } from "../effects/floatingText";
import { HealthBar } from "../factions/healthBar";
import { Hero } from "../factions/hero";
import { Item } from "../factions/item";
import { Tile } from "./tile";
import { CrystalVisuals } from "./crystalVisuals";
import { handleCrystalClick } from "../../utils/handleCrystalClick";

export class Crystal extends Phaser.GameObjects.Container {
  context: GameScene;
  stats: ICrystal;
  visuals: CrystalVisuals;
  healthBar: HealthBar;
  unitCard: CrystalCard;

  constructor(context: GameScene, data: ICrystal) {
    const { x, y } = context.centerPoints[data.boardPosition];
    super(context, x, y);
    this.context = context;

    this.stats = data;
    this.visuals = new CrystalVisuals(context, data);
    this.healthBar = new HealthBar(context, data, -38, -75);
    this.unitCard = new CrystalCard(context, data).setVisible(false);

    this.add([this.visuals,  this.healthBar, this.unitCard]).setSize(90, 95).setInteractive({ useHandCursor: true }).setDepth(this.stats.row + 9.5);
    handleCrystalClick(this, this.context);

    context.add.existing(this);
  }

  getTile(): Tile {
    const tile = this.context?.gameController?.board.getTileFromBoardPosition(this.stats.boardPosition);
    if (!tile) throw new Error('getTile() -> No tile found');

    return tile;
  }

  updateTileData(): void {
    const tile = this.getTile();

    if (this.stats.debuffLevel < 0) {
      this.stats.debuffLevel = 0;
      this.updateCrystalDebuffAnimation(this.stats.debuffLevel);
    }

    this.getMagicalDamageResistance();
    this.getPhysicalDamageResistance();

    tile.crystal = { ...this.stats };
  }

  receiveEngineerShield(engineerId: string): void {
    this.stats.engineerShield = engineerId;
    this.visuals.engineerShieldImage.setVisible(true);
    this.updateTileData();
  }

  removeEngineerShield(): void {
    this.stats.engineerShield = undefined;
    this.visuals.engineerShieldImage.setVisible(false);
    this.updateTileData();
  }

  getsDamaged(damage: number, attackType: EAttackType, unit: Hero | Item, splashDamage = false): void {
    if (this.stats.engineerShield) {
      this.context.gameController?.board.updateEngineerOnShieldLost(this.stats.engineerShield);
      this.removeEngineerShield();
      return;
    }

    let assaultBoostDamage = 0;

    if (this.stats.debuffLevel === 0) {
      playSound(this.scene, EGameSounds.CRYSTAL_DAMAGE);
    } else {
      playSound(this.scene, EGameSounds.CRYSTAL_DAMAGE_BUFF);

      const enemyUnitsOnAssaultTiles = this.context.gameController?.board.getUnitsOnAssaultTiles(this.stats.belongsTo);

      if (enemyUnitsOnAssaultTiles?.length) enemyUnitsOnAssaultTiles.forEach(unitOnTile => {
        assaultBoostDamage += this.calculateAssaultBoost(unitOnTile);
      });
    }

    if (unit instanceof Hero && unit.stats.unitType === EHeroes.ANNIHILATOR && splashDamage) assaultBoostDamage *= 0.2;

    if (unit instanceof Hero && unit.stats.unitType === EHeroes.GRENADIER && splashDamage) assaultBoostDamage *= 0.5;

    if (unit instanceof Hero && unit.stats.unitType === EHeroes.GUNNER && splashDamage) assaultBoostDamage *= 0.666;

    const damageMultiplier = assaultBoostDamage  *  this.stats.debuffLevel;
    const totalDamage = roundToFive(this.getLifeLost(damage + damageMultiplier, attackType));
    const damageTaken = totalDamage > this.stats.currentHealth ? this.stats.currentHealth : totalDamage;
    this.stats.currentHealth -= damageTaken;

    if (this.stats.currentHealth <= this.stats.maxHealth / 2) {
      this.visuals.crystalImage.setTexture('crystalDamaged');
    }

    // Update hp bar
    this.healthBar.setHealth(this.stats.maxHealth, this.stats.currentHealth);

    // Show damage numbers
    if (damageTaken > 0) new FloatingText(this.context, this.x, this.y - 50, damageTaken.toString());

    this.unitCard.updateCardHealth(this);
    this.updateTileData();

    // Update player HP bar
    if (this.stats.belongsTo === 1) this.context.gameController?.gameUI.banner.playerOneHpBar.setHealth();
    if (this.stats.belongsTo === 2) this.context.gameController?.gameUI.banner.playerTwoHpBar.setHealth();

    if (this.stats.currentHealth <= 0) this.removeFromGame();
  }

  removeFromGame(): void {
    playSound(this.scene, EGameSounds.CRYSTAL_DESTROY);

    const tile = this.getTile();
    tile.crystal = undefined;
    tile.obstacle = false;
    tile.tileType = ETiles.BASIC;

    // Remove destoyed crystal from the board array
    const crystalArray = this.context.gameController!.board.crystals;
    const index = crystalArray.findIndex(crystal => crystal.stats.boardPosition === this.stats.boardPosition);
    crystalArray.splice(index, 1);

    // Update the remaining crystal or set gameOver
    if (this.stats.isLastCrystal) {
      this.context.gameController!.gameOver = {
        winCondition: EWinConditions.CRYSTAL,
        winner: this.context.activePlayer!
      };
    } else {
      const otherCrystals = crystalArray.filter(crystal => crystal.stats.belongsTo === this.stats.belongsTo);
      if (!otherCrystals.length) throw new Error('Crystal getsDestroyed() No other crystals found');

      if (otherCrystals.length === 1) {
        otherCrystals[0].stats.isLastCrystal = true;
        otherCrystals[0].updateTileData();
      }
    }

    // Remove animations
    this.scene.tweens.killTweensOf(this);

    this.list.forEach(child => {
      this.scene.tweens.killTweensOf(child);
    });

    // Remove events
    this.visuals.debuffEventSingle.remove(false);
    this.visuals.debuffEventDouble.remove(false);

    // Destroy container and children
    this.destroy(true);
  }

  updateCrystalDebuffAnimation(newLevel: number): void {
    if (newLevel === this.stats.debuffLevel) return;

    switch (newLevel) {
      case 0:
        this.visuals.singleCrystalDebuff.setVisible(false);
        this.visuals.doubleCrystalDebuff.setVisible(false);
        break;

      case 1:
        this.visuals.singleCrystalDebuff.setVisible(true);
        this.visuals.doubleCrystalDebuff.setVisible(false);
        break;

      case 2:
        this.visuals.singleCrystalDebuff.setVisible(false);
        this.visuals.doubleCrystalDebuff.setVisible(true);
        break;

      default:
        console.error('updateDebuffAnimation() level and case dont match', newLevel);
        break;
    }

    this.stats.debuffLevel = newLevel;
    this.updateTileData();
  }

  getPhysicalDamageResistance(): number {
    let total = this.stats.basePhysicalDamageResistance;
    if (this.stats.paladinAura > 0) total += 5 * this.stats.paladinAura;
    this.setPhysicalDamageResistance(total);
    return total;
  }

  getMagicalDamageResistance(): number {
    let total = this.stats.baseMagicalDamageResistance;
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

  getLifeLost(damage: number, attackType: EAttackType) {
    const resistance = {
      [EAttackType.MAGICAL]: this.getMagicalDamageResistance(),
      [EAttackType.PHYSICAL]: this.getPhysicalDamageResistance()
    };

    const reduction = resistance[attackType];

    const totalDamage = resistance ? damage - damage * reduction / 100 : damage;
    return totalDamage > this.stats.currentHealth ? this.stats.currentHealth : totalDamage;
  }

  calculateAssaultBoost(unitOnTile: IHero): number {
    if (unitOnTile.unitType === EHeroes.ENGINEER) return 420;

    if (unitOnTile.faction === EFaction.DWARVES) return 360;

    return 300;
  }
}