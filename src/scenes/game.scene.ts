import { IGame, IGameOver, IGameState, IPlayerData, IPlayerState, IUserData } from "../interfaces/gameInterface";
import { createChatComponent } from "./gameSceneUtils/chatComponent";
import { gameListFadeOutText, textAnimationFadeOut } from "../utils/textAnimations";
import { Room } from "@colyseus/sdk";
import { GameOverScreen } from "../classes/board/gameOverScreen";
import { EActionClass, EActionType, EGameSceneMode, EGameStatus, EHeroes, EItems, ETiles } from "../enums/gameEnums";
import { ActionPie } from "../classes/board/actionPie";
import { Banner } from "../classes/board/banner";
import { Board } from "../classes/board/board";
import { Deck } from "../classes/board/deck";
import { Door } from "../classes/board/door";
import { RematchButton } from "../classes/buttons/rematchButton";
import { TurnButton } from "../classes/buttons/turnButton";
import { Hand } from "../classes/hand";
import { ConcedeWarningPopup } from "../classes/popups/concedePopup";
import { TurnWarningPopup } from "../classes/popups/turnPopup";
import { replayButton } from "./gameSceneUtils/replayButton";
import { visibleUnitCardCheck } from "../utils/unitCards";
import { Hero } from "../classes/factions/hero";
import { Item } from "../classes/factions/item";
import { colyseusService } from "../colyseus/colyseusService";
import { getActionClass } from "../utils/gameUtils";
import { deselectUnit, getPlayersKey } from "../utils/playerUtils";
import { Crystal } from "../classes/board/crystal";
import { Tile } from "../classes/board/tile";
import { GameReplay } from "../classes/gameReplay";

export default class GameScene extends Phaser.Scene {
  userId!: string;
  opponentId!: string;
  isReplay = false;
  gameSceneMode: EGameSceneMode | undefined;

  chatComponent: Phaser.GameObjects.DOMElement | undefined;
  currentGame: IGame | undefined;
  currentTurn: IGameState[] | undefined;
  clonedGame: IGame | undefined; // FIXME:
  startTurnState: IGameState | undefined;
  currentTurnAction: number | undefined;

  // gamecontroller
  banner: Banner | undefined;
  board: Board | undefined;
  hand: Hand | undefined;
  opponentHand: Hand | undefined;
  deck: Deck | undefined;
  opponentDeck: Deck | undefined;
  actionPie: ActionPie | undefined;
  door: Door | undefined;
  turnButton: TurnButton | undefined;
  turnPopup: TurnWarningPopup | undefined;
  rematchButton: RematchButton | undefined;
  replayButton: Phaser.GameObjects.Image | undefined;
  gameOver: IGameOver | undefined;
  gameOverScreen: GameOverScreen | undefined;
  concedeButton: Phaser.GameObjects.Image | undefined;
  concedePopup: ConcedeWarningPopup | undefined;

  player1: IPlayerState | undefined;
  player2: IPlayerState | undefined;
  activePlayer: string | undefined;
  firstPlayer: string | undefined; // only used for replays
  playerData: IUserData[] | undefined;
  isPlayerOne: boolean | undefined;
  turnNumber: number | undefined;
  activeUnit: Hero | Item | undefined;

  longPressStart: number | undefined;
  visibleUnitCard: Hero | Item | Crystal | Tile | undefined;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: {
    userId: string,
    currentGame: IGame,
    currentRoom: Room, // FIXME: do we need this?
    gameSceneMode: EGameSceneMode
  }) {
    // FIXME: check undefine everything
    this.chatComponent = undefined;
    this.longPressStart = undefined;
    this.visibleUnitCard = undefined;
    this.activeUnit = undefined;

    this.currentGame = data.currentGame;
    this.userId = data.userId;
    const opponent = data.currentGame.players.find((p: IPlayerData) => data.userId !== p.userData._id);
    this.opponentId = opponent!.userData._id;

    this.gameSceneMode = data.gameSceneMode;

    this.isReplay = [EGameSceneMode.GAME_REPLAY, EGameSceneMode.TURN_REPLAY].includes(this.gameSceneMode);
    console.log('GameSceneMode: ', this.gameSceneMode);

    const networkStatus = navigator.onLine ? 'online' : 'offline';
    this.registry.set('networkStatus', networkStatus);
    window.addEventListener('offline', this.handleOffline);
    window.addEventListener('online', this.handleOnline);
    this.game.events.on('messageToGameScene', this.handleMessageToGameScene);

    // this.input.mouse!.disableContextMenu(); // FIXME: what was this for?
  }

  create() {
    this.clonedGame = structuredClone(this.currentGame);

    if (this.clonedGame!.status === EGameStatus.FINISHED && !this.isReplay){
      this.gameOverScreen =  new GameOverScreen(this);
    }

    if (this.gameSceneMode === EGameSceneMode.TURN_REPLAY) {
      this.startTurnState = structuredClone(this.clonedGame!.previousTurn[0]);
    } else if (this.gameSceneMode === EGameSceneMode.GAME_REPLAY) {
      this.startTurnState = structuredClone(this.clonedGame!.turnHistory![0][0]);
    } else {
      this.startTurnState = structuredClone(this.clonedGame!.previousTurn[this.clonedGame!.previousTurn.length - 1]);
    }

    this.player1 = this.startTurnState.player1;
    this.player2 = this.startTurnState.player2!;

    this.activePlayer = this.clonedGame!.activePlayer;
    this.firstPlayer = this.clonedGame!.firstPlayer!;
    this.isPlayerOne = this.clonedGame!.players[0].userData._id === this.userId;
    this.turnNumber = this.clonedGame!.turnNumber;
    this.currentTurnAction = this.turnNumber === 1 ? 3 : 1;

    // Game map
    const gameMap = this.add.image(0, 0, 'gameBoard').setOrigin(0).setInteractive();
    gameMap.y += 14; // FIXME: this used to be inside the gameUI and render correctly, not sure why it blocks tiles and crystals
    gameMap.x = 1434 - gameMap.width - 14;
    // Item rack
    this.add.image(0, 0, 'gameAtlas', 'itemRack').setOrigin(0.5).setPosition(900, 736).setScale(1.125);

    this.board = new Board(this, this.startTurnState.boardState, this.clonedGame!.map);

    this.playerData = this.clonedGame!.players.map(player => { return player.userData; });
    this.banner = new Banner(this, this.board, this.playerData);

    const { player1, player2 } = this.startTurnState;
    const activePlayer = this.isPlayerOne ? player1 : player2!;
    const opponentPlayer = this.isPlayerOne ? player2! : player1;
    this.deck = new Deck(activePlayer.deck);
    this.opponentDeck = new Deck(opponentPlayer.deck);
    this.hand = new Hand(activePlayer.hand);
    this.opponentHand = new Hand(opponentPlayer.hand);
    this.opponentHand.disableOpponentHand(); // FIXME: do we need the same for the deck?

    this.actionPie = new ActionPie(this);
    this.turnButton = new TurnButton(this);
    this.turnPopup = new TurnWarningPopup(this);
    this.rematchButton = new RematchButton(this).setVisible(false);
    this.concedeButton = this.addConcedeButton(this);
    this.concedePopup = new ConcedeWarningPopup(this);
    this.door = new Door(this);

    if (this.isReplay) {
      this.rematchButton.setVisible(false);
      this.turnButton.buttonImage.setVisible(false);
    }
    else if (this.clonedGame!.status === EGameStatus.FINISHED) {
      this.rematchButton.setVisible(true);
      this.turnButton.buttonImage.setVisible(false);
      this.gameOverEffects();
    }

    if (this.activePlayer !== this.userId) this.turnButton.buttonImage.setVisible(false);

    // Clicking skips replay // FIXME:
    // this.blockingLayer = this.add.rectangle(910, 0, 1040, 1650).setOrigin(0.5).setInteractive().setDepth(999).setVisible(isReplay);

    // this.blockingLayer.on('pointerdown', () => {
    //   this.scene.restart({
    //     userId: this.userId,
    //     currentGame: this.currentGame,
    //     triggerReplay: false,
    //     fullReplay: false
    //   });
    // });

    this.replayButton = replayButton(this); // FIXME: modified for testing purposes. Transfor into class

    this.currentTurn = [];

    // Add a generic gameobject pointer event to make it easier to hide a unit info card
    this.input.on('gameobjectdown', () => visibleUnitCardCheck(this));

    this.add.text(850, 110, `TURN ${this.turnNumber }`, {
      fontFamily: 'proHeavy',
      fontSize: 35,
      color: '#ffffff'
    });

    const userPreferences = this.registry.get('userPreferences');
    if (userPreferences.chat) this.chatComponent = createChatComponent(this);

    if (this.gameSceneMode === EGameSceneMode.GAME_REPLAY) new GameReplay(this);
    // if (this.turnReplay) new GameReplay(this); FIXME:
  }

  addConcedeButton(context: GameScene): Phaser.GameObjects.Image {
    const button = context.add.image(1350, 70, 'gameAtlas', 'concedeButton').setScale(0.9).setInteractive({ useHandCursor: true });
    button.on('pointerdown', ()=> {
      // this.sound.play(EUiSounds.BUTTON_GENERIC);
      this.concedePopup!.setVisible(true);
    });
    return button;
  }

  async resetTurn() {
    deselectUnit(this);
    this.longPressStart = undefined;
    this.visibleUnitCard = undefined;
    // this.sound.play(EGameSounds.RESET_TURN);

    this.scene.restart();
  };

  drawUnits() {
    // this.sound.play(EGameSounds.DRAW);

    const drawAmount = 6 - this.hand!.getHandSize();
    if (this.deck!.getDeckSize() === 0 || drawAmount === 0) return;

    this.door!.openDoor();

    const drawnUnits = this.deck!.removeFromDeck(drawAmount);

    this.hand!.addToHand(drawnUnits);

    // Add action to turn state
    const { player, opponent } = getPlayersKey(this);

    const playerState: IPlayerState = {
      ...this[player]!,
      hand: this.hand!.exportHandData(),
      deck: this.deck!.getDeck()
    };
    const opponentState = this[opponent];
    this.currentTurn!.push({
      player1: this.isPlayerOne ? playerState : opponentState!,
      player2: !this.isPlayerOne ? playerState : opponentState!,
      action: {
        actionClass: EActionClass.AUTO,
        action: EActionType.DRAW

      },
      boardState: this.board!.getBoardState()
    });
  }

  async removeKOUnits() {
    // Remove KO'd units from the board
    const unitsToRemove: Hero[] = [];

    this.board!.units.forEach(u => {
      if (u instanceof Hero && u.stats.isKO) {
        if (u.stats.lastBreath) unitsToRemove.push(u);
        if (!u.stats.lastBreath) {
          u.stats.lastBreath = true;
        }
      }
    });

    if (unitsToRemove.length) {
      // this.sound.play(EGameSounds.VANISH);
      const animation = (hero: Hero): Promise<void> => {
        return new Promise((resolve) => {
          this.tweens.add({
            targets: hero,
            alpha: 0,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {
              hero.removeFromGame(true);
              resolve();
            }
          });
        });
      };

      await Promise.all(unitsToRemove.map(unit => {
        return animation.call(this, unit);
      }));
    }

    this.addActionToState(EActionType.REMOVE_UNITS); // this step needs to happen every turn in order to update the tiles
  }

  hasActionsLeft(): boolean {
    if (this.turnNumber === 1 && this.currentTurnAction! < 4) return true;
    if (this.currentTurnAction! < 6) return true;
    return false;
  }

  async endOfTurnActions(): Promise<void> {
    // If a unit was currently selected, de-select it
    if (this.activeUnit) deselectUnit(this);

    this.actionPie!.resetActionPie();
    this.drawUnits();
    await this.removeKOUnits();
    this.door!.updateBannerText();

    const lastTurnFromBE = this.clonedGame!.previousTurn[this.clonedGame!.previousTurn.length - 1];
    this.currentTurn!.unshift(lastTurnFromBE);

    this.activePlayer = this.opponentId;
    this.turnNumber!++;

    colyseusService.sendTurnMessage({
      gameId: this.clonedGame!._id,
      currentTurn: this.currentTurn!,
      newActivePlayer: this.opponentId,
      turnNumber: this.turnNumber!,
      gameOver: this.gameOver
    });

    if (this.gameOver) this.gameOverEffects();
  }

  async gameOverEffects() {
    if (this.gameOver?.winner === this.activePlayer) {
      // this.sound.play(EUiSounds.WIN_SFX);
    } else {
      // this.sound.play(EUiSounds.LOSE_SFX);
    }
  }

  onHeroClicked(hero: Hero) {
    console.log(`A hero in position ${hero.stats.boardPosition} has been clicked`);
    if (hero.stats.boardPosition > 44) this.board!.highlightSpawns(hero.stats.unitType);

    if (hero.stats.boardPosition < 45) {
      this.board!.highlightEnemyTargets(hero);
      this.board!.highlightFriendlyTargets(hero);
      this.board!.highlightMovementArea(hero);

      if (hero.stats.unitType === EHeroes.NINJA || hero.getTile().tileType === ETiles.TELEPORTER) this.board!.highlightTeleportOptions(hero);
    }
  }

  onItemClicked(item: Item) {
    console.log(`An item ${item.stats.unitId} has been clicked`);
    if (item.stats.dealsDamage && item.stats.itemType === EItems.PULVERIZER) {
      this.board!.highlightAllLivingEnemyTargets(item);
    } else if (item.stats.dealsDamage) {
      this.board!.highlightAllBoard();
    } else {
      this.board!.highlightEquipmentTargets(item);
    }
  }

  afterAction(actionType: EActionType, activePosition: number, targetPosition?: number): void {
    if (this.isReplay) return;

    // Add action to current state
    this.addActionToState(actionType, activePosition, targetPosition);

    // Remove a slice from the action pie
    this.actionPie!.hideActionSlice(this.currentTurnAction!++);

    // Deselect unit and clear highlights
    if (this.activeUnit) deselectUnit(this);
  }

  addActionToState(action: EActionType, actorPosition?: number, targetPosition?: number): void {
    const { player, opponent } = getPlayersKey(this);

    const actionClass = getActionClass(action);

    const playerState: IPlayerState = {
      ...this[player]!,
      hand: this.hand!.exportHandData(),
      deck: this.deck!.getDeck()
    };

    const opponentState = this[opponent];
    // Add action to current turn state
    this.currentTurn!.push({
      player1: this.isPlayerOne ? playerState : opponentState!,
      player2: !this.isPlayerOne ? playerState : opponentState!,
      action: {
        actorPosition,
        targetPosition: targetPosition ?? actorPosition,
        action,
        actionClass
      },
      boardState: this.board!.getBoardState()
    });
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
