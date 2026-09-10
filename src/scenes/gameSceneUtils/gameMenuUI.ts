import { joinGame } from "../../colyseus/colyseusGameRoom";
import { IGame } from "../../interfaces/gameInterface";
import UIScene from "../ui.scene";

export async function accessGame(context: UIScene, game: IGame): Promise<void> {
  if (context.currentRoom) {
    console.log('Leaving game: ', context.currentRoom.roomId);
    await context.currentRoom.leave();
    context.currentRoom = undefined;
    context.scene.stop('GameScene');
  }

  console.log('Accessing game: ', game._id);
  const room = await joinGame(context.colyseusClient, context.userId, game._id);

  if (!room) return;

  context.currentRoom = room;
  context.scene.launch('GameScene', {
    userId: context.userId,
    colyseusClient: context.colyseusClient,
    currentGame: game,
    currentRoom: room
  });
}