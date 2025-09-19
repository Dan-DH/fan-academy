import { EChallengePopup, EUiSounds } from "../enums/gameEnums";
import { IUserStats } from "../interfaces/userInterface";
import { getLeaderBoard } from "../queries/userQueries";
import LeaderboardScene from "../scenes/leaderboard.scene";
import { playSound, truncateText } from "../utils/gameUtils";
import { ChallengePopup } from "./challengePopup";

export class Leaderboard extends Phaser.GameObjects.Container {
  header: Phaser.GameObjects.Container;
  rows: Phaser.GameObjects.Container[];
  paginationBar: Phaser.GameObjects.Container;

  context: LeaderboardScene;

  constructor(context: LeaderboardScene, data: {
    players: {
      _id: string,
      username: string,
      picture: string,
      stats: IUserStats,
    }[],
    totalPages: number,
    currentPage: number
  }) {
    const startingCoords = {
      x: 350,
      y: 50
    };

    super(context, 0, 0);

    this.context = context;

    const style = {
      fontFamily: "proLight",
      color: '#ffffff',
      wordWrap: {
        width: 190,
        useAdvancedWrap: true
      }
    };
    const bigStyle = {
      ...style,
      fontSize: 45
    };
    const smallStyle  = {
      ...style,
      fontSize: 35
    };

    this.header = context.add.container(startingCoords.x, startingCoords.y);

    const usernameText = context.add.text(100, 0, 'Username', bigStyle);
    const totalGames = context.add.text(320, 0, `Games`, bigStyle);
    const totalWins = context.add.text(520, 0, `Wins`, bigStyle);
    const councilWins = context.add.text(720, 0, `Council`, bigStyle);
    const elvesWins = context.add.text(920, 0, `Elves`, bigStyle);

    this.header.add([usernameText, totalGames, totalWins, councilWins, elvesWins]);

    startingCoords.y += 20;

    this.rows = data.players.map(player => {
      startingCoords.y += 50;
      const row = context.add.container(startingCoords.x, startingCoords.y);

      const usernameText = context.add.text(100, 0, truncateText(player.username, 13), smallStyle);
      const totalGames = context.add.text(350, 0, `${player.stats.totalGames}`, smallStyle);
      const totalWins = context.add.text(550, 0, `${player.stats.totalWins}`, smallStyle);
      const councilWins = context.add.text(750, 0, `${player.stats.councilWins}`, smallStyle);
      const elvesWins = context.add.text(950, 0, `${player.stats.elvesWins}`, smallStyle);

      const challengeIcon = context.add.image(1030, 15, 'challengeIcon').setInteractive({ useHandCursor: true });

      challengeIcon.on('pointerdown', () => {
        playSound(this.scene, EUiSounds.BUTTON_GENERIC);

        new ChallengePopup({
          context,
          username: player.username,
          challengeType: EChallengePopup.SEND,
          opponentId: player._id
        });
      });

      if (player._id === context.userId) challengeIcon.setVisible(false).disableInteractive();

      row.add([usernameText, totalGames, totalWins, councilWins, elvesWins, challengeIcon]);

      return row;
    });

    // Pagination
    let page = data.currentPage;
    const paginationY = 730;
    const paginationX = 900;

    this.paginationBar = context.add.container(paginationX, paginationY + 10);

    const paginationText = context.add.text(0, 0, `${page} / ${data.totalPages}`, bigStyle).setOrigin(0.5);

    const firstPageButton = context.add.image(-180, 0, 'arrowButton').setFlipX(true).setScale(0.7).setVisible(page > 1);
    const backButton = context.add.image(-120, 0, 'curvedArrowButton').setScale(0.7).setVisible(page > 1);
    const forwardButton = context.add.image(120, 0, 'curvedArrowButton').setFlipX(true).setScale(0.7).setVisible(page !== data.totalPages);
    const lastPageButton = context.add.image(180, 0, 'arrowButton').setScale(0.7).setVisible(page !== data.totalPages);

    let isQuerying = false;

    firstPageButton.setInteractive({ useHandCursor: true }).on('pointerdown', async () => {
      this.scene.sound.play(EUiSounds.BUTTON_GENERIC);
      if (page > 1) {
        const leaderboardData = await getLeaderBoard(1);
        if (leaderboardData) {
          new Leaderboard(this.context, leaderboardData);
          this.destroy();
        }
      }
    });

    backButton.setInteractive({ useHandCursor: true }).on('pointerdown', async () => {
      if (isQuerying) return;
      isQuerying = true;

      this.scene.sound.play(EUiSounds.BUTTON_GENERIC);
      if (page > 1) {
        const leaderboardData = await getLeaderBoard(--page);
        if (leaderboardData) {
          new Leaderboard(this.context, leaderboardData);
          this.destroy();
        }
        isQuerying = false;
      }
    });

    forwardButton.setInteractive({ useHandCursor: true }).on('pointerdown', async () => {
      if (isQuerying) return;
      isQuerying = true;

      this.scene.sound.play(EUiSounds.BUTTON_GENERIC);
      const leaderboardData = await getLeaderBoard(++page);
      if (leaderboardData) {
        new Leaderboard(this.context, leaderboardData);
        this.destroy();
      }
      isQuerying = false;
    });

    lastPageButton.setInteractive({ useHandCursor: true }).on('pointerdown', async () => {
      this.scene.sound.play(EUiSounds.BUTTON_GENERIC);
      if (page !== data.totalPages) {
        const leaderboardData = await getLeaderBoard(data.totalPages);
        if (leaderboardData) {
          new Leaderboard(this.context, leaderboardData);
          this.destroy();
        }
      }
    });

    this.paginationBar.add([firstPageButton, backButton, paginationText, forwardButton, lastPageButton]);

    this.add([this.header, ...this.rows, this.paginationBar]);

    this.context.add.existing(this);
  }
};