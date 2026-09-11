import { EFaction, EGameModes } from "../../enums/gameEnums";
import UIScene from "../ui.scene";
import { gameListFadeOutText, textAnimationFadeOut } from "../../utils/textAnimations";
import { sendCreateGameMessage } from "../../colyseus/colyseusLobbyRoom";

export const createNewGame = async (context: UIScene, faction: EFaction, gameMode: EGameModes) => {
  if (context.activeGamesAmount >= context.activeGamesAmountLimit) {
    if (context.activeGame) {
      context.game.events.emit('messageToGameScene', {
        x: 300,
        y: 350,
        message: `You have reached the max amount of open games`
      });
    } else {
      const openGameLimitReached = gameListFadeOutText(context, 300, 350, `You have reached the max amount of open games`);
      textAnimationFadeOut(openGameLimitReached, 3000);
    }
    return;
  }
  // Create the faction's deck and starting hand
  if (context.userId) {
    sendCreateGameMessage({
      userId: context.userId,
      faction,
      gameMode
    });

    if (context.activeGame) {
      context.game.events.emit('messageToGameScene', {
        x: 700,
        y: 350,
        message: `New game created`
      });
    } else {
      const newGameCreated = gameListFadeOutText(context, 700, 350, `New game created`);
      textAnimationFadeOut(newGameCreated, 3000);
    }
  } else {
    console.error('No userId when creating a new game');
  };
};