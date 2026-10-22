import { EActionType, EItems } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { Hero } from "../hero";
import { useAnimation } from "../../../utils/unitAnimations";
import { StatusEffects } from "../../../utils/statuses";

export abstract class Tribe extends Hero {
  constructor(data: IHero) {
    super(data);
  }

  addBloodlust(): void {
    this.status.add(StatusEffects.BLOODLUST);
    this.visuals.updateCharacterImage(this.stats);
    this.unitCard.updateCardPower(this);
  }

  removeBloodlust(): void {
    this.status.remove(StatusEffects.BLOODLUST);
    this.visuals.updateCharacterImage(this.stats);
    this.unitCard.updateCardPower(this);
  }

  equipFactionEquipment(handPosition: number): void {
    // this.scene.sound.play(EGameSounds.DRAGON_SCALE_USE); // FIXME:

    const spikeImg = this.scene.add.image(this.x + 10, this.y - 10, 'gameAtlas', EItems.SPIKE_ARMOR).setOrigin(0.5).setDepth(100);
    useAnimation(spikeImg);

    this.status.add(StatusEffects.SPIKE_ARMOR);
    this.visuals.factionEquipmentImage.setVisible(true);
    this.visuals.characterImage.setTexture('gameAtlas', this.visuals.updateCharacterImage(this.stats));

    this.increaseMaxHealth(this.stats.baseHealth * 0.1);

    this.unitCard.updateCardData(this);

    this.context.afterAction(EActionType.USE, handPosition, this.stats.boardPosition);
  }
}
