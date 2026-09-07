import { EActionType } from "../../enums/gameEnums";
import GameScene from "../../scenes/game.scene";
import { isInHand } from "../../utils/gameUtils";
import { getCurrentPlayer } from "../../utils/playerUtils";

export class Door extends Phaser.GameObjects.Container {
  doorClosed: Phaser.GameObjects.Image;
  doorOpen: Phaser.GameObjects.Image;
  doorBanner: Phaser.GameObjects.Image;
  bannerText: Phaser.GameObjects.Text;
  context: GameScene;

  constructor(context: GameScene) {
    super(context, 450, 715);
    this.context = context;

    this.doorClosed = context.add.image(50, -15, 'gameAtlas', 'doorClosed').setScale(1.1);

    this.doorOpen = context.add.image(55, -15, 'gameAtlas', 'doorOpen').setScale(1.1).setVisible(false);

    this.doorBanner = context.add.image(0, 45, 'gameAtlas', 'doorBanner').setScale(1.2);
    const deckSize: number = getCurrentPlayer(context).factionData.unitsInDeck.length ?? 99;
    this.bannerText = this.context.add.text(0, 45 + 2, deckSize!.toString(), {
      fontFamily: "proLight",
      fontSize: 30,
      color: '#000000'
    }).setOrigin(0.5);

    this.add([this.doorClosed, this.doorOpen, this.doorBanner, this.bannerText]);

    this.setSize(70, 100).setInteractive({ useHandCursor: true });

    this.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.button === 0 && context.activeUnit && isInHand(context.activeUnit.stats.boardPosition)) {
        // playSound(this.scene, EGameSounds.SHUFFLE);

        const activePosition = context.activeUnit.stats.boardPosition;
        context.activeUnit.shuffleInDeck();

        // Add action to state
        context.gameController?.afterAction(EActionType.SHUFFLE, activePosition, 51);

        this.updateBannerText();
      }
    });

    context.add.existing(this);
  }

  updateBannerText(): void {
    const deckSize: number = this.context.gameController?.deck.getDeckSize() ?? 0;

    this.bannerText.setText(deckSize.toString());
  }

  openDoor(): void {
    this.doorOpen.setVisible(true);
    this.doorClosed.setVisible(false);

    this.scene.time.delayedCall(1000, () => {
      this.doorOpen.setVisible(false);
      this.doorClosed.setVisible(true);
    });
  }
}