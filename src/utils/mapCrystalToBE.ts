import { Crystal } from "../classes/board/crystal";
import { ICrystalBE } from "../interfaces/gameInterface";

export function mapCrystalToBE(crystal: Crystal): ICrystalBE {
  const {
    unitId,
    belongsTo,
    maxHealth,
    currentHealth,
    boardPosition,
    boardType
  } = crystal.stats;

  return {
    unitId,
    belongsTo,
    maxHealth,
    currentHealth,
    boardPosition,
    boardType,
    status: crystal.status.get()
  };
}