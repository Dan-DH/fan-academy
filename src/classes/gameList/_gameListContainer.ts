// import { IGame } from "../../interfaces/gameInterface";
// import LobbyScene from "../../scenes/lobby.scene";

// export class _GameListContainer extends Phaser.GameObjects.Container {
//     private lastY = 0;
//     private sceneContext: LobbyScene;
//     private listItems: GameListItem[] = [];

//     constructor(scene: LobbyScene, x: number, y: number) {
//         super(scene, x, y);
//         this.sceneContext = scene;
//         this.setScale(0.51);
//         scene.add.existing(this);
        
//         this.buildList();
//         this.setupScrolling();
//     }

//     public buildList() {
//         this.removeAll(true);
//         this.lastY = 0;
//         const games = this.sceneContext.gameList || [];

//         // 1. New Game Button
//         this.addNewGameButton();

//         // // 2. Sort Logic (Simplified example)
//         // const groups = {
//         //     "Your Turn": games.filter(g => g.status === EGameStatus.PLAYING && g.activePlayer === this.sceneContext.userId),
//         //     "Opponent's Turn": games.filter(g => g.status === EGameStatus.PLAYING && g.activePlayer !== this.sceneContext.userId),
//         //     "Finished": games.filter(g => g.status === EGameStatus.FINISHED)
//         // };

//         // Object.entries(groups).forEach(([title, list]) => {
//         //     if (list.length > 0) {
//         //         this.addHeader(title);
//         //         list.forEach(game => this.addItem(game));
//         //     }
//         // });
//     }

//     private addHeader(text: string) {
//         const header = this.sceneContext.add.text(30, this.lastY, text, { fontSize: 50, fontFamily: "proLight" });
//         this.add(header);
//         this.lastY += 60;
//     }

//     private addItem(game: IGame) {
//         const item = new GameListItem(this.sceneContext, 0, this.lastY, game);
//         this.add(item);
//         this.lastY += 142 + 20; // Height + Spacing
//     }

//     private addNewGameButton() {
//         const btn = this.sceneContext.add.image(0, this.lastY, 'newGameButton').setOrigin(0).setInteractive();
//         const txt = this.sceneContext.add.text(100, this.lastY + 15, 'Create a game', { fontSize: 120, fontFamily: "proHeavy" });
        
//         btn.on('pointerup', () => { /* Open Challenge Popup */ });
        
//         this.add([btn, txt]);
//         this.lastY += 150;
//     }

//     private setupScrolling() {
//         // Implement your wheel and pointermove logic here, 
//         // referencing 'this.y' and 'this.lastY'
//     }
// }