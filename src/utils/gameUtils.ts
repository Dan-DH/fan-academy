import { GameObjects } from "phaser";
import { Hero } from "../classes/factions/hero";
import { Item, RuneMetal, ShiningHelm, SuperCharge } from "../classes/factions/item";
import { Tile } from "../classes/board/tile";
import { EActionClass, EActionType, ECardType, EClass, EGameSounds, EHeroes, EItems, ETiles, EUiSounds, EWinConditions } from "../enums/gameEnums";
import { ICrystal, IHero, IItem, IPlayerState, ITile } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";
import UIScene from "../scenes/ui.scene";
import { Archer } from "../classes/factions/council/archer";
import { Cleric } from "../classes/factions/council/cleric";
import { DragonScale, HealingPotion, Inferno } from "../classes/factions/council/items";
import { Knight } from "../classes/factions/council/knight";
import { Ninja } from "../classes/factions/council/ninja";
import { Wizard } from "../classes/factions/council/wizard";
import { ManaVial, SoulHarvest, SoulStone } from "../classes/factions/elves/items";
import { Necromancer } from "../classes/factions/elves/necromancer";
import { Phantom } from "../classes/factions/elves/phantom";
import { Priestess } from "../classes/factions/elves/priestess";
import { VoidMonk } from "../classes/factions/elves/voidMonk";
import { Wraith } from "../classes/factions/elves/wraith";
import { Impaler } from "../classes/factions/elves/impaler";
import { Crystal } from "../classes/board/crystal";

export function isHero(hero: IHero | IItem): hero is Hero {
  return hero.class === "hero";
}

export function isItem(item: IHero | IItem): item is Item {
  return item.class === "item";
}

export function isInHand(boardPosition: number): boolean {
  return boardPosition > 44 && boardPosition < 51;
}

export function isOnBoard(position: number): boolean {
  return position >= 0 && position <= 44;
}

export function belongsToPlayer(context: GameScene, unit: Hero | IHero | Item | IItem | Crystal | ICrystal): boolean {
  const playerNumber = context.isPlayerOne ? 1 : 2;
  return unit.belongsTo === playerNumber;
}

// Rounds a number to the nearest multiple of 5
export function roundToFive(amount: number): number {
  return Math.round(amount / 5) * 5;
}

export function getGridDistance(startRow: number, startColumn: number, targetRow: number, targetColumn: number): number {
  return Math.abs(startRow - targetRow) + Math.abs(startColumn - targetColumn);
}

export function createNewItem(context: GameScene, itemData: IItem): Item {
  const itemTypes: Record<EItems, () => Item> = {
    [EItems.SHINING_HELM]: () => new ShiningHelm(context, itemData),
    [EItems.SUPERCHARGE]: () => new SuperCharge(context, itemData),
    [EItems.RUNE_METAL]: () => new RuneMetal(context, itemData),

    [EItems.DRAGON_SCALE]: () => new DragonScale(context, itemData),
    [EItems.HEALING_POTION]: () => new HealingPotion(context, itemData),
    [EItems.INFERNO]: () => new Inferno(context, itemData),

    [EItems.MANA_VIAL]: () => new ManaVial(context, itemData),
    [EItems.SOUL_HARVEST]: () => new SoulHarvest(context, itemData),
    [EItems.SOUL_STONE]: () => new SoulStone(context, itemData)
  };

  const createItem = itemTypes[itemData.itemType];
  if (!createItem) console.error('Error creating item', itemData);
  return createItem();
}

export function createNewHero(context: GameScene, heroData: IHero, tile?: Tile): Hero {
  const heroTypes: Record<EHeroes, () => Hero> = {
    [EHeroes.ARCHER]: () => new Archer(context, heroData, tile),
    [EHeroes.CLERIC]: () => new Cleric(context, heroData, tile),
    [EHeroes.KNIGHT]: () => new Knight(context, heroData, tile),
    [EHeroes.NINJA]: () => new Ninja(context, heroData, tile),
    [EHeroes.WIZARD]: () => new Wizard(context, heroData, tile),

    [EHeroes.PRIESTESS]: () => new Priestess(context, heroData, tile),
    [EHeroes.IMPALER]: () => new Impaler(context, heroData, tile),
    [EHeroes.NECROMANCER]: () => new Necromancer(context, heroData, tile),
    [EHeroes.PHANTOM]: () => new Phantom(context, heroData, tile),
    [EHeroes.VOIDMONK]: () => new VoidMonk(context, heroData, tile),
    [EHeroes.WRAITH]: () => new Wraith(context, heroData, tile)
  };

  const createHero = heroTypes[heroData.unitType];
  if (!createHero) console.error('Error creating hero', heroData);
  return createHero();
}

export async function moveAnimation(context: GameScene, hero: Hero, targetTile: Tile): Promise<void> {
  const flyingUnits = [EHeroes.NECROMANCER, EHeroes.WRAITH, EHeroes.PHANTOM];
  if (flyingUnits.includes(hero.unitType)) {
    playSound(context, EGameSounds.MOVE_FLY);
  } else {
    playSound(context, EGameSounds.MOVE_WALK);
  }

  // Stop user input until the animation finishes playing
  context.input.enabled = false;

  const unitImage: Phaser.GameObjects.Image = hero.getByName('body');

  // If the unit is moving backwards, flip the unit's image for the duration of the animation
  let temporaryFlip: boolean;
  if (hero.belongsTo === 1 &&  targetTile.x < hero.x) {
    unitImage.setFlipX(true);
    temporaryFlip = true;
  }

  if (hero.belongsTo === 2 &&  targetTile.x > hero.x ) {
    unitImage.setFlipX(false);
    temporaryFlip = true;
  }

  const animation = (hero: Hero, targetTile: Tile): Promise<void> => {
    return new Promise((resolve) => {
      context.tweens.add({
        targets: hero,
        x: targetTile.x,
        y: targetTile.y,
        duration: 400,
        ease: 'Linear',
        onComplete: () => {
          context.input.enabled = true;
          if (temporaryFlip) unitImage.setFlipX(!unitImage.flipX);
          resolve();
        }
      });
    });
  };

  await animation.call(context, hero, targetTile);
}

export async function forcedMoveAnimation(context: GameScene, hero: Hero, targetTile: Tile): Promise<void> {
  context.input.enabled = false;

  const animation = (hero: Hero, targetTile: Tile): Promise<void> => {
    return new Promise((resolve) => {
      context.tweens.add({
        targets: hero,
        x: targetTile.x,
        y: targetTile.y,
        duration: 200,
        ease: 'Linear',
        onComplete: () => {
          context.input.enabled = true;
          resolve();
        }
      });
    });
  };

  await animation.call(context, hero, targetTile);
};

export function getNewPositionAfterForce(attackerRow: number, attackerCol: number, targetRow: number, targetCol: number, isPush: boolean) {
  // Direction from attacker to target
  let directionRow = targetRow - attackerRow;
  let directionColumn = targetCol - attackerCol;

  // Normalize to single step
  directionRow = Math.sign(directionRow);
  directionColumn = Math.sign(directionColumn);

  // For pull, reverse the direction
  if (!isPush) {
    directionRow *= -1;
    directionColumn *= -1;
  }

  return {
    row: targetRow + directionRow,
    col: targetCol + directionColumn
  };
}

export function playSound(scene: Phaser.Scene, sound: EGameSounds | EUiSounds): void {
  scene.sound.play(sound);
}

// Not used at the moment, could be useful when animations are added. Otherwise remove
export function pauseCode(scene: Phaser.Scene, delay: number): Promise<void> {
  return new Promise(resolve => {
    scene.time.delayedCall(delay, resolve);
  });
}

export function selectItemSound(scene: Phaser.Scene, item: EItems): void {
  const itemMap = {
    [EItems.RUNE_METAL]: EGameSounds.RUNE_METAL_SELECT,
    [EItems.SUPERCHARGE]: EGameSounds.SCROLL_SELECT,
    [EItems.SHINING_HELM]: EGameSounds.ITEM_SELECT,

    [EItems.DRAGON_SCALE]: EGameSounds.SHIELD_SELECT,
    [EItems.HEALING_POTION]: EGameSounds.POTION_SELECT,
    [EItems.INFERNO]: EGameSounds.AOE_SPELL_SELECT,

    [EItems.SOUL_STONE]: EGameSounds.ITEM_SELECT,
    [EItems.MANA_VIAL]: EGameSounds.POTION_SELECT,
    [EItems.SOUL_HARVEST]: EGameSounds.AOE_SPELL_SELECT
  };

  const soundToPlay = itemMap[item];
  if (!soundToPlay) return;

  playSound(scene, soundToPlay);
}

export function selectDeathSound(scene: Phaser.Scene, hero: EHeroes): void {
  const heroMap = {
    [EHeroes.ARCHER]: EGameSounds.ARCHER_DEATH,
    [EHeroes.KNIGHT]: EGameSounds.KNIGHT_DEATH,
    [EHeroes.CLERIC]: EGameSounds.CLERIC_DEATH,
    [EHeroes.WIZARD]: EGameSounds.WIZARD_DEATH,
    [EHeroes.NINJA]: EGameSounds.NINJA_DEATH,

    [EHeroes.IMPALER]: EGameSounds.IMPALER_DEATH,
    [EHeroes.VOIDMONK]: EGameSounds.VOIDMONK_DEATH,
    [EHeroes.PRIESTESS]: EGameSounds.PRIESTESS_DEATH,
    [EHeroes.NECROMANCER]: EGameSounds.NECROMANCER_DEATH,
    [EHeroes.WRAITH]: EGameSounds.WRAITH_DEATH,
    [EHeroes.PHANTOM]: EGameSounds.PHANTOM_DEATH
  };

  const soundToPlay = heroMap[hero];
  if (!soundToPlay) return;

  playSound(scene, soundToPlay);
}

export function getActionClass(action: EActionType): EActionClass {
  return [EActionType.PASS, EActionType.DRAW, EActionType.REMOVE_UNITS].includes(action) ? EActionClass.AUTO : EActionClass.USER;
}

export function getAOETiles(context: GameScene, spell: Item,  targetTile: Tile): {
  enemyHeroTiles: Tile[],
  enemyCrystalTiles: Tile[]
} {
  const board = context.gameController?.board;
  if (!board) throw new Error('Inferno use() board not found');

  const areaOfEffect = board.getAreaOfEffectTiles(targetTile);

  const enemyHeroTiles = areaOfEffect?.filter(tile => tile.hero && tile.hero?.belongsTo !== spell.belongsTo);

  const enemyCrystalTiles = areaOfEffect?.filter(tile => tile.crystal && tile.crystal?.belongsTo !== spell.belongsTo);

  return {
    enemyHeroTiles,
    enemyCrystalTiles
  };
}

// Used only by the voidmonk and wizard's splash attacks
export function canBeAttacked(attacker: Hero, tile: Tile): boolean {
  let result = false;

  if (tile.hero && tile.hero.belongsTo !== attacker.belongsTo && !tile.hero.isKO) result = true;
  if (tile.crystal && tile.crystal.belongsTo !== attacker.belongsTo) result = true;

  return result;
}

export function isLastUnit(context: GameScene, hero: Hero): boolean {
  let attackingPlayer: IPlayerState | undefined;
  let defendingPlayer: IPlayerState | undefined;

  if (hero.unitId.includes(context.player1!.playerId)) {
    attackingPlayer = context.player2;
    defendingPlayer = context.player1;
  } else {
    attackingPlayer = context.player1;
    defendingPlayer = context.player2;
  }

  if (!attackingPlayer || !defendingPlayer) throw new Error('updateUnitsLeft() No player found');

  const unitsArray = context.gameController?.board.units;
  if (!unitsArray) throw new Error('updateUnitsLeft() no units array found');

  // Get remaining units of defending player. Populate gameOver flag if there are none left and the player has no revives in hand
  const remainingAwakeBoardUnits: Hero[] = [];
  const remainingKoBoardUnits: Hero[] = [];

  unitsArray.filter(unit => unit.belongsTo === hero.belongsTo).map(unit => unit.isKO ? remainingKoBoardUnits.push(unit) : remainingAwakeBoardUnits.push(unit));

  let hand;
  let remainingHandUnits;
  const defendingPlayerIsActivePlayer = defendingPlayer.playerId === context.activePlayer;
  if (defendingPlayerIsActivePlayer) {
    hand = context.gameController?.hand.getHand();
    remainingHandUnits = hand!.find(unit => unit.belongsTo === hero.belongsTo && unit.class === EClass.HERO);
  } else {
    hand = defendingPlayer.factionData.unitsInHand;
    remainingHandUnits = hand.find(unit => unit.belongsTo === hero.belongsTo && unit.class === EClass.HERO);
  }

  const remainingDeckUnits = defendingPlayer.factionData.unitsInDeck.find(unit => unit.belongsTo === hero.belongsTo && unit.class === EClass.HERO);

  const reviveItems = [EItems.HEALING_POTION, EItems.SOUL_HARVEST];
  const hasReviveInHand = hand ? hand.find(unit => reviveItems.includes((unit as Item)?.itemType)) : undefined;

  if (remainingAwakeBoardUnits || remainingHandUnits || remainingDeckUnits || remainingKoBoardUnits && hasReviveInHand) return false;

  return true;
}

export function checkUnitGameOver(context: GameScene, hero: Hero): void {
  if (!isLastUnit(context, hero)) return;

  const attackingPlayer = hero.unitId.includes(context.player1!.playerId) ? context.player2 : context.player1;

  context.gameController!.gameOver = {
    winCondition: EWinConditions.UNITS,
    winner: attackingPlayer!.playerId
  };
}

export function forcedMoveSpawnCheck(tile: Tile | ITile, hero: Hero): boolean {
  const spawnBelongsTo = tile.col < 5 ? 1 : 2;
  return tile.tileType === ETiles.SPAWN && hero.belongsTo === spawnBelongsTo;
}

export function isEnemySpawn(context: GameScene, tile: Tile | ITile): boolean {
  return tile.tileType === ETiles.SPAWN && (context.isPlayerOne ? tile.col > 5 : tile.col < 5);
}

export function turnIfBehind(context: GameScene, attacker: Hero, target: Hero | Crystal): void {
  const isLookingRight = attacker.belongsTo === 1;
  const attackerImage = attacker.characterImage;

  if (isLookingRight && target.col >= attacker.col) return;
  if (!isLookingRight && target.col <= attacker.col) return;

  if (!isLookingRight) attackerImage.setFlipX(false);
  if (isLookingRight)  attackerImage.setFlipX(true);

  context.time.delayedCall(500, () => {
    attackerImage.setFlipX(!attacker.characterImage.flipX);
  });
}

export function getCardText(unit: EHeroes | EItems): {
  cardType: ECardType,
  cardText: string,
  cardName?: string
} {
  const unitMap = {
    [EHeroes.ARCHER]: {
      cardType: ECardType.SHOOTER,
      cardText: "Marksman who does high damage to enemies at range. Weak melee attack."
    },
    [EHeroes.CLERIC]: {
      cardType: ECardType.SUPPORT,
      cardText: "Spellcaster who revives and heals allies. Attacks enemies at range."
    },
    [EHeroes.KNIGHT]: {
      cardType: ECardType.FIGHTER,
      cardText: "Heavily armored and an excellent defender. His attacks knock back enemies."
    },
    [EHeroes.NINJA]: {
      cardType: ECardType.SUPER,
      cardText: "Deals double damage in melee range. He can teleport to allies."
    },
    [EHeroes.WIZARD]: {
      cardType: ECardType.CASTER,
      cardText: "Powerful spellcaster, damages groups of enemies with chain lightning."
    },

    [EHeroes.PRIESTESS]: {
      cardType: ECardType.SUPPORT,
      cardText: "She can heal up to 3 tiles away, and weakens enemy attacks."
    },
    [EHeroes.IMPALER]: {
      cardType: ECardType.SHOOTER,
      cardText: "Wields a powerful harpoon that can pull enemies close."
    },
    [EHeroes.NECROMANCER]: {
      cardType: ECardType.CASTER,
      cardText: "Dark caster who can create Phantoms from fallen units."
    },
    [EHeroes.PHANTOM]: {
      cardType: ECardType.SUMMONED,
      cardText: "A summoned phantom from beyond."
    },
    [EHeroes.VOIDMONK]: {
      cardType: ECardType.FIGHTER,
      cardText: "Strong melee fighter whose hits do splash damage."
    },
    [EHeroes.WRAITH]: {
      cardType: ECardType.SUPER,
      cardText: "A terror who gains max health and power by draining K.O.'d units."
    },

    [EItems.SHINING_HELM]: {
      cardName: 'Shining Helm',
      cardType: ECardType.EQUIPMENT,
      cardText: "Adds 20% magical defense, and 10% max health."
    },
    [EItems.SUPERCHARGE]: {
      cardName: 'Scroll',
      cardType: ECardType.BUFF,
      cardText: "Multiplies an ally's attack power by 3 for one attack."
    },
    [EItems.RUNE_METAL]: {
      cardName: 'Runemetal',
      cardType: ECardType.EQUIPMENT,
      cardText: "Permanently increases an ally's power by 50%."
    },

    [EItems.DRAGON_SCALE]: {
      cardName: 'Dragonscale',
      cardType: ECardType.EQUIPMENT,
      cardText: "Adds 20% physical defense, and 10% max health."
    },
    [EItems.HEALING_POTION]: {
      cardName: 'Healing Potion',
      cardType: ECardType.CONSUMABLE,
      cardText: "Heals an ally for 1000 HP, or revives an ally with 100 HP."
    },
    [EItems.INFERNO]: {
      cardName: 'Inferno',
      cardType: ECardType.SPELL,
      cardText: "Damages all enemies in a 3x3 area and destroys knocked-out units."
    },

    [EItems.MANA_VIAL]: {
      cardName: 'Mana Vial',
      cardType: ECardType.CONSUMABLE,
      cardText: "Heals an ally for 1000 HP and increases max health by 50 HP."
    },
    [EItems.SOUL_HARVEST]: {
      cardName: 'Soul Harvest',
      cardType: ECardType.SPELL,
      cardText: "Drains health from enemies in a 3x3 area. Increases max health for all allies and revives knocked-out units."
    },
    [EItems.SOUL_STONE]: {
      cardName: 'Soulstone',
      cardType: ECardType.EQUIPMENT,
      cardText: "Doubles the effect of a unit's life leech and increases max health by 10%."
    }
  };

  return unitMap[unit];
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function truncateText(text: string, maxLength: number) {
  return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
}

// Used to remove any visible unit cards from a mobile long press action
export function visibleUnitCardCheck(context: GameScene): void {
  if (!context.visibleUnitCard) return;

  if (context.visibleUnitCard instanceof Tile) {
    context.visibleUnitCard.setDepth(2);
  } else {
    context.visibleUnitCard.setDepth(context.visibleUnitCard.row + 10);
  }

  context.visibleUnitCard.unitCard?.setVisible(false);
}

export function generateFourDigitId(): number {
  return Math.floor(1000 + Math.random() * 9000);
}

export function useAnimation(image: GameObjects.Image, scale = 2): void {
  image.scene.tweens.add({
    targets: image,
    scale,
    alpha: 0,
    duration: 1000,
    onComplete: () => {
      image.destroy();
    }
  });
}

export function textAnimationSizeIncrease(text: GameObjects.Text, scale = 2): Promise<void> {
  return new Promise((resolve) => {
    text.scene.tweens.add({
      targets: text,
      scale,
      alpha: 50,
      duration: 1000,
      onComplete: () => {
        text.destroy();
        resolve();
      }
    });
  });
}

export function textAnimationFadeOut(text: GameObjects.Text, duration = 1000): Promise<void> {
  return new Promise((resolve) => {
    text.scene.tweens.add({
      targets: text,
      alpha: 0,
      duration,
      ease: 'Linear',
      onComplete: () => {
        text.destroy();
        resolve();
      }
    });
  });
}

export function gameListFadeOutText(context: UIScene | GameScene, x: number, y: number, message: string): Phaser.GameObjects.Text {
  return context.add.text(x, y, message, {
    fontFamily: "proLight",
    fontSize: 60,
    color: '#fffb00'
  }).setDepth(9999);
}