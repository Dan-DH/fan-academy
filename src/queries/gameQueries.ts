import { EFaction, EGameModes } from "../enums/gameEnum";
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

// Challenge a player to a game // TODO: WE KEEP THIS ONE
export async function newGameChallenge(data: {
  userId: string,
  username: string,
  portrait: string,
  faction: EFaction,
  opponentUsername: string,
  opponentPortrait: string,
  opponentId: string,
  gameMode: EGameModes
} ): Promise<any> {
  const jwt = localStorage.getItem('jwt');
  const { userId, username, portrait, faction, gameMode, opponentUsername, opponentPortrait, opponentId } = data;

  const url = `${import.meta.env.VITE_BE_URL}games/newGame?userId=${encodeURIComponent(userId)}&username=${encodeURIComponent(username)}&portrait=${encodeURIComponent(portrait)}&faction=${encodeURIComponent(faction)}&opponentUsername=${encodeURIComponent(opponentUsername)}&opponentPortrait=${encodeURIComponent(opponentPortrait)}&opponentId=${encodeURIComponent(opponentId)}&gameMode=${encodeURIComponent(gameMode)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    }
  });

  const result = await response.json();

  if (response.status !== 200) {
    console.error('Error sending challenge...', result.message);
    return null;
  }

  return result; // TODO: what do we do with the result here?
}