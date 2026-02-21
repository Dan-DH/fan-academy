import { ChallengePopup } from "../../classes/popups/challengePopup";
import { sendDeletedGameMessage } from "../../colyseus/colyseusLobbyRoom";
import { EChallengePopup, EGameStatus, EUiSounds } from "../../enums/gameEnums";
import { IGame, IPlayerData } from "../../interfaces/gameInterface";
import { truncateText } from "../../utils/textAnimations";
import { timeAgo } from "../../utils/timeAgo";
import UIScene from "../ui.scene";
import { accessGame } from "./gameMenuUI";

export async function createGameList(context: UIScene) {
  if (!context.gameList) {
    console.error('createGameList() no gameList in context');
    return;
  }

  if (context.gameListContainer) context.gameListContainer.destroy(true); // Need to remove the old container before adding a new one

  // Split game list and split it into arrays, depending on status
  const listPlayerTurnArray: IGame[] = [];
  const listOpponentTurnArray: IGame[] = [];
  const listSearchingArray: IGame[] = [];
  const listChallengeSentArray: IGame[] = [];
  const listChallengeReceivedArray: IGame[] = [];
  const listFinishedArray: IGame[] = [];

  context.gameList.forEach((game: IGame )=> {
    if (game.status === EGameStatus.SEARCHING) listSearchingArray.push(game);
    if (game.status === EGameStatus.PLAYING && game.activePlayer === context.userId) listPlayerTurnArray.push(game);
    if (game.status === EGameStatus.PLAYING && game.activePlayer !== context.userId) listOpponentTurnArray.push(game);
    if (game.status === EGameStatus.CHALLENGE) {
      if (game.players[0].userData._id === context.userId) listChallengeSentArray.push(game);
      if (game.players[1].userData._id === context.userId) listChallengeReceivedArray.push(game);
    }
    if (game.status === EGameStatus.FINISHED) listFinishedArray.push(game);
  });

  // Update game limit
  context.activeGamesAmount = listPlayerTurnArray.length + listOpponentTurnArray.length + listSearchingArray.length + listChallengeReceivedArray.length + listChallengeSentArray.length;

  // Update the browser tab title if the player has games pending action
  if (listPlayerTurnArray.length || listChallengeReceivedArray.length) {
    document.title = `(${listPlayerTurnArray.length + listChallengeReceivedArray.length}) Fan Academy`;
  } else {
    document.title = 'Fan Academy';
  }

  // Setting spacing for the positioning of the items in the list
  const gameListButtonHeight = 142;
  const gameListButtonWidth = 700;
  const gameListButtonSpacing = 20;
  const textListHeight = 40;
  const visibleHeight = 915;
  const visibleWidth = 400;
  let lastListItemY = 0;

  // Creating a container for the game list and adding it to the context (scene)
  const initialContainerX = 19;
  const initialContainerY = 65;
  const gameListContainer = context.add.container(initialContainerX, initialContainerY); // Setting a variable to save me having to write 'context' every time
  context.gameListContainer = gameListContainer;

  // Function for adding elements to the container
  const createGameListItem = (gameListArray: IGame[]) => {
    gameListArray.forEach((game, index) => {
      const player = game.players.find((p: IPlayerData) => context.userId === p.userData._id);
      const opponent = game.players.find((p: IPlayerData) => context.userId !== p.userData._id);
      if (!player) return;

      lastListItemY += (index === 0 ? textListHeight : gameListButtonHeight) + gameListButtonSpacing;

      const gameListButtonImage = context.add.image(0, lastListItemY, "gameListButton").setOrigin(0).setTint(0xBBBBBB);
      const playerFactionIcon = player.faction ? {
        faction: player.faction,
        scale: 0.4
      } : {
        faction: 'unknownFaction',
        scale: 1.2
      };

      const lastPlayedText = context.add.text(20, lastListItemY + 100, timeAgo(game.lastPlayedAt), {
        fontFamily: "proLight",
        fontSize: 38,
        color: '#ffffff'
      }).setOrigin(0);

      const playerFactionImage =  context.add.image(90, lastListItemY + gameListButtonHeight / 2, playerFactionIcon.faction).setScale(playerFactionIcon.scale);

      let opponentFactionImage;
      let opponentProfilePicture;
      let opponentNameText;

      const setOpponentNameText = (name: string) => {
        return context.add.text(200, lastListItemY + gameListButtonHeight / 2 - 33, truncateText(name, 13), {
          fontSize: 50,
          fontFamily: "proLight"
        });
      };

      if (opponent) {
        opponentFactionImage = context.add.image(510, lastListItemY + gameListButtonHeight / 2, opponent.faction).setScale(0.4);
        opponentProfilePicture = context.add.image(632, lastListItemY + gameListButtonHeight / 2, opponent.userData.picture).setFlipX(true).setDisplaySize(256 * 0.4, 256 * 0.4);
        opponentNameText = setOpponentNameText(opponent.userData.username);
      } else {
        opponentFactionImage = context.add.image(510, lastListItemY + gameListButtonHeight / 2, 'unknownFaction');
        opponentProfilePicture = context.add.image(632, lastListItemY + gameListButtonHeight / 2, 'unknownOpponent').setFlipX(true).setScale(0.4);
        opponentNameText = setOpponentNameText('Searching...');
      }

      // Add a 'close' button to games looking for players
      const closeButton = context.add.image(gameListButtonWidth - 30, lastListItemY, 'closeButton').setOrigin(0).setVisible(false);
      if (game.status === EGameStatus.SEARCHING || game.status === EGameStatus.CHALLENGE) {
        closeButton.setVisible(true).setInteractive({ useHandCursor: true });
        closeButton.on('pointerup', async () => {
          if (pointerMoved) return; // skip tap if user was swiping

          sendDeletedGameMessage(context.lobbyRoom!, game._id, context.userId);
          context.sound.play(EUiSounds.GAME_DELETE);
          createGameList(context);
        });
      }

      // Highlight the current open game on the game list
      const highlightGameButton = () => {
        gameListButtonImage.clearTint();
        if (context.activeGameImage) context.activeGameImage.setTint(0xBBBBBB);
        context.activeGameImage = gameListButtonImage;
        context.activeGameImageId = game._id;
      };

      // Make the game accessible -only for games already playing
      if (game.status === EGameStatus.PLAYING || game.status === EGameStatus.FINISHED) {
        gameListButtonImage.setInteractive({ useHandCursor: true });
        if (context.activeGameImageId === game._id) highlightGameButton();
        gameListButtonImage.on('pointerup', async () => {
          if (pointerMoved) return; // skip tap if user was swiping

          highlightGameButton();
          context.sound.play(EUiSounds.BUTTON_GENERIC);
          await accessGame(context, game);
        });
      }

      if (game.status === EGameStatus.CHALLENGE && listChallengeReceivedArray.find(gameReceived => gameReceived._id === game._id )) {
        gameListButtonImage.setInteractive({ useHandCursor: true });
        if (context.activeGameImageId === game._id) highlightGameButton();
        gameListButtonImage.on('pointerup', async () => {
          if (pointerMoved) return; // skip tap if user was swiping

          context.sound.play(EUiSounds.GAME_DELETE);
          highlightGameButton();

          if (context.currentRoom) {
            console.log('Leaving game: ', context.currentRoom.roomId);
            await context.currentRoom.leave();
            context.currentRoom = undefined;
            context.scene.stop('GameScene');
          }

          new ChallengePopup({
            context,
            opponentId: opponent!.userData._id,
            challengeType: EChallengePopup.ACCEPT,
            gameId: game._id
          });
        });
      }

      gameListContainer.add([gameListButtonImage, playerFactionImage, opponentFactionImage, opponentNameText, opponentProfilePicture, closeButton, lastPlayedText]);
    });
  };

  // New game button is always at the top of the games' list
  const newGameText = context.add.text(100, lastListItemY + 15, 'Create a game', {
    fontSize: 120,
    fontFamily: "proHeavy"
  });
  const newGameButton = context.add.image(0, lastListItemY, 'newGameButton').setOrigin(0).setInteractive({ useHandCursor: true });

  newGameButton.on('pointerdown', async () => {
    if (context.currentRoom) {
      console.log('Leaving game: ', context.currentRoom.roomId);
      await context.currentRoom.leave();
      context.currentRoom = undefined;
      context.scene.stop('GameScene');
    }

    new ChallengePopup({
      context,
      challengeType: EChallengePopup.OPEN
    });
  });

  lastListItemY += 150;

  gameListContainer.add([newGameButton, newGameText]);

  // Check the arrays one by one, adding the elements in order
  const setHeaderText = (header: string) => {
    return context.add.text(30, lastListItemY, header, {
      fontSize: 50,
      fontFamily: "proLight"
    });
  };

  const addListItems = (arr: IGame[], headerText: string) =>{
    if (!arr.length) return;
    const header = setHeaderText(headerText);
    gameListContainer.add(header);

    createGameListItem(arr);
    lastListItemY += gameListButtonHeight + gameListButtonSpacing;
  };

  addListItems(listPlayerTurnArray, 'Your turn');
  addListItems(listChallengeReceivedArray, 'Challenges received');
  addListItems(listOpponentTurnArray, "Opponent's turn");
  addListItems(listChallengeSentArray, 'Challenges sent');
  addListItems(listSearchingArray, 'Searching for players');
  addListItems(listFinishedArray, 'Finished');

  // Reduce the size of the container to make the images fit the UI
  gameListContainer.setScale(0.51);

  // Set the mask to make the list scrollable
  const maskGraphics = context.make.graphics();
  maskGraphics.fillStyle(0xffffff);
  maskGraphics.fillRect(19, 65, visibleWidth, visibleHeight - 15);
  const mask = new Phaser.Display.Masks.GeometryMask(context, maskGraphics);

  gameListContainer.setMask(mask);
  const withinScrollArea = (pointer: Phaser.Input.Pointer) => {
    return (
      pointer.x >= 19 &&
      pointer.x <= 19 + visibleWidth &&
      pointer.y >= initialContainerY &&
      pointer.y <= initialContainerY + visibleHeight
    );
  };

  // Define boundaries
  let contentOffset = 0;
  const maxOffset = 0;
  const minOffset = Math.min(visibleHeight - lastListItemY * 0.51 - 10, 0);

  // Scroll handler
  context.input.on("wheel", (pointer: Phaser.Input.Pointer, _gameObjects: any, _deltaX: number, deltaY: number, _deltaZ: number ) => {
    if (withinScrollArea(pointer) && lastListItemY > visibleHeight) {
      contentOffset -= deltaY;

      // Clamp to valid scroll range
      contentOffset = Phaser.Math.Clamp(contentOffset, minOffset, maxOffset);

      // Update container position
      gameListContainer.y = initialContainerY + contentOffset;
    }
  });

  // Setting scrolling on mobile
  let isDragging = false;
  let dragStartY = 0;
  let dragStartOffset = 0;
  let pointerMoved = false;

  context.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    if (withinScrollArea(pointer) && lastListItemY > visibleHeight) {
      isDragging = true;
      dragStartY = pointer.y;
      dragStartOffset = contentOffset;
      pointerMoved = false;
    } else {
      isDragging = false;
      dragStartY = 0;
      dragStartOffset = 0;
      pointerMoved = false;
    }
  });

  context.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
    if (!isDragging) return;

    const deltaY = pointer.y - dragStartY;

    if (Math.abs(deltaY) > 5) pointerMoved = true;

    contentOffset = Phaser.Math.Clamp(dragStartOffset + deltaY, minOffset, 0);
    gameListContainer.y = 65 + contentOffset;
  });

  context.input.on("pointerup", () => {
    isDragging = false;
    dragStartY = 0;
    dragStartOffset = 0;
    pointerMoved = false;
  });
}
