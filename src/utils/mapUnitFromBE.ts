import { EAttackType, EHeroes } from "../enums/gameEnums";
import { IHero, IHeroBaseStats, IHeroBE } from "../interfaces/gameInterface";
import { calculateAllCenterPoints } from "./boardCalculations";

export function mapUnitFromBE(data: IHeroBE): IHero {
  const coordinates = calculateAllCenterPoints(); // FIXME: need a better way to deal with this function
  const unitCoordinates = coordinates.find(c => c.boardPosition === data.boardPosition);

  // if (!unitCoordinates) throw new Error('mapUnitFromBE() - No matching coordinates for board position: ' + data.boardPosition);

  const baseUnitStats = mapUnitBaseStats(data.unitType);

  return {
    class: data.class,
    faction: data.faction,
    unitType: data.unitType,
    unitId: data.unitId,
    boardPosition: data.boardPosition,
    status: data.status,
    boardType: data.boardType,
    belongsTo: data.belongsTo,

    currentHealth: data.currentHealth ?? baseUnitStats.baseHealth,
    maxHealth: data.maxHealth ?? baseUnitStats.baseHealth,
    lastBreath: data.lastBreath ?? false,
    unitsConsumed: data.unitsConsumed ?? 0,
    row: unitCoordinates?.row ?? 0,
    col: unitCoordinates?.col ?? 0,
    isKO: data.currentHealth === 0,
    ...baseUnitStats
  };
}

function mapUnitBaseStats(unitType: EHeroes): IHeroBaseStats {
  const map = {
    [EHeroes.ARCHER]: {
      baseHealth: 800,
      movement: 2,
      attackType: EAttackType.PHYSICAL,
      attackRange: 3,
      healingRange: 0,
      buffRange: 0,
      basePower: 300,
      basePhysicalDamageResistance: 0,
      baseMagicalDamageResistance: 0,
      canHeal: false,
      canBuff: false
    },
    [EHeroes.CLERIC]: {
      baseHealth: 800,
      movement: 2,
      attackType: EAttackType.MAGICAL,
      attackRange: 2,
      healingRange: 2,
      buffRange: 0,
      basePower: 200,
      basePhysicalDamageResistance: 0,
      baseMagicalDamageResistance: 0,
      canHeal: true,
      canBuff: false
    },
    [EHeroes.KNIGHT]: {
      baseHealth: 1000,
      movement: 2,
      attackType: EAttackType.PHYSICAL,
      attackRange: 1,
      healingRange: 0,
      buffRange: 0,
      basePower: 200,
      basePhysicalDamageResistance: 20,
      baseMagicalDamageResistance: 0,
      canHeal: false,
      canBuff: false
    },
    [EHeroes.NINJA]: {
      baseHealth: 800,
      movement: 3,
      attackType: EAttackType.PHYSICAL,
      attackRange: 2,
      healingRange: 0,
      buffRange: 0,
      basePower: 200,
      basePhysicalDamageResistance: 0,
      baseMagicalDamageResistance: 0,
      canHeal: false,
      canBuff: false
    },
    [EHeroes.WIZARD]: {
      baseHealth: 800,
      movement: 2,
      attackType: EAttackType.MAGICAL,
      attackRange: 2,
      healingRange: 0,
      buffRange: 0,
      basePower: 200,
      basePhysicalDamageResistance: 0,
      baseMagicalDamageResistance: 10,
      canHeal: false,
      canBuff: false
    },
    [EHeroes.PRIESTESS]: {
      baseHealth: 800,
      movement: 2,
      attackType: EAttackType.MAGICAL,
      attackRange: 2,
      healingRange: 3,
      buffRange: 0,
      basePower: 200,
      basePhysicalDamageResistance: 0,
      baseMagicalDamageResistance: 0,
      canHeal: true,
      canBuff: false
    },
    [EHeroes.IMPALER]: {
      baseHealth: 800,
      movement: 2,
      attackType: EAttackType.PHYSICAL,
      attackRange: 2,
      healingRange: 0,
      buffRange: 0,
      basePower: 300,
      basePhysicalDamageResistance: 0,
      baseMagicalDamageResistance: 0,
      canHeal: false,
      canBuff: false
    },
    [EHeroes.NECROMANCER]: {
      baseHealth: 800,
      movement: 2,
      attackType: EAttackType.MAGICAL,
      attackRange: 3,
      healingRange: 0,
      buffRange: 0,
      basePower: 200,
      basePhysicalDamageResistance: 0,
      baseMagicalDamageResistance: 0,
      canHeal: false,
      canBuff: false
    },
    [EHeroes.PHANTOM]: {
      baseHealth: 100,
      movement: 3,
      attackType: EAttackType.MAGICAL,
      attackRange: 1,
      healingRange: 0,
      buffRange: 0,
      basePower: 100,
      basePhysicalDamageResistance: 0,
      baseMagicalDamageResistance: 0,
      canHeal: false,
      canBuff: false
    },
    [EHeroes.VOIDMONK]: {
      baseHealth: 800,
      movement: 3,
      attackType: EAttackType.PHYSICAL,
      attackRange: 1,
      healingRange: 0,
      buffRange: 0,
      basePower: 200,
      basePhysicalDamageResistance: 20,
      baseMagicalDamageResistance: 20,
      canHeal: false,
      canBuff: false
    },
    [EHeroes.WRAITH]: {
      baseHealth: 800,
      movement: 3,
      attackType: EAttackType.MAGICAL,
      attackRange: 1,
      healingRange: 0,
      buffRange: 0,
      basePower: 250,
      basePhysicalDamageResistance: 0,
      baseMagicalDamageResistance: 10,
      canHeal: false,
      canBuff: false
    },
    [EHeroes.PALADIN]: {
      baseHealth: 900,
      movement: 2,
      attackType: EAttackType.PHYSICAL,
      attackRange: 1,
      healingRange: 2,
      buffRange: 0,
      basePower: 200,
      basePhysicalDamageResistance: 10,
      baseMagicalDamageResistance: 10,
      canHeal: true,
      canBuff: false
    },
    [EHeroes.ENGINEER]: {
      baseHealth: 800,
      movement: 2,
      attackType: EAttackType.PHYSICAL,
      attackRange: 1,
      healingRange: 0,
      buffRange: 3,
      basePower: 200,
      basePhysicalDamageResistance: 0,
      baseMagicalDamageResistance: 0,
      canHeal: false,
      canBuff: true
    },
    [EHeroes.GUNNER]: {
      baseHealth: 800,
      movement: 2,
      attackType: EAttackType.PHYSICAL,
      attackRange: 2,
      healingRange: 0,
      buffRange: 0,
      basePower: 300,
      basePhysicalDamageResistance: 0,
      baseMagicalDamageResistance: 0,
      canHeal: false,
      canBuff: false
    },
    [EHeroes.GRENADIER]: {
      baseHealth: 800,
      movement: 2,
      attackType: EAttackType.MAGICAL,
      attackRange: 3,
      healingRange: 0,
      buffRange: 0,
      basePower: 200,
      basePhysicalDamageResistance: 0,
      baseMagicalDamageResistance: 0,
      canHeal: false,
      canBuff: false
    },
    [EHeroes.ANNIHILATOR]: {
      baseHealth: 650,
      movement: 2,
      attackType: EAttackType.MAGICAL,
      attackRange: 3,
      healingRange: 0,
      buffRange: 0,
      basePower: 300,
      basePhysicalDamageResistance: 0,
      baseMagicalDamageResistance: 0,
      canHeal: false,
      canBuff: false
    }
  };

  const result = map[unitType];

  if (!result) throw new Error('mapUnitBaseStats() - No unit matching ' + unitType);

  return result;
}