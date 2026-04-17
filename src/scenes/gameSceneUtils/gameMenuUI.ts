import { joinGame } from "../../colyseus/colyseusGameRoom";
import IGameBE from "../../interfaces/gameInterfaceServer";
import LobbyScene from "../lobby.scene";
import { mapToPhaserGame } from "../lobbySceneUtils/mapToPhaserGame";

export async function accessGame(context: LobbyScene, game: IGameBE): Promise<void> {
  if (context.currentRoom) {
    console.log('Leaving game: ', context.currentRoom);
    context.currentRoom = undefined;
    context.scene.stop('GameScene');
  }

  console.log('Accessing game: ', game._id);
  const room = await joinGame(context.colyseusClient, context.userId, game._id, context);
  const gameData = mapToPhaserGame(context, game);
  context.currentRoom = game._id;

  context.scene.launch('GameScene', {
    userId: context.userId,
    colyseusClient: context.colyseusClient,
    currentGame: gameData,
    currentRoom: room // TODO: remove?
  });
}