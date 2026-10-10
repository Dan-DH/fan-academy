import { EActionClass, EActionType } from "../enums/gameEnums";
import { IGameState, IPlayerState, ITurnHistoryAction, ITurnHistoryElement } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";
import UIScene from "../scenes/ui.scene";
import { getPlayersKey } from "../utils/playerUtils";
import { Deck } from "./board/deck";
import { Pulverizer } from "./factions/dwarves/items";
import { Hero } from "./factions/hero";
import { Item } from "./factions/item";
import { Hand } from "./hand";

export class MapGameReplay {
  context: UIScene;
  gameScene: GameScene;
  turnHistory: ITurnHistoryElement[];
  isFirstPlayer: boolean;
  isPlayerTurn: boolean;
  fullGameReplay: IGameState[][] = [];

  constructor(context: UIScene, gameScene: GameScene) {
    this.context = context;
    this.gameScene = gameScene;
    this.turnHistory = this.gameScene.clonedGame!.turnHistory!;
    this.isFirstPlayer = this.gameScene.firstPlayer === context.userId;
    this.isPlayerTurn = this.isFirstPlayer;
  }

  async mapFullReplay(): Promise<void> {
    this.gameScene.skipAnimations = true;
    this.gameScene.sys.setVisible(false);
    this.fullGameReplay.push([structuredClone(this.gameScene.startTurnState!)]);

    for (let i = 0; i <= this.turnHistory.length - 1; i++) {
      this.isPlayerTurn = i % 2 === 0 === this.isFirstPlayer;
      await this.replayTurn(this.turnHistory[i]);
    }

    console.log('full replay', this.fullGameReplay);
    this.gameScene.registry.set('FullGameReplay', this.fullGameReplay);
    this.gameScene.scene.stop();
  }

  async replayAllTurns() {
    for (let i = 0; i <= this.turnHistory.length - 1; i++) {
      console.log('TURN', i);

      this.isPlayerTurn = i % 2 === 0 === this.isFirstPlayer;

      await this.replayTurn(this.turnHistory[i]);
    }
  }

  async replayTurn(turn: ITurnHistoryElement) {
    const hand = this.isPlayerTurn ? this.gameScene.hand! : this.gameScene.opponentHand!;
    const deck = this.isPlayerTurn ? this.gameScene.deck! : this.gameScene.opponentDeck!;

    for (let i = 0; i <= turn.actions.length - 1; i++) {
      const turnAction = turn.actions[i];
      if (!turnAction.actionType) continue;

      await this.replayAction(turnAction, hand, deck);

      if (i === turn.actions.length - 1) {
        const previousTurn = this.fullGameReplay[this.fullGameReplay.length - 1];
        this.gameScene.currentTurn?.unshift(previousTurn[previousTurn.length - 1]);
        this.fullGameReplay.push(this.gameScene.currentTurn!);
        this.gameScene.currentTurn = [];
      }
    }
  }

  async replayAction(turnAction: ITurnHistoryAction, hand: Hand, deck: Deck): Promise<void> {
    const actionTaken = turnAction.actionType;

    const replayActionMap = {
      [EActionType.SPAWN]: () => this.replaySpawn(turnAction, hand),
      [EActionType.MOVE]: () => this.replayMove(turnAction),
      [EActionType.ATTACK]: () => this.replayUnitAction(turnAction),
      [EActionType.HEAL]: () => this.replayUnitAction(turnAction),
      [EActionType.BUFF]: () => this.replayUnitAction(turnAction),
      [EActionType.TELEPORT]: () => this.replayUnitAction(turnAction),
      [EActionType.SPAWN_PHANTOM]: () => this.replayUnitAction(turnAction),
      [EActionType.SHUFFLE]: ()=> this.replayShuffle(turnAction.actorPosition!, hand, deck),
      [EActionType.USE]: () => this.replayUse(turnAction, hand),
      [EActionType.DRAW]: () => this.replayDraw(hand, deck),
      [EActionType.REMOVE_UNITS]: () => this.gameScene.removeKOUnits(),
      [EActionType.PASS]: () => console.log('User passed'),
      [EActionType.CONCEDE]: () => console.log('User conceded')
    };

    replayActionMap[actionTaken]();
  }

  replaySpawn(action: ITurnHistoryAction, hand: Hand): void {
    const hero = hand.getHand().find(unit => unit.stats.boardPosition === action.actorPosition) as Hero;
    const tile = this.gameScene.board!.getTileFromBoardPosition(action.targetPosition!);
    if (!hero || !tile) throw new Error('Missing hero or tile in spawn or move action');

    hero.spawn(tile);
  };

  replayMove(action: ITurnHistoryAction): void {
    const hero = this.gameScene.board!.units.find(unit => unit instanceof Hero && unit.stats.boardPosition === action.actorPosition) as Hero;

    const tile = this.gameScene.board!.getTileFromBoardPosition(action.targetPosition!);

    if (!hero || !tile) throw new Error('Missing hero or tile in spawn or move action');

    hero.move(hero.getTile(), tile);
  };

  replayUnitAction(action: ITurnHistoryAction): void {
    const hero = this.gameScene.board!.units.find(unit => unit instanceof Hero && unit.stats.boardPosition === action.actorPosition) as Hero;
    const target = this.gameScene.board!.units.find(unit => unit.stats.boardPosition === action.targetPosition);
    if (!hero || !target) throw new Error('Missing hero or target in attack or heal action');

    // VSCode says await has no effect on them, but it does work
    if (action.actionType === EActionType.ATTACK || action.actionType === EActionType.SPAWN_PHANTOM) hero.attack(target);
    if (action.actionType === EActionType.HEAL) hero.heal(target as Hero);
    if (action.actionType === EActionType.BUFF) hero.shieldAlly(target);
    if (action.actionType === EActionType.TELEPORT) hero.teleport(target as Hero);
  };

  replayUse(action: ITurnHistoryAction, hand: Hand): void {
    const item = hand.getHand().find(item => item.stats.boardPosition === action.actorPosition) as Item;
    if (!item) throw new Error('Missing item in use action');

    if (item.stats.dealsDamage) {
      const target = item instanceof Pulverizer ? this.gameScene.board!.units.find(u => u.stats.boardPosition === action.targetPosition) : this.gameScene.board!.getTileFromBoardPosition(action.targetPosition!);
      if (!item) throw new Error('Missing tile in use action');
      item.use(target);
    }

    if (!item.stats.dealsDamage) {
      const hero = this.gameScene.board!.units.find(unit => unit.stats.boardPosition === action.targetPosition);
      if (!hero) throw new Error('Missing target in use action');
      item.use(hero);
    }
  }

  replayShuffle(actorPosition: number, hand: Hand, deck: Deck): void {
    const unitToShuffle = hand.getHandElementByBoardPosition(actorPosition!);
    if (!unitToShuffle) {
      console.error('replayShuffle() no hand element for boardPosition ' + actorPosition);
      return;
    }
    unitToShuffle.shuffleInDeck();

    this.replayAddToState(EActionType.SHUFFLE, EActionClass.USER, actorPosition, 51);
  }

  replayDraw(hand: Hand, deck: Deck) {
    const drawAmount = 6 - hand!.getHandSize();
    if (deck!.getDeckSize() === 0 || drawAmount === 0) return;
    const drawnUnits = deck!.removeFromDeck(drawAmount);
    hand!.addToHand(drawnUnits);

    this.replayAddToState(EActionType.DRAW, EActionClass.AUTO);
  }

  replayAddToState(action: EActionType, actionClass: EActionClass, actorPosition?: number, targetPosition?: number): void {
    const { player, opponent } = getPlayersKey(this.gameScene);

    const playerState: IPlayerState = {
      playerId: this.gameScene[player]!.playerId,
      hand: this.gameScene.hand!.exportHandData(),
      deck: this.gameScene.deck!.getDeck()
    };

    const opponentState: IPlayerState = {
      playerId: this.gameScene[opponent]!.playerId,
      hand: this.gameScene.opponentHand!.exportHandData(),
      deck: this.gameScene.opponentDeck!.getDeck()
    };

    this.gameScene.currentTurn!.push({
      player1: this.gameScene.isPlayerOne ? playerState : opponentState!,
      player2: !this.gameScene.isPlayerOne ? playerState : opponentState!,
      action: {
        actionClass,
        action,
        actorPosition,
        targetPosition
      },
      boardState: this.gameScene.board!.getBoardState()
    });
  }
}
