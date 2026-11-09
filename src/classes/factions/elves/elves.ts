import { EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { Hero } from "../hero";
import { useAnimation } from "../../../utils/unitAnimations";
import { roundToFive } from "../../../utils/gameUtils";
import { StatusEffects } from "../../../utils/statuses";

export abstract class DarkElf extends Hero {
  constructor(data: IHero) {
    super(data);
  }
  equipFactionEquipment(handPosition: number): void {
    const soulStone = this.scene.add.image(this.x, this.y - 10, 'gameAtlas', 'soulStone').setOrigin(0.5).setDepth(100);
    useAnimation(soulStone);

    this.status.add(StatusEffects.FACTION_EQUIPMENT);
    this.visuals.factionEquipmentImage.setVisible(true);
    this.visuals.characterImage.setTexture('gameAtlas', this.visuals.updateCharacterImage(this.stats));
    this.increaseMaxHealth(this.stats.baseHealth * 0.1);

    this.unitCard.updateCardData(this);

    // this.scene.sound.play(EGameSounds.ITEM_USE);

    this.context.afterAction(EActionType.USE, handPosition, this.stats.boardPosition);
  }

  lifeSteal(damage: number, spikeArmor: boolean): void {
    if (this.status.has(StatusEffects.FACTION_EQUIPMENT)) {
      const roundedHealing = roundToFive(damage * (spikeArmor ? 0.333 : 0.666));
      this.getsHealed(roundedHealing);
    } else if (!spikeArmor) {
      const roundedHealing = roundToFive(damage * 0.333);
      this.getsHealed(roundedHealing);
    }
  }
}