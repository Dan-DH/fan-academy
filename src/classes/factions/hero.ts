import { EActionType, EAttackType, EFaction, EHeroes, EItems } from "../../enums/gameEnums";
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
import { roundToFive, checkUnitGameOver, getGridDistance } from "../../utils/gameUtils";
import { getDamagedAnimation, moveAnimation, removePriestessDebuffTween, useAnimation } from "../../utils/unitAnimations";
import { HeroVisuals } from "./heroVisuals";
import { enterSpecialTileCheck, exitSpecialTileCheck, removeFromBoard, removeSpecialTile } from "../../utils/boardUtils";
import { Pulverizer } from "./dwarves/items";
import { fanAcademy } from "../../main";
import { StatusEffects, StatusTracker } from "../../utils/statuses";

export abstract class Hero extends Phaser.GameObjects.Container {
  context: GameScene;
  stats: IHero;
  status: StatusTracker;
  visuals: HeroVisuals;
  unitCard: HeroCard;
  healthBar: HealthBar;
  isActiveValue = false;

  constructor(data: IHero) {
    const context = fanAcademy.scene.getScene('GameScene') as GameScene;
    const { x, y } = context.centerPoints[data.boardPosition];
    super(context, x, y);

    this.context = context;
    this.status = new StatusTracker(data.status);
    this.stats = data;
    this.stats.physicalDamageResistance = this.getPhysicalDamageResistance();
    this.stats.magicalDamageResistance = this.getMagicalDamageResistance();
    // this.stats.class = EClass.HERO;

    this.unitCard = new HeroCard(context, {
      ...data,
      currentPower: this.getTotalPower()
    }).setVisible(false);

    this.healthBar = new HealthBar(context, data, -38, -75);
    if (this.stats.boardPosition >= 45) this.healthBar.setVisible(false);

    this.visuals = new HeroVisuals(context, data, this.status);

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

  // FIXME:
  updatePosition(tile: Tile): void {
    const { x, y } = this.context.centerPoints[tile.boardPosition];
    this.x = x;
    this.y = y;
    this.stats.boardPosition = tile.boardPosition;
    this.stats.row = tile.row;
    this.stats.col = tile.col;
    this.setDepth(this.stats.row + 10);
    this.visuals.characterImage.setScale(1.2);
    this.stats.paladinAura = this.context.gameController!.board.searchForAliveAdjacentFriendlyUnit(this, EHeroes.PALADIN);
    if (this.stats.unitType === EHeroes.PALADIN) this.context.gameController!.board.updatePaladinAurasAcrossBoard();
    this.unitCard.updateCardData(this);
  }

  // FIXME: is this used?
  exportData(): IHero {
    this.getMagicalDamageResistance();
    this.getPhysicalDamageResistance();
    return { ...this.stats };
  }

  onActivate(): void {
    const scale = this.stats.boardPosition >= 45 ? 1.2 : 1.4;
    this.visuals.characterImage.setScale(scale);
  }

  onDeactivate() {
    const scale = this.stats.boardPosition >= 45 ? 1.1 : 1.2;
    this.visuals.characterImage.setScale(scale);
  }

  // TODO: refactor direcHit. Shouldn't be used just for the Pulverizer attack. Type number to match Crystal, but used as a boolean
  getsDamaged(damage: number, attackType: EAttackType, unit: Hero | Item, directHit?: number): number {
    if (this.status.has(StatusEffects.ENGINEER_SHIELD)) {
      // this.scene.sound.play(EGameSounds.ENGINEER_SHIELD_SHATTER);
      this.context.gameController?.board.updateEngineerOnShieldLost(this.stats.unitId);
      this.removeEngineerShield();
      return 0;
    }

    getDamagedAnimation(this);

    // Calculate damage after applying resistances
    const totalAttackDamage = this.getLifeLost(damage, attackType);
    // Check if the damage comes from a Pulverizer's AoE (not affected by resistances)
    let assaultTileDamage = 0;

    if (unit instanceof Pulverizer) {
      if (directHit && this.status.has(StatusEffects.FACTION_EQUIPMENT)) {
        this.status.remove(StatusEffects.FACTION_EQUIPMENT);
        this.reduceMaxHealth(this.stats.baseHealth * 0.1);
        this.visuals.factionEquipmentImage.setVisible(false);
        this.visuals.characterImage.setTexture('gameAtlas', this.visuals.updateCharacterImage(this.stats));
      }

      if (!directHit) {
        const debuffLevel = this.context.gameController?.board.crystals.find(crystal => crystal.stats.belongsTo === this.stats.belongsTo)?.stats.debuffLevel;
        assaultTileDamage = 300 * (debuffLevel ?? 0) * 0.333;
      }
    }

    const totalDamage = roundToFive(totalAttackDamage + assaultTileDamage);

    this.stats.currentHealth -= totalDamage;

    if (this.stats.currentHealth <= 0) this.getsKnockedDown();

    // Update hp bar
    this.healthBar.setHealth(this.stats.maxHealth, this.stats.currentHealth);

    // Show damage numbers
    if (totalDamage > 0) new FloatingText(this.context, this.x, this.y - 50, totalDamage.toString());

    // Remove 1-hit buffs and debuffs
    if (attackType === EAttackType.PHYSICAL) {
      this.status.remove(StatusEffects.ANNIHILATOR_DEBUFF);
      this.visuals.stopAnnihilatorDebuffAnimation();
    }
    this.status.remove(StatusEffects.DWARVEN_BREW);
    this.visuals.dwarvenBrewImage.setVisible(false);

    this.unitCard.updateCardData(this);

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
    const runeMetalBuff = this.status.has(StatusEffects.RUNE_METAL) ? 1.5 : 1;
    const attackTileBuff = this.status.has(StatusEffects.POWER_TILE) ? attackTileDamage : 0;
    const superCharge = this.status.has(StatusEffects.SUPER_CHARGE) ? 3 : 1;
    const priestessDebuff = this.status.has(StatusEffects.PRIESTESS_DEBUFF) ? 0.5 : 1;
    const paladinAura = this.stats.paladinAura! * 0.05 + 1;

    return roundToFive((this.stats.basePower + attackTileBuff) * rangeModifier * superCharge * priestessDebuff * runeMetalBuff * paladinAura);
  }

  getPhysicalDamageResistance(): number {
    let total = this.stats.basePhysicalDamageResistance;

    if (this.status.has(StatusEffects.ANNIHILATOR_DEBUFF)) total -= 50;
    if (this.status.has(StatusEffects.DWARVEN_BREW)) total += 50;
    if (this.stats.paladinAura! > 0) total += 5 * this.stats.paladinAura!;
    if (this.status.has(StatusEffects.FACTION_EQUIPMENT) && this.stats.faction !== EFaction.DARK_ELVES) total += 20;

    if (this.status.has(StatusEffects.PHYSICAL_RESISTANCE_TILE)) {
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

    if (this.status.has(StatusEffects.DWARVEN_BREW)) total += 50;
    if (this.stats.paladinAura! > 0) total += 5 * this.stats.paladinAura!;
    if (this.status.has(StatusEffects.SHINING_HELM)) total += 20;

    if (this.status.has(StatusEffects.MAGICAL_RESISTANCE_TILE)) {
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

    const totalDamage = damage - damage * resistance[attackType] / 100;
    return totalDamage > this.stats.currentHealth ? this.stats.currentHealth : totalDamage;
  }

  getTotalHealing(unitHealingMult: number): number {
    let attackTileDamage;
    if (this.stats.faction === EFaction.DWARVES) {
      attackTileDamage = this.stats.unitType === EHeroes.ENGINEER ? 140 : 120;
    } else {
      attackTileDamage = 100;
    }

    const runeMetalBuff = this.status.has(StatusEffects.RUNE_METAL) ? 1.5 : 1;
    const attackTileBuff = this.status.has(StatusEffects.POWER_TILE) ? attackTileDamage : 0;
    const superCharge = this.status.has(StatusEffects.SUPER_CHARGE) ? 3 : 1;
    const priestessDebuff = this.status.has(StatusEffects.PRIESTESS_DEBUFF) ? 0.5 : 1;
    const paladinAura = this.stats.paladinAura! > 0 ? this.stats.paladinAura! * 0.05 + 1 : 1;

    return roundToFive((this.stats.basePower + attackTileBuff) * unitHealingMult * superCharge * priestessDebuff * runeMetalBuff * paladinAura);
  }

  getsHealed(healing: number, addText = true): number {
    if (healing <= 0) return 0;
    healing = roundToFive(healing);

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

    return actualHealing;
  }

  private getsRevived(): void {
    this.visuals.playReviveAnimation();

    this.stats.isKO = false;
    this.stats.lastBreath = false;
    this.visuals.characterImage.setTexture('gameAtlas', this.visuals.updateCharacterImage(this.stats));
    const { charImageX, charImageY } = positionHeroImage(this.stats.unitType, this.stats.belongsTo === 1, false, false);

    this.stats.paladinAura = this.context.gameController!.board.searchForAliveAdjacentFriendlyUnit(this, EHeroes.PALADIN);
    enterSpecialTileCheck(this, this.getTile());
    if (this.stats.unitType === EHeroes.PALADIN) this.context.gameController!.board.updatePaladinAurasAcrossBoard();

    this.visuals.characterImage.x = charImageX;
    this.visuals.characterImage.y = charImageY;
  }

  increaseMaxHealth(amount: number, addText = true): void {
    if (amount <= 0) return;
    if (this.stats.isKO) this.getsRevived(); // for Soul Harvest // FIXME: revive on sould harvest method

    const roundedHealthGain = roundToFive(amount);
    this.stats.maxHealth += roundedHealthGain;
    this.stats.currentHealth += roundedHealthGain;

    // Update hp bar
    this.healthBar.setHealth(this.stats.maxHealth, this.stats.currentHealth);

    // Show healing numbers
    if (addText) new FloatingText(this.context, this.x, this.y - 50, roundedHealthGain.toString(), true);

    this.unitCard.updateCardData(this);
  }

  healAndIncreaseHealth(healing: number, increase: number): void {
    const actualHealing = this.getsHealed(healing, false);
    this.increaseMaxHealth(increase, false);

    // Show total number
    const textFigure = actualHealing ? actualHealing + increase : increase;
    new FloatingText(this.context, this.x, this.y - 50, textFigure.toString(), true);
  };

  reduceMaxHealth(amount: number, addText = false): number {
    if (amount <= 0) return 0;

    const roundedHealthLoss = roundToFive(amount);
    this.stats.maxHealth -= roundedHealthLoss;
    if (this.stats.currentHealth > this.stats.maxHealth) this.stats.currentHealth = this.stats.maxHealth;

    // Update hp bar
    this.healthBar.setHealth(this.stats.maxHealth, this.stats.currentHealth);

    if (addText) new FloatingText(this.context, this.x, this.y - 90, amount.toString(), false);

    this.unitCard.updateCardData(this);

    return amount;
  }

  getsKnockedDown(): void {
    // if (this.stats.unitType !== EHeroes.PHANTOM) selectDeathSound(this.scene, this.stats.unitType);
    removeSpecialTile(this, this.getTile());

    if (this.stats.shieldingAlly) {
      this.context.gameController?.board.removeEngineerShield(this.stats.shieldingAlly);
      this.stats.shieldingAlly = undefined;
    }

    this.stats.currentHealth = 0;
    this.stats.isKO = true;

    if (this.stats.unitType === EHeroes.PALADIN) this.context.gameController!.board.updatePaladinAurasAcrossBoard();

    this.visuals.characterImage.setTexture('gameAtlas', this.visuals.updateCharacterImage(this.stats));
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

  // FIXME:
  // updateTileData(): void {
  //   // const tile = this.getTile();
  //   // tile.hero = this.exportData();
  // }

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

    if (board) removeFromBoard(this);

    // Destroy container and children
    this.destroy(true);
  }

  // FIXME: no longer getting the engineer id. We'll loop through units when losing it to find the engie with the matching id to this unit. Same if the shield is lost on the engie's side
  receiveEngineerShield(): void {
    this.status.add(StatusEffects.ENGINEER_SHIELD);
    this.visuals.engineerShieldImage.setVisible(true);
  }

  removeEngineerShield(): void {
    this.status.remove(StatusEffects.ENGINEER_SHIELD);
    this.visuals.engineerShieldImage.setVisible(false);
  }

  async move(currentTile: Tile, targetTile: Tile): Promise<void> {
    const gameController = this.context.gameController!;

    const tilesMoved = getGridDistance(currentTile.row, currentTile.col, targetTile.row, targetTile.col);

    const startTile = gameController.board.getTileFromBoardPosition(this.stats.boardPosition);
    if (!startTile) return;
    exitSpecialTileCheck(this, startTile);

    this.setDepth(targetTile.row + 10); // manually setting the depth before the animation for a smoother transition. Will be done again in updatePosition()
    await moveAnimation(this, targetTile, tilesMoved);

    // FIXME:
    // Stomp KO'd units
    // if (targetTile.hero && targetTile.hero.isKO) {
    //   const hero = gameController.board.units.find(unit => unit.stats.unitId === targetTile.hero?.unitId);
    //   if (!hero) console.error('move() Found heroData on targetTile, but no Hero to remove', targetTile);
    //   // this.scene.sound.play(EGameSounds.HERO_STOMP);
    //   hero?.removeFromGame(true);
    // }

    // Check if the unit is leaving or entering a special tile and apply any effects
    enterSpecialTileCheck(this, targetTile);
    this.updatePosition(targetTile);

    // startTile.removeHero();
    this.unitCard.updateCardData(this);
    gameController.afterAction(EActionType.MOVE, startTile.boardPosition, targetTile.boardPosition);
  }

  spawn(tile: Tile): void {
    const startingPosition = this.stats.boardPosition;
    const gameController = this.context.gameController!;

    // FIXME:
    // Stomp KO'd units and enemy phantoms
    // if (tile.hero && (tile.hero.isKO || tile.hero.unitType === EHeroes.PHANTOM)) {
    //   const hero = gameController.board.units.find(unit => unit.stats.unitId === tile.hero?.unitId);
    //   if (!hero) console.error('spawn() Found heroData on tile, but no Hero to remove', tile);
    //   // this.scene.sound.play(EGameSounds.HERO_STOMP);
    //   hero?.removeFromGame(true);
    // }

    gameController.hand.removeFromHand(this.stats.unitId);
    gameController.board.heroes.push(this);

    // Modify image
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
    enterSpecialTileCheck(this, tile);
    // Position hero on the board
    this.updatePosition(tile);
    this.healthBar.setVisible(true);

    // this.scene.sound.play(EGameSounds.HERO_SPAWN);

    if (this.stats.unitType === EHeroes.PALADIN) {
      this.visuals.paladinAuraImage.setVisible(true);
      this.context.gameController!.board.updatePaladinAurasAcrossBoard();
    }

    gameController.afterAction(EActionType.SPAWN, startingPosition, tile.boardPosition);
  }

  isFullHP(): boolean {
    return this.stats.maxHealth === this.stats.currentHealth;
  }

  isAlreadyEquipped(item: Item): boolean {
    const map: Partial<Record<EItems, boolean>> = {
      [EItems.DRAGON_SCALE]: this.status.has(StatusEffects.FACTION_EQUIPMENT),
      [EItems.SOUL_STONE]: this.status.has(StatusEffects.FACTION_EQUIPMENT),
      [EItems.RUNE_METAL]: this.status.has(StatusEffects.RUNE_METAL),
      [EItems.SHINING_HELM]: this.status.has(StatusEffects.SHINING_HELM),
      [EItems.SUPERCHARGE]: this.status.has(StatusEffects.SUPER_CHARGE),
      [EItems.DWARVEN_BREW]: this.status.has(StatusEffects.DWARVEN_BREW)
    };

    return !!map[item.stats.itemType];
  }

  equipShiningHelm(handPosition: number): void {
    const helmImage = this.scene.add.image(this.x, this.y, 'gameAtlas', 'shiningHelm').setDepth(100);
    useAnimation(helmImage);

    this.status.add(StatusEffects.SHINING_HELM);
    this.increaseMaxHealth(this.stats.baseHealth * 0.1);
    this.visuals.shiningHelmImage.setVisible(true);
    this.visuals.characterImage.setTexture('gameAtlas', this.visuals.updateCharacterImage(this.stats));

    this.unitCard.updateCardData(this);

    this.context.gameController!.afterAction(EActionType.USE, handPosition, this.stats.boardPosition);
  }

  equipRunemetal(handPosition: number): void {
    const helmImage = this.scene.add.image(this.x, this.y, 'gameAtlas', 'runeMetal').setDepth(100);
    useAnimation(helmImage);

    this.status.add(StatusEffects.RUNE_METAL);
    this.visuals.runeMetalImage.setVisible(true);
    this.visuals.characterImage.setTexture('gameAtlas', this.visuals.updateCharacterImage(this.stats));

    this.unitCard.updateCardData(this);

    this.context.gameController!.afterAction(EActionType.USE, handPosition, this.stats.boardPosition);
  }

  equipSuperCharge(handPosition: number): void {
    this.status.add(StatusEffects.SUPER_CHARGE);
    this.visuals.playSuperChargeAnimation();

    this.unitCard.updateCardData(this);

    this.context.gameController!.afterAction(EActionType.USE, handPosition, this.stats.boardPosition);
  }

  removeAttackModifiers(): void {
    this.status.remove(StatusEffects.PRIESTESS_DEBUFF);
    removePriestessDebuffTween(this.visuals.priestessDebuffImage);

    this.status.remove(StatusEffects.SUPER_CHARGE);
    this.visuals.stopSuperChargeAnimation();

    this.unitCard.updateCardData(this);
  }
}
