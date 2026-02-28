import { Leaderboard } from "./leaderboardSceneUtils/leaderboard";
import { getLeaderBoard } from "../queries/userQueries";
import { loadLeaderboardUI } from "./leaderboardSceneUtils/leaderboardUI";

export default class LeaderboardScene extends Phaser.Scene {
  userId!: string;

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

    const leaderboardData = await getLeaderBoard();

    if (leaderboardData) new Leaderboard(this, leaderboardData);
  }

  onShutdown() {
    this.sound.stopAll();
  }
}
