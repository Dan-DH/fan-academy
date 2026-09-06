
export const CDN_PATH = 'https://cdn.jsdelivr.net/gh/Dan-DH/fa-assets@b4e30e9';

// PreloaderScene.ts
export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloaderScene' });
  }

  preload(): void {
    // load loading image
    this.load.image('loadingScreen', `${CDN_PATH}/ui/loading.webp`);
    this.load.once('filecomplete-image-loadingScreen', () => {
      this.add.image(0, 0, 'loadingScreen').setOrigin(0).setScale(2.8);
      this.loadAtlases();
      this.loadMainMenuAssets();
    });
  }

  create(): void {
    // Move to main scene after loading
    this.scene.start('MainMenuScene');
  }

  loadAtlases() {
    // this.load.atlas('gameAtlas', `${CDN_PATH}/atlas/gameTexture.webp`, `${CDN_PATH}/atlas/gameTexture.json`); // FIXME: uncomment and update assets
    this.load.atlas('gameAtlas', `/gameTexture.webp`, `/gameTexture.json`);
  }

  loadMainMenuAssets() {
    // fonts
    this.load.font('proHeavy', '/fonts/BlambotFXProHeavyLowerCapsBB.woff', 'truetype');
    this.load.font('proLight', '/fonts/BlambotFXProLightBB.woff', 'truetype');

    // background image
    this.load.image('gameBackground', `${CDN_PATH}/ui/create_game.webp`);

    this.load.html('loginForm', 'html/loginForm.html');
    this.load.html('signUpForm', 'html/signUpForm.html');
    this.load.html('passwordRecoveryForm', 'html/passwordRecoveryForm.html');
    this.load.html('passwordResetForm', 'html/passwordResetForm.html');

    // menu images
    this.load.image('uiBackground', `${CDN_PATH}/ui/game_screen.webp`);
    this.load.image('mainMenuImage', `${CDN_PATH}/ui/main_menu_image_dwarves.webp`); // 'main_menu_image.webp' for the original one

    // ui scene
    this.load.html('disconnectWarning', 'html/disconnectWarning.html');

    // game scene
    this.load.image('gameBoard', `${CDN_PATH}/images/maps/game_board.webp`);
    this.load.html('chatComponent', 'html/chat.html');

    // sounds
    // this.load.audio('buttonFailedSound', `${CDN_PATH}/audio/ui/buttonFailed.mp3`);
    // this.load.audio('battleButtonSound', `${CDN_PATH}/audio/ui/battleButton.mp3`);
    // this.load.audio('buttonPressGenericSound', `${CDN_PATH}/audio/ui/buttonPressGeneric.mp3`);
    // this.load.audio('deleteGameSound', `${CDN_PATH}/audio/ui/deleteGame.mp3`);
  }

  // profile pictures
  // profilePicNames.forEach(name => {
  //   this.load.image(name, `${CDN_PATH}/images/profilePics/${name}.webp`);
  // }); // FIXME: use this when adding the sprites
}
