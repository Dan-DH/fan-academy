import UIScene from "../ui.scene";

export async function loadProfilePictures(context: UIScene): Promise<void> {
  if (!context.gameList?.length) return;

  const allPlayerObjects: {
    username: string,
    picture: string
  }[] = [];

  context.gameList.forEach((game) => {
    const opponent  = game.players.find(player => player.userData._id !== context.userId);

    if (opponent) allPlayerObjects.push({
      username: opponent.userData.username,
      picture: opponent.userData.picture
    });
  });

  // Remove duplicates
  const uniqueOpponents: {
    username: string,
    picture: string
  }[] = Array.from(
    allPlayerObjects.reduce((map, opponent) => map.set(opponent.username, opponent), new Map<string, {
      username: string,
      picture: string
    }>()).values()
  );

  uniqueOpponents.forEach( opponent => {
    if (context.textures.exists(opponent.username)) context.textures.remove(opponent.username);
    context.load.image(opponent.username, opponent.picture);
  });

  const player = context.gameList[0].players.find(player => player.userData._id === context.userId);
  if (context.textures.exists(player!.userData.username)) context.textures.remove(player!.userData.username);
  context.load.image(player!.userData.username, player!.userData.picture);

  return new Promise((resolve) => {
    context.load.once('complete', () => {
      resolve();
    });
    context.load.start(); // Start loading after setting up the event listener
  });
}