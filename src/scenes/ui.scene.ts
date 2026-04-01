import { Client, Room } from "colyseus.js";
import { connectToGameLobby } from "../colyseus/colyseusLobbyRoom";
import { EFaction } from "../enums/gameEnums"; // Import EGameSounds
import { IGame } from "../interfaces/gameInterface";
import { getGameList } from "../queries/gameQueries";
import { createGameList } from "./gameSceneUtils/gameList";
import { CDN_PATH } from "./preloader.scene";
import { profilePicNames } from "./profileSceneUtils/profilePicNames";
import { createWarningComponent } from "./uiSceneUtils/disconnectWarning";
import { HomeButton } from "../classes/buttons/homeButton";

export const backgroundMusicInstance: Phaser.Sound.BaseSound | null = null;

export default class UIScene extends Phaser.Scene {
  colyseusClient: Client;
  lobbyRoom: Room | undefined;
  userId!: string;
  gameListContainer: Phaser.GameObjects.Container | undefined;
  gameList: IGame[] | undefined;

  currentRoom: Room | undefined;
  gameScene: Phaser.Scene | undefined;

  // Used to highlight the active game in the game list
  activeGameImage: Phaser.GameObjects.Image | undefined;
  activeGameImageId: string | undefined;

  // There is limit of 50 active games per player. Games currently playing, searching for players and open challenges all count towards the limit
  activeGamesAmountLimit = 50;
  activeGamesAmount = 0;

  constructor() {
    super({ key: 'UIScene' });
    this.colyseusClient = new Client(`${import.meta.env.VITE_SOCKET}`);
  }

  init(data: { userId: string, }) {
    this.userId = data.userId;
  }

  preload() {
    // faction emblems
    this.load.image(EFaction.COUNCIL, `${CDN_PATH}/ui/council_emblem.webp`);
    this.load.image(EFaction.DARK_ELVES, `${CDN_PATH}/ui/elves_emblem.webp`);
    this.load.image(EFaction.DWARVES, `${CDN_PATH}/ui/dwarves_emblem.webp`);

    // ranked icon
    this.load.image('runeMetal', `${CDN_PATH}/images/factions/common/rune_metal.webp`);

    // profile pictures
    profilePicNames.forEach(name => {
      this.load.image(name, `${CDN_PATH}/images/profilePics/${name}.webp`);
    });

    // UI
    this.load.image('gameListButton', `${CDN_PATH}/ui/game_list_premade.webp`);
    this.load.image('newGameButton', `${CDN_PATH}/ui/new_game_btn.webp`);
    this.load.image('unknownFaction', `${CDN_PATH}/ui/unknown_faction.webp`);
    this.load.image('unknownOpponent', `${CDN_PATH}/images/profilePics/unknownAvatar-hd.webp`);
    this.load.image('closeButton', `${CDN_PATH}/ui/close_button.webp`);
    this.load.image('concedeButton', `${CDN_PATH}/ui/concede_button.webp`);

    this.load.html('disconnectWarning', 'html/disconnectWarning.html');

    this.load.audio('deleteGameSound', `${CDN_PATH}/audio/ui/deleteGame.mp3`);
  }

  async create() {
    this.time.addEvent({
      delay: 300000, // 5 minutes
      callback: () => {
        this.lobbyRoom!.send("ping");
      },
      loop: true
    });

    createWarningComponent(this);

    this.add.image(0, 0, 'loadingScreen').setOrigin(0).setScale(2.8);

    // Connect to lobby and get the list of games
    this.lobbyRoom = await connectToGameLobby(this.colyseusClient, this.userId, this);
    this.gameList = await getGameList(this.userId);

    // UI background
    this.add.image(0, 0, 'uiBackground').setOrigin(0);

    // Create the game list UI
    await createGameList(this);

    new HomeButton(this);

    // Background game screen
    this.add.image(397, 15, 'gameBackground').setOrigin(0, 0).setScale(1.06, 1.2);
  }

  onShutdown() {
    this.sound.stopAll();
  }
}