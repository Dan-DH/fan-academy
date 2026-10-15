import { EActionType, EAttackType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { getAOETiles, getDistanceToTarget } from "../../../utils/boardUtils";
import { isKoUnitOnEnemySpawn, isPhantomAndKO } from "../../../utils/gameUtils";
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

    if (isPhantomAndKO(target)) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  meleeAttack(target: Hero | Crystal): void {
    // this.scene.sound.play(EGameSounds.GRENADIER_ATTACK_MELEE);
    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (isKoUnitOnEnemySpawn(target)) {
      target.removeFromGame();
    } else {
      target.getsDamaged({
        damage: this.getTotalPower(0.5),
        attackType: this.stats.attackType,
        attacker: this
      });
      this.removeAttackModifiers();
    }
  }

  rangedAttack(target: Hero | Crystal): void {
    const enemyUnits = getAOETiles(this, target.stats.boardPosition);
    // this.scene.sound.play(EGameSounds.GRENADIER_ATTACK);

    target.getsDamaged({
      damage: this.getTotalPower(),
      attackType: EAttackType.MAGICAL,
      attacker: this
    });

    enemyUnits.forEach(u => {
      if (u.stats.boardPosition !== target.stats.boardPosition) {
        u.getsDamaged({
          damage: this.getTotalPower(0.5),
          attackType: EAttackType.MAGICAL,
          attacker: this
        });
        if (isPhantomAndKO(u)) u.removeFromGame();
      }
    });

    this.removeAttackModifiers();
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_arget: Hero | Crystal): void {}
}