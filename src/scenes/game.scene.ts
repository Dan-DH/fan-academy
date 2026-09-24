import { GameController } from "../classes/gameController";
import { Hero } from "../classes/factions/hero";
import { Item } from "../classes/factions/item";
import { IGame, IPlayerData, IPlayerState } from "../interfaces/gameInterface";
import { createChatComponent } from "./gameSceneUtils/chatComponent";
import { Tile } from "../classes/board/tile";
import { Crystal } from "../classes/board/crystal";
import { gameListFadeOutText, textAnimationFadeOut } from "../utils/textAnimations";
import { Room } from "@colyseus/sdk";
import { TurnReplay } from "../classes/turnReplay";
import { GameReplay } from "../classes/gameReplay";

export default class GameScene extends Phaser.Scene {
  // FIXME: check which properties we can remove here
  userId!: string;

  currentGame!: IGame;
  currentTurnAction: number | undefined;
  turnNumber: number | undefined;

  activeUnit: Hero | Item | undefined;

  gameController: GameController | undefined;

  activePlayer: string | undefined;
  firstPlayer: string | undefined; // only used for replays
  isPlayerOne: boolean | undefined;
  opponentId!: string;

  player1: IPlayerState | undefined;
  player2: IPlayerState | undefined;

  longPressStart: number | undefined;
  visibleUnitCard: Hero | Item | Crystal | Tile | undefined;

  triggerReplay = true;
  fullReplay = false;

  chatComponent: Phaser.GameObjects.DOMElement | undefined;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: {
    userId: string,
    currentGame: IGame,
    currentRoom: Room,
    fullReplay: boolean,
    triggerReplay?: boolean
  }) {
    this.activeUnit = undefined;
    this.gameController = undefined;
    this.visibleUnitCard = undefined;
    this.chatComponent = undefined;
    this.longPressStart = undefined;
    this.firstPlayer = undefined;

    this.userId = data.userId;
    this.turnNumber = data.currentGame.turnNumber;
    this.currentGame = data.currentGame;
    const opponent = data.currentGame.players.find((p: IPlayerData) => data.userId !== p.userData._id);
    this.opponentId = opponent!.userData._id;

    this.fullReplay = data.fullReplay;
    this.triggerReplay = data.fullReplay ? false : data.triggerReplay ?? true;
    console.log('freplay', this.fullReplay, 'treplay', this.triggerReplay);

    // Updating GameScene properties
    this.activePlayer = this.currentGame.activePlayer;
    this.firstPlayer = this.currentGame.firstPlayer ?? undefined;
    this.isPlayerOne = this.currentGame?.players[0].userData._id === this.userId;
    this.currentTurnAction = this.turnNumber === 1 ? 3 : 1;
  }

  create() {
    const networkStatus = navigator.onLine ? 'online' : 'offline';
    this.registry.set('networkStatus', networkStatus);
    window.addEventListener('offline', this.handleOffline);
    window.addEventListener('online', this.handleOnline);

    const userPreferences = this.registry.get('userPreferences');
    if (userPreferences.chat) this.chatComponent = createChatComponent(this);

    this.input.mouse!.disableContextMenu();
    this.gameController = new GameController(this);
    if (this.triggerReplay) {
      new TurnReplay(this.gameController).replayTurn();
    }
    if (this.fullReplay) {
      new GameReplay(this.gameController).replayAllTurns();
    }
    this.game.events.on('messageToGameScene', this.handleMessageToGameScene);
  }

  onShutdown() {
    this.removeListeners();
  }

  onDestroy() {
    this.removeListeners();
  }

  handleOnline = () => {
    this.registry.set('networkStatus', 'online');
  };

  handleOffline = () => {
    this.registry.set('networkStatus', 'offline');
  };

  handleMessageToGameScene = (data: {
    x: number,
    y: number,
    message: string
  }) =>  {
    const { x, y, message } = data;
    const openGameLimitReached = gameListFadeOutText(this, x, y, message );
    textAnimationFadeOut(openGameLimitReached, 3000);
  };

  removeListeners() {
    window.removeEventListener('offline', this.handleOffline);
    window.removeEventListener('online', this.handleOnline);
    this.game.events.off('messageToGameScene', this.handleMessageToGameScene);
  }
};
