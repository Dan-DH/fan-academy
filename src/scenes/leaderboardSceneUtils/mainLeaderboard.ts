import { EChallengePopup, EFaction, EUiSounds } from "../../enums/gameEnums";
import { IUserStats } from "../../interfaces/userInterface";
import LeaderboardScene from "../leaderboard.scene";
import { playSound } from "../../utils/gameSounds";
import { truncateText } from "../../utils/textAnimations";
import { ChallengePopup } from "../../classes/popups/challengePopup";
import { ELeaderboardEnum } from "../../enums/leaderboardEnum";
import { getLeaderBoardQuery } from "../../queries/userQueries";

export class MainLeaderboard extends Phaser.GameObjects.Container {
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
        width: 270,
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
    const totalWins = context.add.text(400, 0, `Wins`, bigStyle);
    const totalGames = context.add.text(520, 0, `Games`, bigStyle);
    const councilWins = context.add.image(700, 25, EFaction.COUNCIL).setScale(0.2);
    const elvesWins = context.add.image(800, 25, EFaction.DARK_ELVES).setScale(0.2);
    const dwarvesWins = context.add.image(900, 25, EFaction.DWARVES).setScale(0.2);

    this.header.add([usernameText, totalGames, totalWins, councilWins, elvesWins, dwarvesWins]);

    startingCoords.y += 20;

    this.rows = data.players.map(player => {
      startingCoords.y += 50;
      const row = context.add.container(startingCoords.x, startingCoords.y);

      const usernameText = context.add.text(100, 0, truncateText(player.username, 20), smallStyle);
      const totalWins = context.add.text(410, 0, `${player.stats.totalWins}`, smallStyle);
      const totalGames = context.add.text(530, 0, `${player.stats.totalGames}`, smallStyle);
      const councilWins = context.add.text(690, 0, `${player.stats.factions.council.wins}`, smallStyle);
      const elvesWins = context.add.text(790, 0, `${player.stats.factions.elves.wins}`, smallStyle);
      const dwarvesWins = context.add.text(890, 0, `${player.stats.factions.dwarves.wins}`, smallStyle);

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

      row.add([usernameText, totalGames, totalWins, councilWins, elvesWins, dwarvesWins, challengeIcon]);

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
        const leaderboardData = await getLeaderBoardQuery(ELeaderboardEnum.MAIN, 1);
        if (leaderboardData) {
          this.context.leaderBoard = new MainLeaderboard(this.context, leaderboardData);
          this.destroy();
        }
      }
    });

    backButton.setInteractive({ useHandCursor: true }).on('pointerdown', async () => {
      if (isQuerying) return;
      isQuerying = true;

      this.scene.sound.play(EUiSounds.BUTTON_GENERIC);
      if (page > 1) {
        const leaderboardData = await getLeaderBoardQuery(ELeaderboardEnum.MAIN, --page);
        if (leaderboardData) {
          this.context.leaderBoard = new MainLeaderboard(this.context, leaderboardData);
          this.destroy();
        }
        isQuerying = false;
      }
    });

    forwardButton.setInteractive({ useHandCursor: true }).on('pointerdown', async () => {
      if (isQuerying) return;
      isQuerying = true;

      this.scene.sound.play(EUiSounds.BUTTON_GENERIC);
      const leaderboardData = await getLeaderBoardQuery(ELeaderboardEnum.MAIN, ++page);
      if (leaderboardData) {
        this.context.leaderBoard = new MainLeaderboard(this.context, leaderboardData);
        this.destroy();
      }
      isQuerying = false;
    });

    lastPageButton.setInteractive({ useHandCursor: true }).on('pointerdown', async () => {
      this.scene.sound.play(EUiSounds.BUTTON_GENERIC);
      if (page !== data.totalPages) {
        const leaderboardData = await getLeaderBoardQuery(ELeaderboardEnum.MAIN, data.totalPages);
        if (leaderboardData) {
          this.context.leaderBoard = new MainLeaderboard(this.context, leaderboardData);
          this.destroy();
        }
      }
    });

    this.paginationBar.add([firstPageButton, backButton, paginationText, forwardButton, lastPageButton]);

    this.add([this.header, ...this.rows, this.paginationBar]);

    this.context.add.existing(this);
  }
};