import { ETiles } from "../../enums/gameEnums";
import { ICrystal, IHero, ITile } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { makeTileClickable } from "../../utils/makeUnitClickable";
import { SpecialTileCard } from "../cards/specialTileCard";

export class Tile extends Phaser.GameObjects.Container {
  baseRectangle: Phaser.GameObjects.Rectangle;
  row: number;
  col: number;
  x: number;
  y: number;
  boardPosition: number;

  obstacle: boolean;
  hero: IHero | undefined;
  crystal: ICrystal | undefined;
  tileSize: number = 90;
  tileType: ETiles;

  isHighlighted: boolean;
  unitCard: SpecialTileCard | undefined;
  icon: Phaser.GameObjects.Image | undefined;

  constructor(context: GameScene,
    data: ITile) {
    super(context, data.x, data.y);

    this.row = data.row;
    this.col = data.col;
    this.x = data.x;
    this.y = data.y;
    this.tileType = data.tileType;
    this.obstacle = data.obstacle;
    this.hero = data.hero;
    this.crystal = data.crystal;
    this.boardPosition = data.boardPosition;

    // Add base tile shape
    this.baseRectangle = context.add.rectangle(0, 0, this.tileSize, this.tileSize);
    this.add(this.baseRectangle);
    this.isHighlighted = this.baseRectangle.isFilled;

    if (this.tileType !== ETiles.BASIC) this.unitCard = new SpecialTileCard(context, this.tileType).setVisible(false);

    // If tileType is not basic or a crystal, add the visual representation
    const typesToIgnore = [ETiles.BASIC, ETiles.CRYSTAL, ETiles.CRYSTAL_SMALL, ETiles.CRYSTAL_BIG];
    if (!typesToIgnore.includes(this.tileType)) {
      this.icon = context.add.image(0, 0, this.tileType);
      if (this.col > 4) this.icon.setFlipX(true);
      this.add(this.icon);
    }
    this.setSize(90, 90).setInteractive({ useHandCursor: true }).setDepth(2);
    makeTileClickable(this, context);

    if (this.unitCard) this.add(this.unitCard);

    context.add.existing(this);
  }

  getTileData(): ITile {
    return {
      row: this.row,
      col: this.col,
      x: this.x,
      y: this.y,
      tileType: this.tileType,
      boardPosition: this.boardPosition,
      obstacle: this.obstacle,
      hero: this.hero,
      crystal: this.crystal
    };
  }

  removeHero(): void {
    this.hero = undefined;
  }

  isFriendly(userId: string) {
    return this.hero && this.hero.unitId.includes(userId);
  }

  isEnemy(userId: string) {
    return this.hero && !this.hero.unitId.includes(userId);
  }

  setHighlight() {
    this.baseRectangle.setFillStyle(0x0080ff, 0.3);
    this.isHighlighted = this.baseRectangle.isFilled;
  }

  clearHighlight() {
    this.baseRectangle.setFillStyle();
    this.isHighlighted = this.baseRectangle.isFilled;
  }
}
