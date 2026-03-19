import { EUiSounds } from "../../enums/gameEnums";
import { deleteAccount, updateProfile } from "../../queries/userQueries";
import ProfileScene from "../profile.scene";
import { playSound } from "../../utils/gameSounds";
import { isValidPassword } from "../../utils/playerUtils";
import { DeleteWarningPopup } from "../../classes/popups/deletePopup";
import { ProfilePicPopup } from "../../classes/popups/profilePicPopup";

export class Profile extends Phaser.GameObjects.Container {
  context: ProfileScene;
  profilePicturePopup: ProfilePicPopup;

  emailInput: Phaser.GameObjects.DOMElement;
  passwordInput: Phaser.GameObjects.DOMElement;
  passwordConfirmInput: Phaser.GameObjects.DOMElement;
  profileUpdateError: Phaser.GameObjects.DOMElement;
  profileUpdateSuccess: Phaser.GameObjects.DOMElement;

  notificationsCheckBox: Phaser.GameObjects.DOMElement;
  chatCheckBox: Phaser.GameObjects.DOMElement;
  soundCheckBox: Phaser.GameObjects.DOMElement;

  saveButtonImage: Phaser.GameObjects.Image;
  saveButtonText: Phaser.GameObjects.Text;
  deleteAccountButtonImage: Phaser.GameObjects.Image;
  deleteAccountButtonText: Phaser.GameObjects.Text;

  deletePopup: Phaser.GameObjects.Container;

  profilePicture: Phaser.GameObjects.Image;

  previousPicture: string | undefined;

  constructor(context: ProfileScene) {
    super(context, 0, 0);
    this.context = context;

    // Background game screen
    this.context.add.image(396, 14, 'gameBackground').setOrigin(0, 0).setScale(1.07, 1.2);

    // Draw background and layout
    this.context.add.text(800, 40, 'PROFILE', {
      fontFamily: 'proHeavy',
      fontSize: 80,
      color: '#ffffff'
    });

    this.context.add.text(1000, 150, 'PREFERENCES', {
      fontFamily: 'proHeavy',
      fontSize: 40,
      color: '#ffffff'
    });

    /**
      *  DATA
      *
     */
    this.context.add.text(550, 150, 'DATA', {
      fontFamily: 'proHeavy',
      fontSize: 40,
      color: '#ffffff'
    });

    // Display profile picture
    this.previousPicture = this.context.userData!.picture;
    this.profilePicture = this.context.add.image(580, 550, this.context.userData!.picture).setDisplaySize(256 * 0.5, 256 * 0.5).setInteractive({ useHandCursor: true });
    this.profilePicture.on('pointerdown', () => {
      this.profilePicturePopup.setVisible(true);
      this.toggleFormVisibility(false);
      this.bringToTop(this.profilePicturePopup);
    });
    this.profilePicturePopup = new ProfilePicPopup(this.context, this.profilePicture);

    // Email input
    this.emailInput = this.createInputField(600, 230, 'email', 'Email');

    // Password input
    this.passwordInput = this.createInputField(600, 290, 'New password', 'password');
    this.passwordConfirmInput = this.createInputField(600, 350, 'Confirm Password', 'password');

    // Error field
    this.profileUpdateError = this.context.add.dom(450, 380).createFromHTML(`
  <div id="profileError" class="proLightFont" style="color: white; font-size: 30px; margin-bottom: 10px; display: none; max-width: 500px; background-color: #8e0000; padding: 10px"></div>`);

    // Successful update field
    this.profileUpdateSuccess = this.context.add.dom(450, 380).createFromHTML(`
  <div id="profileSuccess" class="proLightFont" style="color: white; font-size: 30px; margin-bottom: 10px; display: none; max-width: 500px; background-color: #14452f; padding: 10px"></div>`);

    /**
      *  PREFERENCES
      *
     */

    const preferences = context.userData!.preferences;
    this.notificationsCheckBox = this.createCheckbox(1150, 230, 'Email notifications', preferences.emailNotifications);
    this.chatCheckBox = this.createCheckbox(1087, 290, 'Enable chat', preferences.chat);
    this.soundCheckBox = this.createCheckbox(1103, 350, 'Enable sound', preferences.sound);

    /**
     * STATS
     */
    context.add.text(1000, 390, 'STATS', {
      fontFamily: 'proHeavy',
      fontSize: 40,
      color: '#ffffff'
    });
    context.add.text(900, 440, `Games: ${context.userData?.stats.totalGames}`, {
      fontFamily: 'proLight',
      fontSize: 35,
      color: '#ffffff'
    });
    context.add.text(900, 490, `Wins: ${context.userData?.stats.totalWins}`, {
      fontFamily: 'proLight',
      fontSize: 35,
      color: '#ffffff'
    });
    context.add.text(1100, 440, `Council wins: ${context.userData?.stats.council.wins}`, {
      fontFamily: 'proLight',
      fontSize: 35,
      color: '#ffffff'
    });
    context.add.text(1100, 490, `Elves wins: ${context.userData?.stats.elves.wins}`, {
      fontFamily: 'proLight',
      fontSize: 35,
      color: '#ffffff'
    });
    context.add.text(1100, 540, `Dwarves wins: ${context.userData?.stats.dwarves.wins}`, {
      fontFamily: 'proLight',
      fontSize: 35,
      color: '#ffffff'
    });

    /**
      *  BUTTONS
      *
     */

    // Save changes button
    this.saveButtonImage = this.context.add.image(895, 700, 'popupButton').setTint(0x3399ff).setDisplaySize(230, 100).setInteractive({ useHandCursor: true });
    this.saveButtonText = this.context.add.text(830, 655, 'SAVE CHANGES', {
      fontFamily: "proHeavy",
      fontSize: 40,
      color: '#ffffff',
      align: 'center',
      wordWrap: {
        width: 150,
        useAdvancedWrap: true
      }
    });

    this.saveButtonImage.on('pointerdown', async () => {
      playSound(this.scene, EUiSounds.BUTTON_GENERIC);
      await this.handleSubmit();
    });

    this.loadUserData();

    // Delete warning popup
    this.deletePopup = new DeleteWarningPopup(context, this);

    // Delete account button
    this.deleteAccountButtonImage = this.context.add.image(1265, 700, 'popupButton').setTint(0x990000).setDisplaySize(230, 100).setInteractive({ useHandCursor: true });
    this.deleteAccountButtonText = this.context.add.text(1200, 655, 'DELETE ACCOUNT', {
      fontFamily: "proHeavy",
      fontSize: 40,
      color: '#ffffff',
      align: 'center',
      wordWrap: {
        width: 150,
        useAdvancedWrap: true
      }
    });

    this.deleteAccountButtonImage.on('pointerdown', () => {
      playSound(this.scene, EUiSounds.BUTTON_GENERIC);
      this.toggleFormVisibility(false);
      this.deletePopup.setVisible(true);
    });

    this.add([
      this.emailInput,
      this.passwordInput,
      this.passwordConfirmInput,
      this.profileUpdateError,
      this.profileUpdateSuccess,
      this.notificationsCheckBox,
      this.chatCheckBox,
      this.soundCheckBox,
      this.saveButtonImage,
      this.saveButtonText,
      this.deleteAccountButtonImage,
      this.deleteAccountButtonText,
      this.profilePicturePopup
    ]);

    this.bringToTop(this.profilePicturePopup);
    this.context.add.existing(this);
  }

  createInputField(x: number, y: number, placeholder: string, type: string, value = ''): Phaser.GameObjects.DOMElement {
    const html = `
    <input
      type="${type}"
      placeholder="${placeholder}"
      value="${value}"
      style="font-size:25px; width: 300px; height: 30px; font-family: proLight"
    />
  `;
    return this.context.add.dom(x, y).createFromHTML(html);
  }

  createCheckbox(x: number, y: number, label: string, checked: boolean) {
    const dom = this.context.add.dom(x, y).createFromHTML(`
      <label style="color:white; font-size: 50px; font-family: proLight">
        <input type="checkbox" ${checked ? 'checked' : ''} style="width: 35px; height: 35px;"/> ${label}
      </label>
    `);
    return dom;
  }

  loadUserData() {
    (this.emailInput!.getChildByName('') as HTMLInputElement).value = this.context.userData!.email;
    (this.notificationsCheckBox!.getChildByName('') as HTMLInputElement).checked = this.context.userData!.preferences.emailNotifications;
    (this.chatCheckBox!.getChildByName('') as HTMLInputElement).checked = this.context.userData!.preferences.chat;
    (this.soundCheckBox!.getChildByName('') as HTMLInputElement).checked = this.context.userData!.preferences.sound;
  }

  async handleSubmit() {
    this.profileUpdateError.setVisible(false);
    this.profileUpdateSuccess.setVisible(false);

    const email = (this.emailInput!.getChildByName('') as HTMLInputElement).value;
    const password = (this.passwordInput!.getChildByName('') as HTMLInputElement).value;
    const passwordConfirm = (this.passwordConfirmInput!.getChildByName('') as HTMLInputElement).value;
    const receiveNotifications = (this.notificationsCheckBox!.getChildByName('') as HTMLInputElement).checked;
    const enableChat = (this.chatCheckBox!.getChildByName('') as HTMLInputElement).checked;
    const enableSound = (this.soundCheckBox!.getChildByName('') as HTMLInputElement).checked;

    const emailInputEl = this.emailInput.node.querySelector('input') as HTMLInputElement;

    if (!emailInputEl.checkValidity()) {
      this.showForm(this.profileUpdateError, 'profileError', 'Incorrect email format');
      return;
    }

    if (password.trim() !== '') {
      if (password !== passwordConfirm) {
        this.showForm(this.profileUpdateError, 'profileError', 'Passwords do not match');
        return;
      };

      if (!isValidPassword(password)) {
        this.showForm(this.profileUpdateError, 'profileError', 'Password must be at least 8 characters long and contain a letter and a number');
        return;
      };
    }

    const payload: {
      email?: string,
      password?: string,
      picture?: string,
      emailNotifications?: boolean,
      chat?: boolean,
      sound?: boolean
    } = {};

    if (email && email !== this.context.userData?.email) payload.email = email;
    if (password && password.trim() !== '') payload.password = password;
    if (receiveNotifications !== undefined && receiveNotifications !== this.context.userData?.preferences.emailNotifications) payload.emailNotifications = receiveNotifications;
    if (enableChat !== undefined && enableChat !== this.context.userData?.preferences.chat) payload.chat = enableChat;
    if (enableSound !== undefined && enableSound !== this.context.userData?.preferences.sound) payload.sound = enableSound;
    if (this.context.userData?.picture !== this.previousPicture) payload.picture = this.context.userData!.picture;

    if (Object.keys(payload).length === 0) return;

    const result = await updateProfile(payload);

    if (result.success) {
      console.log('Profile updated');
      this.showForm(this.profileUpdateSuccess, 'profileSuccess', 'Profile successfully updated');
      this.context.userData = result.user;

      this.scene.registry.set('userPreferences', {
        chat: result.user.preferences.chat,
        sound: result.user.preferences.sound
      });

      this.scene.sound.mute = !result.user.preferences.sound;
    } else {
      this.loadUserData();
      this.profilePicture.setTexture(this.previousPicture!);
      this.showForm(this.profileUpdateError, 'profileError', result.error); // Show server error to user
    }
  }

  async handleDelete(): Promise<void> {
    const result = await deleteAccount();
    if (result.success) this.context.scene.start('MainMenuScene');
  }

  toggleFormVisibility(visible: boolean) {
    this.emailInput.setVisible(visible);
    this.passwordInput.setVisible(visible);
    this.passwordConfirmInput.setVisible(visible);
    this.notificationsCheckBox.setVisible(visible);
    this.chatCheckBox.setVisible(visible);
    this.soundCheckBox.setVisible(visible);
    this.profileUpdateError.setVisible(visible);
    this.profileUpdateSuccess.setVisible(visible);
  }

  showForm(domElement: Phaser.GameObjects.DOMElement, elementId: string, message: string) {
    domElement.setVisible(true);

    const node = domElement.getChildByID?.(elementId) as HTMLDivElement | null;
    if (node) {
      node.innerText = message;
      node.style.display = 'block';
    }
  }

  hideForm(domElement: Phaser.GameObjects.DOMElement, elementId: string) {
    const node = domElement.getChildByID?.(elementId) as HTMLDivElement | null;
    if (node) {
      node.innerText = '';
      node.style.display = 'none';
    }
  }
}
