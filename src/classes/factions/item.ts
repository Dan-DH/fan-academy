import { EItems } from "../../enums/gameEnums";
import { IItem } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { makeUnitClickable } from "../../utils/makeUnitClickable";
import { ItemCard } from "../cards/itemCard";

export abstract class Item extends Phaser.GameObjects.Container {
  stats: IItem;
  isActiveValue: boolean = false;
  itemImage: Phaser.GameObjects.Image;
  context: GameScene;
  unitCard: ItemCard;

  constructor(context: GameScene, data: IItem) {
    const { x, y } = context.centerPoints[data.boardPosition];
    super(context, x, y - 20);
    this.context = context;
    this.stats = data;
    this.unitCard = new ItemCard(context, data).setVisible(false);

    this.itemImage = context.add.image(0, 0, this.stats.itemType).setOrigin(0.5).setName('itemImage');

    if (this.stats.itemType ===  EItems.DRAGON_SCALE) {
      this.itemImage.displayWidth = 55;
      this.itemImage.displayHeight = 55;
    } else if (this.stats.itemType ===  EItems.SHINING_HELM) {
      this.itemImage.displayWidth = 45;
      this.itemImage.displayHeight = 65;
    } else {
      this.itemImage.displayWidth = 110;
      this.itemImage.displayHeight = 110;
    }

    const hitArea = new Phaser.Geom.Rectangle(-35, -30, 75, 85); // centered on (0,0)

    if (this.stats.boardPosition === 51) this.setVisible(false).disableInteractive();

    makeUnitClickable(this, context);

    this.add([this.itemImage, this.unitCard]).setDepth(this.stats.boardPosition).setInteractive({
      hitArea,
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true
    }).setName(this.stats.unitId);

    context.add.existing(this);
  }

  get isActive() {
    return this.isActiveValue;
  }

  set isActive(value: boolean) {
    this.isActiveValue = value;
    if (value) {
      this.onActivate();
    } else {
      this.onDeactivate();
    }
  }

  exportData(): IItem {
    return { ... this.stats };
  }

  updatePosition(boardPosition: number): void {
    const { x, y } = this.context.centerPoints[boardPosition];
    this.x = x;
    this.y = y;
    this.stats.boardPosition = boardPosition;
  }

  onActivate() {
    console.log(`${this.stats.unitId} is now active`);
    this.setScale(1.2);
  }

  onDeactivate() {
    console.log(`${this.stats.unitId} is now inactive`);
    this.setScale(1);
  }

  shuffleInDeck(): void {
    this.stats.boardPosition = 51;

    const unitData = this.exportData();

    this.context.gameController!.deck.addToDeck(unitData);

    this.removeFromGame();
  }

  removeFromGame(): void {
    // Remove animations
    this.scene.tweens.killTweensOf(this);

    this.context.gameController?.hand.removeFromHand(this.stats.unitId);

    this.destroy(true);
  }

  abstract use(target: any): void;
}
