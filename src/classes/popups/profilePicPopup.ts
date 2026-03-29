import ProfileScene from "../../scenes/profile.scene";
import { profilePicNames } from "../../scenes/profileSceneUtils/profilePicNames";

export class ProfilePicPopup extends Phaser.GameObjects.Container {
  visibleFlag: boolean;
  constructor(context: ProfileScene, profilePicture: Phaser.GameObjects.Image) {
    super(context, 900, 400);

    const modal = new Phaser.GameObjects.Container(context, 0, 0); // Centered relative to the popup

    // Used to block the user from clicking on some other part of the game
    const blockingLayer = context.add.rectangle(0, 0, 3000, 2000, 0x000000, 0.001).setOrigin(0.5).setInteractive();

    const modalWidth = 600;
    const modalHeight = 500;
    const avatarSize = 256 * 0.4;
    const padding = 10;
    const avatarsPerRow = 4;

    // Background
    const backgroundRectangle = context.add.rectangle(0, 0, modalWidth, modalHeight, 0x222222, 1).setStrokeStyle(2, 0xffffff);
    modal.add(backgroundRectangle);

    // Scrollable area
    const scrollContainer = new Phaser.GameObjects.Container(context, -modalWidth / 2 + padding, -modalHeight / 2 + padding);
    modal.add(scrollContainer);

    const thumbnails: Phaser.GameObjects.Image[] = [];

    const updateThumbnailInteractivity = () => {
      const maskTop = -modalHeight / 2 + padding + 25; // Matches your maskShape Y
      const maskBottom = maskTop + (modalHeight - 60);

      thumbnails.forEach(img => {
        const imgTop = img.y + scrollContainer.y;
        const imgBottom = imgTop + img.displayHeight;

        const isVisible = imgBottom > maskTop && imgTop < maskBottom;

        if (isVisible) {
          if (!img.input?.enabled) img.setInteractive({ useHandCursor: true }); // Prevent re-enabling every frame
        } else {
          img.disableInteractive();
        }
      });
    };

    profilePicNames.forEach((key, index) => {
      const row = Math.floor(index / avatarsPerRow);
      const col = index % avatarsPerRow;

      const x = col * (avatarSize + padding);
      const y = row * (avatarSize + padding);

      const img = context.add.image(x + 120, y - 160, key)
        .setInteractive({ useHandCursor: true })
        .setDisplaySize(avatarSize, avatarSize)
        .setData('key', key);

      img.on('pointerup', () => {
        if (pointerMoved || !this.visibleFlag) return; // skip tap if user was swiping

        context.userData!.picture = key;
        profilePicture!.setTexture(key).setDisplaySize(256 * 0.5, 256 * 0.5);
        this.setVisible(false);
        context.profile?.toggleFormVisibility(true);
      });

      thumbnails.push(img);
      scrollContainer.add(img);
    });

    // Scroll mask
    const maskX = this.x + scrollContainer.x;
    const maskY = this.y + scrollContainer.y;

    const maskShape = context.make.graphics({});
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(maskX, maskY + 25, modalWidth - 2 * padding, modalHeight - 60);

    const mask = new Phaser.Display.Masks.GeometryMask(context, maskShape);
    scrollContainer.setMask(mask);

    // Set initial scroll bounds
    const totalRows = Math.ceil(profilePicNames.length / avatarsPerRow);
    const contentHeight = totalRows * (avatarSize + padding);
    const minY = -contentHeight + modalHeight - 2 * padding - 100;
    scrollContainer.y = 0; // Make sure it's at top
    updateThumbnailInteractivity();

    // Enable wheel-based scrolling
    context.input.on('wheel', (_pointer: Phaser.Input.Pointer, _currentlyOver: any, _deltaX: number, deltaY: number, _deltaZ: number ) => {
      // Only scroll if the modal is visible
      if (!this.visible) return;

      scrollContainer.y -= deltaY * 1; // Adjust speed multiplier if needed
      scrollContainer.y = Phaser.Math.Clamp(scrollContainer.y, minY, 0);
      updateThumbnailInteractivity();
    });

    // Enable touch-based scrolling
    let isDragging = false;
    let dragStartY = 0;
    let pointerMoved = false;

    context.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (!this.visible) return;
      isDragging = true;
      dragStartY = pointer.y;
      pointerMoved = false;
    });

    context.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!isDragging) return;

      const deltaY = pointer.y - dragStartY;

      if (Math.abs(deltaY) > 5) pointerMoved = true;

      scrollContainer.y += deltaY * 0.7;
      scrollContainer.y = Phaser.Math.Clamp(scrollContainer.y, minY, 0);
      updateThumbnailInteractivity();

      dragStartY = pointer.y; // Update for next frame
    });

    context.input.on("gameobjectup", () => {
      isDragging = false;
      dragStartY = 0;
      pointerMoved = false;
    });

    this.add([
      blockingLayer,
      modal
    ]);

    this.setDepth(1002);
    this.setVisible(false);

    context.add.existing(this);
    this.visibleFlag = true;
  }
}