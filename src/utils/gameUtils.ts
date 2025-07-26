import { GameObjects } from "phaser";
import { Archer, Cleric, DragonScale, HealingPotion, Inferno, Knight, Ninja, Wizard } from "../classes/council";
import { Crystal } from "../classes/crystal";
import { Impaler, ManaVial, Necromancer, Phantom, Priestess, SoulHarvest, SoulStone, VoidMonk, Wraith } from "../classes/elves";
import { Hero } from "../classes/hero";
import { Item, RuneMetal, ShiningHelm, SuperCharge } from "../classes/item";
import { Tile } from "../classes/tile";
import { EActionClass, EActionType, ECardType, EClass, EHeroes, EItems, ETiles, EWinConditions } from "../enums/gameEnums";
import { ICrystal, IHero, IItem, IPlayerState, ITile } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";

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
        duration: 300,
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

export function getActionClass(action: EActionType): EActionClass {
  return [EActionType.PASS, EActionType.DRAW, EActionType.REMOVE_UNITS].includes(action) ? EActionClass.AUTO : EActionClass.USER;
}

export function getAOETiles(context: GameScene, spell: Item,  targetTile: Tile): {
  enemyHeroTiles: Tile[],
  enemyCrystalTiles: Tile[]
} {
  const board = context.gameController?.board;
  if (!board) throw new Error('Inferno use() board not found');

  const areOfEffect = board.getAreaOfEffectTiles(targetTile);

  const enemyHeroTiles = areOfEffect?.filter(tile => tile.hero && tile.hero?.belongsTo !== spell.belongsTo);

  const enemyCrystalTiles = areOfEffect?.filter(tile => tile.tileType === ETiles.CRYSTAL && tile.crystal?.belongsTo !== spell.belongsTo);

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

export function updateUnitsLeft(context: GameScene, hero: Hero): void {
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

  const unitIndex = unitsArray.findIndex(unit => unit.unitId === hero.unitId);
  if (unitIndex !== -1) unitsArray.splice(unitIndex, 1);

  // Get remaining units of defending player. Populate gameOver flag if there are none left
  const remainingBoardUnits = unitsArray.find(unit => unit.belongsTo === hero.belongsTo);

  let remainingHandUnits;
  const defendingPlayerIsActivePlayer = defendingPlayer.playerId === context.activePlayer;
  if (defendingPlayerIsActivePlayer) {
    remainingHandUnits = context.gameController?.hand.getHand().find(unit => unit.belongsTo === hero.belongsTo && unit.class === EClass.HERO);
  } else {
    remainingHandUnits = defendingPlayer.factionData.unitsInHand.find(unit => unit.belongsTo === hero.belongsTo && unit.class === EClass.HERO);
  }

  const remainingDeckUnits = defendingPlayer.factionData.unitsInDeck.find(unit => unit.belongsTo === hero.belongsTo && unit.class === EClass.HERO);

  if (remainingBoardUnits || remainingHandUnits || remainingDeckUnits) return;

  context.gameController!.gameOver = {
    winCondition: EWinConditions.UNITS,
    winner: attackingPlayer.playerId
  };
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
      cardText: "Permanently increases and ally's power by 50%."
    },

    [EItems.DRAGON_SCALE]: {
      cardName: 'Dragonscale',
      cardType: ECardType.EQUIPMENT,
      cardText: "Adds 20% physical defense, and 10% max health."
    },
    [EItems.HEALING_POTION]: {
      cardName: 'Healing Potion',
      cardType: ECardType.CONSUMABLE,
      cardText: "Heals and ally for 1000 HP, or revives an ally with 100 HP."
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
      cardText: "Doubles the effect of a unit's life leech and increases max health by 10%"
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
  if (context.visibleUnitCard) {
    context.visibleUnitCard.setDepth(context.visibleUnitCard.boardPosition + 10);
    context.visibleUnitCard.unitCard.setVisible(false);
  }
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

export function textAnimation(text: GameObjects.Text, scale = 2): Promise<void> {
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
