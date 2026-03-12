import { EClass, EActionType, EGameSounds } from "../enums/gameEnums";
import { IHero, IItem, ITurnAction } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";
import { createNewHero, createNewItem } from "../utils/createUnit";
import { playSound } from "../utils/gameSounds";
import { textAnimationSizeIncrease } from "../utils/textAnimations";
import { Hero } from "./factions/hero";
import { Item } from "./factions/item";
import { GameController } from "./gameController";

export class TurnReplay {
  gameController: GameController;
  context: GameScene;

  constructor(gameController: GameController) {
    this.gameController = gameController;
    this.context = gameController.context;
  }

  async replayTurn() {
    const opponentHand = this.fakeOpponentHand();

    for (let i = 0; i < this.gameController.game.previousTurn.length; i++) {
      const turn = this.gameController.game.previousTurn[i];

      const actionsToIgnore = [EActionType.DRAW, EActionType.PASS];
      const actionTaken = turn.action?.action;

      if (!actionTaken || actionsToIgnore.includes(actionTaken)) continue;

      await new Promise<void>(resolve => {
        this.context.time.delayedCall(1000, async () => {
          if (actionTaken === EActionType.SPAWN) this.replaySpawn(turn.action!, opponentHand);
          if (actionTaken === EActionType.MOVE) this.replayMove(turn.action!);

          if (
            actionTaken === EActionType.ATTACK ||
            actionTaken === EActionType.HEAL ||
            actionTaken === EActionType.BUFF ||
            actionTaken === EActionType.TELEPORT ||
            actionTaken === EActionType.SPAWN_PHANTOM
          ) await this.replayUnitAction(turn.action!);

          if (actionTaken === EActionType.SHUFFLE) await this.replayShuffle();

          if (actionTaken === EActionType.USE) await this.replayUse(turn.action!, opponentHand);

          if (actionTaken === EActionType.REMOVE_UNITS) await this.gameController.removeKOUnits();

          resolve();
        });
      });
    }

    this.context.scene.restart({
      userId: this.context.userId,
      colyseusClient: this.context.colyseusClient,
      currentGame: this.context.currentGame,
      currentRoom: this.context.currentRoom,
      triggerReplay: false
      // gameOver: undefined // FIXME: is this used at all?
    } );
  }

  fakeOpponentHand(): (Hero | Item)[] {
    const opponentHand: (Hero | Item)[] = [];
    if (this.gameController.context.activePlayer === this.context.userId) {
      const opponentData = this.context.isPlayerOne ? this.gameController.lastTurnState.player2 : this.gameController.lastTurnState.player1;

      opponentData?.factionData.unitsInHand.forEach(unit => {
        if (unit.class === EClass.HERO) opponentHand.push(createNewHero(this.context, unit as IHero).setVisible(false).setInteractive(false));
        if (unit.class === EClass.ITEM ) opponentHand.push(createNewItem(this.context, unit as IItem).setVisible(false).setInteractive(false));
      });
    }

    return opponentHand;
  }

  replaySpawn(action: ITurnAction, opponentHand: (Hero | Item)[]): void {
    const actionTaken = action.action;
    const hand = opponentHand.length ? opponentHand : this.gameController.hand.hand;

    const hero = hand.find(unit => unit.stats.boardPosition === action.actorPosition) as Hero;

    const tile = this.gameController.board.getTileFromBoardPosition(action.targetPosition!);

    if (!hero || !tile) throw new Error('Missing hero or tile in spawn or move action');

    if (actionTaken === EActionType.SPAWN) hero.setVisible(true).spawn(tile);
  };

  replayMove(action: ITurnAction): void {
    const actionTaken = action.action;

    const hero = this.gameController.board.units.find(unit => unit.stats.boardPosition === action.actorPosition);

    const tile = this.gameController.board.getTileFromBoardPosition(action.targetPosition!);

    if (!hero || !tile) throw new Error('Missing hero or tile in spawn or move action');

    if (actionTaken === EActionType.MOVE) hero.move(tile);
    if (actionTaken === EActionType.SPAWN) hero.setVisible(true).spawn(tile);
  };

  async replayUnitAction(action: ITurnAction): Promise<void> {
    const hero = this.gameController.board.units.find(unit => unit.stats.boardPosition === action.actorPosition);
    const target = this.gameController.board.crystals.find(crystal => crystal.stats.boardPosition === action.targetPosition) ?? this.gameController.board.units.find(unit => unit.stats.boardPosition === action.targetPosition);
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
    playSound(this.context, EGameSounds.SHUFFLE);

    await textAnimationSizeIncrease(shuffleText, 1.3);
  }
}
