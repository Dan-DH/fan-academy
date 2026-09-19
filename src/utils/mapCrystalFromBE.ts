import { Coordinates, ICrystal, ICrystalBE } from "../interfaces/gameInterface";
import { fanAcademy } from "../main";

export function mapCrystalFromBE(data: ICrystalBE): ICrystal {
  const coordinates = fanAcademy.registry.get('tileCoords') as Coordinates[];
  const unitCoordinates = coordinates.find(c => c.boardPosition === data.boardPosition);

  return {
    maxHealth: data.maxHealth,
    currentHealth: data.currentHealth,
    boardPosition: data.boardPosition,
    belongsTo: data.belongsTo,
    boardType: data.boardType,
    row: unitCoordinates!.row!,
    col: unitCoordinates!.col!,
    debuffLevel: 0, // FIXME: to be calculated after all the units are set up
    paladinAura: 0, // same, alongside resistance
    basePhysicalDamageResistance: 0,
    baseMagicalDamageResistance: 0,
    physicalDamageResistance: 0,
    magicalDamageResistance: 0
  };
}