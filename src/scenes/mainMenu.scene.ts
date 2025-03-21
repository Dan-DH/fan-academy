import { Client } from "colyseus.js";
import createMainMenuButton from "../lib/buttons";
import { authCheck, loginQuery, signUpQuery } from "../queries/userQueries";

export default class MainMenuScene extends Phaser.Scene {
  userId: string | undefined;
  gameList: string | undefined;

  constructor() {
    super({ key: 'MainMenuScene' });
  }

  init() {
  }

  preload() {
    // login form
    this.load.html('loginForm', '../src/html/loginForm.html'); // Paths are relative form the public folder
    this.load.html('signUpForm', '../src/html/signUpForm.html');
    // TODO: play and profile need to be disabled until login. Leaderboard and about should be available. Coming back home should show the login form again
    // TODO: add middleware check

    // images
    const imagesPath = '/assets/ui/used/';
    this.load.image('mainMenuBg', imagesPath + 'game_screen.png');
    this.load.image('mainMenuImage', imagesPath + 'main_menu_image.png');
    this.load.image('mainMenuImageLoggedIn', imagesPath + 'main_menu_logged.png');
    this.load.image('mainMenuBottom', imagesPath + 'main_menu_bottom.jpg');
    this.load.image('playButton', imagesPath + 'play_button.png');
    this.load.image('mainMenuButton', imagesPath + 'main_menu_button.png');

    // fonts
    this.load.font('proHeavy', '/assets/fonts/BlambotFXProHeavyLowerCapsBB.ttf', 'truetype');
    this.load.font('proLight', '/assets/fonts/BlambotFXProLightBB.ttf', 'truetype');
  }

  async create() {
    // Auth check
    this.userId = await authCheck();

    // Login and sign up forms. Only show if user is not authenticated
    this.createSignUpAndLoginForms(this.userId);

    // Background image
    const bg = this.add.image(0, 0, 'mainMenuBg').setOrigin (0);
    // main menu image
    // const menuIgm = isUserAuthenticated ? this.add.image(0, 0, 'mainMenuImageLoggedIn').setOrigin (0) : this.add.image(0, 0, 'mainMenuImage').setOrigin (0);
    const menuImg = this.add.image(0, 0, 'mainMenuImage').setOrigin (0);
    menuImg.x = bg.width - menuImg.width - 14;
    menuImg.y += 14;

    // main menu bottom strip
    const menuBottomImage = this.add.image(0, 0, 'mainMenuBottom').setOrigin(0);
    const menuBottomText = this.add.text(0.5, 0.5, 'Welcome to the Hero Academy!', {
      font: '50px proLight',
      color: '#873600'
    }).setOrigin(-0.4, -1.3);
    const menuBottomContainer = this.add.container(bg.width - menuBottomImage.width - 14, bg.height - menuBottomImage.height - 14, [menuBottomImage, menuBottomText]);

    // main menu buttons
    const menuButtonHeight = this.textures.get('mainMenuButton').getSourceImage().height;
    const menuButtonX =  200;

    const profileButton = createMainMenuButton({
      thisParam: this,
      x: menuButtonX,
      y: 275,
      imageKey: 'mainMenuButton',
      text: 'Profile',
      font: '70px proHeavy'
    });

    const leaderboardsButton = createMainMenuButton({
      thisParam: this,
      x: menuButtonX,
      y: menuButtonHeight + 299,
      imageKey: 'mainMenuButton',
      text: 'Leaderboard',
      font: '70px proHeavy'
    });
    const aboutButton = createMainMenuButton({
      thisParam: this,
      x: menuButtonX,
      y: menuButtonHeight * 2 + 323,
      imageKey: 'mainMenuButton',
      text: 'About',
      font: '70px proHeavy'
    }); // TODO: add callbacks

    const playButton = createMainMenuButton({
      thisParam: this,
      x: 200,
      y: 140,
      imageKey: 'playButton',
      text: 'Play!',
      font: '130px proHeavy',
      callback: () => { this.scene.start('GameScene', { userId: this.userId });}
    });

    // this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
    //   // Log the mouse coordinates
    //   console.log(`Mouse coordinates: x=${pointer.x}, y=${pointer.y}`);
    // });

    // TODO: Remove after testing
    // this.time.addEvent({
    //   delay: 0,
    //   loop: false,
    //   callback: () => { this.scene.start('GameScene',  { userId: this.userId });}
    // });

    /**
     * REVIEW: from the main menu we will do a query (maybe a loading pop up) and pass the gameState and factions to the game
     * When clicking on play, we get to the list of games, but we don't access any yet (no gameboard)
     * The first item on the list is the creating a new game asset, followed by the list of active games. The query vlooks the players' names and profile pics. The list is ordered by two criteria:
     * -games where the user is the active player go on top
     * -games where it's been the user's turn the longest go on top
     * When creating that list we get the players' data, the faction and the boardstate for each game
     * When the user clicks on a game, we access the room and use that information to generate the board
     *
     * What a need to do:
     * -create a new game asset
     * -create a current game asset
     * -create a second user
     * -check again the function for the rooms (destroying a recovering from the db)
     * -chech the game code so it doesn't default to the test room
     * -create a function to create containers for the characters
     *    -avoid bug: dragging an item onto a character in hand
     * -set up spawn tiles on board
     * -add chat to the game object and set it up on colyseus
     */
  }

  /*
  HELPER FUNCTIONS
  */
  createSignUpAndLoginForms(userId: string | undefined): // REVIEW: userId used as a boolean
  {
    loginForm: Phaser.GameObjects.DOMElement,
    signUpForm: Phaser.GameObjects.DOMElement
  }
  {
    // Login form
    const loginForm = this.add.dom(800, 400).createFromCache('loginForm');
    // Get references to the form elements
    const loginUsernameInput = loginForm.getChildByID('username') as HTMLInputElement | null;
    const loginPasswordInput = loginForm.getChildByID('password') as HTMLInputElement | null;
    const loginButton = loginForm.getChildByID('loginButton') as HTMLInputElement | null;
    const linkToSignUp = loginForm.getChildByID('linkToSignUp') as HTMLInputElement | null;
    loginForm.setVisible(true);
    // Login query
    loginButton?.addEventListener('click', async () => {
      if (loginUsernameInput?.value && loginPasswordInput?.value) {
        const user = await loginQuery(loginUsernameInput.value, loginPasswordInput.value); // TODO: return user id only
        if (user) {
          loginForm.setVisible(false);
          this.userId = user._id;
          console.log('UserId after login, ', this.userId);
        }
      }
    });
    // Login form, link to sign up form
    linkToSignUp?.addEventListener('click', async () => {
      signUpForm.setVisible(true);
      loginForm.setVisible(false);
    });

    // Sign up form
    const signUpForm = this.add.dom(800, 400).createFromCache('signUpForm');
    // Get references to the form elements
    const signUpEmailInput = signUpForm.getChildByID('email') as HTMLInputElement | null;
    const signUpUsernameInput = signUpForm.getChildByID('username') as HTMLInputElement | null;
    const signUpPasswordInput = signUpForm.getChildByID('password') as HTMLInputElement | null;
    const signUpButton = signUpForm.getChildByID('loginButton') as HTMLInputElement | null;
    const linkToLogin = signUpForm.getChildByID('linkToLogin') as HTMLInputElement | null;
    signUpForm.setVisible(false);

    // Sign up query
    signUpButton?.addEventListener('click', async () => {
      if (signUpUsernameInput?.value && signUpPasswordInput?.value && signUpEmailInput?.value) {
        const user =  await signUpQuery(signUpEmailInput.value, signUpUsernameInput.value, signUpPasswordInput.value); // TODO: return user id only
        if (user) {
          signUpForm.setVisible(false);
          this.userId = user._id;
          console.log('UserId after sign up, ', this.userId);
        }
      }
    });
    // Sign up form, link to login form
    linkToLogin?.addEventListener('click', async () => {
      signUpForm.setVisible(false);
      loginForm.setVisible(true);
    });

    console.log(userId);
    if (userId) loginForm.setVisible(false);

    return {
      loginForm,
      signUpForm
    };
  }
}
