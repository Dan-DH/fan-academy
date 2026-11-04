import { Item } from "../classes/factions/item";
import { IItemBE } from "../interfaces/gameInterface";

export function mapItemToBE(item: Item): IItemBE {
  const {
    faction,
    unitId,
    itemType,
    boardPosition,
    belongsTo
  } = item.stats;

  return {
    faction,
    unitId,
    itemType,
    boardPosition,
    belongsTo,
    class: item.stats.class
  };
}