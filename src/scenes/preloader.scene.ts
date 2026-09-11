import { ETiles } from "../enums/gameEnums";

export const CDN_PATH = 'https://cdn.jsdelivr.net/gh/Dan-DH/fa-assets@cc4a03e';

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
    this.createSpriteAnimations();

    // Move to main scene after loading
    this.scene.start('MainMenuScene');
  }

  loadAtlases() {
    this.load.atlas('gameAtlas', `${CDN_PATH}/atlas/gameTexture.webp`, `${CDN_PATH}/atlas/gameTexture.json`);
    // this.load.atlas('gameAtlas', `/gameTexture.webp`, `/gameTexture.json`);
    // Floating text fonts
    this.load.atlas(
      'greenFont',
      `${CDN_PATH}/fonts/green_font.png`,
      `${CDN_PATH}/fonts/green_font.json`
    );
    this.load.atlas(
      'redFont',
      `${CDN_PATH}/fonts/red_font.png`,
      `${CDN_PATH}/fonts/red_font.json`
    );
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

  // animations
  createSpriteAnimations(): void {
    this.createReviveAnimation();
    this.createSpecialTileAnimations();
    this.createAnnihilatorDebuffAnimation();
    this.createSingleCrystalDebuffAnimation();
    this.createDoubleCrystalDebuffAnimation();
    this.createSuperChargeAnimation();
  }

  createReviveAnimation(): void {
    this.anims.create({
      key: 'reviveAnim',
      frames: this.anims.generateFrameNames('gameAtlas', {
        prefix: 'reviveAnim_',
        start: 1,
        end: 3
      }),
      frameRate: 10,
      repeat: 0
    });
  }

  createAnnihilatorDebuffAnimation(): void {
    this.anims.create({
      key: 'annihilatorDebuffAnim',
      frames: this.anims.generateFrameNames('gameAtlas', {
        prefix: 'annihilatorDebuff_',
        start: 1,
        end: 2
      }),
      duration: 1500,
      repeat: -1
    });
  };

  createSuperChargeAnimation(): void {
    this.anims.create({
      key: 'superChargeAnim',
      frames: this.anims.generateFrameNames('gameAtlas', {
        prefix: 'superChargeAnim_',
        start: 1,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });
  };

  createSingleCrystalDebuffAnimation(): void {
    this.anims.create({
      key: 'singleCrystalDebuffAnim',
      frames: this.anims.generateFrameNames('gameAtlas', {
        prefix: 'crystalDebuff_',
        start: 1,
        end: 2
      }),
      frameRate: 10,
      repeat: -1
    });
  };

  createDoubleCrystalDebuffAnimation(): void {
    this.anims.create({
      key: 'doubleCrystalDebuffAnim',
      frames: this.anims.generateFrameNames('gameAtlas', {
        prefix: 'crystalDebuff_',
        start: 3,
        end: 4
      }),
      frameRate: 10,
      repeat: -1
    });
  };

  createSpecialTileAnimations(): void {
    const specialTilesFrames = [
      {
        type: ETiles.POWER,
        frames: 'powerTileAnim'
      },
      {
        type: ETiles.CRYSTAL_DAMAGE,
        frames: 'crystalDamageAnim'
      },
      {
        type: ETiles.MAGICAL_RESISTANCE,
        frames: 'magicalResistanceAnim'
      },
      {
        type: ETiles.PHYSICAL_RESISTANCE,
        frames: 'physicalResistanceAnim'
      },
      {
        type: ETiles.SPEED,
        frames: 'magicalResistanceAnim'
      }
    ];

    specialTilesFrames.forEach(tile => {
      this.anims.create({
        key: tile.type,
        frames: this.anims.generateFrameNames('gameAtlas', {
          prefix: tile.frames + '_',
          start: 1,
          end: 3
        }),
        frameRate: 10,
        repeat: -1
      });
    });
  }
}
