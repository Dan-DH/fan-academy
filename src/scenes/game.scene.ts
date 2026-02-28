import { Client, Room } from "colyseus.js";
import { GameController } from "../classes/gameController";
import { Hero } from "../classes/factions/hero";
import { Item } from "../classes/factions/item";
import { Coordinates, IGame, IPlayerData, IPlayerState } from "../interfaces/gameInterface";
import { calculateAllCenterPoints } from "../utils/boardCalculations";
import { createChatComponent } from "./gameSceneUtils/chatComponent";
import { loadGameBoardUI } from "./gameSceneUtils/gameBoardUI";
import { loadGameAssets } from "./mainMenuUtils/gameAssets";
import { Tile } from "../classes/board/tile";
import { Crystal } from "../classes/board/crystal";
import { gameListFadeOutText, textAnimationFadeOut } from "../utils/textAnimations";

export default class GameScene extends Phaser.Scene {
  userId!: string;
  colyseusClient!: Client;
  centerPoints: Coordinates[];

  currentRoom!: Room;
  currentGame!: IGame;
  currentTurnAction: number | undefined;
  turnNumber: number | undefined;

  activeUnit: Hero | Item | undefined;

  gameController: GameController | undefined;

  activePlayer: string | undefined;
  isPlayerOne: boolean | undefined;
  opponentId!: string;

  player1: IPlayerState | undefined;
  player2: IPlayerState | undefined;

  longPressStart: number | undefined;
  visibleUnitCard: Hero | Item | Crystal | Tile | undefined;

  triggerReplay = true;

  chatComponent: Phaser.GameObjects.DOMElement | undefined;

  constructor() {
    super({ key: 'GameScene' });
    this.centerPoints = calculateAllCenterPoints();
  }

  init(data: {
    userId: string,
    colyseusClient: Client,
    currentGame: IGame,
    currentRoom: Room,
    triggerReplay?: boolean
  }) {
    this.userId = data.userId;
    this.colyseusClient = data.colyseusClient;
    this.turnNumber = data.currentGame.turnNumber;
    this.currentGame = data.currentGame;
    this.currentRoom = data.currentRoom;
    const opponent = data.currentGame.players.find((p: IPlayerData) => data.userId !== p.userData._id);
    this.opponentId = opponent!.userData._id;

    this.triggerReplay = data.triggerReplay ?? true;

    // Updating GameScene properties
    this.activePlayer = this.currentGame.activePlayer.toString();
    this.isPlayerOne = this.currentGame?.players[0].userData._id === this.userId;
    this.currentTurnAction = this.turnNumber === 0 ? 3 : 1;

    this.activeUnit = undefined;
  }

  preload() {
    this.load.html('chatComponent', 'html/chat.html');
    loadGameAssets(this);
    loadGameBoardUI(this);
  }

  create() {
    this.time.addEvent({
      delay: 300000, // 5 minutes
      callback: () => {
        this.currentRoom.send("ping");
      },
      loop: true
    });

    const userPreferences = this.registry.get('userPreferences');
    if (userPreferences.chat) this.chatComponent = createChatComponent(this);

    this.input.mouse!.disableContextMenu();
    this.gameController = new GameController(this);
    if (this.triggerReplay) this.gameController.replayTurn();

    this.game.events.on('messageToGameScene', (data: {
      x: number,
      y: number,
      message: string
    }) => {
      const { x, y, message } = data;
      const openGameLimitReached = gameListFadeOutText(this, x, y, message );
      textAnimationFadeOut(openGameLimitReached, 3000);
    });
  }

  onShutdown() {
    this.sound.stopAll();
  }
};
