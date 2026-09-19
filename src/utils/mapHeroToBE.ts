import { Hero } from "../classes/factions/hero";
import { IHeroBE } from "../interfaces/gameInterface";

export function mapHeroToBE(hero: Hero): IHeroBE {
  const { faction, unitType, unitId, boardPosition, currentHealth, maxHealth, lastBreath, unitsConsumed, boardType, belongsTo } = hero.stats;

  return {
    faction,
    unitType,
    unitId,
    boardPosition,
    currentHealth,
    maxHealth,
    lastBreath,
    unitsConsumed,
    boardType,
    belongsTo,
    class: hero.stats.class,
    status: hero.status.get()
  };
}