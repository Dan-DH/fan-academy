import { EClass, EFaction, EItems } from "../enums/gameEnums";
import { IItem } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";
import { makeUnitClickable } from "../utils/makeUnitClickable";
import { Hero } from "./hero";
import { ItemCard } from "./itemCard";

export abstract class Item extends Phaser.GameObjects.Container {
  class: EClass = EClass.ITEM;
  faction: EFaction;
  unitId: string;
  itemType: EItems;
  boardPosition: number;
  isActiveValue: boolean;
  belongsTo: number;
  canHeal: boolean;
  dealsDamage: boolean;
  itemImage: Phaser.GameObjects.Image;

  context: GameScene;

  unitCard: ItemCard;

  constructor(context: GameScene, data: IItem) {
    const { x, y } = context.centerPoints[data.boardPosition];
    super(context, x, y - 20); // REVIEW: -20 ?
    this.context = context;

    this.unitCard = new ItemCard(context, data).setVisible(false);

    // Interface properties assignment
    this.unitId = data.unitId;
    this.faction = data.faction;
    this.itemType = data.itemType;
    this.boardPosition = data.boardPosition;
    this.isActiveValue = false;
    this.belongsTo = data.belongsTo ?? 1;
    this.canHeal = data.canHeal ?? false;
    this.dealsDamage = data.dealsDamage ?? false;

    this.itemImage = context.add.image(0, 0, this.itemType).setOrigin(0.5).setName('itemImage');

    // Add listener for clicking on the unit
    makeUnitClickable(this, context);

    // Making the item not visible if it's in the deck (board position 51)
    if (this.boardPosition === 51) this.setVisible(false).disableInteractive();

    // Setting the image size. SuperCharge and ShinningHelm icons have slighty different sizes
    this.itemImage.displayWidth = 110;
    this.itemImage.displayHeight = 110;

    if (this instanceof SuperCharge) {
      this.itemImage.displayWidth = 55;
      this.itemImage.displayHeight = 55;
    }

    if (this instanceof ShiningHelm) {
      this.itemImage.displayWidth = 45;
      this.itemImage.displayHeight = 65;
    }

    this.add([this.itemImage, this.unitCard]).setSize(50, 50).setDepth(this.boardPosition + 10).setInteractive().setName(this.unitId);

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
    return {
      class: this.class,
      faction: this.faction,
      unitId: this.unitId,
      itemType: this.itemType,
      boardPosition: this.boardPosition,
      belongsTo: this.belongsTo,
      canHeal: this.canHeal,
      dealsDamage: this.dealsDamage
    };
  }

  updatePosition(boardPosition: number): void {
    const { x, y } = this.context.centerPoints[boardPosition];
    this.x = x;
    this.y = y;
    this.boardPosition = boardPosition;
  }

  onActivate() {
    console.log(`${this.unitId} is now active`);
    this.setScale(1.2);
  }

  onDeactivate() {
    console.log(`${this.unitId} is now inactive`);
    this.setScale(1);
  }

  shuffleInDeck(): void {
    this.boardPosition = 51;

    const unitData = this.exportData();

    this.context.gameController!.deck.addToDeck(unitData);

    this.removeFromGame();
  }

  removeFromGame(): void {
    // Remove animations
    this.scene.tweens.killTweensOf(this);

    this.context.gameController?.hand.removeFromHand(this);

    this.destroy(true);
  }

  abstract use(target: any): void;
}

export class ShiningHelm extends Item {
  constructor(context: GameScene, data: IItem) {
    super(context, data);
  }

  use(target: Hero): void {
    target.equipShiningHelm(this.boardPosition);
    this.removeFromGame();
  }
}

export class RuneMetal extends Item {
  constructor(context: GameScene, data: IItem) {
    super(context, data);
  }

  use(target: Hero): void {
    target.equipRunemetal(this.boardPosition);
    this.removeFromGame();
  }
}

export class SuperCharge extends Item {
  constructor(context: GameScene, data: IItem) {
    super(context, data);
  }

  use(target: Hero): void {
    target.equipSuperCharge(this.boardPosition);
    this.removeFromGame();
  }
}