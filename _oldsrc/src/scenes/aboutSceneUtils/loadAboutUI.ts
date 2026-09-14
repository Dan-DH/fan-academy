import AboutScene from "../about.scene";
import { CDN_PATH } from "../preloader.scene";

export function loadAboutUI(context: AboutScene): void {
  context.load.image('councilAbout', `${CDN_PATH}/images/aboutImages/Council_SplashScreen1.webp`);
  context.load.image('archerAbout', `${CDN_PATH}/images/aboutImages/Archer_tile.webp`);
  context.load.image('clericAbout', `${CDN_PATH}/images/aboutImages/Cleric_tile.webp`);
  context.load.image('knightAbout', `${CDN_PATH}/images/aboutImages/Knight_tile.webp`);
  context.load.image('ninjaAbout', `${CDN_PATH}/images/aboutImages/Ninja_tile.webp`);
  context.load.image('wizardAbout', `${CDN_PATH}/images/aboutImages/Wizard_tile.webp`);

  context.load.image('elvesAbout', `${CDN_PATH}/images/aboutImages/DarkElves_SplashScreen.webp`);
  context.load.image('impalerAbout', `${CDN_PATH}/images/aboutImages/Impaler_tile.webp`);
  context.load.image('necromancerAbout', `${CDN_PATH}/images/aboutImages/Necromancer_tile.webp`);
  context.load.image('phantomAbout', `${CDN_PATH}/images/aboutImages/Phantom_tile.webp`);
  context.load.image('priestessAbout', `${CDN_PATH}/images/aboutImages/Priestess_tile.webp`);
  context.load.image('voidmonkAbout', `${CDN_PATH}/images/aboutImages/VoidMonk_tile.webp`);
  context.load.image('wraithAbout', `${CDN_PATH}/images/aboutImages/Wraith_tile.webp`);

  context.load.image('dwarvesAbout', `${CDN_PATH}/images/aboutImages/Dwarves_SplashScreen.webp`);
  context.load.image('paladinAbout', `${CDN_PATH}/images/aboutImages/Paladin_tile.webp`);
  context.load.image('engineerAbout', `${CDN_PATH}/images/aboutImages/Engineer_tile.webp`);
  context.load.image('gunnerAbout', `${CDN_PATH}/images/aboutImages/Gunner_tile.webp`);
  context.load.image('grenadierAbout', `${CDN_PATH}/images/aboutImages/Grenadier_tile.webp`);
  context.load.image('annihilatorAbout', `${CDN_PATH}/images/aboutImages/Annihilator_tile.webp`);

  context.load.image('arrowAbout', `${CDN_PATH}/images/aboutImages/AvatarArrow-hd.webp`);

  context.load.image('aboutPlayButton', `${CDN_PATH}/images/aboutImages/play_button.webp`);
  context.load.image('aboutProfileButton', `${CDN_PATH}/images/aboutImages/profile_button.webp`);
  context.load.image('aboutLeaderboardButton', `${CDN_PATH}/images/aboutImages/leaderboard_button.webp`);

  context.load.image('aboutPlayPage', `${CDN_PATH}/images/aboutImages/play_page.webp`);
  context.load.image('aboutProfilePage', `${CDN_PATH}/images/aboutImages/profile_page.webp`);
  context.load.image('aboutLeaderboardPage', `${CDN_PATH}/images/aboutImages/leaderboard_page.webp`);
}