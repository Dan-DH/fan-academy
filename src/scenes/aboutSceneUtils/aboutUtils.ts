import { fanAcademyText, heroAcademyText, disclaimerText, playText, profileText, leaderboardText, gameText, mechanicsText, countilText, councilItemsText, elvesText, elvesItemsText, dwarvesText, dwarvesItemsText, tribeText, tribeItemsText } from "./aboutText";

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

  aboutContainer.add(context.add.text(0, 360, 'What is Fan Academy?', {
    ...fontOptions,
    fontSize: 50
  }));
  aboutContainer.add(context.add.text(0, 420, fanAcademyText, fontOptions));

  aboutContainer.add(context.add.text(0, 680, 'What is Hero Academy?', {
    ...fontOptions,
    fontSize: 50
  }));
  aboutContainer.add(context.add.text(0, 740, heroAcademyText, fontOptions));

  aboutContainer.add(context.add.text(0, 930, 'Disclaimer for third-party assets', {
    ...fontOptions,
    fontSize: 50
  }));
  aboutContainer.add(context.add.text(0, 990, disclaimerText, fontOptions));

  aboutContainer.add(context.add.text(0, 1170, 'Menu guide', {
    ...fontOptions,
    fontSize: 50
  }));

  aboutContainer.add(context.add.text(0, 2190, playText, fontOptions));

  aboutContainer.add(context.add.text(0, 4240, profileText, fontOptions));

  aboutContainer.add(context.add.text(0, 5140, leaderboardText, fontOptions));

  aboutContainer.add(context.add.text(0, 5390, 'Game guide', {
    ...fontOptions,
    fontSize: 60
  }));

  aboutContainer.add(context.add.text(0, 5460, gameText, fontOptions));

  aboutContainer.add(context.add.text(0, 5710, 'General mechanics', {
    ...fontOptions,
    fontSize: 50
  }));
  aboutContainer.add(context.add.text(0, 5770, mechanicsText, fontOptions));

  aboutContainer.add(context.add.text(0, 8800, 'Factions', {
    ...fontOptions,
    fontSize: 60
  }));
  aboutContainer.add(context.add.image(450, 9030, 'councilAbout'));
  aboutContainer.add(context.add.text(0, 9180, countilText, {
    ...fontOptions,
    wordWrap: {
      width: 700,
      useAdvancedWrap: true
    }
  }));
  aboutContainer.add(context.add.text(0, 10370, councilItemsText, fontOptions));

  aboutContainer.add(context.add.image(450, 11090, 'elvesAbout'));
  aboutContainer.add(context.add.text(0, 11250, elvesText, {
    ...fontOptions,
    wordWrap: {
      width: 750,
      useAdvancedWrap: true
    }
  }));
  aboutContainer.add(context.add.text(0, 12910, elvesItemsText, fontOptions));

  aboutContainer.add(context.add.image(450, 13840, 'dwarvesAbout'));
  aboutContainer.add(context.add.text(0, 13990, dwarvesText, {
    ...fontOptions,
    wordWrap: {
      width: 750,
      useAdvancedWrap: true
    }
  }));
  aboutContainer.add(context.add.text(0, 15610, dwarvesItemsText, fontOptions));

  aboutContainer.add(context.add.image(450, 16550, 'tribeAbout'));
  aboutContainer.add(context.add.text(0, 16700, tribeText, {
    ...fontOptions,
    wordWrap: {
      width: 750,
      useAdvancedWrap: true
    }
  }));
  aboutContainer.add(context.add.text(0, 18420, tribeItemsText, fontOptions));

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
      y: 1150
    },
    {
      title: 'Game guide',
      y: 5360
    },
    {
      title: 'Council',
      y: 8800
    },
    {
      title: 'Dark Elves',
      y: 10910
    },
    {
      title: 'Dwarves',
      y: 13620
    },
    {
      title: 'The Tribe',
      y: 16400
    }
  ];

  indexElem.forEach((elem, index) => {
    const link = addLink(context, elem, index, 60, container, topY, bottomY, contentHeight);

    container.add(link);
  });

  const mainMenuElem = [
    {
      title: 'Play!',
      y: 1270
    },
    {
      title: 'Profile',
      y: 3270
    },
    {
      title: 'Leaderboard',
      y: 4690
    }
  ];

  mainMenuElem.forEach((elem, index) => {
    const link = addLink(context, elem, index, 1160, container, topY, bottomY, contentHeight);

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
  container.add(context.add.image(87, 1410, 'aboutPlayButton').setScale(0.5));
  container.add(context.add.image(490, 1810, 'aboutPlayPage').setScale(0.7));

  container.add(context.add.image(170, 3400, 'aboutProfileButton'));
  container.add(context.add.image(490, 3830, 'aboutProfilePage'));

  container.add(context.add.image(170, 4820, 'aboutLeaderboardButton'));
  container.add(context.add.image(490, 4990, 'aboutLeaderboardPage'));

  // Factions
  const pictureX = 840;
  container.add(context.add.image(pictureX, 9270, 'knightAbout').setScale(1.5));
  container.add(context.add.image(pictureX, 9500, 'archerAbout').setScale(1.5));
  container.add(context.add.image(pictureX, 9700, 'wizardAbout').setScale(1.5));
  container.add(context.add.image(pictureX, 9985, 'clericAbout').setScale(1.5));
  container.add(context.add.image(pictureX, 10210, 'ninjaAbout').setScale(1.5));

  container.add(context.add.image(pictureX, 11350, 'voidmonkAbout').setScale(1.5));
  container.add(context.add.image(pictureX, 11600, 'impalerAbout').setScale(1.5));
  container.add(context.add.image(pictureX, 11820, 'necromancerAbout').setScale(1.5));
  container.add(context.add.image(pictureX, 12070, 'priestessAbout').setScale(1.5));
  container.add(context.add.image(pictureX, 12370, 'wraithAbout').setScale(1.5));
  container.add(context.add.image(pictureX, 12720, 'phantomAbout').setScale(1.5));

  container.add(context.add.image(pictureX, 14090, 'paladinAbout').setScale(1));
  container.add(context.add.image(pictureX, 14470, 'grenadierAbout').setScale(1));
  container.add(context.add.image(pictureX, 14730, 'gunnerAbout').setScale(1));
  container.add(context.add.image(pictureX, 15050, 'engineerAbout').setScale(1));
  container.add(context.add.image(pictureX, 15390, 'annihilatorAbout').setScale(1));

  container.add(context.add.image(pictureX, 16800, 'warriorAbout').setScale(1));
  container.add(context.add.image(pictureX, 17040, 'axeThrowerAbout').setScale(1));
  container.add(context.add.image(pictureX, 17300, 'witchAbout').setScale(1));
  container.add(context.add.image(pictureX, 17600, 'shamanAbout').setScale(1));
  container.add(context.add.image(pictureX, 18000, 'chieftainAbout').setScale(1));
}
