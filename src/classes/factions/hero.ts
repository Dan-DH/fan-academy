import { EActionType, EAttackType, EClass, EFaction, EGameSounds, EHeroes, EItems } from "../../enums/gameEnums";
import { IHero } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { positionHeroImage } from "../../utils/heroImagePosition";
import { handleUnitClick } from "../../utils/handleUnitClick";
import { Item } from "./item";
import { Tile } from "../board/tile";
import { Crystal } from "../board/crystal";
import { HeroCard } from "../cards/heroCard";
import { FloatingText } from "../effects/floatingText";
import { HealthBar } from "./healthBar";
import { selectDeathSound, playSound } from "../../utils/gameSounds";
import { roundToFive, checkUnitGameOver } from "../../utils/gameUtils";
import { moveAnimation, singleAnimation, useAnimation } from "../../utils/unitAnimations";
import { HeroVisuals } from "./heroVisuals";
import { removeFromBoard, removeSpecialTileOnKo, specialTileCheck } from "../../utils/boardUtils";
import { Pulverizer } from "./dwarves/items";

export abstract class Hero extends Phaser.GameObjects.Container {
  context: GameScene;
  stats: IHero;
  visuals: HeroVisuals;
  unitCard: HeroCard;
  healthBar: HealthBar;
  isActiveValue = false;

  constructor(context: GameScene, data: IHero, tile?: Tile) {
    const { x, y } = context.centerPoints[data.boardPosition];
    super(context, x, y);
    this.context = context;
    this.stats = data;
    this.stats.class = EClass.HERO;

    this.unitCard = new HeroCard(context, {
      ...data,
      currentPower: this.getTotalPower()
    }).setVisible(false);

    this.healthBar = new HealthBar(context, data, -38, -75);
    if (this.stats.boardPosition >= 45) this.healthBar.setVisible(false);

    this.visuals = new HeroVisuals(context, data, tile);

    const hitArea = new Phaser.Geom.Rectangle(-35, -50, 75, 85); // centered on (0,0)

    this.add([this.visuals, this.healthBar, this.unitCard]).setInteractive({
      hitArea,
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true
    }).setName(this.stats.unitId).setDepth(this.stats.row + 10);

    if (this.stats.boardPosition === 51) this.setVisible(false); // Hide if in deck
    handleUnitClick(this, context);
    context.add.existing(this);
  }

  /**
   *
   * FUNCTIONS
  *
  */
  abstract attack(target: Hero | Crystal): void;
  abstract heal(target: Hero): void;
  abstract teleport(target: Hero): void;
  abstract equipFactionEquipment(handPosition: number): void;
  abstract shieldAlly(target: Hero | Crystal): void;

  get isActive() {
    return this.isActiveValue;
  }

  set isActive(value: boolean) {
    this.isActiveValue = value;
    if (value) {
      this.onActivate();
    } else {
      this.onDeactivate();
    }
  }

  updatePosition(tile: Tile): void {
    const { x, y } = this.context.centerPoints[tile.boardPosition];
    this.x = x;
    this.y = y;
    this.stats.boardPosition = tile.boardPosition;
    this.stats.row = tile.row;
    this.stats.col = tile.col;
    this.setDepth(this.stats.row + 10);
  }

  exportData(): IHero {
    this.getMagicalDamageResistance();
    this.getPhysicalDamageResistance();
    return { ...this.stats };
  }

  onActivate(): void {
    console.log(`${this.stats.unitId} is now active`);
    this.visuals.characterImage.setScale(1.2);
  }

  onDeactivate() {
    console.log(`${this.stats.unitId} is now inactive`);
    this.visuals.characterImage.setScale(1);
  }

  getsDamaged(damage: number, attackType: EAttackType, unit: Hero | Item): number {
    if (this.stats.engineerShield) {
      playSound(this.context, EGameSounds.ENGINEER_SHIELD_SHATTER);
      this.context.gameController?.board.updateEngineerOnShieldLost(this.stats.engineerShield);
      this.removeEngineerShield();
      return 0;
    }

    // Flash the unit red
    this.visuals.characterImage.setTint(0xff0000);
    this.scene.time.delayedCall(500, () => this.visuals.characterImage.clearTint());

    // Calculate damage after applying resistances
    const totalAttackDamage = roundToFive(this.getLifeLost(damage, attackType));
    // Check if the damage comes from a Pulverizer's AoE (not affected by resistances)
    let assaultTileDamage = 0;
    if (unit instanceof Pulverizer) {
      const debuffLevel = this.context.gameController?.board.crystals.find(crystal => crystal.stats.belongsTo === this.stats.belongsTo)?.stats.debuffLevel;
      assaultTileDamage = 300 * (debuffLevel ?? 0);
    }
    const totalDamage = totalAttackDamage + assaultTileDamage;

    this.stats.currentHealth -= totalDamage;

    if (this.stats.currentHealth <= 0) this.getsKnockedDown();

    // Update hp bar
    this.healthBar.setHealth(this.stats.maxHealth, this.stats.currentHealth);

    // Show damage numbers
    if (totalDamage > 0) new FloatingText(this.context, this.x, this.y - 50, totalDamage.toString());

    // Remove 1-hit buffs and debuffs
    if (attackType === EAttackType.PHYSICAL) {
      this.stats.annihilatorDebuff = false;
      this.visuals.annihilatorDebuffImage.setVisible(false);
    }
    this.stats.dwarvenBrew = false;
    this.visuals.dwarvenBrewImage.setVisible(false);

    this.unitCard.updateCardData(this);
    this.updateTileData();

    return totalDamage; // Return damage taken for lifesteal
  }

  getTotalPower(rangeModifier = 1): number {
    /**
     * Calculation order:
     * - base attack power
     * - range modifiers (archer, ninja)
     * - assault tile bonus
     * - any other multiplicative modifier (scroll, debuff, runemetal)
     */
    let attackTileDamage;
    if (this.stats.faction === EFaction.DWARVES) {
      attackTileDamage = this.stats.unitType === EHeroes.ENGINEER ? 140 : 120;
    } else {
      attackTileDamage = 100;
    }

    if (rangeModifier === 0) rangeModifier = 1;
    const runeMetalBuff = this.stats.runeMetal ? 1.5 : 1;
    const attackTileBuff = this.stats.attackTile ? attackTileDamage : 0;
    const superCharge = this.stats.superCharge ? 3 : 1;
    const priestessDebuff = this.stats.priestessDebuff ? 0.5 : 1;
    const paladinAura = this.stats.paladinAura > 0 ? this.stats.paladinAura * 0.05 + 1 : 1;

    return (this.stats.basePower + attackTileBuff) * rangeModifier * superCharge * priestessDebuff * runeMetalBuff * paladinAura;
  }

  getPhysicalDamageResistance(): number {
    let total = this.stats.basePhysicalDamageResistance;

    if (this.stats.annihilatorDebuff) total -= 50;
    if (this.stats.paladinAura > 0) total += 5 * this.stats.paladinAura;
    if (this.stats.dwarvenBrew) total += 50;
    if (this.stats.factionEquipment && this.stats.faction !== EFaction.DARK_ELVES) total += 20;

    if (this.stats.physicalResistanceTile) {
      if (this.stats.faction === EFaction.DWARVES) {
        total += this.stats.unitType === EHeroes.ENGINEER ? 28 : 24;
      } else {
        total += 20;
      }
    }

    this.setPhysicalDamageResistance(total);
    return total;
  }

  getMagicalDamageResistance(): number {
    let total = this.stats.baseMagicalDamageResistance;

    if (this.stats.paladinAura > 0) total += 5 * this.stats.paladinAura;
    if (this.stats.dwarvenBrew) total += 50;
    if (this.stats.shiningHelm) total += 20;

    if (this.stats.magicalResistanceTile) {
      if (this.stats.faction === EFaction.DWARVES) {
        total += this.stats.unitType === EHeroes.ENGINEER ? 28 : 24;
      } else {
        total += 20;
      }
    }

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

  getTotalHealing(unitHealingMult: number): number {
    let attackTileDamage;
    if (this.stats.faction === EFaction.DWARVES) {
      attackTileDamage = this.stats.unitType === EHeroes.ENGINEER ? 140 : 120;
    } else {
      attackTileDamage = 100;
    }

    const runeMetalBuff = this.stats.runeMetal ? 1.5 : 1;
    const attackTileBuff = this.stats.attackTile ? attackTileDamage : 0;
    const superCharge = this.stats.superCharge ? 3 : 1;
    const priestessDebuff = this.stats.priestessDebuff ? 0.5 : 1;

    return (this.stats.basePower + attackTileBuff) * unitHealingMult * superCharge * priestessDebuff * runeMetalBuff;
  }

  getsHealed(healing: number, addText = true): number {
    if (healing <= 0) return 0;

    let actualHealing: number;

    if (this.stats.currentHealth + healing >= this.stats.maxHealth) {
      actualHealing = this.stats.maxHealth - this.stats.currentHealth;
      this.stats.currentHealth = this.stats.maxHealth;
    } else {
      this.stats.currentHealth += healing;
      actualHealing = healing;
    }

    // Update hp bar
    this.healthBar.setHealth(this.stats.maxHealth, this.stats.currentHealth);

    // Show healing numbers
    if (actualHealing > 0 && addText) new FloatingText(this.context, this.x, this.y - 50, actualHealing.toString(), true);

    if (this.stats.isKO) this.getsRevived();

    this.unitCard.updateCardData(this);
    this.updateTileData();

    return actualHealing;
  }

  private getsRevived(): void {
    this.visuals.reviveEvent = singleAnimation(this.visuals.reviveAnim, ['reviveAnim_1', 'reviveAnim_2', 'reviveAnim_3'], 150);

    this.stats.isKO = false;
    this.stats.lastBreath = false;
    this.visuals.characterImage.setTexture(this.visuals.updateCharacterImage(this.stats));
    const { charImageX, charImageY } = positionHeroImage(this.stats.unitType, this.stats.belongsTo === 1, false, false);

    this.stats.paladinAura = this.context.gameController!.board.searchForAliveAdjacentFriendlyUnit(this, EHeroes.PALADIN);
    specialTileCheck(this, this.getTile().tileType);
    if (this.stats.unitType === EHeroes.PALADIN) this.context.gameController!.board.updatePaladinAurasAcrossBoard();

    this.visuals.characterImage.x = charImageX;
    this.visuals.characterImage.y = charImageY;
  }

  increaseMaxHealth(amount: number, addText = true): void {
    if (amount <= 0) return;
    if (this.stats.isKO) this.getsRevived(); // for Soul Harvest

    const roundedHealtGain = roundToFive(amount);
    this.stats.maxHealth += roundedHealtGain;
    this.stats.currentHealth += roundedHealtGain;

    // Update hp bar
    this.healthBar.setHealth(this.stats.maxHealth, this.stats.currentHealth);

    // Show healing numbers
    if (addText) new FloatingText(this.context, this.x, this.y - 50, amount.toString(), true);

    this.unitCard.updateCardData(this);
    this.updateTileData();
  }

  healAndIncreaseHealth(healing: number, increase: number): void {
    const actualHealing = this.getsHealed(healing, false);
    this.increaseMaxHealth(increase, false);

    // Show total number
    const textFigure = actualHealing ? actualHealing + increase : increase;
    new FloatingText(this.context, this.x, this.y - 50, textFigure.toString(), true);
  };

  getsKnockedDown(): void {
    if (this.stats.unitType !== EHeroes.PHANTOM) selectDeathSound(this.scene, this.stats.unitType);
    removeSpecialTileOnKo(this);

    if (this.stats.shieldingAlly) {
      this.context.gameController?.board.removeEngineerShield(this.stats.shieldingAlly);
      this.stats.shieldingAlly = undefined;
    }

    this.stats.currentHealth = 0;
    this.stats.isKO = true;

    this.updateTileData();

    if (this.stats.unitType === EHeroes.PALADIN) this.context.gameController!.board.updatePaladinAurasAcrossBoard();

    this.visuals.characterImage.setTexture(this.visuals.updateCharacterImage(this.stats));
    const { charImageX, charImageY } = positionHeroImage(this.stats.unitType, this.stats.belongsTo === 1, false, true);
    this.visuals.characterImage.x = charImageX;
    this.visuals.characterImage.y = charImageY;

    checkUnitGameOver(this);
  }

  getTile(): Tile {
    const tile = this.context?.gameController?.board.getTileFromBoardPosition(this.stats.boardPosition);
    if (!tile) throw new Error('getTile() -> No tile found');

    return tile;
  }

  updateTileData(): void {
    const tile = this.getTile();
    tile.hero = this.exportData();
  }

  shuffleInDeck(): void {
    this.stats.boardPosition = 51;

    const unitData = this.exportData();

    this.context.gameController!.hand.removeFromHand(this.stats.unitId);
    this.context.gameController!.deck.addToDeck(unitData);

    this.removeFromGame(false);
  }

  removeFromGame(board = true): void {
    // Remove animations
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.killTweensOf(this.visuals);

    this.list.forEach(child => {
      this.scene.tweens.killTweensOf(child);
    });

    // Remove events
    this.visuals.crystalDebuffEvent.remove(false);
    this.visuals.powerTileEvent.remove(false);
    this.visuals.magicalResistanceTileEvent.remove(false);
    this.visuals.physicalResistanceTileEvent.remove(false);
    this.visuals.superChargeEvent.remove(false);
    this.visuals.annihilatorDebuffEvent.remove(false);

    if (this.visuals.spawnEvent) this.visuals.spawnEvent?.remove(false);

    if (board) removeFromBoard(this);

    // Destroy container and children
    this.destroy(true);
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

  async move(targetTile: Tile): Promise<void> {
    const gameController = this.context.gameController!;

    const startTile = gameController.board.getTileFromBoardPosition(this.stats.boardPosition);
    if (!startTile) return;

    this.setDepth(targetTile.row + 10); // manually setting the depth before the animation for a smoother transition. Will be done again in updatePosition()
    await moveAnimation(this.context, this, targetTile);

    // Stomp KO'd units
    if (targetTile.hero && targetTile.hero.isKO) {
      const hero = gameController.board.units.find(unit => unit.stats.unitId === targetTile.hero?.unitId);
      if (!hero) console.error('move() Found heroData on targetTile, but no Hero to remove', targetTile);
      playSound(this.context, EGameSounds.HERO_STOMP);
      hero?.removeFromGame(true);
    }

    // Check if the unit is leaving or entering a special tile and apply any effects
    this.stats.paladinAura = this.context.gameController!.board.searchForAliveAdjacentFriendlyUnit(this, EHeroes.PALADIN);
    specialTileCheck(this, targetTile.tileType, startTile.tileType);
    this.updatePosition(targetTile);
    targetTile.hero = this.exportData();
    startTile.removeHero();
    if (this.stats.unitType === EHeroes.PALADIN) this.context.gameController!.board.updatePaladinAurasAcrossBoard();

    gameController.afterAction(EActionType.MOVE, startTile.boardPosition, targetTile.boardPosition);
  }

  spawn(tile: Tile): void {
    const startingPosition = this.stats.boardPosition;
    const gameController = this.context.gameController!;

    // Stomp KO'd units and enemy phantoms
    if (tile.hero && (tile.hero.isKO || tile.hero.unitType === EHeroes.PHANTOM)) {
      const hero = gameController.board.units.find(unit => unit.stats.unitId === tile.hero?.unitId);
      if (!hero) console.error('spawn() Found heroData on tile, but no Hero to remove', tile);
      playSound(this.context, EGameSounds.HERO_STOMP);
      hero?.removeFromGame(true);
    }

    gameController.hand.removeFromHand(this.stats.unitId);
    gameController.board.units.push(this);

    // Modify image
    this.visuals.characterImage.setScale(1);
    const { charImageX, charImageY } = positionHeroImage(this.stats.unitType, this.stats.belongsTo === 1, false, false);
    this.visuals.characterImage.x = charImageX;
    this.visuals.characterImage.y = charImageY;
    this.setDepth(this.stats.row + 10);
    // Flip image if player is player 2
    if (this.stats.belongsTo === 2) this.visuals.characterImage.setFlipX(true);

    // Update vertical positioning of the info card
    this.unitCard.y = 0;
    this.stats.paladinAura = this.context.gameController!.board.searchForAliveAdjacentFriendlyUnit(this, EHeroes.PALADIN);
    // A Wraith can spawn on a special tile. Phantom spawning is handled within its class
    specialTileCheck(this, tile.tileType);
    // Position hero on the board
    this.updatePosition(tile);
    // Update tile data
    this.updateTileData();

    this.healthBar.setVisible(true);

    playSound(this.context, EGameSounds.HERO_SPAWN);

    if (this.stats.unitType === EHeroes.PALADIN) this.context.gameController!.board.updatePaladinAurasAcrossBoard();

    gameController.afterAction(EActionType.SPAWN, startingPosition, tile.boardPosition);
  }

  isFullHP(): boolean {
    return this.stats.maxHealth === this.stats.currentHealth;
  }

  isAlreadyEquipped(item: Item): boolean {
    const map: Partial<Record<EItems, boolean>> = {
      [EItems.DRAGON_SCALE]: this.stats.factionEquipment,
      [EItems.SOUL_STONE]: this.stats.factionEquipment,
      [EItems.RUNE_METAL]: this.stats.runeMetal,
      [EItems.SHINING_HELM]: this.stats.shiningHelm,
      [EItems.SUPERCHARGE]: this.stats.superCharge,
      [EItems.DWARVEN_BREW]: this.stats.dwarvenBrew
    };

    return !!map[item.stats.itemType];
  }

  equipShiningHelm(handPosition: number): void {
    const helmImage = this.scene.add.image(this.x, this.y, 'shiningHelm').setDepth(100);
    useAnimation(helmImage);

    this.stats.shiningHelm = true;

    this.increaseMaxHealth(this.stats.baseHealth * 0.1);

    this.visuals.shiningHelmImage.setVisible(true);
    this.visuals.characterImage.setTexture(this.visuals.updateCharacterImage(this.stats));

    this.unitCard.updateCardData(this);
    this.updateTileData();

    this.context.gameController!.afterAction(EActionType.USE, handPosition, this.stats.boardPosition);
  }

  equipRunemetal(handPosition: number): void {
    const helmImage = this.scene.add.image(this.x, this.y, 'runeMetal').setDepth(100);
    useAnimation(helmImage);

    this.stats.runeMetal = true;
    this.visuals.runeMetalImage.setVisible(true);

    this.visuals.runeMetalImage.setVisible(true);
    this.visuals.characterImage.setTexture(this.visuals.updateCharacterImage(this.stats));

    this.unitCard.updateCardData(this);
    this.updateTileData();

    this.context.gameController!.afterAction(EActionType.USE, handPosition, this.stats.boardPosition);
  }

  equipSuperCharge(handPosition: number): void {
    this.stats.superCharge = true;

    this.unitCard.updateCardData(this);
    this.updateTileData();

    this.visuals.superChargeAnim.setVisible(true);

    this.context.gameController!.afterAction(EActionType.USE, handPosition, this.stats.boardPosition);
  }

  removeAttackModifiers() {
    this.stats.priestessDebuff = false;
    this.visuals.priestessDebuffImage.setVisible(false);
    this.stats.superCharge = false;
    this.visuals.superChargeAnim.setVisible(false);

    this.unitCard.updateCardData(this);

    const tile = this.getTile();
    tile.hero = this.exportData();
  }

  flashActingUnit(): void {
    // Flash the unit blue to better identify which unit is attacking / healing on a replay
    this.visuals.characterImage.setTint(0x3399ff);
    this.scene.time.delayedCall(800, () => this.visuals.characterImage.clearTint());
  }
}
