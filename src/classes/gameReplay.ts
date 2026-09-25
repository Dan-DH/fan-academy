import { EActionType, EGameSceneMode } from "../enums/gameEnums";
import { IGameState, ITurnAction } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";
import { Deck } from "./board/deck";
import { Hero } from "./factions/hero";
import { Item } from "./factions/item";
import { Hand } from "./hand";

export class GameReplay {
  context: GameScene;
  turnHistory: IGameState[][];

  turnNumber = 0;
  actionNumber = 0;
  isPaused = false;
  isFirstPlayer: boolean;
  isPlayerTurn: boolean;

  replayToggleButton;

  constructor(context: GameScene) {
    this.context = context;
    this.turnHistory = context.currentGame! .turnHistory!;

    ////
    ////
    this.replayToggleButton = context.add.image(460, 200, 'gameAtlas', 'replayButton').setScale(1.6).setInteractive({ useHandCursor: true }).setVisible(context.gameSceneMode === EGameSceneMode.GAME_REPLAY);

    this.replayToggleButton.on('pointerdown', () => {
      // context.sound.play(EUiSounds.BUTTON_GENERIC);
      this.togglePause();
    });
    ////
    ////

    this.isFirstPlayer = context.firstPlayer === context.userId;
    this.isPlayerTurn = this.isFirstPlayer;

    this.replayAllTurns();
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
    if (!this.isPaused) this.replayAllTurns();
  }

  changeTurn(n: number): void {
    this.togglePause();
    this.turnNumber += n; // if negative we go back one turn
    this.actionNumber = 0;
    this.togglePause();
  }

  goToLast(): void {
    this.togglePause();
    this.turnNumber = this.turnHistory.length;
    this.actionNumber = 0;
    this.togglePause();
  }

  goToFirst(): void {
    this.togglePause();
    this.turnNumber = 0;
    this.actionNumber = 0;
    this.togglePause();
  }

  async replayAllTurns() {
    for (let i = this.turnNumber; i <= this.turnHistory.length - 1; i++) {
      console.log('TURN', i);

      this.isPlayerTurn = this.isFirstPlayer ? i % 2 !== 0 : i % 2 === 0;

      await this.replayTurn(this.turnHistory![i]);

      if (this.isPaused) break;

      this.turnNumber++;
    }
  }

  async replayTurn(turn: IGameState[]) {
    const hand = this.isPlayerTurn ? this.context.hand! : this.context.opponentHand!;
    const deck = this.isPlayerTurn ? this.context.deck! : this.context.opponentDeck!;

    for (let i = this.actionNumber; i <= turn.length - 1; i++) {
      const turnAction = turn[i];

      console.log('turnAction.action', turnAction.action);
      console.log('turnAction number, ', i);

      if (!turnAction.action) continue;
      const actionTaken = turnAction.action.action;

      await new Promise<void>(resolve => {
        this.context.time.delayedCall(1000, async () => {
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

      if (this.actionNumber === turn.length - 1) {
        this.actionNumber = 0;
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

  replaySpawn(action: ITurnAction, hand: Hand): void {
    const hero = hand.getHand().find(unit => unit.stats.boardPosition === action.actorPosition) as Hero;
    const tile = this.context.board!.getTileFromBoardPosition(action.targetPosition!);
    if (!hero || !tile) throw new Error('Missing hero or tile in spawn or move action');

    hand.removeFromHand(hero.stats.unitId);
    this.context.board!.units.push(hero);
    hero.setVisible(true).updateUnitAfterSpawn(tile);
  };

  replayMove(action: ITurnAction): void {
    const hero = this.context.board!.units.find(unit => unit instanceof Hero && unit.stats.boardPosition === action.actorPosition) as Hero;

    console.log('Hero movement', hero);

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
    console.log('hand', hand);
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
