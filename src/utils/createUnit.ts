import { Tile } from "../classes/board/tile";
import { Archer } from "../classes/factions/council/archer";
import { Cleric } from "../classes/factions/council/cleric";
import { DragonScale, HealingPotion, Inferno } from "../classes/factions/council/items";
import { Knight } from "../classes/factions/council/knight";
import { Ninja } from "../classes/factions/council/ninja";
import { Wizard } from "../classes/factions/council/wizard";
import { Annihilator } from "../classes/factions/dwarves/annihilator";
import { Engineer } from "../classes/factions/dwarves/engineer";
import { Grenadier } from "../classes/factions/dwarves/grenadier";
import { Gunner } from "../classes/factions/dwarves/gunner";
import { DwarvenBrew, Pulverizer } from "../classes/factions/dwarves/items";
import { Paladin } from "../classes/factions/dwarves/paladin";
import { Impaler } from "../classes/factions/elves/impaler";
import { ManaVial, SoulHarvest, SoulStone } from "../classes/factions/elves/items";
import { Necromancer } from "../classes/factions/elves/necromancer";
import { Phantom } from "../classes/factions/elves/phantom";
import { Priestess } from "../classes/factions/elves/priestess";
import { VoidMonk } from "../classes/factions/elves/voidMonk";
import { Wraith } from "../classes/factions/elves/wraith";
import { Hero } from "../classes/factions/hero";
import { Item } from "../classes/factions/item";
import { ShiningHelm, SuperCharge, RuneMetal } from "../classes/factions/sharedItems";
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

    [EItems.DWARVEN_BREW]: () => new DwarvenBrew(context, itemData),
    [EItems.PULVERIZER]: () => new Pulverizer(context, itemData)
  };

  const createItem = itemTypes[itemData.itemType];
  if (!createItem) console.error('Error creating item', itemData);
  return createItem();
}

export function createNewHero(heroData: IHero): Hero {
  const heroTypes: Record<EHeroes, () => Hero> = {
    [EHeroes.ARCHER]: () => new Archer(heroData),
    [EHeroes.CLERIC]: () => new Cleric(heroData),
    [EHeroes.KNIGHT]: () => new Knight(heroData),
    [EHeroes.NINJA]: () => new Ninja(heroData),
    [EHeroes.WIZARD]: () => new Wizard(heroData),

    [EHeroes.PRIESTESS]: () => new Priestess(heroData),
    [EHeroes.IMPALER]: () => new Impaler(heroData),
    [EHeroes.NECROMANCER]: () => new Necromancer(heroData),
    [EHeroes.PHANTOM]: () => new Phantom(heroData),
    [EHeroes.VOIDMONK]: () => new VoidMonk(heroData),
    [EHeroes.WRAITH]: () => new Wraith(heroData),

    [EHeroes.PALADIN]: () => new Paladin(heroData),
    [EHeroes.ENGINEER]: () => new Engineer(heroData),
    [EHeroes.GUNNER]: () => new Gunner(heroData),
    [EHeroes.GRENADIER]: () => new Grenadier(heroData),
    [EHeroes.ANNIHILATOR]: () => new Annihilator(heroData)
  };

  const createHero = heroTypes[heroData.unitType];
  if (!createHero) console.error('Error creating hero', heroData);
  return createHero();
}