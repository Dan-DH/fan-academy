import { EActionType, EAttackType, EHeroes } from "../../../enums/gameEnums";
import { IItem } from "../../../interfaces/gameInterface";
import { Hero } from "../hero";
import { Item } from "../item";
import { Tile } from "../../board/tile";
import { getAOETiles } from "../../../utils/boardUtils";
import { roundToFive } from "../../../utils/gameUtils";
import { useAnimation } from "../../../utils/unitAnimations";
import { Crystal } from "../../board/crystal";
import { StatusEffects } from "../../../utils/statuses";

export class SoulStone extends Item {
  constructor(data: IItem) {
    super(data);
  }

  use(target: Hero): void {
    target.equipFactionEquipment(this.stats.boardPosition);
    this.removeFromGame();
  }
}

export class ManaVial extends Item {
  constructor(data: IItem) {
    super(data);
  }

  use(target: Hero): void {
    if (target.stats.isKO) return;

    // this.scene.sound.play(EGameSounds.POTION_USE);
    const potionImage = this.scene.add.image(target.x, target.y - 10, 'gameAtlas', 'manaVial').setDepth(100);
    useAnimation(potionImage);

    if (target.status.has(StatusEffects.MANA_VIAL)) {
      target.getsHealed(1000);
    } else {
      target.healAndIncreaseHealth(1000, 50);
      target.status.add(StatusEffects.MANA_VIAL);
    }

    this.context.afterAction(EActionType.USE, this.stats.boardPosition, target.stats.boardPosition);

    this.removeFromGame();
  }
}

export class SoulHarvest extends Item {
  constructor(data: IItem) {
    super(data);
  }

  use(targetTile: Tile): void {
    const harvestIamge = this.scene.add.image(targetTile.x, targetTile.y - 20, 'gameAtlas', 'soulHarvestShockWave').setDepth(100);
    useAnimation(harvestIamge);

    // this.scene.sound.play(EGameSounds.USE_HARVEST);

    // Damages enemy units and crystals but doesn't remove KO'd enemy units
    const damage = 100;

    // Keep track of the cumulative damage done (not attack power used) to enemy heroes (not crystals)
    let totalDamageInflicted = 0;

    const enemyUnits = getAOETiles(this, targetTile.boardPosition);
    enemyUnits.forEach(u => {
      if (u instanceof Crystal) {
        u.getsDamaged(damage, EAttackType.MAGICAL, this);
        return;
      }

      if (u instanceof Hero) {
        if (u.stats.isKO) return;

        totalDamageInflicted += u.getsDamaged(damage, EAttackType.MAGICAL, this);

        if (u.stats.unitType === EHeroes.PHANTOM && u.stats.isKO) u.removeFromGame();
      }
    });

    // Get total amount of friendly units in the map, including KO'd ones
    const friendlyUnits = this.context.board!.units.filter(u => u instanceof Hero && u.stats.belongsTo === this.stats.belongsTo) as Hero[];

    // Divide damage dealt by that number + 3, then round to nearest 5. Formula: 1 / (units + 3) * damage
    const lifeIncreaseAmount = roundToFive(1 / (friendlyUnits.length + 3) * totalDamageInflicted);

    // Increase max health of all units, including KO'd ones, and revive them
    friendlyUnits.forEach(unit => unit.increaseMaxHealth(lifeIncreaseAmount));

    this.context.afterAction(EActionType.USE, this.stats.boardPosition, targetTile.boardPosition);
    this.removeFromGame();
  }
}
