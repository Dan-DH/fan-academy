import { EActionType, EGameSounds } from "../enums/gameEnums";
import GameScene from "../scenes/game.scene";
import { isInHand, effectSequence, timeDelay } from "../utils/gameUtils";
import { getCurrentPlayer } from "../utils/playerUtils";

export class Door extends Phaser.GameObjects.Container {
  doorClosed: Phaser.GameObjects.Image;
  doorOpen: Phaser.GameObjects.Image;
  doorBanner: Phaser.GameObjects.Image;
  bannerText: Phaser.GameObjects.Text;
  context: GameScene;

  constructor(context: GameScene) {
    super(context, 450, 715);
    this.context = context;

    // TODO: On container 'hoover' -> show icons of remaining units and items in the deck
    this.doorClosed = context.add.image(50, -15, 'doorClosed').setScale(0.9);

    this.doorOpen = context.add.image(55, -15, 'doorOpen').setVisible(false);

    this.doorBanner = context.add.image(0, 45, 'doorBanner');
    const deckSize: number = getCurrentPlayer(context).factionData.unitsInDeck.length ?? 99;
    this.bannerText = this.context.add.text(0, 45 + 2, deckSize!.toString(), {
      fontFamily: "proLight",
      fontSize: 30,
      color: '#000000'
    }).setOrigin(0.5);

    this.add([this.doorClosed, this.doorOpen, this.doorBanner, this.bannerText]);

    this.setSize(70, 100).setInteractive({ useHandCursor: true });

    this.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.button === 0 && context.activeUnit && isInHand(context.activeUnit.boardPosition)) {
        const activePosition = context.activeUnit.boardPosition;
        context.activeUnit.shuffleInDeck();
      
        // Add action to state
        context.gameController?.afterAction(EActionType.SHUFFLE, activePosition, 51 );

        effectSequence(this.scene, EGameSounds.RETURN_ITEM);

        this.updateBannerText();
      }

      if (pointer.button === 2) {
        console.log('Add list of items in Deck here');
      }
    });

    this.on('pointerover', (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown()) {
        // this.setDepth(1001);
        // this.unitCard.setVisible(true);
      }
    });

    this.on('pointerout', () => {
      // unit.setDepth(unit.boardPosition + 10);
      // unit.unitCard.setVisible(false);
    });

    context.add.existing(this);
  }

  updateBannerText(): void {
    const deckSize: number = this.context.gameController?.deck.getDeckSize() ?? 0;

    this.bannerText.setText(deckSize.toString());
  }

  async openDoor(): Promise<void> {
    this.doorOpen.setVisible(true);
    this.doorClosed.setVisible(false);

    await timeDelay(this.context, 1600)
    this.doorOpen.setVisible(false);
    this.doorClosed.setVisible(true);
  }
}