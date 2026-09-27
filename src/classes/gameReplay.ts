import { EActionClass, EActionType, EGameSceneMode } from "../enums/gameEnums";
import { IGameState, ITurnAction } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";
import { Banner } from "./board/banner";
import { Board } from "./board/board";
import { Deck } from "./board/deck";
import { Hero } from "./factions/hero";
import { Item } from "./factions/item";
import { Hand } from "./hand";

export class GameReplay {
  context: GameScene;
  turnHistory: IGameState[][];

  turnNumber = 1;
  actionNumber = 0;
  isPaused = false;
  isFirstPlayer: boolean;
  isPlayerTurn: boolean;

  actionNumberTextBox!: Phaser.GameObjects.Text;

  replayToggleButton!: Phaser.GameObjects.Image;
  nextTurnButton!: Phaser.GameObjects.Image;
  lastTurnButton!: Phaser.GameObjects.Image;
  previousTurnButton!: Phaser.GameObjects.Image;
  firstTurnButton!: Phaser.GameObjects.Image;
  nextActionButton!: Phaser.GameObjects.Image;
  previousActionButton!: Phaser.GameObjects.Image;

  constructor(context: GameScene) {
    this.context = context;
    this.turnHistory = context.currentGame! .turnHistory!;

    this.addUiElements();

    this.isFirstPlayer = context.firstPlayer === context.userId;
    this.isPlayerTurn = this.isFirstPlayer;

    // this.replayAllTurns();
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
    // TODO: is paused, change play icon or color
    if (!this.isPaused) this.replayAllTurns(); // FIXME: bug if we pause first then go to a specific turn
  }

  changeTurn(n: number): void {
    if (!this.isPaused) this.togglePause();
    this.turnNumber += n; // if negative we go back one turn
    this.actionNumber = 0;
    this.goToState(this.turnNumber, this.actionNumber);
  }

  changeAction(n: number): void {
    if (!this.isPaused) this.togglePause();
    this.actionNumber = n; // if negative we go back one
    this.goToState(this.turnNumber, this.actionNumber);
  }

  goToLast(): void {
    if (!this.isPaused) this.togglePause();
    this.turnNumber = this.turnHistory.length - 1 ;
    this.actionNumber = 0;
    this.goToState(this.turnNumber, this.actionNumber);
  }

  goToFirst(): void {
    if (!this.isPaused) this.togglePause();
    this.turnNumber = 1;
    this.actionNumber = 0;
    this.goToState(0, this.actionNumber);
  }

  addUiElements(): void {
    this.actionNumberTextBox = this.context.add.text(this.context.turnNumberTextBox!.x, this.context.turnNumberTextBox!.y + 30, `Action ${ this.actionNumber + 1 }`, {
      fontFamily: 'proLight',
      fontSize: 30,
      color: '#ffffff'
    });

    this.replayToggleButton = this.context.add.image(900, 660, 'gameAtlas', 'replayButton').setScale(1.6).setInteractive({ useHandCursor: true }).setVisible(this.context.gameSceneMode === EGameSceneMode.GAME_REPLAY);

    const replayButtonX = this.replayToggleButton.x;
    const replayButtonY = this.replayToggleButton.y;
    const separationX = 65;

    this.previousActionButton = this.context.add.image(replayButtonX - separationX, replayButtonY, 'gameAtlas', 'replayButton').setScale(1.3).setInteractive({ useHandCursor: true }).setVisible(this.context.gameSceneMode === EGameSceneMode.GAME_REPLAY).setFlipX(true);
    this.previousTurnButton = this.context.add.image(replayButtonX - separationX * 2, replayButtonY, 'gameAtlas', 'replayButton').setScale(1.6).setInteractive({ useHandCursor: true }).setVisible(this.context.gameSceneMode === EGameSceneMode.GAME_REPLAY).setFlipX(true);
    this.firstTurnButton = this.context.add.image(replayButtonX - separationX * 3, replayButtonY, 'gameAtlas', 'replayButton').setScale(1.6).setInteractive({ useHandCursor: true }).setVisible(this.context.gameSceneMode === EGameSceneMode.GAME_REPLAY).setFlipX(true);

    this.nextActionButton = this.context.add.image(replayButtonX + separationX, replayButtonY, 'gameAtlas', 'replayButton').setScale(1.3).setInteractive({ useHandCursor: true }).setVisible(this.context.gameSceneMode === EGameSceneMode.GAME_REPLAY);
    this.nextTurnButton = this.context.add.image(replayButtonX + separationX * 2, replayButtonY, 'gameAtlas', 'replayButton').setScale(1.6).setInteractive({ useHandCursor: true }).setVisible(this.context.gameSceneMode === EGameSceneMode.GAME_REPLAY);
    this.lastTurnButton = this.context.add.image(replayButtonX + separationX * 3, replayButtonY, 'gameAtlas', 'replayButton').setScale(1.6).setInteractive({ useHandCursor: true }).setVisible(this.context.gameSceneMode === EGameSceneMode.GAME_REPLAY);

    this.replayToggleButton.on('pointerdown', () => {
      // context.sound.play(EUiSounds.BUTTON_GENERIC);
      console.log('replayToggleButton clicked');
      this.togglePause();
    });

    this.firstTurnButton.on('pointerdown', () => {
      // context.sound.play(EUiSounds.BUTTON_GENERIC);
      console.log('firstTurnButton clicked');
      this.goToFirst();
    });
    this.previousTurnButton.on('pointerdown', () => {
      // context.sound.play(EUiSounds.BUTTON_GENERIC);
      console.log('previousTurnButton clicked');
    });
    this.previousActionButton.on('pointerdown', () => {
      // context.sound.play(EUiSounds.BUTTON_GENERIC);
      console.log('previousActionButton clicked');
    });
    this.nextActionButton.on('pointerdown', () => {
      // context.sound.play(EUiSounds.BUTTON_GENERIC);
      console.log('nextActionButton clicked');
    });
    this.nextTurnButton.on('pointerdown', () => {
      // context.sound.play(EUiSounds.BUTTON_GENERIC);
      console.log('nextTurnButton clicked');
    });
    this.lastTurnButton.on('pointerdown', () => {
      // context.sound.play(EUiSounds.BUTTON_GENERIC);
      console.log('lastTurnButton clicked');
      this.goToLast();
    });
  }

  goToState(turn: number, action: number): void {
    // TODO: restart UI elements and gameState with the correct snapshot
    this.context.startTurnState = structuredClone(this.context.clonedGame!.turnHistory![turn][action]);

    this.context.board?.units.forEach(u => u.removeAll(true).destroy());
    this.context.board = new Board(this.context, this.context.startTurnState.boardState, this.context.clonedGame!.map);

    this.context.banner?.removeAll(true).destroy();
    this.context.banner = new Banner(this.context, this.context.board, this.context.playerData!);

    const { player1, player2 } = this.context.startTurnState;
    const activePlayer = this.context.isPlayerOne ? player1 : player2!;
    const opponentPlayer = this.context.isPlayerOne ? player2! : player1;
    this.context.deck = new Deck(activePlayer.deck);
    this.context.opponentDeck = new Deck(opponentPlayer.deck);

    this.context.hand?.hand.forEach(u => u.removeAll(true).destroy());
    this.context.hand = new Hand(activePlayer.hand);
    this.context.opponentHand?.hand.forEach(u => u.removeAll(true).destroy());
    this.context.opponentHand = new Hand(opponentPlayer.hand);
    this.context.opponentHand.disableOpponentHand(); // FIXME: do we need the same for the deck?
  }

  async replayAllTurns() {
    for (let i = this.turnNumber; i <= this.turnHistory.length - 1; i++) {
      console.log('TURN', i);
      this.context.turnNumberTextBox?.setText(`TURN ${i}`);

      this.isPlayerTurn = this.isFirstPlayer ? i % 2 !== 0 : i % 2 === 0;

      await this.replayTurn(this.turnHistory![i]);

      if (this.isPaused) break;
    }
  }

  async replayTurn(turn: IGameState[]) {
    const hand = this.isPlayerTurn ? this.context.hand! : this.context.opponentHand!;
    const deck = this.isPlayerTurn ? this.context.deck! : this.context.opponentDeck!;

    for (let i = this.actionNumber; i <= turn.length - 1; i++) {
      const turnAction = turn[i];

      console.log('turn: ', this.turnNumber, ' action number: ', i);
      console.log('turnAction.action', turnAction.action);

      if (!turnAction.action) continue;

      await this.replayAction(turnAction, hand, deck, i);

      if (i === turn.length - 1) {
        this.actionNumber = 0;
        this.turnNumber++;
        console.log('turnNumber triggers. Previous turn: ', this.turnNumber, ' New turn: ', this.turnNumber + 1);
      } else {
        this.actionNumber++;
      }

      if (this.isPaused) return;
    }

    // FIXME: add check for gameOver and add gameOver screen

    // this.context.scene.restart({
    //   userId: this.context.userId,
    //   currentGame: this.context.currentGame,
    //   triggerReplay: false
    // } );
  }

  async replayAction(turnAction: IGameState, hand: Hand, deck: Deck, actionNumber: number): Promise<void> {
    const actionTaken = turnAction.action?.action;
    await new Promise<void>(resolve => {
      this.context.time.delayedCall(1000, async () => {
        if (turnAction.action?.actionClass === EActionClass.USER) this.actionNumberTextBox.setText(`Action ${ actionNumber + 1 }`);
        switch (actionTaken) {
          case EActionType.SPAWN:
            this.replaySpawn(turnAction.action!, hand);
            break;
          case EActionType.MOVE:
            this.replayMove(turnAction.action!);
            break;
          case EActionType.ATTACK:
          case EActionType.HEAL:
          case EActionType.BUFF:
          case EActionType.TELEPORT:
          case EActionType.SPAWN_PHANTOM:
            this.replayUnitAction(turnAction.action!);;
            break;
          case EActionType.SHUFFLE:
            await this.replayShuffle();
            break;
          case EActionType.USE:
            await this.replayUse(turnAction.action!, hand);
            break;
          case EActionType.DRAW:
            this.replayDraw(hand, deck);
            break;
          case EActionType.REMOVE_UNITS:
            await this.context.removeKOUnits();
            break;
          default:
            console.error('Replay: action not covered: ', actionTaken);
            break;
        }

        resolve();
      });
    });

    // this.startTurnState = turn[i];
  }

  replaySpawn(action: ITurnAction, hand: Hand): void {
    const hero = hand.getHand().find(unit => unit.stats.boardPosition === action.actorPosition) as Hero;
    const tile = this.context.board!.getTileFromBoardPosition(action.targetPosition!);
    if (!hero || !tile) throw new Error('Missing hero or tile in spawn or move action');

    this.context.board!.units.push(hero);
    hero.setVisible(true).updateUnitAfterSpawn(tile);
    hand.removeFromHand(hero.stats.unitId);
  };

  replayMove(action: ITurnAction): void {
    const hero = this.context.board!.units.find(unit => unit instanceof Hero && unit.stats.boardPosition === action.actorPosition) as Hero;

    const tile = this.context.board!.getTileFromBoardPosition(action.targetPosition!);

    if (!hero || !tile) throw new Error('Missing hero or tile in spawn or move action');

    hero.move(hero.getTile(), tile);
  };

  async replayUnitAction(action: ITurnAction): Promise<void> {
    const hero = this.context.board!.units.find(unit => unit instanceof Hero && unit.stats.boardPosition === action.actorPosition) as Hero;
    const target = this.context.board!.units.find(unit => unit.stats.boardPosition === action.targetPosition);
    if (!hero || !target) throw new Error('Missing hero or target in attack or heal action');

    // VSCode says await has no effect on them, but it does work
    if (action.action === EActionType.ATTACK || action.action === EActionType.SPAWN_PHANTOM) await hero.attack(target);
    if (action.action === EActionType.HEAL) await hero.heal(target as Hero);
    if (action.action === EActionType.BUFF) await hero.shieldAlly(target);
    if (action.action === EActionType.TELEPORT) await hero.teleport(target as Hero);
  };

  async replayUse(action: ITurnAction, hand: Hand): Promise<void> {
    const item = hand.getHand().find(item => item.stats.boardPosition === action.actorPosition) as Item;
    if (!item) throw new Error('Missing item in use action');

    if (item.stats.dealsDamage) {
      const tile = this.context.board!.getTileFromBoardPosition(action.targetPosition!);
      if (!item) throw new Error('Missing tile in use action');
      await item.use(tile);
    }

    if (!item.stats.dealsDamage) {
      const hero = this.context.board!.units.find(unit => unit.stats.boardPosition === action.targetPosition);
      if (!hero) throw new Error('Missing target in use action');
      await item.use(hero);
    }
  }

  async replayShuffle(): Promise<void> {
    // const shuffleText = this.context.add.text(600, 350, 'OPPONENT SWAPPED AN ITEM!', {
    //   fontFamily: "proLight",
    //   fontSize: 50,
    //   color: '#fffb00'
    // }).setDepth(999);
    // // this.context.sound.play(EGameSounds.SHUFFLE);

    // await textAnimationSizeIncrease(shuffleText, 1.3);
  }

  replayDraw(hand: Hand, deck: Deck) {
    // this.sound.play(EGameSounds.DRAW);

    const drawAmount = 6 - hand!.getHandSize();
    if (deck!.getDeckSize() === 0 || drawAmount === 0) return;

    this.context.door!.openDoor();

    const drawnUnits = deck!.removeFromDeck(drawAmount);

    hand!.addToHand(drawnUnits, this.isPlayerTurn);

    if (this.isPlayerTurn) this.context.door?.updateBannerText();
  }
}
