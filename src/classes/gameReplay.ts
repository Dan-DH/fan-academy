import { EActionType, EGameSceneMode } from "../enums/gameEnums";
import { IGame, IGameState, ITurnAction } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";
import UIScene from "../scenes/ui.scene";
import { Deck } from "./board/deck";
import { Pulverizer } from "./factions/dwarves/items";
import { Hero } from "./factions/hero";
import { Item } from "./factions/item";
import { Hand } from "./hand";

export class GameReplay {
  context: UIScene;
  gameScene: GameScene;
  gameData: IGame;
  turnHistory: IGameState[][];
  isPaused = false;
  isFirstPlayer: boolean;
  isPlayerTurn: boolean;

  replayToggleButton!: Phaser.GameObjects.Image;
  nextTurnButton!: Phaser.GameObjects.Image;
  lastTurnButton!: Phaser.GameObjects.Image;
  previousTurnButton!: Phaser.GameObjects.Image;
  firstTurnButton!: Phaser.GameObjects.Image;
  nextActionButton!: Phaser.GameObjects.Image;
  previousActionButton!: Phaser.GameObjects.Image;
  handSwitchButton!: Phaser.GameObjects.Image;

  constructor(context: UIScene, gameScene: GameScene) {
    this.context = context;
    this.gameScene = gameScene;
    this.gameData = gameScene.clonedGame!;
    this.turnHistory = this.gameScene.registry.get('FullGameReplay');
    this.isFirstPlayer = this.gameScene.firstPlayer === context.userId;
    this.isPlayerTurn = this.isFirstPlayer;
    this.addUiElements();
  }

  restartSceneOnTurn(turnNumber: number, currentTurnAction: number): void {
    this.isPaused = true;
    this.context.scene.stop('GameScene');

    this.context.scene.launch('GameScene', {
      userId: this.context.userId,
      currentGame: this.context.activeGame,
      startTurnState: this.turnHistory[Math.min(turnNumber, this.turnHistory.length - 1)][0], // does turnhistory include
      turnNumber,
      currentTurnAction,
      gameSceneMode: EGameSceneMode.GAME_REPLAY
    });

    this. gameScene.events.once(Phaser.Scenes.Events.CREATE, () => {
      this.gameScene = this.context.scene.get('GameScene') as GameScene;
      this.addUiElements();
    });
  }

  // TODO: is paused, change play icon or color
  togglePause(): void {
    this.isPaused = !this.isPaused;
    if (!this.isPaused) this.replayAllTurns(); // FIXME: bug if we pause first then go to a specific turn
  }

  goToPreviousTurn(): void {
    this.restartSceneOnTurn(Math.max(this.gameScene.turnNumber! - 1, 1), 1);
  }

  goToNextTurn(): void {
    this.restartSceneOnTurn(Math.min(this.gameScene.turnNumber! + 1, this.turnHistory.length), 1);
  }

  goToLast(): void {
    this.restartSceneOnTurn(this.turnHistory.length, 1);
  }

  goToFirst(): void {
    this.restartSceneOnTurn(1, 1);
  }

  addUiElements(): void {
    this.replayToggleButton = this.gameScene.add.image(900, 660, 'gameAtlas', 'replayButton').setScale(1.6).setInteractive({ useHandCursor: true }).setVisible(this.gameScene.gameSceneMode === EGameSceneMode.GAME_REPLAY);

    const replayButtonX = this.replayToggleButton.x;
    const replayButtonY = this.replayToggleButton.y;
    const separationX = 65;

    this.previousTurnButton = this.gameScene.add.image(replayButtonX - separationX, replayButtonY, 'gameAtlas', 'replayButton').setScale(1.3).setInteractive({ useHandCursor: true }).setVisible(this.gameScene.gameSceneMode === EGameSceneMode.GAME_REPLAY).setFlipX(true);
    this.firstTurnButton = this.gameScene.add.image(replayButtonX - separationX * 2, replayButtonY, 'gameAtlas', 'UI_FFButton-hd').setScale(1.3).setInteractive({ useHandCursor: true }).setVisible(this.gameScene.gameSceneMode === EGameSceneMode.GAME_REPLAY).setFlipX(true);

    this.nextTurnButton = this.gameScene.add.image(replayButtonX + separationX, replayButtonY, 'gameAtlas', 'replayButton').setScale(1.3).setInteractive({ useHandCursor: true }).setVisible(this.gameScene.gameSceneMode === EGameSceneMode.GAME_REPLAY);
    this.lastTurnButton = this.gameScene.add.image(replayButtonX + separationX * 2, replayButtonY, 'gameAtlas', 'UI_FFButton-hd').setScale(1.3).setInteractive({ useHandCursor: true }).setVisible(this.gameScene.gameSceneMode === EGameSceneMode.GAME_REPLAY);

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
      this.goToPreviousTurn();
    });
    this.nextTurnButton.on('pointerdown', () => {
      // context.sound.play(EUiSounds.BUTTON_GENERIC);
      console.log('nextTurnButton clicked');
      this.goToNextTurn();
    });
    this.lastTurnButton.on('pointerdown', () => {
      // context.sound.play(EUiSounds.BUTTON_GENERIC);
      console.log('lastTurnButton clicked');
      this.goToLast();
    });

    this.handSwitchButton = this.gameScene.add.image(1200, 720, 'gameAtlas', 'UI_RefreshButton-hd').setScale(1.3).setInteractive({ useHandCursor: true }).setVisible(this.gameScene.gameSceneMode === EGameSceneMode.GAME_REPLAY);
    this.handSwitchButton.on('pointerdown', () => {
      this.gameScene.hand!.isVisible = !this.gameScene.hand!.isVisible;
      this.gameScene.hand!.hand.forEach(u => u.setVisible(!u.visible));

      this.gameScene.opponentHand!.isVisible = !this.gameScene.hand!.isVisible;
      this.gameScene.opponentHand!.hand.forEach(u => u.setVisible(!u.visible));
    });
  }

  async replayAllTurns() {
    for (let i = this.gameScene.turnNumber!; i <= this.turnHistory.length - 1; i++) {
      console.log('TURN NUMBER', i, this.turnHistory[i]);

      this.gameScene.turnNumberTextBox?.setText(`TURN ${i}`);

      this.isPlayerTurn = i % 2 !== 0 === this.isFirstPlayer;

      await this.replayTurn(this.turnHistory[i]);

      if (this.isPaused) break;
    }
  }

  async replayTurn(turn: IGameState[]) {
    const hand = this.isPlayerTurn ? this.gameScene.hand! : this.gameScene.opponentHand!;
    const deck = this.isPlayerTurn ? this.gameScene.deck! : this.gameScene.opponentDeck!;

    for (let i = this.gameScene.currentTurnAction!; i <= turn.length - 1; i++) {
      const turnAction = turn[i];

      console.log('turn: ', this.gameScene.currentTurnAction, ' action number: ', i, 'pTurn: ', this.isPlayerTurn, turnAction.action?.action, turnAction.action?.actorPosition, turnAction.action?.targetPosition);

      if (!turnAction.action?.action) continue;

      await this.replayAction(turnAction, hand, deck, i);

      if (this.isPaused) return;
    }

    this.gameScene.turnNumber!++;
    this.gameScene.actionPie?.resetActionPie();
    this.gameScene.currentTurnAction = 1;
  }

  async replayAction(turnAction: IGameState, hand: Hand, deck: Deck, _actionNumber: number): Promise<void> {
    const actionTaken = turnAction.action?.action;
    if (!actionTaken) throw new Error('gameReplay(): no action found ' + actionTaken);
    const actionDelay = 1000;

    const replayActionMap = {
      [EActionType.SPAWN]: () => this.replaySpawn(turnAction.action!, hand),
      [EActionType.MOVE]: () => this.replayMove(turnAction.action!),
      [EActionType.ATTACK]: () => this.replayUnitAction(turnAction.action!),
      [EActionType.HEAL]: () => this.replayUnitAction(turnAction.action!),
      [EActionType.BUFF]: () => this.replayUnitAction(turnAction.action!),
      [EActionType.TELEPORT]: () => this.replayUnitAction(turnAction.action!),
      [EActionType.SPAWN_PHANTOM]: () => this.replayUnitAction(turnAction.action!),
      [EActionType.SHUFFLE]: ()=> this.replayShuffle(),
      [EActionType.USE]: () => this.replayUse(turnAction.action!, hand),
      [EActionType.DRAW]: () => this.replayDraw(hand, deck),
      [EActionType.REMOVE_UNITS]: () => this.gameScene.removeKOUnits(),
      [EActionType.PASS]: () => console.log('Implement pass?'),
      [EActionType.CONCEDE]: () => console.log('Implement concede?')
    };

    await new Promise<void>(resolve => {
      this.gameScene.time.delayedCall(actionDelay, async () => {
        replayActionMap[actionTaken]();
        resolve();
      });
    });
  }

  replaySpawn(action: ITurnAction, hand: Hand): void {
    console.log('hand', hand);
    const hero = hand.getHand().find(unit => unit.stats.boardPosition === action.actorPosition) as Hero;
    const tile = this.gameScene.board!.getTileFromBoardPosition(action.targetPosition!);
    if (!hero || !tile) throw new Error('Missing hero or tile in spawn or move action');

    console.log('hero', hero);

    hero.spawn(tile);
  };

  replayMove(action: ITurnAction): void {
    const hero = this.gameScene.board!.units.find(unit => unit instanceof Hero && unit.stats.boardPosition === action.actorPosition) as Hero;

    const tile = this.gameScene.board!.getTileFromBoardPosition(action.targetPosition!);

    if (!hero || !tile) throw new Error('Missing hero or tile in spawn or move action');

    hero.move(hero.getTile(), tile);
  };

  replayUnitAction(action: ITurnAction): void {
    const hero = this.gameScene.board!.units.find(unit => unit instanceof Hero && unit.stats.boardPosition === action.actorPosition) as Hero;
    const target = this.gameScene.board!.units.find(unit => unit.stats.boardPosition === action.targetPosition);
    if (!hero || !target) throw new Error('Missing hero or target in attack or heal action');

    // VSCode says await has no effect on them, but it does work
    if (action.action === EActionType.ATTACK || action.action === EActionType.SPAWN_PHANTOM) hero.attack(target);
    if (action.action === EActionType.HEAL) hero.heal(target as Hero);
    if (action.action === EActionType.BUFF) hero.shieldAlly(target);
    if (action.action === EActionType.TELEPORT) hero.teleport(target as Hero);
  };

  replayUse(action: ITurnAction, hand: Hand): void {
    const item = hand.getHand().find(item => item.stats.boardPosition === action.actorPosition) as Item;
    console.log('item is found: ', item.stats.unitId);
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

  replayShuffle(): void {
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

    console.log('handSize pre-draw', hand.getHandSize(), hand);
    const drawAmount = 6 - hand!.getHandSize();
    if (deck!.getDeckSize() === 0 || drawAmount === 0) return;

    this.gameScene.door!.openDoor();

    const drawnUnits = deck!.removeFromDeck(drawAmount);
    console.log('drawnUnits', drawnUnits);

    hand!.addToHand(drawnUnits, this.isPlayerTurn);

    console.log('handAfterDrawing', hand);

    if (this.isPlayerTurn) this.gameScene.door?.updateBannerText();
  }
}
