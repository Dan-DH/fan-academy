import { loadGameAssets } from "./mainMenuUtils/gameAssets";
import { profilePicNames } from "./profileSceneUtils/profilePicNames";

// PreloaderScene.ts
export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloaderScene' });
  }

  preload(): void {
    // load loading image
    this.load.image('loadingScreen', '/assets/ui/loading.png');
    this.load.once('filecomplete-image-loadingScreen', () => {
      this.add.image(0, 0, 'loadingScreen').setOrigin(0).setScale(1.4);
      this.loadRestOfAssets();
    });

    this.load.start();
  }

  loadRestOfAssets() {
    // login form
    this.load.html('loginForm', 'html/loginForm.html');
    this.load.html('signUpForm', 'html/signUpForm.html');

    // menu images
    this.load.image('mainMenuBg', '/assets/ui/game_screen.png');
    this.load.image('mainMenuImage', '/assets/ui/main_menu_image.png');
    this.load.image('mainMenuImageLoggedIn', '/assets/ui/main_menu_logged.png');
    this.load.image('mainMenuBottom', '/assets/ui/main_menu_bottom.jpg');
    this.load.image('playButton', '/assets/ui/play_button.png');
    this.load.image('mainMenuButton', '/assets/ui/main_menu_button.png');

    // profile pictures
    profilePicNames.forEach(name => {
      this.load.image(name, `/assets/images/profilePics/${name}.jpg`);
    });

    // fonts
    this.load.font('proHeavy', '/assets/fonts/BlambotFXProHeavyLowerCapsBB.ttf', 'truetype');
    this.load.font('proLight', '/assets/fonts/BlambotFXProLightBB.ttf', 'truetype');

    // game assets
    loadGameAssets(this);
  }

  create(): void {
    // Move to main scene after loading
    this.scene.start('MainMenuScene');
  }
}
