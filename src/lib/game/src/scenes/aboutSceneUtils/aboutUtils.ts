import { fanAcademyText, heroAcademyText, disclaimerText, playText, profileText, leaderboardText, gameText, mechanicsText, countilText, councilItemsText, elvesText, elvesItemsText, dwarvesText, dwarvesItemsText } from "./aboutText";

export function addTextContainer(context: Phaser.Scene): Phaser.GameObjects.Container {
  const aboutContainer = new Phaser.GameObjects.Container(context, 420, 25);

  const fontOptions = {
    fontFamily: "proLight",
    fontSize: 35,
    color: '#ffffff',
    wordWrap: {
      width: 1000,
      useAdvancedWrap: true
    }
  };

  // Start the About text
  aboutContainer.add(context.add.text(0, 0, 'Index', {
    ...fontOptions,
    fontSize: 50
  }));

  aboutContainer.add(context.add.text(0, 300, 'What is Fan Academy?', {
    ...fontOptions,
    fontSize: 50
  }));
  aboutContainer.add(context.add.text(0, 360, fanAcademyText, fontOptions));

  aboutContainer.add(context.add.text(0, 620, 'What is Hero Academy?', {
    ...fontOptions,
    fontSize: 50
  }));
  aboutContainer.add(context.add.text(0, 680, heroAcademyText, fontOptions));

  aboutContainer.add(context.add.text(0, 870, 'Disclaimer for third-party assets', {
    ...fontOptions,
    fontSize: 50
  }));
  aboutContainer.add(context.add.text(0, 930, disclaimerText, fontOptions));

  aboutContainer.add(context.add.text(0, 1110, 'Menu guide', {
    ...fontOptions,
    fontSize: 50
  }));

  aboutContainer.add(context.add.text(0, 2130, playText, fontOptions));

  aboutContainer.add(context.add.text(0, 4180, profileText, fontOptions));

  aboutContainer.add(context.add.text(0, 5080, leaderboardText, fontOptions));

  aboutContainer.add(context.add.text(0, 5330, 'Game guide', {
    ...fontOptions,
    fontSize: 60
  }));

  aboutContainer.add(context.add.text(0, 5400, gameText, fontOptions));

  aboutContainer.add(context.add.text(0, 5650, 'General mechanics', {
    ...fontOptions,
    fontSize: 50
  }));
  aboutContainer.add(context.add.text(0, 5710, mechanicsText, fontOptions));

  aboutContainer.add(context.add.text(0, 8740, 'Factions', {
    ...fontOptions,
    fontSize: 60
  }));
  aboutContainer.add(context.add.image(450, 8970, 'councilAbout'));
  aboutContainer.add(context.add.text(0, 9120, countilText, {
    ...fontOptions,
    wordWrap: {
      width: 700,
      useAdvancedWrap: true
    }
  }));
  aboutContainer.add(context.add.text(0, 10310, councilItemsText, fontOptions));

  aboutContainer.add(context.add.image(450, 11030, 'elvesAbout'));
  aboutContainer.add(context.add.text(0, 11190, elvesText, {
    ...fontOptions,
    wordWrap: {
      width: 750,
      useAdvancedWrap: true
    }
  }));
  aboutContainer.add(context.add.text(0, 12850, elvesItemsText, fontOptions));

  aboutContainer.add(context.add.image(450, 13780, 'dwarvesAbout'));
  aboutContainer.add(context.add.text(0, 13930, dwarvesText, {
    ...fontOptions,
    wordWrap: {
      width: 750,
      useAdvancedWrap: true
    }
  }));
  aboutContainer.add(context.add.text(0, 15560, dwarvesItemsText, fontOptions));

  return aboutContainer;
}

export function getContainerHeight(container: Phaser.GameObjects.Container): number {
  let maxY = 0;
  container.iterate((child: any) => {
    const bottom = child.y + (child.height ?? 0);
    if (bottom > maxY) maxY = bottom;
  });
  return maxY;
}

export function addHyperlinks(context: Phaser.Scene, container: Phaser.GameObjects.Container, topY: number, bottomY: number, contentHeight: number) {
  // Set up index links
  const indexElem = [
    {
      title: 'Menu guide',
      y: 1030
    },
    {
      title: 'Game guide',
      y: 5240
    },
    {
      title: 'Council',
      y: 8740
    },
    {
      title: 'Dark Elves',
      y: 10850
    },
    {
      title: 'Dwarves',
      y: 13550
    }
  ];

  indexElem.forEach((elem, index) => {
    const link = addLink(context, elem, index, 60, container, topY, bottomY, contentHeight);

    container.add(link);
  });

  const mainMenuElem = [
    {
      title: 'Play!',
      y: 1210
    },
    {
      title: 'Profile',
      y: 3200
    },
    {
      title: 'Leaderboard',
      y: 4620
    }
  ];

  mainMenuElem.forEach((elem, index) => {
    const link = addLink(context, elem, index, 1090, container, topY, bottomY, contentHeight);

    container.add(link);
  });
}

export function addLink(context: Phaser.Scene, elem: {
  title: string,
  y: number
}, index: number, startPoint: number, aboutContainer: Phaser.GameObjects.Container, topY: number, bottomY: number, contentHeight: number): Phaser.GameObjects.Text {
  const link = context.add.text(0, startPoint + index * 50, elem.title, {
    fontFamily: "proLight",
    color: '#ffffff',
    fontSize: 35,
    backgroundColor: '#00f',
    padding: { x: 10 }
  });

  link.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
    aboutContainer.y = topY - elem.y;
    const minY = topY + (bottomY - contentHeight);
    aboutContainer.y = Phaser.Math.Clamp(aboutContainer.y, minY, topY);
  });

  return link;
}

export function addPictures(context: Phaser.Scene, container: Phaser.GameObjects.Container): void {
  // UI
  container.add(context.add.image(87, 1280, 'aboutPlayButton').setScale(0.5));
  container.add(context.add.image(490, 1690, 'aboutPlayPage').setScale(0.7));

  container.add(context.add.image(170, 3270, 'aboutProfileButton'));
  container.add(context.add.image(490, 3700, 'aboutProfilePage'));

  container.add(context.add.image(170, 4670, 'aboutLeaderboardButton'));
  container.add(context.add.image(490, 4860, 'aboutLeaderboardPage'));

  // Factions
  const pictureX = 840;
  container.add(context.add.image(pictureX, 9210, 'knightAbout').setScale(1.5));
  container.add(context.add.image(pictureX, 9440, 'archerAbout').setScale(1.5));
  container.add(context.add.image(pictureX, 9640, 'wizardAbout').setScale(1.5));
  container.add(context.add.image(pictureX, 9925, 'clericAbout').setScale(1.5));
  container.add(context.add.image(pictureX, 10150, 'ninjaAbout').setScale(1.5));

  container.add(context.add.image(pictureX, 11290, 'voidmonkAbout').setScale(1.5));
  container.add(context.add.image(pictureX, 11540, 'impalerAbout').setScale(1.5));
  container.add(context.add.image(pictureX, 11760, 'necromancerAbout').setScale(1.5));
  container.add(context.add.image(pictureX, 12010, 'priestessAbout').setScale(1.5));
  container.add(context.add.image(pictureX, 12310, 'wraithAbout').setScale(1.5));
  container.add(context.add.image(pictureX, 12660, 'phantomAbout').setScale(1.5));

  container.add(context.add.image(pictureX, 14030, 'paladinAbout').setScale(1));
  container.add(context.add.image(pictureX, 14410, 'grenadierAbout').setScale(1));
  container.add(context.add.image(pictureX, 14670, 'gunnerAbout').setScale(1));
  container.add(context.add.image(pictureX, 14990, 'engineerAbout').setScale(1));
  container.add(context.add.image(pictureX, 15330, 'annihilatorAbout').setScale(1));
}
