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
import { IHeroBE, IItemBE } from "../interfaces/gameInterface";
import { mapItemFromBE } from "./mapItemFromBE";
import { mapUnitFromBE } from "./mapUnitFromBE";

export function createNewItem(itemData: IItemBE): Item {
  const itemTypes: Record<EItems, () => Item> = {
    [EItems.SHINING_HELM]: () => new ShiningHelm(mapItemFromBE(itemData)),
    [EItems.SUPERCHARGE]: () => new SuperCharge(mapItemFromBE(itemData)),
    [EItems.RUNE_METAL]: () => new RuneMetal(mapItemFromBE(itemData)),

    [EItems.DRAGON_SCALE]: () => new DragonScale(mapItemFromBE(itemData)),
    [EItems.HEALING_POTION]: () => new HealingPotion(mapItemFromBE(itemData)),
    [EItems.INFERNO]: () => new Inferno(mapItemFromBE(itemData)),

    [EItems.MANA_VIAL]: () => new ManaVial(mapItemFromBE(itemData)),
    [EItems.SOUL_HARVEST]: () => new SoulHarvest(mapItemFromBE(itemData)),
    [EItems.SOUL_STONE]: () => new SoulStone(mapItemFromBE(itemData)),

    [EItems.DWARVEN_BREW]: () => new DwarvenBrew(mapItemFromBE(itemData)),
    [EItems.PULVERIZER]: () => new Pulverizer(mapItemFromBE(itemData))
  };

  const createItem = itemTypes[itemData.itemType];
  if (!createItem) console.error('Error creating item', itemData);
  return createItem();
}

export function createNewHero(heroData: IHeroBE): Hero {
  const heroTypes: Record<EHeroes, () => Hero> = {
    [EHeroes.ARCHER]: () => new Archer(mapUnitFromBE(heroData)),
    [EHeroes.CLERIC]: () => new Cleric(mapUnitFromBE(heroData)),
    [EHeroes.KNIGHT]: () => new Knight(mapUnitFromBE(heroData)),
    [EHeroes.NINJA]: () => new Ninja(mapUnitFromBE(heroData)),
    [EHeroes.WIZARD]: () => new Wizard(mapUnitFromBE(heroData)),

    [EHeroes.PRIESTESS]: () => new Priestess(mapUnitFromBE(heroData)),
    [EHeroes.IMPALER]: () => new Impaler(mapUnitFromBE(heroData)),
    [EHeroes.NECROMANCER]: () => new Necromancer(mapUnitFromBE(heroData)),
    [EHeroes.PHANTOM]: () => new Phantom(mapUnitFromBE(heroData)),
    [EHeroes.VOIDMONK]: () => new VoidMonk(mapUnitFromBE(heroData)),
    [EHeroes.WRAITH]: () => new Wraith(mapUnitFromBE(heroData)),

    [EHeroes.PALADIN]: () => new Paladin(mapUnitFromBE(heroData)),
    [EHeroes.ENGINEER]: () => new Engineer(mapUnitFromBE(heroData)),
    [EHeroes.GUNNER]: () => new Gunner(mapUnitFromBE(heroData)),
    [EHeroes.GRENADIER]: () => new Grenadier(mapUnitFromBE(heroData)),
    [EHeroes.ANNIHILATOR]: () => new Annihilator(mapUnitFromBE(heroData))
  };

  const createHero = heroTypes[heroData.unitType];
  if (!createHero) console.error('Error creating hero', heroData);
  return createHero();
}