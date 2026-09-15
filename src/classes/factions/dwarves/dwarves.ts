import { EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { Hero } from "../hero";
import { useAnimation } from "../../../utils/unitAnimations";

export abstract class Dwarf extends Hero {
  constructor(data: IHero) {
    super(data);
  }

  equipFactionEquipment(handPosition: number): void {
    // this.scene.sound.play(EGameSounds.DRAGON_SCALE_USE);

    const dragonScaleImg = this.scene.add.image(this.x + 10, this.y - 10, 'gameAtlas', 'dragonScale').setOrigin(0.5).setDepth(100);
    useAnimation(dragonScaleImg);

    this.stats.factionEquipment = true;
    this.visuals.factionEquipmentImage.setVisible(true);
    this.visuals.characterImage.setTexture('gameAtlas', this.visuals.updateCharacterImage(this.stats));

    this.stats.physicalDamageResistance += 20;

    this.increaseMaxHealth(this.stats.baseHealth * 0.1);

    this.unitCard.updateCardData(this);
    this.updateTileData();

    this.context.gameController!.afterAction(EActionType.USE, handPosition, this.stats.boardPosition);
  }
}
