import { addTextContainer, getContainerHeight, addHyperlinks, addFactionPictures } from "./aboutSceneUtils/aboutUtils";
import { loadAboutUI } from "./aboutSceneUtils/loadAboutUI";

export default class AboutScene extends Phaser.Scene {
  constructor() {
    super({ key: 'AboutScene' });
  }

  preload() {
    loadAboutUI(this);
  }

  async create() {
    this.add.image(396, 14, 'gameBackground').setOrigin(0, 0).setScale(1.07, 1.2).setTint(0x999999);

    // Add (most) text
    const container = addTextContainer(this);

    // Set the mask to make the text scrollable
    const leftX = 396;
    const rightX = 1100;
    const topY = 20;
    const bottomY = 750;
    const maskGraphics = this.make.graphics();
    maskGraphics.fillRect(leftX, topY, rightX, bottomY);

    const mask = new Phaser.Display.Masks.GeometryMask(this, maskGraphics);

    container.setMask(mask);

    const withinScrollArea = (pointer: Phaser.Input.Pointer) => {
      return (
        pointer.x >= leftX &&
        pointer.x <= rightX &&
        pointer.y >= topY &&
        pointer.y <= bottomY
      );
    };

    const contentHeight = getContainerHeight(this, container);
    const visibleHeight = bottomY;

    addHyperlinks(this, container, topY, bottomY, contentHeight);

    addFactionPictures(this, container);

    // Scrolling on PC
    this.input.on("wheel", (pointer: Phaser.Input.Pointer, _gameObjects: any, _deltaX: number, deltaY: number, _deltaZ: number ) => {
      if (withinScrollArea(pointer) && contentHeight > visibleHeight) {
        container.y -= deltaY * 1; // Adjust speed multiplier if needed
        const minY = topY + (visibleHeight - contentHeight);
        container.y = Phaser.Math.Clamp(container.y, minY, topY);
      }
    });

    // Scrolling on mobile
    let isDragging = false;
    let dragStartY = 0;
    let dragStartOffset = 0;
    let pointerMoved = false;

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (withinScrollArea(pointer) && contentHeight > visibleHeight) {
        isDragging = true;
        dragStartY = pointer.y;
        dragStartOffset = container.y;
        pointerMoved = false;
      } else {
        isDragging = false;
        dragStartY = 0;
        dragStartOffset = 0;
        pointerMoved = false;
      }
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      console.log('this logs', isDragging);

      if (!isDragging) return;

      const deltaY = pointer.y - dragStartY;

      if (Math.abs(deltaY) > 5) pointerMoved = true;

      const minY = topY + (visibleHeight - contentHeight);
      container.y = Phaser.Math.Clamp(
        dragStartOffset + deltaY,
        minY,
        topY
      );
    });

    this.input.on("pointerup", () => {
      isDragging = false;
      dragStartY = 0;
      dragStartOffset = 0;
      pointerMoved = false;
    });

    // Back-to-top button
    const arrowButton = this.add.image(1350, 60, 'arrowAbout').setScale(2).setInteractive().setScrollFactor(0);
    arrowButton.on('pointerdown', () => {
      container.y = topY;
      const minY = topY + (visibleHeight - contentHeight);
      container.y = Phaser.Math.Clamp(container.y, minY, topY);
    });
  }
}
