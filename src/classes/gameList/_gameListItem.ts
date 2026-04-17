// import { IGame, IPlayerData } from "../../interfaces/gameInterface";
// import { EGameStatus, EGameModes, EUiSounds } from "../../enums/gameEnum";
// import { timeAgo } from "../../utils/timeAgo";
// import { truncateText } from "../../utils/textAnimations";
// import { sendDeletedGameMessage } from "../../colyseus/colyseusLobbyRoom";
// import { accessGame } from "../../scenes/gameSceneUtils/gameMenuUI";
// import LobbyScene from "../../scenes/lobby.scene";

// export class _GameListItem extends Phaser.GameObjects.Container {
//      gameData: IGame;
//      lobbyContext: LobbyScene;
//      bgImage!: Phaser.GameObjects.Image;

//     constructor(scene: LobbyScene, x: number, y: number, game: IGame) {
//         super(scene, x, y);
//         this.gameData = game;
//         this.lobbyContext = scene;

//         const player = game.players.find((p: IPlayerData) => scene.userId === p.userData._id);
//         const opponent = game.players.find((p: IPlayerData) => scene.userId !== p.userData._id);
//         if (!player) return;

//         const btnWidth = 700;
//         const btnHeight = 142;

//         // 1. Background
//         this.bgImage = scene.add.image(0, 0, "gameListButton").setOrigin(0).setTint(0xBBBBBB);
//         this.add(this.bgImage);

//         // 2. Faction Icons
//         const playerFactionKey = player.faction || 'unknownFaction';
//         const playerFactionScale = player.faction ? 0.4 : 1.2;
//         this.add(scene.add.image(90, btnHeight / 2, playerFactionKey).setScale(playerFactionScale));

//         // 3. Time Text
//         this.add(scene.add.text(20, 100, timeAgo(game.lastPlayedAt), {
//             fontFamily: "proLight", fontSize: 38, color: '#ffffff'
//         }).setOrigin(0));

//         // 4. Opponent Info
//         const oppName = opponent ? truncateText(opponent.userData.username, 13) : 'Searching...';
//         const oppText = scene.add.text(200, btnHeight / 2 - 33, oppName, { fontSize: 50, fontFamily: "proLight" });
        
//         const oppFactionKey = opponent ? opponent.faction : 'unknownFaction';
//         const oppProfileKey = opponent ? opponent.userData.picture : 'unknownOpponent';
        
//         const oppFactionImg = scene.add.image(510, btnHeight / 2, oppFactionKey).setScale(opponent ? 0.4 : 1);
//         const oppProfileImg = scene.add.image(632, btnHeight / 2, oppProfileKey).setFlipX(true).setDisplaySize(102, 102);

//         this.add([oppText, oppFactionImg, oppProfileImg]);

//         // 5. Ranked Icon
//         if (game.gameMode === EGameModes.RANKED) {
//             this.add(scene.add.image(btnWidth - 20, btnHeight - 25, "runeMetal"));
//         }

//         // 6. Interaction Logic
//         this.setupInteractions();
//     }

//     private setupInteractions() {
//         const game = this.gameData;
//         const scene = this.lobbyContext;

//         // Delete/Close Button
//         if (game.status === EGameStatus.SEARCHING || game.status === EGameStatus.CHALLENGE) {
//             const closeBtn = scene.add.image(670, 0, 'closeButton').setOrigin(0).setInteractive({ useHandCursor: true });
//             closeBtn.on('pointerup', () => {
//                 // if (scene.isScrolling) return; 
//                 sendDeletedGameMessage(scene.lobbyRoom!, game._id, scene.userId);
//                 scene.sound.play(EUiSounds.GAME_DELETE);
//                 // scene.refreshGameList(); // Custom method to trigger refresh
//             });
//             this.add(closeBtn);
//         }

//         // Main Button Click
//         this.bgImage.setInteractive({ useHandCursor: true });
        
//         // Highlight logic
//         if (scene.activeGameImageId === game._id) this.highlight();

//         this.bgImage.on('pointerup', async () => {
//             // if (scene.isScrolling) return;

//             this.highlight();
            
//             if (game.status === EGameStatus.PLAYING || game.status === EGameStatus.FINISHED) {
//                 scene.sound.play(EUiSounds.BUTTON_GENERIC);
//                 await accessGame(scene, game);
//             } else if (game.status === EGameStatus.CHALLENGE) {
//                 // ... handle challenge popup logic ...
//             }
//         });
//     }

//     public highlight() {
//         // if (this.lobbyContext.activeGameItem) this.lobbyContext.activeGameItem.bgImage.setTint(0xBBBBBB);
//         // this.bgImage.clearTint();
//         // this.lobbyContext.activeGameItem = this;
//         // this.lobbyContext.activeGameImageId = this.gameData._id;
//         return
//     }
// }