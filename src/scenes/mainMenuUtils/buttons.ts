import MainMenuScene from "../mainMenu.scene";

export default function createMainMenuButton(params: {
  thisParam: MainMenuScene,
  x: number,
  y: number,
  imageKey: string,
  text: string,
  font: string,
  tint?: string,
  scale?: number,
  callback?: any
}) {
  const { thisParam, x, y, imageKey, text, font, tint, scale, callback } = params;
  const buttonImage = thisParam.add.sprite(0, 0, 'gameAtlas', imageKey).setOrigin(0.5).setScale(scale ?? 1.3).setInteractive({ useHandCursor: true });

  const buttonText = thisParam.add.text(0.5, 0.5, text, { font }).setOrigin(0.5, 0.6);

  if (tint) buttonImage.setTint(0x990000);

  const container = thisParam.add.container(x, y, [buttonImage, buttonText]);

  // Add interactivity to the image (acts as the button)
  buttonImage.on('pointerdown', () => {
    callback(); // Call the provided callback on click
  });

  return container;
}