import { EFaction } from "../../enums/gameEnums";
import GameScene from "../game.scene";
import { createGameList } from "./gameList";

export function loadGameMenuUI(context: GameScene) {
  context.load.image('uiBackground', '/assets/ui/used/game_screen.png');
  context.load.image('createGame', '/assets/ui/used/create_game.png');
  context.load.image('gameListButton', '/assets/ui/used/game_list_premade.png');
  context.load.image('newGameButton', '/assets/ui/used/new_game_btn.png');
  context.load.image(EFaction.COUNCIL, '/assets/ui/used/council_emblem.png');
  context.load.image(EFaction.DARK_ELVES, '/assets/ui/used/elves_emblem.png');
  context.load.image('unknownFaction', '/assets/ui/used/unknown_faction.png');
  context.load.image('unknownOpponent', '/assets/images/profilePics/UnknownAvatar-hd.jpg');
  context.load.image('closeButton', '/assets/ui/used/close_button.png');
}

export async function  createGameMenuUI(context: GameScene) {
  // Background game screen
  context.add.image(0, 0, 'uiBackground').setOrigin(0, 0);
  await createGameList(context);

  if (!context.currentGame) context.add.image(397, 15, 'createGame').setOrigin(0, 0).setScale(1.06, 1.2);
}