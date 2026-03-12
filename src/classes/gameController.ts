import { sendTurnMessage } from "../colyseus/colyseusGameRoom";
import { EActionClass, EActionType, EGameSounds, EGameStatus, EHeroes, ETiles, EUiSounds } from "../enums/gameEnums";
import { IGame, IGameOver, IGameState, IPlayerState, IUserData } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";
import { replayButton } from "../scenes/gameSceneUtils/replayButton";
import { playSound } from "../utils/gameSounds";
import { getNewPositionAfterForce, forcedMoveSpawnCheck, forcedMoveAnimation } from "../utils/unitAnimations";
import { visibleUnitCardCheck } from "../utils/unitCards";
import { deselectUnit, getPlayersKey } from "../utils/playerUtils";
import { ActionPie } from "./board/actionPie";
import { Board } from "./board/board";
import { Deck } from "./board/deck";
import { Door } from "./board/door";
import { GameOverScreen } from "./board/gameOverScreen";
import { GameUI } from "./board/gameUI";
import { Tile } from "./board/tile";
import { RematchButton } from "./buttons/rematchButton";
import { TurnButton } from "./buttons/turnButton";
import { Hero } from "./factions/hero";
import { Item } from "./factions/item";
import { Hand } from "./hand";
import { ConcedeWarningPopup } from "./popups/concedePopup";
import { TurnWarningPopup } from "./popups/turnPopup";
import { getActionClass } from "../utils/gameUtils";
import { specialTileCheck } from "../utils/boardUtils";

export class GameController {
  context: GameScene;
  game: IGame;
  gameUI: GameUI;
  board: Board;
  hand: Hand;
  deck: Deck;
  actionPie: ActionPie;
  door: Door;
  turnButton: TurnButton;
  turnPopup: TurnWarningPopup;
  rematchButton: RematchButton;
  lastTurnState: IGameState;
  currentTurn: IGameState[];
  blockingLayer: Phaser.GameObjects.Rectangle;
  replayButton: Phaser.GameObjects.Image;
  playerData: IUserData[];

  gameOver: IGameOver | undefined;
  gameOverScreen: GameOverScreen | undefined;
  concedeButton: Phaser.GameObjects.Image;
  concedePopup: ConcedeWarningPopup;

  constructor(context: GameScene) {
    if (context.triggerReplay && context.chatComponent) context.chatComponent!.pointerEvents = 'none';

    if (context.currentGame.status === EGameStatus.FINISHED && !context.triggerReplay){
      const gameOverScreen =  new GameOverScreen(context);
      gameOverScreen.init();
    }

    this.context = context;
    this.game = structuredClone(context.currentGame!);

    // If we are in a replay we set everything to the last turn
    if (context.triggerReplay) {
      this.lastTurnState =  this.game.previousTurn[0];
    } else {
      this.lastTurnState =  this.game.previousTurn[this.game.previousTurn.length - 1];
    }

    context.player1 = this.lastTurnState.player1;
    context.player2 = this.lastTurnState.player2;

    this.board = new Board(context, this.lastTurnState.boardState);
    this.playerData = this.game.players.map(player => { return player.userData; });
    this.gameUI = new GameUI(context, this.board, this.playerData);

    this.deck  = new Deck(context, this.lastTurnState);
    this.hand = new Hand(context, this.lastTurnState);
    this.actionPie = new ActionPie(context);

    this.turnButton = new TurnButton(context);
    this.turnPopup = new TurnWarningPopup(context);

    this.rematchButton = new RematchButton(context).setVisible(false);

    this.concedeButton = this.addConcedeButton(context);
    this.concedePopup = new ConcedeWarningPopup(context);

    if (context.triggerReplay) {
      this.rematchButton.setVisible(false);
      this.turnButton.buttonImage.setVisible(false);
    }
    else if (this.game.status === EGameStatus.FINISHED) {
      this.rematchButton.setVisible(true);
      this.turnButton.buttonImage.setVisible(false);
      this.gameOverEffects();
    }

    if (context.activePlayer !== context.userId) this.turnButton.buttonImage.setVisible(false);

    this.door = new Door(context);

    // Clicking skips replay
    this.blockingLayer = context.add.rectangle(910, 0, 1040, 1650, 0x000000, 0.3).setOrigin(0.5).setInteractive().setDepth(999).setVisible(this.context.triggerReplay);

    this.blockingLayer.on('pointerdown', () => {
      context.scene.restart({
        userId: context.userId,
        colyseusClient: context.colyseusClient,
        currentGame: context.currentGame,
        currentRoom: context.currentRoom,
        triggerReplay: false
      });
    });

    this.replayButton = replayButton(context);

    this.currentTurn = [];

    // Add a generic gameobject pointer event to make it easier to hide a unit info card
    context.input.on('gameobjectdown', () => visibleUnitCardCheck(context));
  }

  addConcedeButton(context: GameScene): Phaser.GameObjects.Image {
    const button = context.add.image(1350, 70, 'concedeButton').setScale(0.9).setInteractive({ useHandCursor: true });
    button.on('pointerdown', ()=> {
      playSound(this.context, EUiSounds.BUTTON_GENERIC);
      this.concedePopup.setVisible(true);
    });
    return button;
  }

  async resetTurn() {
    deselectUnit(this.context);
    this.context.longPressStart = undefined;
    this.context.visibleUnitCard = undefined;
    playSound(this.context, EGameSounds.RESET_TURN);

    this.context.scene.restart();
  };

  getDeck() {
    return this.deck.getDeck();
  }

  drawUnits() {
    playSound(this.context, EGameSounds.DRAW);

    const drawAmount = 6 - this.hand.getHandSize();
    if (this.deck.getDeckSize() === 0 || drawAmount === 0) return;

    this.door.openDoor();

    const drawnUnits = this.deck.removeFromDeck(drawAmount); // IHero IItem

    this.hand.addToHand(drawnUnits);

    // Add action to turn state
    const { player, opponent } = getPlayersKey(this.context);

    const playerState: IPlayerState = {
      ...this.context[player]!,
      factionData: {
        ...this.context[player]!.factionData,
        unitsInHand: this.hand.exportHandData(),
        unitsInDeck: this.deck.getDeck()
      }
    };
    const opponentState = this.context[opponent];
    this.currentTurn.push({
      player1: this.context.isPlayerOne ? playerState : opponentState!,
      player2: !this.context.isPlayerOne ? playerState : opponentState!,
      action: {
        actionClass: EActionClass.AUTO,
        action: EActionType.DRAW

      },
      boardState: this.board.getBoardState()
    });
  }

  async removeKOUnits() {
    // Remove KO'd units from the board
    const unitsToRemove: Hero[] = [];

    this.board.units.forEach(unit => {
      if (unit.stats.isKO) {
        if (unit.stats.lastBreath) unitsToRemove.push(unit);
        if (!unit.stats.lastBreath) {
          unit.stats.lastBreath = true;
          unit.updateTileData();
        }
      }
    });

    if (unitsToRemove.length) {
      playSound(this.context, EGameSounds.VANISH);
      const animation = (hero: Hero): Promise<void> => {
        return new Promise((resolve) => {
          this.context.tweens.add({
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
        return animation.call(this.context, unit);
      }));
    }

    this.addActionToState(EActionType.REMOVE_UNITS); // this step needs to happen every turn in order to update the tiles
  }

  hasActionsLeft(): boolean {
    if (this.context.turnNumber === 0 && this.context.currentTurnAction! < 4) return true;
    if (this.context.currentTurnAction! < 6) return true;
    return false;
  }

  async endOfTurnActions(): Promise<void> {
    // If a unit was currently selected, de-select it
    if (this.context.activeUnit) deselectUnit(this.context);

    // Refresh actionPie, draw units and update door banner
    this.actionPie.resetActionPie();
    this.drawUnits(); // FIXME: move this until after the sedTurnMessage succeeds (or show an error)
    this.door.updateBannerText();

    // Add the last action of the previous turn at index 0 of the actions array to serve as the base for the replay
    this.currentTurn.unshift(this.lastTurnState);

    this.context.activePlayer = this.context.opponentId;
    this.context.turnNumber!++;

    sendTurnMessage(this.context.currentRoom, this.currentTurn, this.context.opponentId, this.context.turnNumber!, this.gameOver);

    if (this.gameOver) this.gameOverEffects();
  }

  async gameOverEffects() {
    if (this.gameOver?.winner === this.context.activePlayer) {
      playSound(this.context, EUiSounds.WIN_SFX);
    } else {
      playSound(this.context, EUiSounds.LOSE_SFX);
    }
  }

  onHeroClicked(hero: Hero) {
    console.log(`A hero in position ${hero.stats.boardPosition} has been clicked`);
    if (hero.stats.boardPosition > 44) this.board.highlightSpawns(hero.stats.unitType);

    if (hero.stats.boardPosition < 45) {
      this.board.highlightEnemyTargets(hero);
      this.board.highlightFriendlyTargets(hero);
      this.board.highlightMovementArea(hero);

      if (hero.stats.unitType === EHeroes.NINJA || hero.getTile().tileType === ETiles.TELEPORTER) this.board.highlightTeleportOptions(hero);
    }
  }

  onItemClicked(item: Item) {
    console.log(`An item ${item.stats.unitId} has been clicked`);
    if (item.stats.dealsDamage) {
      this.board.highlightAllBoard();
    } else {
      this.board.highlightEquipmentTargets(item);
    }
  }

  onTileClicked(tile: Tile) {
    console.log(`A tile ${tile.tileType} has been clicked`);
  }

  afterAction(actionType: EActionType, activePosition: number, targetPosition?: number): void {
    // Don't trigger pie animation during replays
    if (this.context.triggerReplay) return;

    // Add action to current state
    this.addActionToState(actionType, activePosition, targetPosition);

    // Remove a slice from the action pie
    this.actionPie.hideActionSlice(this.context.currentTurnAction!++);

    // Deselect unit and clear highlights
    if (this.context.activeUnit) deselectUnit(this.context);
  }

  addActionToState(action: EActionType, actorPosition?: number, targetPosition?: number): void {
    const { player, opponent } = getPlayersKey(this.context);

    const actionClass = getActionClass(action);

    const playerState: IPlayerState = {
      ...this.context[player]!,
      factionData: {
        ...this.context[player]!.factionData,
        unitsInHand: this.hand.exportHandData(),
        unitsInDeck: this.deck.getDeck()
      }
    };

    const opponentState = this.context[opponent];
    // Add action to current turn state
    this.currentTurn.push({
      player1: this.context.isPlayerOne ? playerState : opponentState!,
      player2: !this.context.isPlayerOne ? playerState : opponentState!,
      action: {
        actorPosition,
        targetPosition: targetPosition ?? actorPosition,
        action,
        actionClass
      },
      boardState: this.board.getBoardState()
    });
  }

  async pushEnemy(attacker: Hero, target: Hero): Promise<void> {
    const attackerTile = this.board.getTileFromBoardPosition(attacker.stats.boardPosition);
    const targetTile = this.board.getTileFromBoardPosition(target.stats.boardPosition);
    if (!attackerTile || !targetTile) {
      console.error('pushEnemy() no attacker or target board position');
      return;
    }

    const newPosition = getNewPositionAfterForce(attackerTile.row, attackerTile.col, targetTile.row, targetTile.col, true);

    // If the tile is beyond the boundaries of the map, ignore
    const isWrongRow = newPosition.row < 0 || newPosition.row > 4;
    const isWrongCol = newPosition.col < 0 || newPosition.col > 8;
    if (isWrongRow || isWrongCol) {
      console.error('pushEnemy() Cant push enemy out of the map');
      return;
    }

    const targetNewTile = this.board.getTileFromCoordinates(newPosition.row, newPosition.col);
    if (!targetNewTile) {
      console.error('pushEnemy() No destination tile found');
      return;
    }
    if (targetNewTile.crystal || targetNewTile.hero) {
      console.error('pushEnemy() Destination tile is occupied');
      return;
    }
    if (targetNewTile.tileType == ETiles.SPAWN && forcedMoveSpawnCheck(targetNewTile, attacker) && !target.stats.isKO) {
      console.error(`pushEnemy() Can't push a non-KO'd enemy onto a friendly spawn`);
      return;
    }

    if (!target.stats.isKO) specialTileCheck(target, targetNewTile.tileType, targetTile.tileType);

    await forcedMoveAnimation(this.context, target, targetNewTile);

    target.updatePosition(targetNewTile);
    targetNewTile.hero = target.exportData();
    targetTile.removeHero();
  }

  async pullEnemy(attacker: Hero, target: Hero): Promise<void> {
    const attackerTile = this.board.getTileFromBoardPosition(attacker.stats.boardPosition);
    const targetTile = this.board.getTileFromBoardPosition(target.stats.boardPosition);
    if (!attackerTile || !targetTile) {
      console.error('pullEnemy() no attacker or target board position');
      return;
    }

    const newPosition = getNewPositionAfterForce(attackerTile.row, attackerTile.col, targetTile.row, targetTile.col, false);

    const targetNewTile = this.board.getTileFromCoordinates(newPosition.row, newPosition.col);
    if (!targetNewTile) {
      console.error('pullEnemy() No destination tile found');
      return;
    }
    if (targetNewTile.crystal || targetNewTile.hero) {
      console.error('pullEnemy() Destination tile is occupied');
      return;
    }
    if (targetNewTile.tileType == ETiles.SPAWN && forcedMoveSpawnCheck(targetNewTile, attacker) && !target.stats.isKO) {
      console.error(`pushEnemy() Can't pull a non-KO'd enemy onto a friendly spawn`);
      return;
    }

    if (!target.stats.isKO) specialTileCheck(target, targetNewTile.tileType, targetTile.tileType);

    await forcedMoveAnimation(this.context, target, targetNewTile);

    target.updatePosition(targetNewTile);
    targetNewTile.hero = target.exportData();
    targetTile.removeHero();
  }

  updateCrystals(attackerBelongsTo: number, increase: boolean): void {
    this.board.crystals.forEach(crystal => {
      if (crystal.stats.belongsTo !== attackerBelongsTo) {
        let newLevel: number = 0;

        if (increase) newLevel = crystal.stats.debuffLevel + 1;
        if (!increase && crystal.stats.debuffLevel > 0) newLevel = crystal.stats.debuffLevel - 1; // Safeguard to avoid it going negative until I figure out the bug

        crystal.updateCrystalDebuffAnimation(newLevel);
      }
    });
  };
}
