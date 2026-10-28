import { EFaction } from "../../enums/gameEnums";
import { ELeaderboardEnum } from "../../enums/leaderboardEnum";
import { getLeaderBoardQuery } from "../../queries/userQueries";

export async function getLeaderboardData() {
  const mainBoard = await getLeaderBoardQuery(ELeaderboardEnum.MAIN);
  const councilBoard = await getLeaderBoardQuery(ELeaderboardEnum.COUNCIL);
  const elvesBoard = await getLeaderBoardQuery(ELeaderboardEnum.ELVES);
  const dwarvesBoard = await getLeaderBoardQuery(ELeaderboardEnum.DWARVES);
  const tribeBoard = await getLeaderBoardQuery(ELeaderboardEnum.TRIBE);

  if (!mainBoard || !councilBoard || !elvesBoard || !dwarvesBoard || !tribeBoard) throw new Error(`getLeaderboardData() -> Data not found`);

  return {
    mainBoard,
    councilBoard,
    elvesBoard,
    dwarvesBoard,
    tribeBoard
  };
}

export function mapFactionEnumsToLowerCase(faction: EFaction): string {
  const factionMap = {
    [EFaction.COUNCIL]: 'council',
    [EFaction.DARK_ELVES]: 'elves',
    [EFaction.DWARVES]: 'dwarves',
    [EFaction.TRIBE]: 'tribe'
  };

  return factionMap[faction];
}