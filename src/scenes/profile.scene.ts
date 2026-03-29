import { Profile } from "./profileSceneUtils/profile";
import { IUserPreferences, IUserStats } from "../interfaces/userInterface";
import { getProfile } from "../queries/userQueries";
import { CDN_PATH } from "./preloader.scene";
import { profilePicNames } from "./profileSceneUtils/profilePicNames";

export default class ProfileScene extends Phaser.Scene {
  userId!: string;
  profile: Profile | undefined;

  userData: {
    _id: string;
    username: string;
    email: string;
    picture: string;
    preferences: IUserPreferences;
    stats: IUserStats
  } | null | undefined;

  constructor() {
    super({ key: 'ProfileScene' });
  }

  init(data: { userId: string, }) {
    this.userId = data.userId;
  }

  preload() {
    // profile pictures
    profilePicNames.forEach(name => {
      this.load.image(name, `${CDN_PATH}/images/profilePics/${name}.webp`);
    });
  }

  async create() {
    // User data query
    this.userData = await getProfile();

    this.profile = new Profile(this);
  }

  onShutdown() {
    this.sound.stopAll();
  }
}