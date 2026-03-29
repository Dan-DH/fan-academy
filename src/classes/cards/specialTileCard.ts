import { ETiles, ECardType } from "../../enums/gameEnums";
import GameScene from "../../scenes/game.scene";

export class SpecialTileCard extends Phaser.GameObjects.Container {
  cardBackgroundImage: Phaser.GameObjects.Image;
  unitPictureImage: Phaser.GameObjects.Image;
  cardSeparatorImage: Phaser.GameObjects.Image;

  cardNameText: Phaser.GameObjects.Text;
  cardTypeText: Phaser.GameObjects.Text;
  cardFlavorText: Phaser.GameObjects.Text;

  context: GameScene;

  constructor(context: GameScene, tileType: ETiles) {
    super(context, 0, 0);
    this.context = context;

    // Unit image for special tiles (skip CRYSTAL)
    let unitImageKey = '';
    let typeLabel = '';
    let description = '';
    switch (tileType) {
      case ETiles.SPAWN:
        unitImageKey = 'spawnTile';
        typeLabel = 'Spawn Tile';
        description = 'Units can be spawned here.';
        break;
      case ETiles.POWER:
        unitImageKey = 'powerTile';
        typeLabel = 'Power Boost';
        description = 'Adds 100 damage to the unit on this tile.';
        break;
      case ETiles.PHYSICAL_RESISTANCE:
        unitImageKey = 'shieldTile';
        typeLabel = 'Defense Boost';
        description = 'Grants 20% physical resistance to the unit on this tile.';
        break;
      case ETiles.MAGICAL_RESISTANCE:
        unitImageKey = 'helmetTile';
        typeLabel = 'Resist Boost';
        description = 'Grants 20% magical resistance to the unit on this tile.';
        break;
      case ETiles.CRYSTAL_DAMAGE:
        unitImageKey = 'crystalDamageTile';
        typeLabel = 'Assault Boost';
        description = 'Adds 300 damage to all hits to crystals by any unit in the board.';
        break;
      case ETiles.TELEPORTER:
        unitImageKey = 'teleporterTile';
        typeLabel = 'Teleporter';
        description = 'Units on this tile can teleport to any other unoccupied teleporter.';
        break;
      case ETiles.SPEED:
        unitImageKey = 'speedTile';
        typeLabel = 'Speed Boost';
        description = 'Grants 2 extra movement to the unit on this tile.';
        break;
      default:
        unitImageKey = 'specialTile';
        typeLabel = 'Special Tile';
        description = 'A unique tile with special properties.';
        break;
    }

    // Background, unit image, name and type, and separator
    this.cardBackgroundImage = context.add.image(10, 10, 'cardBackground');
    this.unitPictureImage = context.add.image(-130, -140, unitImageKey).setOrigin(0.5).setScale(1.2);
    this.cardSeparatorImage = context.add.image(50, -100, 'cardSeparator').setOrigin(0.5).setScale(1.3);

    this.cardNameText = this.context.add.text(55, -170, typeLabel, {
      fontFamily: "proLight",
      fontSize: 50,
      color: '#ffffff'
    }).setOrigin(0.5);

    this.cardTypeText = this.context.add.text(55, -130, ECardType.SPECIAL_TILE, {
      fontFamily: "proLight",
      fontSize: 30,
      color: '#ffffff'
    }).setOrigin(0.5);

    // Flavour text
    this.cardFlavorText = this.context.add.text(0, -55, description, {
      fontFamily: "proLight",
      fontSize: 30,
      color: '#ffffff',
      wordWrap: {
        width: this.cardBackgroundImage.width - 50,
        useAdvancedWrap: true
      }
    }).setOrigin(0.5);

    this.add([
      this.cardBackgroundImage,
      this.unitPictureImage,
      this.cardSeparatorImage,
      this.cardNameText,
      this.cardTypeText,
      this.cardFlavorText
    ]);
  }
}
