import { IGame } from "../../interfaces/gameInterface";
import UIScene from "../ui.scene";

export async function accessGame(context: UIScene, game: IGame): Promise<void> {
  if (context.activeGame) {
    console.log('Leaving game: ', context.activeGame);
    context.activeGame = undefined;
    context.scene.stop('GameScene');
  }

  console.log('Accessing game: ', game._id);
  context.activeGame = game._id;
  context.scene.launch('GameScene', {
    userId: context.userId,
    colyseusClient: context.colyseusClient,
    currentGame: game
  });
}