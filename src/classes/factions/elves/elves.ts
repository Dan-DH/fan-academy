import { EActionType, EAttackType, EClass, EFaction, EHeroes } from "../../../enums/gameEnums";
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

    this.context.gameController!.afterAction(EActionType.USE, handPosition, this.stats.boardPosition);
  }

  lifeSteal(damage: number): void {
    if (this.status.has(StatusEffects.FACTION_EQUIPMENT)) {
      const roundedHealing = roundToFive(damage * 0.666);
      this.getsHealed(roundedHealing);
    } else {
      const roundedHealing = roundToFive(damage * 0.333);
      this.getsHealed(roundedHealing);
    }
  }
}

// FIXME: to be replaced
export function createElvesPhantomData(data: Partial<IHero>): IHero {
  // Cannot be equipped, buffed or healed, disappears if KO'd
  return {
    unitType: EHeroes.PHANTOM,
    baseHealth: 100,
    maxHealth: 100,
    currentHealth: data.currentHealth ?? 100,
    movement: 3,
    attackRange: 1,
    healingRange: 0,
    attackType: EAttackType.MAGICAL,
    basePower: 100,
    physicalDamageResistance: 0,
    basePhysicalDamageResistance: 0,
    magicalDamageResistance: 0,
    baseMagicalDamageResistance: 0,
    canHeal: false,
    class: EClass.HERO,
    faction: EFaction.DARK_ELVES,
    unitId: data.unitId!,
    boardPosition: data.boardPosition ?? 51,
    isKO: data.isKO ?? false,
    lastBreath: data.lastBreath ?? false,
    belongsTo: data.belongsTo ?? 1,
    row: data.row ?? 0,
    col: data.col ?? 0,
    buffRange: 0,
    canBuff: false,
    paladinAura: data.paladinAura ?? 0,
    unitsConsumed: data.unitsConsumed ?? 0,
    status: 0
  };
}