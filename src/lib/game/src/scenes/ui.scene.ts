import { IGame } from "../interfaces/gameInterface";
import { createGameList } from "./gameSceneUtils/gameList";
import { createWarningComponent } from "./uiSceneUtils/disconnectWarning";
import { HomeButton } from "../classes/buttons/homeButton";

export const backgroundMusicInstance: Phaser.Sound.BaseSound | null = null;

export default class UIScene extends Phaser.Scene {
  userId!: string;
  gameListContainer: Phaser.GameObjects.Container | undefined;
  gameList: IGame[] | undefined;

  gameScene: Phaser.Scene | undefined;

  // Used to highlight the active game in the game list
  activeGameImage: Phaser.GameObjects.Image | undefined;
  activeGame: string | undefined;

  // There is limit of 50 active games per player. Games currently playing, searching for players and open challenges all count towards the limit
  activeGamesAmountLimit = 50;
  activeGamesAmount = 0;

  constructor() {
    super({ key: 'UIScene' });
  }

  init() {
    this.userId = this.registry.get('userId');
    this.gameListContainer = undefined;
    this.gameList = undefined;
    this.gameScene = undefined;
    this.activeGameImage = undefined;
    this.activeGame = undefined;
  }

  async create() {
    createWarningComponent(this);

    this.add.image(0, 0, 'loadingScreen').setOrigin(0).setScale(2.8);

    // UI background
    this.add.image(0, 0, 'uiBackground').setOrigin(0);

    // Create the game list UI
    createGameList();

    new HomeButton(this);

    // Background game screen
    this.add.image(397, 15, 'gameBackground').setOrigin(0, 0).setScale(1.06, 1.2);
  }

  onShutdown() {
    // this.sound.stopAll();
  }
}