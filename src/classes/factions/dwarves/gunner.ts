import { EHeroes, EActionType, EAttackType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { getDistanceToTarget, isEnemySpawn } from "../../../utils/boardUtils";
import { attackAnimation, turnIfBehind } from "../../../utils/unitAnimations";
import { Crystal } from "../../board/crystal";
import { Hero } from "../hero";
import { Dwarf } from "./dwarves";

export class Gunner extends Dwarf {
  constructor(data: IHero) {
    super(data);
  }

  attack(target: Hero | Crystal): void {
    attackAnimation(this);
    turnIfBehind(this.context, this, target);

    const distance = getDistanceToTarget(this, target);

    if (distance === 1) {
      this.singleTargetAttack(target);
    } else {
      this.multiTargetAttack(target);
    }

    if (target && target instanceof Hero && target.stats.isKO && target.stats.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  singleTargetAttack(target: Hero | Crystal): void {
    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (target instanceof Hero && target.stats.isKO && isEnemySpawn(this.context, target.getTile())) {
      // this.scene.sound.play(EGameSounds.GRENADIER_ATTACK_MELEE);
      target.removeFromGame();
    } else {
      // this.scene.sound.play(EGameSounds.GUNNER_ATTACK);
      target.getsDamaged(this.getTotalPower(), this.stats.attackType, this);
      this.removeAttackModifiers();
    }
  }

  multiTargetAttack(target: Hero | Crystal): void {
    // this.scene.sound.play(EGameSounds.GUNNER_ATTACK);
    // this.context.time.delayedCall(100, () => this.scene.sound.play(EGameSounds.GUNNER_ATTACK));
    // this.context.time.delayedCall(200, () => this.scene.sound.play(EGameSounds.GUNNER_ATTACK));

    const splashedUnits = this.context.board!.getGunnerSplashTargets(this, target);

    splashedUnits?.forEach(unit =>  {
      unit.getsDamaged(this.getTotalPower(0.6667), EAttackType.PHYSICAL, this, 0.6667);
      if (unit instanceof Hero && unit.stats.isKO && unit.stats.unitType === EHeroes.PHANTOM) unit.removeFromGame();
    });

    target.getsDamaged(this.getTotalPower(0.6667), EAttackType.PHYSICAL, this);
    this.removeAttackModifiers();
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_arget: Hero | Crystal): void {}
}