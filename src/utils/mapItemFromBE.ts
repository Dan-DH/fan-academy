import { EItems } from "../enums/gameEnums";
import { IItem, IItemBE } from "../interfaces/gameInterface";

export function mapItemFromBE(data: IItemBE): IItem {
  const healingArray = [EItems.DWARVEN_BREW, EItems.HEALING_POTION, EItems.MANA_VIAL, EItems.MEAT];
  const damageArray = [EItems.INFERNO, EItems.SOUL_HARVEST, EItems.PULVERIZER, EItems.TYPHOON];

  return {
    row: 10,
    canHeal: healingArray.includes(data.itemType),
    dealsDamage: damageArray.includes(data.itemType),
    ...data
  };
}