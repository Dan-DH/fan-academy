import { EFaction, EGameModes, EUiSounds } from "../../enums/gameEnum";
import LobbyScene from "../lobby.scene";
import { createGame } from "../../colyseus/colyseusGameRoom";
import { gameListFadeOutText, textAnimationFadeOut } from "../../utils/textAnimations";

export const createNewGame = async (context: LobbyScene, faction: EFaction, gameMode: EGameModes) => {
  if (context.activeGamesAmount >= context.activeGamesAmountLimit) {
    if (context.currentRoom) {
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

  if (context.userId) {
    context.sound.play(EUiSounds.BUTTON_PLAY);
    await createGame(context, faction, gameMode); // Send message here

    if (context.currentRoom) {
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