import { EUiSounds } from "../enums/gameEnums";
import { IUserPreferences } from "../interfaces/userInterface";
import { authCheck, loginQuery, passwordRecoveryEmailQuery, passwordResetQuery, signUpQuery } from "../queries/userQueries";
import { isValidPassword } from "../utils/playerUtils";
import createMainMenuButton from "./mainMenuUtils/buttons";

export default class MainMenuScene extends Phaser.Scene {
  userId: string | undefined;
  gameList: string | undefined;
  userPreferences: IUserPreferences | undefined;

  currentSubScene: string | undefined;

  constructor() {
    super({ key: 'MainMenuScene' });
  }

  init() {}

  async create() {
    // Auth check
    const authCheckResult = await authCheck();

    if (authCheckResult) this.updateUserPreferences(authCheckResult);

    // Background image
    const bg = this.add.image(0, 0, 'uiBackground').setOrigin(0);
    const menuImg = this.add.image(396, 15, 'mainMenuImage').setOrigin(0).setScale(1.065);
    // Background game screen (to be used when a sub scene is running to avoid flickering)
    const backgroundGameScreen = this.add.image(397, 15, 'gameBackground').setOrigin(0, 0).setScale(1.06, 1.2).setVisible(false);
    // Adjustments for the original bg image
    // menuImg.x = bg.width - menuImg.width - 14;
    // menuImg.y += 14;

    // main menu bottom strip
    const menuBottomImage = this.add.sprite(60, 0, 'gameAtlas', 'main_menu_bottom').setScale(1.8);
    const menuBottomText = this.add.text(0.5, 0.5, 'Welcome to the Hero Academy!', {
      font: '50px proLight',
      color: '#873600'
    }).setOrigin(0.5, 0.4);
    // menuBottomContainer
    this.add.container(bg.width - menuBottomImage.width - 14, bg.height - menuBottomImage.height - 14, [menuBottomImage, menuBottomText]);

    // main menu buttons
    const menuButtonHeight = this.textures.get('main_menu_button').getSourceImage().height;
    console.log('menuButtonHeight', menuButtonHeight);
    const menuButtonX =  200;
    const menuButtonPadding = 20;

    // profileButton
    createMainMenuButton({
      thisParam: this,
      x: menuButtonX,
      y: menuButtonHeight * 8 + menuButtonPadding,
      imageKey: 'main_menu_button',
      text: 'Profile',
      font: '70px proHeavy',
      callback: () => {
        // this.sound.play(EUiSounds.BUTTON_GENERIC);
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
      y: menuButtonHeight * 12 - menuButtonPadding,
      imageKey: 'main_menu_button',
      text: 'Leaderboard',
      font: '70px proHeavy',
      callback: () => {
        // this.sound.play(EUiSounds.BUTTON_GENERIC);
        if (this.currentSubScene) this.scene.stop(this.currentSubScene);
        this.scene.launch('LeaderboardScene', { userId: this.userId });
        this.currentSubScene = 'LeaderboardScene';
      }
    });

    // aboutButton
    createMainMenuButton({
      thisParam: this,
      x: menuButtonX,
      y: menuButtonHeight * 14 + 5,
      imageKey: 'main_menu_button',
      text: 'Guide',
      font: '70px proHeavy',
      callback: () => {
        // this.sound.play(EUiSounds.BUTTON_GENERIC);
        if (this.currentSubScene) this.scene.stop(this.currentSubScene);
        this.scene.launch('AboutScene');
        this.currentSubScene = 'AboutScene';
      }
    });

    // discordButton
    createMainMenuButton({
      thisParam: this,
      x: menuButtonX,
      y: menuButtonHeight * 17,
      imageKey: 'main_menu_button',
      text: 'Discord',
      font: '70px proHeavy',
      callback: () => {
        // this.sound.play(EUiSounds.BUTTON_GENERIC);
        window.open('https://discord.gg/pkfwDvKyxX');
      }
    });

    // playButton
    createMainMenuButton({
      thisParam: this,
      x: 200,
      y: 140,
      imageKey: 'play_button',
      text: 'Play!',
      font: '130px proHeavy',
      scale: 1.8,
      callback: () => {
        // this.sound.play(EUiSounds.BUTTON_PLAY);
        if (this.currentSubScene) this.scene.stop(this.currentSubScene);
        this.scene.start('UIScene', { userId: this.userId });
        this.currentSubScene = 'UIScene';
      }
    });

    // logoutButton
    createMainMenuButton({
      thisParam: this,
      x: menuButtonX,
      y: menuButtonHeight * 28 + 40,
      imageKey: 'main_menu_button',
      text: 'Logout',
      font: '70px proHeavy',
      tint: '0x990000',
      callback: async () => {
        // this.sound.play(EUiSounds.BUTTON_GENERIC);
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
    // this.sound.stopAll();
  }

  /*
  HELPER FUNCTIONS
  */
  createMainMenuMessageBox(): Phaser.GameObjects.Container {
    // const messageBackground = this.add.rectangle(800, 400, 600, 600, 0x000000, 0.8).fillRoundedRect(650, 250, 300, 150, 15);
    const messageBoxContainer = this.add.container(0);

    const bg = this.add.graphics().fillStyle(0x000000, 0.8).fillRoundedRect(500, 90, 600, 670, 15);

    const title = this.add.text(800, 150, `UPCOMING PATCH NOTICE - DWARVES`, {
      fontFamily: 'proHeavy',
      fontSize: '38px'
    }).setOrigin(0.5);

    const body = this.add.text(550, 200,
      `The Dwarves are coming! They will be joining the Academy on March 29th, noon-ish (EU time).\n
      Current games are not compatible with the update, so any unfinished games will be removed when the patch is out.\n
      No wins or loses will be awarded for unfinished games.\n
      As usual, the full patch notes will be available on Discord once the patch is live.\n
      Happy gaming!`,
      {
        fontFamily: 'proLight',
        fontSize: '32px',
        color: '#ffffff',
        wordWrap: {
          width: 520,
          useAdvancedWrap: true
        }
      }
    );

    const signature = this.add.text(900, 690, `- dadazbk`, {
      fontFamily: 'proLight',
      fontSize: '38px'
    });

    messageBoxContainer.add([bg, title, body, signature]);
    return messageBoxContainer;
  }
  createSignUpAndLoginForms(userId: string | undefined):  {
    loginForm: Phaser.GameObjects.DOMElement,
    signUpForm: Phaser.GameObjects.DOMElement
    passwordRecoveryForm: Phaser.GameObjects.DOMElement
    passwordResetForm: Phaser.GameObjects.DOMElement
  } {
    // const patchNotice = this.createMainMenuMessageBox().setVisible(false);

    const loginForm = this.add.dom(800, 400).createFromCache('loginForm');
    const signUpForm = this.add.dom(800, 400).createFromCache('signUpForm');
    const passwordRecoveryForm = this.add.dom(800, 400).createFromCache('passwordRecoveryForm').setVisible(false);
    const passwordResetForm = this.add.dom(800, 400).createFromCache('passwordResetForm').setVisible(false);
    signUpForm.setVisible(false);

    // Used to block the user from clicking on some other part of the game
    const blockingLayer = this.add.rectangle(0, 0, 2900, 2000, 0x000000, 0.001).setOrigin(0.5).setInteractive();

    // Login form elements
    const loginUsernameInput = loginForm.getChildByID('username') as HTMLInputElement;
    const loginPasswordInput = loginForm.getChildByID('password') as HTMLInputElement;
    const loginButton = loginForm.getChildByID('loginButton') as HTMLInputElement;
    const linkToSignUp = loginForm.getChildByID('linkToSignUp') as HTMLInputElement;
    const linkToPasswordRecovery = loginForm.getChildByID('linkToPasswordRecovery') as HTMLInputElement;
    const loginError = loginForm.getChildByID('loginError') as HTMLDivElement;

    // Sign up form elements
    const signUpEmailInput = signUpForm.getChildByID('email') as HTMLInputElement;
    const signUpUsernameInput = signUpForm.getChildByID('username') as HTMLInputElement;
    const signUpPasswordInput = signUpForm.getChildByID('password') as HTMLInputElement;
    const signUpPasswordConfirmInput = signUpForm.getChildByID('passwordConfirm') as HTMLInputElement;
    const signUpButton = signUpForm.getChildByID('signUpButton') as HTMLInputElement;
    const linkToLogin = signUpForm.getChildByID('linkToLogin') as HTMLInputElement;
    const signUpError = signUpForm.getChildByID('signUpError') as HTMLDivElement;

    // Password recovery form elements
    const passwordRecoveryEmailInput = passwordRecoveryForm.getChildByID('email') as HTMLInputElement;
    const passwordRecoveryButton = passwordRecoveryForm.getChildByID('passwordRecoveryButton') as HTMLInputElement;
    const linkToPasswordReset = passwordRecoveryForm.getChildByID('linkToPasswordReset') as HTMLInputElement;

    // Password reset form elements
    const passwordResetRecoveryCodeInput = passwordResetForm.getChildByID('recoveryCode') as HTMLInputElement;
    const passwordResetPasswordInput = passwordResetForm.getChildByID('password') as HTMLInputElement;
    const passwordResetPasswordConfirmInput = passwordResetForm.getChildByID('passwordConfirm') as HTMLInputElement;
    const passwordResetError = passwordResetForm.getChildByID('passwordResetError') as HTMLDivElement;
    const passwordResetButton = passwordResetForm.getChildByID('passwordResetButton') as HTMLInputElement;

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
          cleanLoginFormFields();
          blockingLayer.setVisible(false);
          // patchNotice.setVisible(true);
          // this.sound.play(EUiSounds.BUTTON_GENERIC);
        }else {
          // this.sound.play(EUiSounds.BUTTON_FAILED);
          showFormError(loginError, result.error); // Show server error to user
        }
      } else {
        // this.sound.play(EUiSounds.BUTTON_FAILED);
        showFormError(loginError, 'Incorrect username or password.'); // Show server error to user
      }
    });

    // Sign up button click
    signUpButton.addEventListener('click', async () => {
      hideFormError(signUpError);

      if (signUpPasswordInput.value !== signUpPasswordConfirmInput.value) {
        // this.sound.play(EUiSounds.BUTTON_FAILED);
        showFormError(signUpError, 'Passwords do not match');
        return;
      };
      if (!isValidPassword(signUpPasswordInput.value)) {
        // this.sound.play(EUiSounds.BUTTON_FAILED);
        showFormError(signUpError, 'Password must be at least 8 characters long and contain a letter and a number');
        return;
      };

      if(signUpUsernameInput.value.length > 20) {
        // this.sound.play(EUiSounds.BUTTON_FAILED);
        showFormError(signUpError, 'Username must be 20 characters or shorter');
        return;
      }

      if (signUpEmailInput.value && signUpUsernameInput.value && signUpPasswordInput.value) {
        const result = await signUpQuery(signUpEmailInput.value, signUpUsernameInput.value, signUpPasswordInput.value);
        if (result.success) {
          if (result.userData) this.updateUserPreferences(result.userData);
          cleanSignUpFormFields();
          blockingLayer.setVisible(false);
          // patchNotice.setVisible(true);
          // this.sound.play(EUiSounds.BUTTON_GENERIC);
          console.log('UserId after sign up:', this.userId);
        } else {
          // this.sound.play(EUiSounds.BUTTON_FAILED);
          showFormError(signUpError, result.error); // Show server error to user
        }
      }
    });

    // Password recovery button click
    passwordRecoveryButton.addEventListener('click', async () => {
      passwordRecoveryEmailQuery(passwordRecoveryEmailInput.value);

      cleanPasswordRecoveryFormFields();
      passwordResetForm.setVisible(true);
    });

    // Password reset button click
    passwordResetButton.addEventListener('click', async () => {
      hideFormError(passwordResetError);

      if (passwordResetRecoveryCodeInput.value.length !== 6) {
        // this.sound.play(EUiSounds.BUTTON_FAILED);
        showFormError(passwordResetError, 'Invalid recovery code');
        return;
      };
      if (passwordResetPasswordInput.value !== passwordResetPasswordConfirmInput.value) {
        // this.sound.play(EUiSounds.BUTTON_FAILED);
        showFormError(passwordResetError, 'Passwords do not match');
        return;
      };
      if (!isValidPassword(passwordResetPasswordInput.value)) {
        // this.sound.play(EUiSounds.BUTTON_FAILED);
        showFormError(passwordResetError, 'Password must be at least 8 characters long and contain a letter and a number');
        return;
      };

      passwordResetQuery(passwordResetRecoveryCodeInput.value, passwordResetPasswordInput.value);

      cleanPasswordResetFormFields();
      loginForm.setVisible(true);
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
    [signUpEmailInput, signUpUsernameInput, signUpPasswordInput, signUpPasswordConfirmInput].forEach(field => addEnterKeyListener(field, signUpButton));
    addEnterKeyListener(passwordRecoveryEmailInput, passwordRecoveryButton);
    [passwordResetRecoveryCodeInput, passwordResetPasswordInput, passwordResetPasswordConfirmInput].forEach(field => addEnterKeyListener(field, passwordResetButton));

    // Switch forms
    linkToSignUp.addEventListener('click', () => {
      cleanLoginFormFields();
      signUpForm.setVisible(true);
    });

    linkToLogin.addEventListener('click', () => {
      cleanSignUpFormFields();
      loginForm.setVisible(true);
    });

    linkToPasswordRecovery.addEventListener('click', () => {
      cleanLoginFormFields();
      passwordRecoveryForm.setVisible(true);
    });

    linkToPasswordReset.addEventListener('click', () => {
      cleanPasswordRecoveryFormFields();
      passwordResetForm.setVisible(true);
    });

    // Clean forms
    const cleanLoginFormFields = () => {
      loginUsernameInput.value = "";
      loginPasswordInput.value = "";
      loginForm.setVisible(false);
    };
    const cleanSignUpFormFields = () => {
      signUpEmailInput.value = "";
      signUpUsernameInput.value = "";
      signUpPasswordInput.value = "";
      signUpPasswordConfirmInput.value = "";
      signUpForm.setVisible(false);
    };
    const cleanPasswordRecoveryFormFields = () => {
      passwordRecoveryEmailInput.value = "";
      passwordRecoveryForm.setVisible(false);
    };
    const cleanPasswordResetFormFields = () => {
      passwordResetPasswordInput.value = "";
      passwordResetPasswordConfirmInput.value = "";
      passwordResetRecoveryCodeInput.value = "";
      passwordResetForm.setVisible(false);
    };

    // If already logged in
    if (userId) {
      loginForm.setVisible(false);
      signUpForm.setVisible(false);
      passwordRecoveryForm.setVisible(false);
      passwordResetForm.setVisible(false);
      blockingLayer.setVisible(false);
      // patchNotice.setVisible(true);
    }

    return {
      loginForm,
      signUpForm,
      passwordRecoveryForm,
      passwordResetForm
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

    // this.sound.mute = !userData.preferences.sound;
  }
}
