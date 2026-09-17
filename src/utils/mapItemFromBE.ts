import { EItems } from "../enums/gameEnums";
import { IItem, IItemBE } from "../interfaces/gameInterface";

export function mapItemFromBE(data: IItemBE): IItem {
  const healingArray = [EItems.DWARVEN_BREW, EItems.HEALING_POTION, EItems.MANA_VIAL];
  const damageArray = [EItems.INFERNO, EItems.SOUL_HARVEST, EItems.PULVERIZER];

  return {
    row: 10,
    canHeal: healingArray.includes(data.itemType),
    dealsDamage: damageArray.includes(data.itemType),
    ...data
  };
}