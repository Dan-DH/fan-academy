import { EFaction, EGameModes, EGameStatus } from "../enums/gameEnums";
import { IChatMessage, IGameOver, IGameState } from "../interfaces/gameInterface";
import { createGameList } from "../scenes/gameSceneUtils/gameList";
import UIScene from "../scenes/ui.scene";
import { showDisconnectWarning } from "../scenes/uiSceneUtils/disconnectWarning";
import { renderChatMessage } from "../scenes/gameSceneUtils/chatComponent";
import { Client, Room } from "@colyseus/sdk";

let lobbyRoomLobby: Room | undefined =  undefined; // FIXME: testing

export async function connectToGameLobby(client: Client, userId: string, context: UIScene): Promise<Room | undefined> {
  let lobby;
  const token = localStorage.getItem("jwt");

  if (!token) {
    console.error('Error connecting to game lobby: missing token');
    return undefined;
  }

  try {
    console.log('Connecting to game lobby...');

    lobby = await client.joinOrCreate('lobby', {
      userId,
      token
    });

    if (!lobby) throw new Error('connectToGameLobby() No lobby found');

    lobby.reconnection.enabled = false; // TODO: might need a better way of handling this
    lobbyRoomLobby = lobby; // FIXME:

    lobby.onMessage('newGameListUpdate', async (message) => {
      if (!context.gameList) console.error('newGameListUpdate - No context.gameList found');

      // Update game and re-render game list. Remove the 'Searching...' game first if needed
      const isInArrayIndex = context.gameList!.findIndex(game => game._id === message.game._id);
      if (isInArrayIndex !== -1) context.gameList?.splice(isInArrayIndex, 1);

      context.gameList?.push(message.game);

      context.activeGamesAmount++;

      await createGameList(context);
    });

    lobby.onMessage('gameListUpdate', async (message: {
      gameId: string,
      previousTurn: IGameState[],
      newActivePlayer: string,
      turnNumber: number,
      lastPlayedAt: Date
    }) => {
      let game = undefined;
      const isInArrayIndex = context.gameList!.findIndex(game => game._id === message.gameId);
      if (isInArrayIndex !== -1) game = context.gameList?.splice(isInArrayIndex, 1)[0];

      if (!game) throw new Error('Colyseus lobby. No game found');

      game.previousTurn = message.previousTurn;
      game.activePlayer = message.newActivePlayer;
      game.turnNumber = message.turnNumber;
      game.lastPlayedAt = message.lastPlayedAt;

      context.gameList?.push(game);

      await createGameList(context);

      if (message.gameId === context.activeGame) {
        context.scene.get('GameScene').scene.restart({
          userId: context.userId,
          colyseusClient: context.colyseusClient,
          currentGame: game,
          currentRoom: context.activeGame,
          triggerReplay: message.newActivePlayer !== context.userId ? false : true
        });
      }
    });

    lobby.onMessage('gameOverUpdate', async (message: {
      gameId: string,
      previousTurn: IGameState[],
      userIds: string[],
      turnNumber: number,
      lastPlayedAt: Date,
      gameOver: IGameOver
    }) => {
      const gameList = context.gameList;
      if (!gameList) console.error('gameOverUpdate - No context.gameList found');

      // The maximum number of finished games is 5. Sort by finishedAt and remove the oldest finished game if going above the cap
      const unfinishedGames = gameList?.filter(game => game.status !== EGameStatus.FINISHED);
      const finishedGames = gameList?.filter(game => game.status === EGameStatus.FINISHED);
      finishedGames?.sort((a, b) => new Date(b.finishedAt).getTime() - new Date(a.finishedAt).getTime());

      if (finishedGames && finishedGames.length > 4) finishedGames.pop();

      const game = unfinishedGames?.find(game => game._id === message.gameId);
      if (!game) throw new Error('Colyseus lobby. No game found');

      game.previousTurn = message.previousTurn;
      game.turnNumber = message.turnNumber;
      game.status = EGameStatus.FINISHED;
      game.lastPlayedAt = message.lastPlayedAt;
      game.gameOver = message.gameOver;

      context.gameList = [...unfinishedGames ?? [], ...finishedGames ?? []];

      context.activeGamesAmount--;

      await createGameList(context);

      if (message.gameId === context.activeGame) {
        context.scene.get('GameScene').scene.restart({
          userId: context.userId,
          colyseusClient: context.colyseusClient,
          currentGame: game,
          currentRoom: context.activeGame
        });
      }
    });

    lobby.onMessage('gameDeletedUpdate', async (message: {
      gameId: string,
      userIds: string[]
    }) => {
      if (!context.gameList) console.error('gameDeletedUpdate - No context.gameList found');

      // Remove game from the list and re-render it
      const isInArrayIndex = context.gameList!.findIndex(game => game._id === message.gameId);
      if (isInArrayIndex !== -1) context.gameList?.splice(isInArrayIndex, 1);

      await createGameList(context);
      console.log('Game removed from list');
    });

    lobby.onMessage('userDeletedUpdate', async (message: {
      gameIds: string[],
      userIds: string[]
    }) => {
      if (!context.gameList) console.error('userDeletedUpdate - No context.gameList found');

      // Remove game from the list and re-render it
      message.gameIds.forEach(gameId => {
        const isInArrayIndex = context.gameList!.findIndex(game => game._id === gameId);
        if (isInArrayIndex !== -1) {
          const game = context.gameList?.splice(isInArrayIndex, 1);
          if (game?.length && context.activeGame === game[0]._id) context.scene.get('GameScene').scene.stop();
        }
      });

      context.activeGamesAmount--;

      await createGameList(context);
      console.log('Games removed from list');
    });

    lobby.onMessage('chatMessageReceived', async (chatMessage: {
      roomId: string,
      message: IChatMessage
    }) => {
      const gameToUpdate = context.gameList?.find(g => g._id === chatMessage.roomId);
      if (gameToUpdate) gameToUpdate.chatLogs.messages.push(chatMessage.message);

      if (context.activeGame === chatMessage.roomId) renderChatMessage(chatMessage.message);
    });

    lobby.onLeave((code: number) => {
      console.log("Left room with code:", code);
      showDisconnectWarning();
    });
  } catch (error) {
    console.error('Error joining lobby ->', error);
  }

  return lobby;
};

export function sendDeletedGameMessage(lobby: Room, gameId: string, userId: string): void {
  lobby.send('gameDeletedMessage', {
    gameId,
    userId
  });
}

export function sendChallengeAcceptedMessage(lobby: Room, gameId: string, userId: string, faction: EFaction): void {
  lobby.send('challengeAcceptedMessage', {
    gameId,
    userId,
    faction
  });
}

export function sendChatMessage(lobby: Room, messageObject: {
  gameId: string,
  userIds: string[],
  message: string
}): void {
  lobby.send('chatMessageSent', { ...messageObject });
}

export function sendCreateGameMessage(messageObject: {
  userId: string,
  faction: EFaction,
  gameMode: EGameModes
}) {
  lobbyRoomLobby!.send('createGame', messageObject);
};

export function sendTurnMessage(message: {
  gameId: string,
  currentTurn: IGameState[],
  newActivePlayer: string,
  turnNumber: number,
  gameOver?: IGameOver
}): void {
  lobbyRoomLobby!.send("turnSent", {
    gameId: message.gameId,
    currentTurn: message.currentTurn,
    newActivePlayer: message.newActivePlayer,
    gameOver: message.gameOver,
    turnNumber: message.turnNumber
  });
}