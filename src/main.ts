import Phaser from 'phaser';
import UIScene from './scenes/ui.scene';
import MainMenuScene from './scenes/mainMenu.scene';
import GameScene from './scenes/game.scene';
import LeaderboardScene from './scenes/leaderboard.scene';
import ProfileScene from './scenes/profile.scene';
import PreloaderScene from './scenes/preloader.scene';
import AboutScene from './scenes/about.scene';

const config = {
  backgroundColor: '#808080',
  type: Phaser.AUTO, // webgl if browser supports it, fallback to canvas
  scene: [PreloaderScene, MainMenuScene, UIScene, GameScene, LeaderboardScene, ProfileScene, AboutScene],
  scale: {
    mode: Phaser.Scale.FIT, // automatically resize the canvas on window resize
    autoCenter: Phaser.Scale.CENTER_BOTH, // center the canvas
    width: 1434,
    height: 990
  },
  dom: { createContainer: true },
  parent: 'app'

};

// Create a new game
export const fanAcademy = new Phaser.Game(config);
