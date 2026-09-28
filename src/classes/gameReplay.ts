import { EActionClass, EActionType, EGameSceneMode } from "../enums/gameEnums";
import { IGame, IGameState, ITurnAction } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";
import UIScene from "../scenes/ui.scene";
import { Deck } from "./board/deck";
import { Hero } from "./factions/hero";
import { Item } from "./factions/item";
import { Hand } from "./hand";

export class GameReplay {
  context: UIScene;
  gameScene: GameScene;
  gameData: IGame;
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

  constructor(context: UIScene, gameScene: GameScene) {
    this.context = context;
    this.gameScene = gameScene;
    this.gameData = gameScene.clonedGame!;
    this.turnHistory = this.gameScene.clonedGame!.turnHistory!;
    this.isFirstPlayer = this.gameScene.firstPlayer === context.userId;
    this.isPlayerTurn = this.isFirstPlayer;

    this.addUiElements();
    this.replayAllTurns();
  }

  restartSceneOnTurn(turnNumber: number, actionNumber: number): void {
    this.context.scene.stop('GameScene');

    this.context.scene.launch('GameScene', {
      userId: this.context.userId,
      currentGame: this.gameData,
      startTurnState: this.gameData.turnHistory![turnNumber][actionNumber],
      gameSceneMode: EGameSceneMode.GAME_REPLAY
    });

    this.gameScene = this.context.scene.get('GameScene') as GameScene;

    this. gameScene.events.once(Phaser.Scenes.Events.CREATE, () => this.addUiElements());
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
    // TODO: is paused, change play icon or color
    if (!this.isPaused) this.replayAllTurns(); // FIXME: bug if we pause first then go to a specific turn
  }

  goToPreviousTurn(): void {
    if (!this.isPaused) this.togglePause();

    console.log('turnNumber previous turn', this.turnNumber);
    console.log('actionNumber previous turn', this.actionNumber);
    if (this.turnNumber - 1 <= 1) {
      this.goToFirst();
      return;
    }

    this.turnNumber -= 1;
    this.actionNumber = 0;

    const turnsToDialBack = this.actionNumber === 0 ? 1 : 0;
    this.restartSceneOnTurn(this.turnNumber - turnsToDialBack, this.turnHistory[this.turnNumber].length - 1);
  }

  goToNextTurn(): void {
    if (!this.isPaused) this.togglePause();
    if (this.turnNumber >= this.turnHistory.length - 1) {
      this.goToLast();
      return;
    }

    this.actionNumber = this.turnHistory[this.turnNumber].length - 1;
    this.restartSceneOnTurn(this.turnNumber, this.actionNumber);
  }

  goToLast(): void {
    if (!this.isPaused) this.togglePause();
    this.turnNumber = this.turnHistory.length - 1 ;
    this.actionNumber = this.turnHistory[this.turnNumber].length - 1;
    this.restartSceneOnTurn(this.turnNumber, this.actionNumber);
  }

  goToFirst(): void {
    if (!this.isPaused) this.togglePause();
    this.turnNumber = 1;
    this.actionNumber = 0;
    this.restartSceneOnTurn(0, this.actionNumber);
  }

  addUiElements(): void {
    this.actionNumberTextBox = this.gameScene.add.text(this.gameScene.turnNumberTextBox!.x, this.gameScene.turnNumberTextBox!.y + 30, `Action ${ this.actionNumber + 1 }`, {
      fontFamily: 'proLight',
      fontSize: 30,
      color: '#ffffff'
    });

    this.replayToggleButton = this.gameScene.add.image(900, 660, 'gameAtlas', 'replayButton').setScale(1.6).setInteractive({ useHandCursor: true }).setVisible(this.gameScene.gameSceneMode === EGameSceneMode.GAME_REPLAY);

    const replayButtonX = this.replayToggleButton.x;
    const replayButtonY = this.replayToggleButton.y;
    const separationX = 65;

    this.previousTurnButton = this.gameScene.add.image(replayButtonX - separationX, replayButtonY, 'gameAtlas', 'replayButton').setScale(1.3).setInteractive({ useHandCursor: true }).setVisible(this.gameScene.gameSceneMode === EGameSceneMode.GAME_REPLAY).setFlipX(true);
    this.firstTurnButton = this.gameScene.add.image(replayButtonX - separationX * 2, replayButtonY, 'gameAtlas', 'replayButton').setScale(1.6).setInteractive({ useHandCursor: true }).setVisible(this.gameScene.gameSceneMode === EGameSceneMode.GAME_REPLAY).setFlipX(true);

    this.nextTurnButton = this.gameScene.add.image(replayButtonX + separationX, replayButtonY, 'gameAtlas', 'replayButton').setScale(1.3).setInteractive({ useHandCursor: true }).setVisible(this.gameScene.gameSceneMode === EGameSceneMode.GAME_REPLAY);
    this.lastTurnButton = this.gameScene.add.image(replayButtonX + separationX * 2, replayButtonY, 'gameAtlas', 'replayButton').setScale(1.6).setInteractive({ useHandCursor: true }).setVisible(this.gameScene.gameSceneMode === EGameSceneMode.GAME_REPLAY);

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
  }

  async replayAllTurns() {
    for (let i = this.turnNumber; i <= this.turnHistory.length - 1; i++) {
      console.log('TURN', i);
      this.gameScene.turnNumberTextBox?.setText(`TURN ${i}`);

      this.isPlayerTurn = this.isFirstPlayer ? i % 2 !== 0 : i % 2 === 0;

      await this.replayTurn(this.turnHistory![i]);

      if (this.isPaused) break;
    }
  }

  async replayTurn(turn: IGameState[]) {
    const hand = this.isPlayerTurn ? this.gameScene.hand! : this.gameScene.opponentHand!;
    const deck = this.isPlayerTurn ? this.gameScene.deck! : this.gameScene.opponentDeck!;

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
  }

  async replayAction(turnAction: IGameState, hand: Hand, deck: Deck, actionNumber: number): Promise<void> {
    const actionTaken = turnAction.action?.action;
    await new Promise<void>(resolve => {
      this.gameScene.time.delayedCall(1000, async () => {
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
            await this.gameScene.removeKOUnits();
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
    const tile = this.gameScene.board!.getTileFromBoardPosition(action.targetPosition!);
    if (!hero || !tile) throw new Error('Missing hero or tile in spawn or move action');

    this.gameScene.board!.units.push(hero);
    hero.setVisible(true).updateUnitAfterSpawn(tile);
    hand.removeFromHand(hero.stats.unitId);
  };

  replayMove(action: ITurnAction): void {
    const hero = this.gameScene.board!.units.find(unit => unit instanceof Hero && unit.stats.boardPosition === action.actorPosition) as Hero;

    const tile = this.gameScene.board!.getTileFromBoardPosition(action.targetPosition!);

    if (!hero || !tile) throw new Error('Missing hero or tile in spawn or move action');

    hero.move(hero.getTile(), tile);
  };

  async replayUnitAction(action: ITurnAction): Promise<void> {
    const hero = this.gameScene.board!.units.find(unit => unit instanceof Hero && unit.stats.boardPosition === action.actorPosition) as Hero;
    const target = this.gameScene.board!.units.find(unit => unit.stats.boardPosition === action.targetPosition);
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
      const tile = this.gameScene.board!.getTileFromBoardPosition(action.targetPosition!);
      if (!item) throw new Error('Missing tile in use action');
      await item.use(tile);
    }

    if (!item.stats.dealsDamage) {
      const hero = this.gameScene.board!.units.find(unit => unit.stats.boardPosition === action.targetPosition);
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

    this.gameScene.door!.openDoor();

    const drawnUnits = deck!.removeFromDeck(drawAmount);

    hand!.addToHand(drawnUnits, this.isPlayerTurn);

    if (this.isPlayerTurn) this.gameScene.door?.updateBannerText();
  }
}
