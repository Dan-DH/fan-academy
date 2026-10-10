import { EActionType, EAttackType, EHeroes } from "../../../enums/gameEnums";
import { IItem } from "../../../interfaces/gameInterface";
import { Hero } from "../hero";
import { Item } from "../item";
import { Tile } from "../../board/tile";
import { getAOETiles } from "../../../utils/boardUtils";
import { useAnimation } from "../../../utils/unitAnimations";

export class DragonScale extends Item {
  constructor(data: IItem) {
    super(data);
  }

  use(target: Hero): void {
    target.equipFactionEquipment(this.stats.boardPosition);
    this.removeFromGame();
  }
}

export class HealingPotion extends Item {
  constructor(data: IItem) {
    super(data);
  }

  use(target: Hero): void {
    // this.scene.sound.play(EGameSounds.POTION_USE);

    const potionImage = this.scene.add.image(target.x, target.y - 10, 'gameAtlas', 'healingPotion').setDepth(100);
    useAnimation(potionImage);

    const healingAmount = target.stats.isKO ? 100 : 1000;
    target.getsHealed(healingAmount);

    this.removeFromGame();

    this.context.afterAction(EActionType.USE, this.stats.boardPosition, target.stats.boardPosition);
  }
}

export class Inferno extends Item {
  constructor(data: IItem) {
    super(data);
  }

  use(targetTile: Tile): void {
    const infernoImage = this.scene.add.image(targetTile.x, targetTile.y, 'gameAtlas', 'infernoShockWave').setDepth(100);
    useAnimation(infernoImage, 3.5);
    // this.scene.sound.play(EGameSounds.INFERNO_USE);

    // Damages enemy units and crystals, and removes enemy KO'd units
    const damage = 350;

    const enemyUnits = getAOETiles(this, targetTile.boardPosition);

    enemyUnits?.forEach(u => {
      // Inferno removes KO'd enemy units
      if (u instanceof Hero && u.stats.isKO) u.removeFromGame(true);

      u.getsDamaged({
        damage: damage,
        attackType: EAttackType.MAGICAL,
        attacker: this,
        avoidKOs: true
      });
    });

    enemyUnits?.forEach(u => {
      if (u instanceof Hero){
        u.checkIfShouldBeKO();
        if (u.stats.unitType === EHeroes.PHANTOM && u.stats.isKO) u.removeFromGame();
      }
    });

    this.removeFromGame();
    this.context.afterAction(EActionType.USE, this.stats.boardPosition, targetTile.boardPosition);
  }
}
