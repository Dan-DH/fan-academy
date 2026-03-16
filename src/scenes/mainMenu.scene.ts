import { EUiSounds } from "../enums/gameEnums";
import { IUserPreferences } from "../interfaces/userInterface";
import { authCheck, loginQuery, signUpQuery } from "../queries/userQueries";
import { isValidPassword } from "../utils/playerUtils";
import createMainMenuButton from "./mainMenuUtils/buttons";
import { CDN_PATH } from "./preloader.scene";

export default class MainMenuScene extends Phaser.Scene {
  userId: string | undefined;
  gameList: string | undefined;
  userPreferences: IUserPreferences | undefined;

  currentSubScene: string | undefined;

  constructor() {
    super({ key: 'MainMenuScene' });
  }

  init() {}

  preload() {
    // login form
    this.load.html('loginForm', 'html/loginForm.html');
    this.load.html('signUpForm', 'html/signUpForm.html');

    // menu images
    this.load.image('uiBackground', `${CDN_PATH}/ui/game_screen.webp`);
    // this.load.image('mainMenuImage', `${CDN_PATH}/ui/main_menu_image.webp`);
    this.load.image('mainMenuImage', `./assetsd/ui/main_menu_image_dwarves.webp`);
    this.load.image('mainMenuBottom', `${CDN_PATH}/ui/main_menu_bottom.webp`);
    this.load.image('playButton', `${CDN_PATH}/ui/play_button.webp`);
    this.load.image('mainMenuButton', `${CDN_PATH}/ui/main_menu_button.webp`);

    // fonts
    this.load.font('proHeavy', '/fonts/BlambotFXProHeavyLowerCapsBB.woff', 'truetype');
    this.load.font('proLight', '/fonts/BlambotFXProLightBB.woff', 'truetype');

    // sounds
    this.load.audio('buttonFailedSound', `${CDN_PATH}/audio/ui/buttonFailed.mp3`);
    this.load.audio('battleButtonSound', `${CDN_PATH}/audio/ui/battleButton.mp3`);
    this.load.audio('buttonPressGenericSound', `${CDN_PATH}/audio/ui/buttonPressGeneric.mp3`);
  }

  async create() {
    // Auth check
    const authCheckResult = await authCheck();

    if (authCheckResult) this.updateUserPreferences(authCheckResult);

    // Background image
    const bg = this.add.image(0, 0, 'uiBackground').setOrigin(0);
    const menuImg = this.add.image(396, 15, 'mainMenuImage').setOrigin(0).setScale(1.065);
    // Background game screen (to be used when a sub scene is running to avoid flickering) // FIXME:
    const backgroundGameScreen = this.add.image(397, 15, 'gameBackground').setOrigin(0, 0).setScale(1.06, 1.2).setVisible(false);
    // menuImg.x = bg.width - menuImg.width - 14;
    // menuImg.y += 14;

    // main menu bottom strip
    const menuBottomImage = this.add.image(0, 0, 'mainMenuBottom').setOrigin(0);
    const menuBottomText = this.add.text(0.5, 0.5, 'Welcome to the Hero Academy!', {
      font: '50px proLight',
      color: '#873600'
    }).setOrigin(-0.4, -1.3);
    // menuBottomContainer
    this.add.container(bg.width - menuBottomImage.width - 14, bg.height - menuBottomImage.height - 14, [menuBottomImage, menuBottomText]);

    // main menu buttons
    const menuButtonHeight = this.textures.get('mainMenuButton').getSourceImage().height;
    const menuButtonX =  200;
    const menuButtonPadding = 20;

    // profileButton
    createMainMenuButton({
      thisParam: this,
      x: menuButtonX,
      y: menuButtonHeight * 4 + menuButtonPadding,
      imageKey: 'mainMenuButton',
      text: 'Profile',
      font: '70px proHeavy',
      callback: () => {
        this.sound.play(EUiSounds.BUTTON_GENERIC);
        backgroundGameScreen.setVisible(true);
        menuImg.setVisible(false);
        if (this.currentSubScene) this.scene.stop(this.currentSubScene);
        this.scene.launch('ProfileScene', { userId: this.userId });
        this.currentSubScene = 'ProfileScene';
      }
    });

    // leaderboardsButton
    createMainMenuButton({
      thisParam: this,
      x: menuButtonX,
      y: menuButtonHeight * 6 - menuButtonPadding,
      imageKey: 'mainMenuButton',
      text: 'Leaderboard',
      font: '70px proHeavy',
      callback: () => {
        this.sound.play(EUiSounds.BUTTON_GENERIC);
        if (this.currentSubScene) this.scene.stop(this.currentSubScene);
        this.scene.launch('LeaderboardScene', { userId: this.userId });
        this.currentSubScene = 'LeaderboardScene';
      }
    });

    // aboutButton
    createMainMenuButton({
      thisParam: this,
      x: menuButtonX,
      y: menuButtonHeight * 7 + 5,
      imageKey: 'mainMenuButton',
      text: 'Guide',
      font: '70px proHeavy',
      callback: () => {
        this.sound.play(EUiSounds.BUTTON_GENERIC);
        if (this.currentSubScene) this.scene.stop(this.currentSubScene);
        this.scene.launch('AboutScene');
        this.currentSubScene = 'AboutScene';
      }
    });

    // discordButton
    createMainMenuButton({
      thisParam: this,
      x: menuButtonX,
      y: menuButtonHeight * 8.5,
      imageKey: 'mainMenuButton',
      text: 'Discord',
      font: '70px proHeavy',
      callback: () => {
        this.sound.play(EUiSounds.BUTTON_GENERIC);
        window.open('https://discord.gg/pkfwDvKyxX');
      }
    });

    // playButton
    createMainMenuButton({
      thisParam: this,
      x: 200,
      y: 140,
      imageKey: 'playButton',
      text: 'Play!',
      font: '130px proHeavy',
      callback: () => {
        this.sound.play(EUiSounds.BUTTON_PLAY);
        if (this.currentSubScene) this.scene.stop(this.currentSubScene);
        this.scene.start('UIScene', { userId: this.userId });
        this.currentSubScene = 'UIScene';
      }
    });

    // logoutButton
    createMainMenuButton({
      thisParam: this,
      x: menuButtonX,
      y: menuButtonHeight * 14 + 40,
      imageKey: 'mainMenuButton',
      text: 'Logout',
      font: '70px proHeavy',
      tint: '0x990000',
      callback: async () => {
        this.sound.play(EUiSounds.BUTTON_GENERIC);
        localStorage.removeItem('jwt');
        this.userId = undefined;
        document.title = 'Fan Academy';
        if (this.currentSubScene) this.scene.stop(this.currentSubScene);
        this.scene.restart();
      }
    });

    // Login and sign up forms. Only show if user is not authenticated
    this.createSignUpAndLoginForms(this.userId);
  }

  onShutdown() {
    this.sound.stopAll();
  }

  /*
  HELPER FUNCTIONS
  */
  createSignUpAndLoginForms(userId: string | undefined): {
    loginForm: Phaser.GameObjects.DOMElement,
    signUpForm: Phaser.GameObjects.DOMElement
  } {
    const loginForm = this.add.dom(800, 400).createFromCache('loginForm');
    const signUpForm = this.add.dom(800, 400).createFromCache('signUpForm');
    signUpForm.setVisible(false);

    // Used to block the user from clicking on some other part of the game
    const blockingLayer = this.add.rectangle(0, 0, 2900, 2000, 0x000000, 0.001).setOrigin(0.5).setInteractive();

    // Login form elements
    const loginUsernameInput = loginForm.getChildByID('username') as HTMLInputElement;
    const loginPasswordInput = loginForm.getChildByID('password') as HTMLInputElement;
    const loginButton = loginForm.getChildByID('loginButton') as HTMLInputElement;
    const linkToSignUp = loginForm.getChildByID('linkToSignUp') as HTMLInputElement;
    const loginError = loginForm.getChildByID('loginError') as HTMLDivElement;

    // Sign up form elements
    const signUpEmailInput = signUpForm.getChildByID('email') as HTMLInputElement;
    const signUpUsernameInput = signUpForm.getChildByID('username') as HTMLInputElement;
    const signUpPasswordInput = signUpForm.getChildByID('password') as HTMLInputElement;
    const signUpPasswordConfirm = signUpForm.getChildByID('passwordConfirm') as HTMLInputElement;
    const signUpButton = signUpForm.getChildByID('signUpButton') as HTMLInputElement;
    const linkToLogin = signUpForm.getChildByID('linkToLogin') as HTMLInputElement;
    const signUpError = signUpForm.getChildByID('signUpError') as HTMLDivElement;

    const showFormError = (element: HTMLDivElement, message: string) => {
      element.innerText = message;
      element.style.display = 'block';
    };

    const hideFormError = (element: HTMLDivElement) => {
      element.innerText = '';
      element.style.display = 'none';
    };

    // Login button click
    loginButton.addEventListener('click', async () => {
      if (loginUsernameInput.value && loginPasswordInput.value) {
        const result = await loginQuery(loginUsernameInput.value, loginPasswordInput.value);
        if (result.success) {
          if (result.userData) this.updateUserPreferences(result.userData);
          loginForm.setVisible(false);
          blockingLayer.setVisible(false);
          this.sound.play(EUiSounds.BUTTON_GENERIC);
        }else {
          this.sound.play(EUiSounds.BUTTON_FAILED);
          showFormError(loginError, result.error); // Show server error to user
        }
      } else {
        this.sound.play(EUiSounds.BUTTON_FAILED);
        showFormError(loginError, 'Incorrect username or password.'); // Show server error to user
      }
    });

    // Sign up button click
    signUpButton.addEventListener('click', async () => {
      hideFormError(signUpError);

      if (signUpPasswordInput.value !== signUpPasswordConfirm.value) {
        this.sound.play(EUiSounds.BUTTON_FAILED);
        showFormError(signUpError, 'Passwords do not match');
        return;
      };
      if (!isValidPassword(signUpPasswordInput.value)) {
        this.sound.play(EUiSounds.BUTTON_FAILED);
        showFormError(signUpError, 'Password must be at least 8 characters long and contain a letter and a number');
        return;
      };

      if(signUpUsernameInput.value.length > 20) {
        this.sound.play(EUiSounds.BUTTON_FAILED);
        showFormError(signUpError, 'Username must be 20 characters or shorter');
        return;
      }

      if (signUpEmailInput.value && signUpUsernameInput.value && signUpPasswordInput.value) {
        const result = await signUpQuery(signUpEmailInput.value, signUpUsernameInput.value, signUpPasswordInput.value);
        if (result.success) {
          if (result.userData) this.updateUserPreferences(result.userData);
          signUpForm.setVisible(false);
          blockingLayer.setVisible(false);
          this.sound.play(EUiSounds.BUTTON_GENERIC);
          console.log('UserId after sign up:', this.userId);
        } else {
          this.sound.play(EUiSounds.BUTTON_FAILED);
          showFormError(signUpError, result.error); // Show server error to user
        }
      }
    });

    // Listeners for login in pressing Enter
    const addEnterKeyListener = (field: HTMLInputElement, button: HTMLInputElement ) => {
      field.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          button.click();
        }
      });
    };
    [loginUsernameInput, loginPasswordInput].forEach(field => addEnterKeyListener(field, loginButton));
    [signUpEmailInput, signUpUsernameInput, signUpPasswordInput, signUpPasswordConfirm].forEach(field => addEnterKeyListener(field, signUpButton));

    // Switch forms
    linkToSignUp.addEventListener('click', () => {
      loginForm.setVisible(false);
      signUpForm.setVisible(true);
    });

    linkToLogin.addEventListener('click', () => {
      signUpForm.setVisible(false);
      loginForm.setVisible(true);
    });

    // If already logged in
    if (userId) {
      loginForm.setVisible(false);
      signUpForm.setVisible(false);
      blockingLayer.setVisible(false);
    }

    return {
      loginForm,
      signUpForm
    };
  }

  updateUserPreferences(userData: {
    userId: string,
    preferences: IUserPreferences
  }): void {
    this.userId = userData.userId;

    this.registry.set('userPreferences', {
      chat: userData.preferences.chat,
      sound: userData.preferences.sound
    });

    this.sound.mute = !userData.preferences.sound;
  }
}