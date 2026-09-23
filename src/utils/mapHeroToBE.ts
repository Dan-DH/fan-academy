import { Hero } from "../classes/factions/hero";
import { EBoardUnit } from "../enums/gameEnums";
import { IHeroBE } from "../interfaces/gameInterface";

export function mapHeroToBE(hero: Hero): IHeroBE {
  const { faction, unitType, unitId, boardPosition, currentHealth, maxHealth, lastBreath, unitsConsumed, belongsTo } = hero.stats;

  return {
    faction,
    unitType,
    unitId,
    boardPosition,
    currentHealth,
    maxHealth,
    lastBreath,
    unitsConsumed,
    boardType: EBoardUnit.HERO,
    belongsTo,
    class: hero.stats.class,
    status: hero.status.get()
  };
}