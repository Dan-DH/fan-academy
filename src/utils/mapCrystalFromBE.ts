import { Coordinates, ICrystal, ICrystalBE } from "../interfaces/gameInterface";
import { fanAcademy } from "../main";

export function mapCrystalFromBE(data: ICrystalBE): ICrystal {
  const coordinates = fanAcademy.registry.get('tileCoords') as Coordinates[];
  const unitCoordinates = coordinates.find(c => c.boardPosition === data.boardPosition);

  return {
    unitId: data.unitId,
    maxHealth: data.maxHealth,
    currentHealth: data.currentHealth,
    boardPosition: data.boardPosition,
    belongsTo: data.belongsTo,
    boardType: data.boardType,
    status: data.status,
    row: unitCoordinates!.row!,
    col: unitCoordinates!.col!,
    debuffLevel: 0, // debuff and paladinAura are udpated after all units are rendered
    paladinAura: 0,
    basePhysicalDamageResistance: 0,
    baseMagicalDamageResistance: 0,
    physicalDamageResistance: 0,
    magicalDamageResistance: 0
  };
}