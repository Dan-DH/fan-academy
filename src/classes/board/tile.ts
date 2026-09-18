import { ETiles } from "../../enums/gameEnums";
import { ISpecialTile, ITile } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { handleTileClick } from "../../utils/handleTileClick";
import { SpecialTileCard } from "../cards/specialTileCard";

export class Tile extends Phaser.GameObjects.Container {
  row: number;
  col: number;
  boardPosition: number;
  x: number;
  y: number;

  baseRectangle: Phaser.GameObjects.Rectangle;
  tileSize: number = 90;
  tileType: ETiles;
  isHighlighted: boolean;
  unitCard: SpecialTileCard | undefined;
  icon: Phaser.GameObjects.Image | undefined;

  constructor(context: GameScene, data: ISpecialTile) {
    const coordinates = context.centerPoints[data.boardPosition];
    super(context, coordinates.x, coordinates.y);

    this.x = coordinates.x;
    this.y = coordinates.y;
    this.row = data.row;
    this.col = data.col;
    this.tileType = data.tileType;
    this.boardPosition = data.boardPosition;

    // Add base tile shape
    this.baseRectangle = context.add.rectangle(0, 0, this.tileSize, this.tileSize);
    this.add(this.baseRectangle);
    this.isHighlighted = this.baseRectangle.isFilled;

    // If tileType is not basic or a crystal, add the visual representation
    const typesToIgnore = [ETiles.BASIC, ETiles.CRYSTAL, ETiles.CRYSTAL_SMALL, ETiles.CRYSTAL_BIG];
    if (!typesToIgnore.includes(this.tileType)) {
      this.icon = context.add.image(0, 0, 'gameAtlas', this.tileType).setScale(1.2).setDepth(0);
      if (this.col > 4) this.icon.setFlipX(true);
      this.unitCard = new SpecialTileCard(context, this.tileType).setVisible(false).setDepth(100);
      this.add([this.icon, this.unitCard]);
    }

    this.setSize(90, 90).setInteractive({ useHandCursor: true });
    handleTileClick(this, context);
    // parentLayer.add(this);
    context.add.existing(this);
  }

  getTileData(): ITile {
    return {
      row: this.row,
      col: this.col,
      x: this.x,
      y: this.y,
      tileType: this.tileType,
      boardPosition: this.boardPosition
    };
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
