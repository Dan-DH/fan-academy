import { EFaction } from "../../enums/gameEnums";
import { ELeaderboardEnum } from "../../enums/leaderboardEnum";
import { getLeaderBoardQuery } from "../../queries/userQueries";

export async function getLeaderboardData() {
  const mainBoard = await getLeaderBoardQuery(ELeaderboardEnum.MAIN);
  const councilBoard = await getLeaderBoardQuery(ELeaderboardEnum.COUNCIL);
  const elvesBoard = await getLeaderBoardQuery(ELeaderboardEnum.ELVES);
  const dwarvesBoard = await getLeaderBoardQuery(ELeaderboardEnum.DWARVES);

  if (!mainBoard || !councilBoard || !elvesBoard || !dwarvesBoard) throw new Error(`getLeaderboardData() -> Data not found`);

  return {
    mainBoard,
    councilBoard,
    elvesBoard,
    dwarvesBoard
  };
}

export function mapFactionEnumsToLowerCase(faction: EFaction): string {
  const factionMap = {
    [EFaction.COUNCIL]: 'council',
    [EFaction.DARK_ELVES]: 'elves',
    [EFaction.DWARVES]: 'dwarves'
  };

  return factionMap[faction]; // TODO: place somewhere else and rename
}