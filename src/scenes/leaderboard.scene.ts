import { MainLeaderboard } from "./leaderboardSceneUtils/mainLeaderboard";
import { loadLeaderboardUI } from "./leaderboardSceneUtils/leaderboardUI";
import { EFaction, EUiSounds } from "../enums/gameEnums";
import { getLeaderboardData } from "./leaderboardSceneUtils/getLeaderboardData";
import { FactionLeaderboard } from "./leaderboardSceneUtils/factionLeaderboard";
import { playSound } from "../utils/gameSounds";

export default class LeaderboardScene extends Phaser.Scene {
  userId!: string;
  leaderBoard: Phaser.GameObjects.Container | undefined;

  constructor() {
    super({ key: 'LeaderboardScene' });
  }

  init(data: { userId: string, }) {
    this.userId = data.userId;
  }

  preload() {
    // Preload UI
    loadLeaderboardUI(this);
  }

  async create() {
    this.add.image(396, 14, 'gameBackground').setOrigin(0, 0).setScale(1.07, 1.2);

    const leaderboardData = await getLeaderboardData();

    const mainLeaderboardButton = this.add.image(1200, 740, "mainLeaderboard").setScale(0.7).setInteractive({ useHandCursor: true });
    const councilLeaderboardButton = this.add.image(1260, 740, EFaction.COUNCIL).setScale(0.2).setInteractive({ useHandCursor: true });
    const elvesLeaderboardButton = this.add.image(1320, 740, EFaction.DARK_ELVES).setScale(0.2).setInteractive({ useHandCursor: true });
    const dwarvesLeaderboardButton = this.add.image(1380, 740, EFaction.DWARVES).setScale(0.2).setInteractive({ useHandCursor: true });

    mainLeaderboardButton.on('pointerdown', async () => {
      if (this.leaderBoard) this.leaderBoard.destroy();
      playSound(this, EUiSounds.BUTTON_GENERIC);
      this.leaderBoard = new MainLeaderboard(this, leaderboardData.mainBoard);
    });

    councilLeaderboardButton.on('pointerdown', async () => {
      if (this.leaderBoard) this.leaderBoard.destroy();
      playSound(this, EUiSounds.BUTTON_GENERIC);
      this.leaderBoard = new FactionLeaderboard(this, EFaction.COUNCIL, leaderboardData.councilBoard);
    });

    elvesLeaderboardButton.on('pointerdown', async () => {
      if (this.leaderBoard) this.leaderBoard.destroy();
      playSound(this, EUiSounds.BUTTON_GENERIC);
      this.leaderBoard = new FactionLeaderboard(this, EFaction.DARK_ELVES, leaderboardData.elvesBoard);
    });

    dwarvesLeaderboardButton.on('pointerdown', async () => {
      if (this.leaderBoard) this.leaderBoard.destroy();
      playSound(this, EUiSounds.BUTTON_GENERIC);
      this.leaderBoard = new FactionLeaderboard(this, EFaction.DWARVES, leaderboardData.dwarvesBoard);
    });

    if (leaderboardData) this.leaderBoard = new MainLeaderboard(this, leaderboardData.mainBoard);
  }

  onShutdown() {
    this.sound.stopAll();
  }
}
