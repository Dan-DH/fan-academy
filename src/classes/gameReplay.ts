import { EClass, EActionType } from "../enums/gameEnums";
import { IGame, IGameState, IHeroBE, IItemBE, ITurnAction } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";
import { createNewHero, createNewItem } from "../utils/createUnit";
import { textAnimationSizeIncrease } from "../utils/textAnimations";
import { Hero } from "./factions/hero";
import { Item } from "./factions/item";
import { GameController } from "./gameController";

export class GameReplay {
  gameController: GameController;
  context: GameScene;
  lastActionState: IGameState | undefined;

  constructor(gameController: GameController) {
    this.gameController = gameController;
    this.context = gameController.context;
  }

  async replayAllTurns() {
    for (let i = 0; i <= this.gameController.turnHistory!.length - 1; i++) {
      console.log('TURN', i);
      await this.replayTurn(this.gameController.turnHistory![i], i);
    }
  }

  async replayTurn(turn: IGameState[], turnNumber: number) {
    const hand = this.fakeHand(turnNumber);

    for (let i = 0; i <= turn.length - 1; i++) {
      const action = turn[i];

      console.log('action', i, turn);
      console.log('action.action', action.action);

      const actionsToIgnore = [EActionType.DRAW, EActionType.PASS];

      if (!action.action) continue;
      const actionTaken = action.action?.action;

      if (!actionTaken || actionsToIgnore.includes(actionTaken)) continue;

      await new Promise<void>(resolve => {
        this.context.time.delayedCall(1000, async () => {
          if (actionTaken === EActionType.SPAWN) this.replaySpawn(action.action!, hand);
          if (actionTaken === EActionType.MOVE) this.replayMove(action.action!);

          if (
            actionTaken === EActionType.ATTACK ||
            actionTaken === EActionType.HEAL ||
            actionTaken === EActionType.BUFF ||
            actionTaken === EActionType.TELEPORT ||
            actionTaken === EActionType.SPAWN_PHANTOM
          ) await this.replayUnitAction(action.action!);

          if (actionTaken === EActionType.SHUFFLE) await this.replayShuffle();

          if (actionTaken === EActionType.USE) await this.replayUse(action.action!, hand);

          if (actionTaken === EActionType.REMOVE_UNITS) await this.gameController.removeKOUnits();

          resolve();
        });
      });

      this.lastActionState = turn[i];
    }

    // this.context.scene.restart({
    //   userId: this.context.userId,
    //   currentGame: this.context.currentGame,
    //   triggerReplay: false
    // } );
  }

  fakeHand(turnNumber: number): (Hero | Item)[] {
    const { context, turnHistory } = this.gameController;

    const isFirstPlayer = context.firstPlayer === context.userId;
    const isPlayerTurn = isFirstPlayer ? turnNumber % 2 !== 0 : turnNumber % 2 === 0;
    const turnData = turnHistory?.[turnNumber > 0 ? turnNumber - 1 : turnNumber]?.[0];
    const targetData = isPlayerTurn
      ? context.isPlayerOne ? turnData?.player1 : turnData?.player2
      : context.isPlayerOne ? turnData?.player2 : turnData?.player1;

    const hand: (Hero | Item)[] = [];
    targetData?.hand.forEach(unit => {
      console.log('fakehand', unit);
      if (unit.class === EClass.HERO) hand.push(createNewHero(unit as IHeroBE).setVisible(false).setInteractive(false));
      if (unit.class === EClass.ITEM ) hand.push(createNewItem(unit as IItemBE).setVisible(false).setInteractive(false));
    });

    return hand;
  }

  replaySpawn(action: ITurnAction, hand: (Hero | Item)[]): void {
    const hero = hand.find(unit => unit.stats.boardPosition === action.actorPosition) as Hero;

    console.log('replay hand', hand);

    const tile = this.gameController.board.getTileFromBoardPosition(action.targetPosition!);

    console.log('replaySpawn action', action);
    console.log('replaySpawn hero', hero);
    console.log('replaySpawn tile', tile);

    if (!hero || !tile) throw new Error('Missing hero or tile in spawn or move action');

    hero.setVisible(true).spawn(tile);
  };

  replayMove(action: ITurnAction): void {
    const actionTaken = action.action;

    const hero = this.gameController.board.units.find(unit => unit instanceof Hero && unit.stats.boardPosition === action.actorPosition) as Hero;

    const tile = this.gameController.board.getTileFromBoardPosition(action.targetPosition!);

    if (!hero || !tile) throw new Error('Missing hero or tile in spawn or move action');

    if (actionTaken === EActionType.MOVE) hero.move(hero.getTile(), tile);
    if (actionTaken === EActionType.SPAWN) hero.setVisible(true).spawn(tile);
  };

  async replayUnitAction(action: ITurnAction): Promise<void> {
    const hero = this.gameController.board.units.find(unit => unit instanceof Hero && unit.stats.boardPosition === action.actorPosition) as Hero;
    const target = this.gameController.board.units.find(unit => unit.stats.boardPosition === action.targetPosition);
    if (!hero || !target) throw new Error('Missing hero or target in attack or heal action');

    // VSCode says await has no effect on them, but it does work
    if (action.action === EActionType.ATTACK || action.action === EActionType.SPAWN_PHANTOM) await hero.attack(target);
    if (action.action === EActionType.HEAL) await hero.heal(target as Hero);
    if (action.action === EActionType.BUFF) await hero.shieldAlly(target);
    if (action.action === EActionType.TELEPORT) await hero.teleport(target as Hero);
  };

  async replayUse(action: ITurnAction, opponentHand: (Hero | Item)[]): Promise<void> {
    const hand = opponentHand.length ? opponentHand : this.gameController.hand.hand;

    const item = hand.find(item => item.stats.boardPosition === action.actorPosition) as Item;
    if (!item) throw new Error('Missing item in use action');

    if (item.stats.dealsDamage) {
      const tile = this.gameController.board.getTileFromBoardPosition(action.targetPosition!);
      if (!item) throw new Error('Missing tile in use action');
      await item.use(tile);
    }

    if (!item.stats.dealsDamage) {
      const hero = this.gameController.board.units.find(unit => unit.stats.boardPosition === action.targetPosition);
      if (!hero) throw new Error('Missing target in use action');
      await item.use(hero);
    }
  }

  async replayShuffle(): Promise<void> {
    const shuffleText = this.context.add.text(600, 350, 'OPPONENT SWAPPED AN ITEM!', {
      fontFamily: "proLight",
      fontSize: 50,
      color: '#fffb00'
    }).setDepth(999);
    // this.context.sound.play(EGameSounds.SHUFFLE);

    await textAnimationSizeIncrease(shuffleText, 1.3);
  }

  replayDraw(hand: (Hero | Item)[], deck: (IHeroBE | IItemBE)[]): void {
    const drawAmount = 6 - hand.length;
    if (deck.length === 0 || drawAmount === 0) return;

    this.gameController.door.openDoor();

    const drawnUnits = deck.splice(0, drawAmount);

    this.gameController.hand.addToHand(drawnUnits);
  }
}
