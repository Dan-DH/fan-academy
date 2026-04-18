import { Client, Room } from "colyseus.js";
import { connectToGameLobby } from "../colyseus/colyseusLobbyRoom";
import { EFaction } from "../enums/gameEnum"; // Import EGameSounds
import { Coordinates, IGame } from "../interfaces/gameInterface";
import { CDN_PATH } from "./preloader.scene";
import { profilePicNames } from "./profileSceneUtils/profilePicNames";
import { createWarningComponent } from "./lobbySceneUtils/disconnectWarning";
import { HomeButton } from "../classes/buttons/homeButton";
import { EColyseusMessages } from "../enums/colyseusMessageEnum";
import { GameListContainer } from "../classes/gameList/gameListContainer";
import { calculateAllCenterPoints } from "../utils/boardCalculations";

export const backgroundMusicInstance: Phaser.Sound.BaseSound | null = null;

export default class LobbyScene extends Phaser.Scene {
  userId!: string;
  portrait!: string;
  username!: string;
  colyseusClient: Client;
  lobbyRoom: Room | undefined;
  gameListContainer: Phaser.GameObjects.Container | undefined;
  gameListData: IGame[] | undefined;
  gameList: GameListContainer | undefined; // TODO: isn't this gameListData?
  centerPoints: Coordinates[];

  currentRoom: string | undefined; // Reuse and eventually rename to currentGame
  gameScene: Phaser.Scene | undefined; // TODO:

  // Used to highlight the active game in the game list
  activeGameImage: Phaser.GameObjects.Image | undefined;
  activeGameImageId: string | undefined;

  // There is limit of 50 active games per player. Games currently playing, searching for players and open challenges all count towards the limit
  activeGamesAmountLimit = 50;
  activeGamesAmount = 0;

  constructor() {
    super({ key: 'LobbyScene' });
    this.colyseusClient = new Client(`${import.meta.env.VITE_SOCKET}`);
    this.centerPoints = calculateAllCenterPoints(); // This apply to all games, no need to redo every time
  }

  init() {
    const data = this.registry.get('userData');
    this.userId = data.userId;
    this.portrait = data.portrait;
    this.username = data.username;
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
    }); // TODO: load the necessary portraits from the player list only. No need to load everything if it's not used

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
    this.lobbyRoom = await connectToGameLobby(this.colyseusClient, this.userId, this);
    this.lobbyRoom?.onMessage(EColyseusMessages.SEND_GAMELIST, message => {
      this.gameListData = message;
      this.gameList = new GameListContainer(this, message);
    });
    this.lobbyRoom?.send(EColyseusMessages.GET_GAMELIST);

    this.time.addEvent({
      delay: 300000, // 5 minutes
      callback: () => {
        this.lobbyRoom!.send("ping");
      },
      loop: true
    });

    createWarningComponent(this);

    this.add.image(0, 0, 'uiBackground').setOrigin(0);
    this.add.image(397, 15, 'gameBackground').setOrigin(0, 0).setScale(1.06, 1.2);

    new HomeButton(this);
  }

  onShutdown() {
    this.sound.stopAll();
  }
}