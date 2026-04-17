import { ETiles } from "../../enums/gameEnum";
import { ITile } from "../../interfaces/gameInterface";
import IGameBE from "../../interfaces/gameInterfaceServer";
import LobbyScene from "../lobby.scene";
import { mapTemplates } from "./mapTemplates";

export function mapToPhaserGame(context: LobbyScene, gameData: IGameBE): ITile[] {
  const unitsOnBoard = gameData.currentTurn!.turnStartSnapshot.boardState!;
  const specialTiles = mapTemplates[gameData.map! - 1];

  const mapTile = (boardPosition: number) => {
    return {
      boardPosition: boardPosition,
      row: context.centerPoints[boardPosition].row!,
      col: context.centerPoints[boardPosition].col!,
      x: context.centerPoints[boardPosition].x,
      y: context.centerPoints[boardPosition].y,
      tileType: ETiles.BASIC, // FIXME:
      obstacle: false // FIXME:
    };
  };

  const iTiles: ITile[] = [];
  specialTiles.forEach(st => {
    // TODO: we only need the boardPosition for the special tiles
    const newTile = mapTile(st.boardPosition);

    const unitIndex = unitsOnBoard?.findIndex(u => u.boardPosition === st.boardPosition);
    if (unitIndex && unitIndex !== -1){
      const [unit] = unitsOnBoard.splice(unitIndex, 1);

      if (unit) {
        if (unit.unitId.includes("crystal")) {
          Object.assign(newTile, { crystal: unit });
        } else {
          Object.assign(newTile, { hero: unit });
        }
      }

      Object.assign(newTile, unit ? { obstacle: true } : { obstacle: false });
      Object.assign(newTile, { tileType: st.tileType });
    }

    iTiles.push(newTile);
  });

  unitsOnBoard.forEach(u => {
    const newTile = mapTile(u.boardPosition);
    if (u.unitId.includes("crystal")) {
      Object.assign(newTile, { crystal: u });
    } else {
      Object.assign(newTile, { hero: u });
    }

    Object.assign(newTile, { obstacle: true });
    Object.assign(newTile, { tileType: ETiles.BASIC });

    iTiles.push(newTile);
  });

  return iTiles; // TODO: so theoretically we could pass this to a Board and it would generate the grid
}

export const enum EHeroStatus {
  NONE = 0,
  PRIESTESS_DEBUFF = 1 << 0, // 1
  ANNIHILATOR_DEBUFF = 1 << 1, // 2
  SUPER_CHARGE = 1 << 2, // 4
  FACTION_EQUIPMENT = 1 << 3, // 8
  SHINNING_HELM = 1 << 4, // 16
  MANA_VIAL = 1 << 5, // 32
  DWARVEN_BREW = 1 << 6, // 64
  RUNE_METAL = 1 << 7  // 128
}

export const heroStatusManager = {
  has: (current: number, flag: EHeroStatus) => (current & flag) !== 0,
  add: (current: number, flag: EHeroStatus) => current | flag,
  toggle: (current: number, flag: EHeroStatus) => current ^ flag
  // remove: (current: number, flag: EHeroStatus) => current & ~flag
};