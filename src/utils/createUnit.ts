import { Tile } from "../classes/board/tile";
import { Archer } from "../classes/factions/council/archer";
import { Cleric } from "../classes/factions/council/cleric";
import { DragonScale, HealingPotion, Inferno } from "../classes/factions/council/items";
import { Knight } from "../classes/factions/council/knight";
import { Ninja } from "../classes/factions/council/ninja";
import { Wizard } from "../classes/factions/council/wizard";
import { Impaler } from "../classes/factions/elves/impaler";
import { ManaVial, SoulHarvest, SoulStone } from "../classes/factions/elves/items";
import { Necromancer } from "../classes/factions/elves/necromancer";
import { Phantom } from "../classes/factions/elves/phantom";
import { Priestess } from "../classes/factions/elves/priestess";
import { VoidMonk } from "../classes/factions/elves/voidMonk";
import { Wraith } from "../classes/factions/elves/wraith";
import { Hero } from "../classes/factions/hero";
import { Item, ShiningHelm, SuperCharge, RuneMetal } from "../classes/factions/item";
import { EItems, EHeroes } from "../enums/gameEnums";
import { IItem, IHero } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";

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
    [EItems.SOUL_STONE]: () => new SoulStone(context, itemData),

    // TODO: dwarven items
    [EItems.DWARVEN_BREW]: () => new SoulHarvest(context, itemData),
    [EItems.PULVERIZER]: () => new SoulStone(context, itemData)
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
    [EHeroes.WRAITH]: () => new Wraith(context, heroData, tile),

    // TODO: dwarven heroes
    [EHeroes.PALADIN]: () => new Archer(context, heroData, tile),
    [EHeroes.ENGINEER]: () => new Cleric(context, heroData, tile),
    [EHeroes.GUNNER]: () => new Knight(context, heroData, tile),
    [EHeroes.GRENADIER]: () => new Ninja(context, heroData, tile),
    [EHeroes.ANNIHILATOR]: () => new Wizard(context, heroData, tile)
  };

  const createHero = heroTypes[heroData.unitType];
  if (!createHero) console.error('Error creating hero', heroData);
  return createHero();
}