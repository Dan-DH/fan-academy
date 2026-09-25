import { EActionType, EAttackType, EHeroes } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { getAOETiles, getDistanceToTarget, isEnemySpawn } from "../../../utils/boardUtils";
import { attackAnimation, turnIfBehind } from "../../../utils/unitAnimations";
import { Crystal } from "../../board/crystal";
import { Hero } from "../hero";
import { Dwarf } from "./dwarves";

export class Grenadier extends Dwarf {
  constructor(data: IHero) {
    super(data);
  }

  attack(target: Hero | Crystal): void {
    attackAnimation(this);
    turnIfBehind(this.context, this, target);

    const distance = getDistanceToTarget(this, target);

    if (distance === 1) {
      this.meleeAttack(target);
    } else {
      this.rangedAttack(target);
    }

    if (target && target instanceof Hero && target.stats.isKO && target.stats.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  meleeAttack(target: Hero | Crystal): void {
    // this.scene.sound.play(EGameSounds.GRENADIER_ATTACK_MELEE);
    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (target instanceof Hero && target.stats.isKO && isEnemySpawn(this.context, target.getTile())
    ) {
      target.removeFromGame();
    } else {
      target.getsDamaged(this.getTotalPower(0.5), this.stats.attackType, this);
      this.removeAttackModifiers();
    }
  }

  rangedAttack(target: Hero | Crystal): void {
    const enemyUnits = getAOETiles(this, target.stats.boardPosition);
    // this.scene.sound.play(EGameSounds.GRENADIER_ATTACK);

    enemyUnits.forEach(u => {
      if (u.stats.boardPosition === target.stats.boardPosition) {
        u.getsDamaged(this.getTotalPower(), EAttackType.MAGICAL, this);
      } else {
        u.getsDamaged(this.getTotalPower(0.5), EAttackType.MAGICAL, this);
        if (u instanceof Hero && u.stats.isKO && u.stats.unitType === EHeroes.PHANTOM) u.removeFromGame();
      }
    });

    this.removeAttackModifiers();
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_arget: Hero | Crystal): void {}
}