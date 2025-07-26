export const CDN_PATH = 'https://cdn.jsdelivr.net/gh/Dan-DH/fa-assets@d4ce54f';


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

    // sounds
    this.load.audio('buttonFailed', `${CDN_PATH}/audio/Unit_Damage.mp3`);  this.load.audio('battleButton', `${CDN_PATH}/audio/UI_Front_End_Begin_Battle.mp3`);
    this.load.audio('buttonPressGeneric', `${CDN_PATH}/audio/UI_Front_End_Select.mp3`);
    this.load.audio('deleteGame', `${CDN_PATH}/audio/Game_Delete.mp3`);
    this.load.audio('titleMusic', `${CDN_PATH}/audio/Mx_Title_Theme_v4.mp3`);
  }

  create(): void {
    // Move to main scene after loading
    this.scene.start('MainMenuScene');
  }
}
