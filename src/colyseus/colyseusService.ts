import { Client, Room } from "@colyseus/sdk";
import { fanAcademy } from "../main";
import { createGameList } from "../scenes/gameSceneUtils/gameList";
import { IChatMessage, IGame, IGameOver, IGameState } from "../interfaces/gameInterface";
import UIScene from "../scenes/ui.scene";
import { EFaction, EGameModes, EGameStatus } from "../enums/gameEnums";
import { renderChatMessage } from "../scenes/gameSceneUtils/chatComponent";

class ColyseusService {
  client: Client;
  lobby: Room | undefined;
  constructor() {
    this.client = new Client(`${import.meta.env.VITE_SOCKET}`);
    this.lobby = undefined;
  }

  async connect(userId: string, token: string) {
    if (this.lobby) return this.lobby;
    const lobby = await this.client.joinOrCreate('lobby', {
      userId,
      token
    });

    if (!lobby) throw new Error('connectToGameLobby() No lobby found');
    lobby.reconnection.enabled = false;

    this.setOnMessages(lobby);
    this.lobby = lobby;
    return this.lobby;
  }

  async setOnMessages(lobby: Room): Promise<void> {
    //
    // RECEIVING MESSAGES
    //
    lobby.onMessage('newGameListUpdate', async (message) => {
      const gameList = fanAcademy.registry.get('gameList') as IGame[];
      if (!gameList) console.error('newGameListUpdate - No gameList found');

      // Update game and re-render game list. Remove the 'Searching...' game first if needed
      const isInArrayIndex = gameList!.findIndex(game => game._id === message.game._id);
      if (isInArrayIndex !== -1) gameList?.splice(isInArrayIndex, 1);

      gameList?.push(message.game);

      if (fanAcademy.scene.isActive('UIScene')) {
        const uiScene = fanAcademy.scene.getScene('UIScene') as UIScene;
        uiScene.activeGamesAmount++;
        createGameList();
      }
    });

    lobby.onMessage('gameListUpdate', async (message: {
      gameId: string,
      previousTurn: IGameState[],
      newActivePlayer: string,
      turnNumber: number,
      lastPlayedAt: Date
    }) => {
      const gameList = fanAcademy.registry.get('gameList') as IGame[];
      if (!gameList) throw console.error('gameListUpdate - No gameList found');

      let game = undefined;
      const isInArrayIndex = gameList!.findIndex(game => game._id === message.gameId);
      if (isInArrayIndex !== -1) game = gameList?.splice(isInArrayIndex, 1)[0];
      if (!game) throw new Error('gameListUpdate - No game found');

      game.previousTurn = message.previousTurn;
      game.activePlayer = message.newActivePlayer;
      game.turnNumber = message.turnNumber;
      game.lastPlayedAt = message.lastPlayedAt;

      gameList.push(game);

      if (fanAcademy.scene.isActive('UIScene')) {
        const uiScene = fanAcademy.scene.getScene('UIScene') as UIScene;
        createGameList();

        if (message.gameId === uiScene.activeGame) {
          uiScene.scene.get('GameScene').scene.restart({
            userId: uiScene.userId,
            currentGame: game,
            triggerReplay: message.newActivePlayer !== uiScene.userId ? false : true
          });
        }
      }
    });

    lobby.onMessage('gameOverUpdate', (message: {
      gameId: string,
      previousTurn: IGameState[],
      // userIds: string[], // FIXME: if not needed, remove as well in BE
      turnNumber: number,
      lastPlayedAt: Date,
      gameOver: IGameOver
    }) => {
      const gameList = fanAcademy.registry.get('gameList') as IGame[];
      if (!gameList) console.error('gameOverUpdate - No context.gameList found');

      // The maximum number of finished games is 5. Sort by finishedAt and remove the oldest finished game if going above the cap
      const finishedGames = gameList?.filter(game => game.status === EGameStatus.FINISHED);
      finishedGames?.sort((a, b) => new Date(b.finishedAt).getTime() - new Date(a.finishedAt).getTime());
      if (finishedGames && finishedGames.length > 4) finishedGames.pop();

      const unfinishedGames = gameList?.filter(game => game.status !== EGameStatus.FINISHED);
      const game = unfinishedGames?.find(game => game._id === message.gameId);
      if (!game) throw new Error('gameOverUpdate - No game found'); // TODO: swithc this kind of error for a error message?

      game.previousTurn = message.previousTurn;
      game.turnNumber = message.turnNumber;
      game.status = EGameStatus.FINISHED;
      game.lastPlayedAt = message.lastPlayedAt;
      game.gameOver = message.gameOver;

      fanAcademy.registry.set('gameList', [...unfinishedGames ?? [], ...finishedGames ?? []]);

      if (fanAcademy.scene.isActive('UIScene')) {
        const uiScene = fanAcademy.scene.getScene('UIScene') as UIScene;
        uiScene.activeGamesAmount--;
        createGameList();

        if (message.gameId === uiScene.activeGame) {
          uiScene.scene.get('GameScene').scene.restart({
            userId: uiScene.userId,
            currentGame: game
          });
        }
      }
    });

    lobby.onMessage('gameDeletedUpdate', (message: {
      gameId: string,
      userIds: string[]
    }) => {
      const gameList = fanAcademy.registry.get('gameList') as IGame[];
      if (!gameList) console.error('gameDeletedUpdate - No context.gameList found');

      // Remove game from the list and re-render it
      const isInArrayIndex = gameList!.findIndex(game => game._id === message.gameId);
      if (isInArrayIndex !== -1) gameList?.splice(isInArrayIndex, 1);

      if (fanAcademy.scene.isActive('UIScene')) createGameList();
    });

    // FIXME: check if these messages need to be async
    lobby.onMessage('userDeletedUpdate', async (message: {
      gameIds: string[],
      userIds: string[]
    }) => {
      const gameList = fanAcademy.registry.get('gameList') as IGame[];
      if (!gameList) console.error('userDeletedUpdate - No context.gameList found');

      if (fanAcademy.scene.isActive('UIScene')) {
        const uiScene = fanAcademy.scene.getScene('UIScene') as UIScene;
        message.gameIds.forEach(gameId => {
          const isInArrayIndex = gameList!.findIndex(game => game._id === gameId);
          if (isInArrayIndex !== -1) {
            const game = gameList?.splice(isInArrayIndex, 1);
            if (game?.length && uiScene.activeGame === game[0]._id) uiScene.scene.get('GameScene').scene.stop();
          }
          uiScene.activeGamesAmount--;
        });
        createGameList();
      }
    });

    lobby.onMessage('chatMessageReceived', (chatMessage: {
      roomId: string,
      message: IChatMessage
    }) => {
      const gameList = fanAcademy.registry.get('gameList') as IGame[];
      if (!gameList) console.error('chatMessageReceived - No context.gameList found');

      const gameToUpdate = gameList.find(g => g._id === chatMessage.roomId);
      if (gameToUpdate) gameToUpdate.chatLogs.messages.push(chatMessage.message);

      const uiScene = fanAcademy.scene.getScene('UIScene') as UIScene;
      if (uiScene.scene.isActive() && uiScene.activeGame === chatMessage.roomId) renderChatMessage(chatMessage.message);
    });
  }

  //
  // SENDING MESSAGES
  //
  async sendGetTurnHistoryMessage(gameId: string): Promise<void> {
    const turnHistory: {
      _id: string,
      turnHistory: IGameState[][]
    } = await this.lobby!.request('getTurnHistoryMessage', { gameId });

    const gameList = fanAcademy.registry.get('gameList') as IGame[];
    if (!gameList) console.error('turnHistoryReceived - No context.gameList found');
    // Phaser updates the registry automatically since we are setting the whole array
    const gameToUpdate = gameList.find(g => g._id === turnHistory._id);
    if (gameToUpdate) gameToUpdate.turnHistory = turnHistory.turnHistory;
  }

  sendDeletedGameMessage(gameId: string, userId: string): void {
    this.lobby!.send('gameDeletedMessage', {
      gameId,
      userId
    });
  }

  sendChallengeAcceptedMessage(gameId: string, userId: string, faction: EFaction): void {
    this.lobby!.send('challengeAcceptedMessage', {
      gameId,
      userId,
      faction
    });
  }

  sendChatMessage(messageObject: {
    gameId: string,
    userIds: string[],
    message: string
  }): void {
    this.lobby!.send('chatMessageSent', { ...messageObject });
  }

  sendCreateGameMessage(messageObject: {
    userId: string,
    faction: EFaction,
    gameMode: EGameModes
  }) {
    this.lobby!.send('createGame', messageObject);
  };

  sendTurnMessage(message: {
    gameId: string,
    currentTurn: IGameState[],
    newActivePlayer: string,
    turnNumber: number,
    gameOver?: IGameOver
  }): void {
    this.lobby!.send("turnSent", {
      gameId: message.gameId,
      currentTurn: message.currentTurn,
      newActivePlayer: message.newActivePlayer,
      gameOver: message.gameOver,
      turnNumber: message.turnNumber
    });
  }
}

export const colyseusService = new ColyseusService();