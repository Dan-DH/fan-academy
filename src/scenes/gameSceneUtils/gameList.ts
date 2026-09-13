import { ChallengePopup } from "../../classes/popups/challengePopup";
import { colyseusService } from "../../colyseus/colyseusService";
import { EChallengePopup, EGameModes, EGameStatus } from "../../enums/gameEnums";
import { IGame, IPlayerData } from "../../interfaces/gameInterface";
import { fanAcademy } from "../../main";
import { factionEnumToEmblem } from "../../utils/gameUtils";
import { truncateText } from "../../utils/textAnimations";
import { timeAgo } from "../../utils/timeAgo";
import UIScene from "../ui.scene";

export function createGameList() {
  const uiScene = fanAcademy.scene.getScene('UIScene') as UIScene;
  const gameList = uiScene.registry.get('gameList');
  if (!uiScene || !gameList) {
    console.error('createGameList() no gameList in context');
    return;
  }

  if (uiScene.gameListContainer) uiScene.gameListContainer.destroy(true);

  const listPlayerTurnArray: IGame[] = [];
  const listOpponentTurnArray: IGame[] = [];
  const listSearchingArray: IGame[] = [];
  const listChallengeSentArray: IGame[] = [];
  const listChallengeReceivedArray: IGame[] = [];
  const listFinishedArray: IGame[] = [];

  gameList.forEach((game: IGame )=> {
    if (game.status === EGameStatus.SEARCHING) listSearchingArray.push(game);
    if (game.status === EGameStatus.PLAYING && game.activePlayer === uiScene.userId) listPlayerTurnArray.push(game);
    if (game.status === EGameStatus.PLAYING && game.activePlayer !== uiScene.userId) listOpponentTurnArray.push(game);
    if (game.status === EGameStatus.CHALLENGE) {
      if (game.players[0].userData._id === uiScene.userId) listChallengeSentArray.push(game);
      if (game.players[1].userData._id === uiScene.userId) listChallengeReceivedArray.push(game);
    }
    if (game.status === EGameStatus.FINISHED) listFinishedArray.push(game);
  });

  // Update game limit
  uiScene.activeGamesAmount = listPlayerTurnArray.length + listOpponentTurnArray.length + listSearchingArray.length + listChallengeReceivedArray.length + listChallengeSentArray.length;

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
  const gameListContainer = uiScene.add.container(initialContainerX, initialContainerY); // Setting a variable to save me having to write 'context' every time
  uiScene.gameListContainer = gameListContainer;

  // Function for adding elements to the container
  const createGameListItem = (gameListArray: IGame[]) => {
    gameListArray.forEach((game, index) => {
      const player = game.players.find((p: IPlayerData) => uiScene.userId === p.userData._id);
      const opponent = game.players.find((p: IPlayerData) => uiScene.userId !== p.userData._id);
      if (!player) return;

      lastListItemY += (index === 0 ? textListHeight : gameListButtonHeight) + gameListButtonSpacing;

      const gameListButtonImage = uiScene.add.image(-7, lastListItemY, 'gameAtlas', 'gameListPremade').setOrigin(0).setScale(1.80).setTint(0xBBBBBB);
      const playerFactionIcon = player.faction ? {
        faction: player.faction,
        scale: 1
      } : {
        faction: 'unknownFaction',
        scale: 1.3
      };

      const lastPlayedText = uiScene.add.text(20, lastListItemY + 100, timeAgo(game.lastPlayedAt), {
        fontFamily: "proLight",
        fontSize: 38,
        color: '#ffffff'
      }).setOrigin(0);

      const playerFactionImage =  uiScene.add.image(90, lastListItemY + gameListButtonHeight / 2 - 5, 'gameAtlas', factionEnumToEmblem(playerFactionIcon.faction)).setScale(playerFactionIcon.scale);
      const rankedIcon = uiScene.add.image(gameListButtonWidth - 20, lastListItemY + gameListButtonHeight - 25, 'gameAtlas', 'runeMetal').setScale(1).setVisible(false);
      if (game.gameMode === EGameModes.RANKED) rankedIcon.setVisible(true);

      let opponentFactionImage;
      let opponentProfilePicture;
      let opponentNameText;

      const setOpponentNameText = (name: string) => {
        return uiScene.add.text(200, lastListItemY + gameListButtonHeight / 2 - 33, truncateText(name, 13), {
          fontSize: 50,
          fontFamily: "proLight"
        });
      };

      if (opponent) {
        const opponentFaction = factionEnumToEmblem(opponent.faction);
        opponentFactionImage = uiScene.add.image(510, lastListItemY + gameListButtonHeight / 2, 'gameAtlas', opponentFaction).setScale(opponentFaction === 'unknown_faction' ? 1.3 : 1);
        opponentProfilePicture = uiScene.add.image(630, lastListItemY + gameListButtonHeight / 2 + 3, 'gameAtlas', opponent.userData.picture).setFlipX(true).setScale(1.5); //.setDisplaySize(256 * 0.4, 256 * 0.4);
        opponentNameText = setOpponentNameText(opponent.userData.username);
      } else {
        opponentFactionImage = uiScene.add.image(510, lastListItemY + gameListButtonHeight / 2, 'gameAtlas', 'unknownFaction').setScale(1.3);
        opponentProfilePicture = uiScene.add.image(630, lastListItemY + gameListButtonHeight / 2 + 3, 'gameAtlas', 'unknownAvatar-hd').setFlipX(true).setScale(1.5);
        opponentNameText = setOpponentNameText('Searching...');
      }

      // Add a 'close' button to games looking for players
      const closeButton = uiScene.add.image(gameListButtonWidth - 30, lastListItemY, 'gameAtlas', 'closeButton').setOrigin(0).setVisible(false);
      if (game.status === EGameStatus.SEARCHING || game.status === EGameStatus.CHALLENGE) {
        closeButton.setVisible(true).setInteractive({ useHandCursor: true });
        closeButton.on('pointerup', async () => {
          if (pointerMoved) return; // skip tap if user was swiping

          colyseusService.sendDeletedGameMessage(game._id, uiScene.userId);
          // uiScene.sound.play(EUiSounds.GAME_DELETE);
        });
      }

      // Highlight the current open game on the game list
      const highlightGameButton = () => {
        gameListButtonImage.clearTint();
        if (uiScene.activeGameImage) uiScene.activeGameImage.setTint(0xBBBBBB);
        uiScene.activeGameImage = gameListButtonImage;
      };

      // Make the game accessible -only for games already playing
      if (game.status === EGameStatus.PLAYING || game.status === EGameStatus.FINISHED) {
        gameListButtonImage.setInteractive({ useHandCursor: true });
        if (uiScene.activeGame === game._id) highlightGameButton();
        gameListButtonImage.on('pointerup', async () => {
          if (pointerMoved) return; // skip tap if user was swiping

          highlightGameButton();
          // uiScene.sound.play(EUiSounds.BUTTON_GENERIC);
          if (uiScene.activeGame) {
            uiScene.activeGame = undefined;
            uiScene.scene.stop('GameScene');
          }

          uiScene.activeGame = game._id;
          uiScene.scene.launch('GameScene', {
            userId: uiScene.userId,
            currentGame: game
          });
        });
      }

      if (game.status === EGameStatus.CHALLENGE && listChallengeReceivedArray.find(gameReceived => gameReceived._id === game._id )) {
        gameListButtonImage.setInteractive({ useHandCursor: true });
        if (uiScene.activeGame === game._id) highlightGameButton();
        gameListButtonImage.on('pointerup', async () => {
          if (pointerMoved) return; // skip tap if user was swiping

          // uiScene.sound.play(EUiSounds.GAME_DELETE);
          highlightGameButton();

          if (uiScene.activeGame) {
            uiScene.activeGame = undefined;
            uiScene.scene.stop('GameScene');
          } // TODO: check if we actually need to leave the game for this. Same with new game

          new ChallengePopup({
            context: uiScene,
            opponentId: opponent!.userData._id,
            challengeType: EChallengePopup.ACCEPT,
            gameId: game._id
          });
        });
      }

      gameListContainer.add([gameListButtonImage, playerFactionImage, opponentFactionImage, opponentNameText, opponentProfilePicture, closeButton, lastPlayedText, rankedIcon]);
    });
  };

  // New game button is always at the top of the games' list
  const newGameText = uiScene.add.text(100, lastListItemY + 15, 'Create a game', {
    fontSize: 120,
    fontFamily: "proHeavy"
  });
  const newGameButton = uiScene.add.image(-15, lastListItemY, 'gameAtlas', 'newGameButton').setScale(1.83).setOrigin(0).setInteractive({ useHandCursor: true });

  newGameButton.on('pointerdown', async () => {
    if (uiScene.activeGame) {
      uiScene.activeGame = undefined;
      uiScene.scene.stop('GameScene');
    }

    new ChallengePopup({
      context: uiScene,
      challengeType: EChallengePopup.OPEN
    });
  });

  lastListItemY += 150;

  gameListContainer.add([newGameButton, newGameText]);

  // Check the arrays one by one, adding the elements in order
  const setHeaderText = (header: string) => {
    return uiScene.add.text(30, lastListItemY, header, {
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
  const maskGraphics = uiScene.make.graphics();
  maskGraphics.fillStyle(0xffffff);
  maskGraphics.fillRect(19, 65, visibleWidth, visibleHeight - 15);
  const mask = new Phaser.Display.Masks.GeometryMask(uiScene, maskGraphics);

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
  uiScene.input.on("wheel", (pointer: Phaser.Input.Pointer, _gameObjects: any, _deltaX: number, deltaY: number, _deltaZ: number ) => {
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

  uiScene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
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

  uiScene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
    if (!isDragging) return;

    const deltaY = pointer.y - dragStartY;

    if (Math.abs(deltaY) > 5) pointerMoved = true;

    contentOffset = Phaser.Math.Clamp(dragStartOffset + deltaY, minOffset, 0);
    gameListContainer.y = 65 + contentOffset;
  });

  uiScene.input.on("pointerup", () => {
    isDragging = false;
    dragStartY = 0;
    dragStartOffset = 0;
    pointerMoved = false;
  });
}