import { Profile } from "./profileSceneUtils/profile";
import { IUserPreferences, IUserStats } from "../interfaces/userInterface";
import { getProfile } from "../queries/userQueries";

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

  async create() {
    // User data query
    this.userData = await getProfile();

    this.profile = new Profile(this);
  }

  onShutdown() {
    // this.sound.stopAll();
  }
}