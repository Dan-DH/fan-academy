export const CDN_PATH = 'https://cdn.jsdelivr.net/gh/Dan-DH/fa-assets@7d513a2';

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
      this.loadRestOfAssets();
    });
  }

  loadRestOfAssets() {
    // fonts
    this.load.font('proHeavy', '/fonts/BlambotFXProHeavyLowerCapsBB.woff', 'truetype');
    this.load.font('proLight', '/fonts/BlambotFXProLightBB.woff', 'truetype');

    // popups
    this.load.image('popupBackground', `${CDN_PATH}/images/gameItems/popup_button.webp`);
    this.load.image('popupButton', `${CDN_PATH}/images/gameItems/ColorSwatch_Color-hd.webp`);

    // background image
    this.load.image('gameBackground', `${CDN_PATH}/ui/create_game.webp`);
  }

  create(): void {
    // Move to main scene after loading
    this.scene.start('MainMenuScene');
  }
}
