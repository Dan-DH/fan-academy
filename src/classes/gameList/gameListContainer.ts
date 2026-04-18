import { EGameListHeaders } from "../../enums/colyseusMessageEnum";
import { EChallengePopup, EGameModes, EGameStatus, EUiSounds } from "../../enums/gameEnum";
import IGameBE from "../../interfaces/gameInterfaceServer";
import { accessGame } from "../../scenes/gameSceneUtils/gameMenuUI";
import LobbyScene from "../../scenes/lobby.scene";
import { truncateText } from "../../utils/textAnimations";
import { timeAgo } from "../../utils/timeAgo";
import { ChallengePopup } from "../popups/challengePopup";

export class GameListContainer extends Phaser.GameObjects.Container {
  context: LobbyScene;

  gameListItems: IGameBE[];
  playerTurnHeader: boolean = false;
  opponentTurnHeader: boolean = false;
  searchingHeader: boolean = false;
  challengeSentHeader: boolean = false;
  challengeReceivedHeader: boolean = false;
  finishedHeader: boolean = false;

  listPlayerTurnArray: IGameBE[] = [];
  listOpponentTurnArray: IGameBE[] = [];
  listSearchingArray: IGameBE[] = [];
  listChallengeSentArray: IGameBE[] = [];
  listChallengeReceivedArray: IGameBE[] = [];
  listFinishedArray: IGameBE[] = [];

  gameListButtonHeight = 142;
  gameListButtonWidth = 700;
  gameListButtonSpacing = 20;
  textListHeight = 40;
  visibleHeight = 915;
  visibleWidth = 400;

  lastListItemY = 0;

  constructor(context: LobbyScene, gameData: IGameBE[]) {
    super(context, 19, 65);
    this.context = context;

    this.gameListItems = gameData;
    this.gameListItems.forEach((game: IGameBE) => {
      if (game.status === EGameStatus.SEARCHING) this.listSearchingArray.push(game);
      if (game.status === EGameStatus.PLAYING && game.activePlayer === context.userId) this.listPlayerTurnArray.push(game);
      if (game.status === EGameStatus.PLAYING && game.activePlayer !== context.userId) this.listOpponentTurnArray.push(game);
      if (game.status === EGameStatus.CHALLENGE) {
        if (game.players[0].userId === context.userId) this.listChallengeSentArray.push(game);
        if (game.players[1].userId === context.userId) this.listChallengeReceivedArray.push(game);
      }
      if (game.status === EGameStatus.FINISHED) this.listFinishedArray.push(game);
    });

    // Update game limit
    context.activeGamesAmount = this.listPlayerTurnArray.length + this.listOpponentTurnArray.length + this.listSearchingArray.length + this.listChallengeReceivedArray.length + this.listChallengeSentArray.length; // TODO:
    // Update the browser tab title if the player has games pending action
    if (this.listPlayerTurnArray.length || this.listChallengeReceivedArray.length) {
      document.title = `(${this.listPlayerTurnArray.length + this.listChallengeReceivedArray.length}) Fan Academy`;
    } else {
      document.title = 'Fan Academy';
    }

    this.addCreateGameButton();

    console.log('this logs');

    this.addListItems(this.listPlayerTurnArray, EGameListHeaders.PLAYER_TURN);
    this.addListItems(this.listChallengeReceivedArray, EGameListHeaders.CHALLENGES_RECEIVED);
    this.addListItems(this.listChallengeSentArray, EGameListHeaders.CHALLENGES_SENT);
    this.addListItems(this.listSearchingArray, EGameListHeaders.SEARCHING);
    this.addListItems(this.listOpponentTurnArray, EGameListHeaders.OPPONENT_TURN);
    this.addListItems(this.listFinishedArray, EGameListHeaders.FINISHED);

    // Reduce the size of the container to make the images fit the UI
    this.setScale(0.51);
    context.add.existing(this);
  }

  addCreateGameButton(): void {
    // New game button is always at the top of the games' list
    const newGameText = this.context.add.text(100, this.lastListItemY + 15, 'Create a game', {
      fontSize: 120,
      fontFamily: "proHeavy"
    });
    const newGameButton = this.context.add.image(0, this.lastListItemY, 'newGameButton').setOrigin(0).setInteractive({ useHandCursor: true });

    newGameButton.on('pointerdown', async () => {
      if (this.context.currentRoom) {
        console.log('Leaving game: ', this.context.currentRoom);
        this.context.currentRoom = undefined;
        this.context.scene.stop('GameScene');
      }

      new ChallengePopup({
        context: this.context,
        challengeType: EChallengePopup.OPEN
      });
    });

    this.lastListItemY += 150;
    this.add([newGameButton, newGameText]);
  }

  addListItems(arr: IGameBE[], headerText: EGameListHeaders): void {
    if (!arr.length) return;
    const header = this.setHeaderText(headerText);
    this.add(header);

    this.createGameListItem(arr);
    this.lastListItemY += this.gameListButtonHeight + this.gameListButtonSpacing;
  }

  setHeaderText = (header: string) => {
    return this.context.add.text(30, this.lastListItemY, header, {
      fontSize: 50,
      fontFamily: "proLight"
    });
  };

  createGameListItem(games: IGameBE[]): void {
    games.forEach((g, index) => {
      console.log('this algo logs', g);
      const player = g.players.find(p => this.context.userId === p.userId);
      const opponent = g.players.find(p => this.context.userId !== p.userId);
      if (!player) return;

      this.lastListItemY += (index === 0 ? this.textListHeight : this.gameListButtonHeight) + this.gameListButtonSpacing;

      const gameListButtonImage = this.context.add.image(0, this.lastListItemY, "gameListButton").setOrigin(0).setTint(0xBBBBBB);
      const playerFactionIcon = player.faction ? {
        faction: player.faction,
        scale: 0.4
      } : {
        faction: 'unknownFaction',
        scale: 1.2
      };

      const lastPlayedText = this.context.add.text(20, this.lastListItemY + 100, timeAgo(g.lastPlayedAt!), {
        fontFamily: "proLight",
        fontSize: 38,
        color: '#ffffff'
      }).setOrigin(0);

      const playerFactionImage = this.context.add.image(90, this.lastListItemY + this.gameListButtonHeight / 2, playerFactionIcon.faction).setScale(playerFactionIcon.scale);
      const rankedIcon = this.context.add.image(this.gameListButtonWidth - 20, this.lastListItemY + this.gameListButtonHeight - 25, "runeMetal").setScale(1).setVisible(false);
      if (g.gameMode === EGameModes.RANKED) rankedIcon.setVisible(true);

      let opponentFactionImage;
      let opponentProfilePicture;
      let opponentNameText;

      if (opponent) {
        opponentFactionImage = this.context.add.image(510, this.lastListItemY + this.gameListButtonHeight / 2, opponent.faction!).setScale(0.4);
        opponentProfilePicture = this.context.add.image(632, this.lastListItemY + this.gameListButtonHeight / 2, opponent.portrait!).setFlipX(true).setDisplaySize(256 * 0.4, 256 * 0.4);
        opponentNameText = this.setOpponentNameText(opponent.username!);
      } else {
        opponentFactionImage = this.context.add.image(510, this.lastListItemY + this.gameListButtonHeight / 2, 'unknownFaction');
        opponentProfilePicture = this.context.add.image(632, this.lastListItemY + this.gameListButtonHeight / 2, 'unknownOpponent').setFlipX(true).setScale(0.4);
        opponentNameText = this.setOpponentNameText('Searching...');
      }

      //"Remove" button for challenges and games looking for players
      const closeButton = this.context.add.image(this.gameListButtonWidth - 30, this.lastListItemY, 'closeButton').setOrigin(0).setVisible(false);
      if (g.status === EGameStatus.SEARCHING || g.status === EGameStatus.CHALLENGE) {
        closeButton.setVisible(true).setInteractive({ useHandCursor: true });
        closeButton.on('pointerup', async () => {
          // TODO:
          // if (pointerMoved) return; // skip tap if user was swiping

          // sendDeletedGameMessage(context.lobbyRoom!, g._id, context.userId);
          // context.sound.play(EUiSounds.GAME_DELETE);
          // createGameList(context);
        });
      }

      // Make the game accessible -only for games already playing
      if (g.status === EGameStatus.PLAYING || g.status === EGameStatus.FINISHED) {
        gameListButtonImage.setInteractive({ useHandCursor: true });
        if (this.context.activeGameImageId === g._id) this.highlightGameButton(g, gameListButtonImage);
        gameListButtonImage.on('pointerup', async () => {
          // TODO:
          // if (pointerMoved) return; // skip tap if user was swiping

          this.highlightGameButton(g, gameListButtonImage);
          this.context.sound.play(EUiSounds.BUTTON_GENERIC);
          await accessGame(this.context, g);
        });
      }

      if (g.status === EGameStatus.CHALLENGE && this.listChallengeReceivedArray.find(gameReceived => gameReceived._id === g._id)) {
        gameListButtonImage.setInteractive({ useHandCursor: true });
        if (this.context.activeGameImageId === g._id) this.highlightGameButton(g, gameListButtonImage);
        gameListButtonImage.on('pointerup', async () => {
          // TODO:
          // if (pointerMoved) return; // skip tap if user was swiping

          this.context.sound.play(EUiSounds.GAME_DELETE);
          this.highlightGameButton(g, gameListButtonImage);

          if (this.context.currentRoom) {
            // console.log('Leaving game: ', this.context.currentRoom.roomId);
            // await this.context.currentRoom.leave();
            // this.context.currentRoom = undefined;
            // this.context.scene.stop('GameScene');
          }

          new ChallengePopup({
            context: this.context,
            opponentId: opponent!.userId,
            challengeType: EChallengePopup.ACCEPT,
            gameId: g._id
          });
        });
      }

      this.add([gameListButtonImage, playerFactionImage, opponentFactionImage, opponentNameText, opponentProfilePicture, closeButton, lastPlayedText, rankedIcon]);
    });
  }

  setOpponentNameText(name: string): Phaser.GameObjects.Text {
    return this.context.add.text(200, this.lastListItemY + this.gameListButtonHeight / 2 - 33, truncateText(name, 13), {
      fontSize: 50,
      fontFamily: "proLight"
    });
  };

  highlightGameButton(game: IGameBE, image: Phaser.GameObjects.Image): void {
    image.clearTint();
    if (this.context.activeGameImage) this.context.activeGameImage.setTint(0xBBBBBB);
    this.context.activeGameImage = image;
    this.context.activeGameImageId = game._id;
  };

  // TODO:
  updateListOrder(_game: IGameBE): void {
    // this should go one by one through the arrays, based on game status
    // it puts itself at the bottom of the array (based on the Y of the last item of the array + space in between items (except for finished, where it goes on top and can also remove the last item if limit has been reached)
    // then for each of the other arrays, we add one button's worth of space

    // actually we would have to go through the arrays twice to find where it was before, if it's not a new game...
  }
}
