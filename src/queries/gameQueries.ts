import { EFaction, EGameModes } from "../enums/gameEnums";
import { IGame } from "../interfaces/gameInterface";

export async function getGameList(userId: string): Promise<IGame[] | []> {
  console.log('Fetching game list...');
  const jwt = localStorage.getItem('jwt');
  const url = `${import.meta.env.VITE_BE_URL}games/playing?userId=${encodeURIComponent(userId)}`;
  const result = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    }
  });

  const games = await result.json();

  if (result.status !== 200) {
    console.log('Error fetching the game list...');
    return [];
  }

  return games;
}

// Challenge a player to a game
export async function newGameChallenge(userId: string, faction: EFaction, opponentId: string, gameMode: EGameModes): Promise<any> {
  const jwt = localStorage.getItem('jwt');

  const url = `${import.meta.env.VITE_BE_URL}games/newGame?userId=${encodeURIComponent(userId)}&faction=${encodeURIComponent(faction)}&opponentId=${encodeURIComponent(opponentId)}&gameMode=${encodeURIComponent(gameMode)}`;
  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    }
  });

  const data = await result.json();

  if (result.status !== 200) {
    console.error('Error sending challenge...', data.message);
    return null;
  }

  return data;
}