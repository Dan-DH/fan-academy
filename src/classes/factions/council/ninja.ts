import { EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { Hero } from "../hero";
import { Council } from "./council";
import { Crystal } from "../../board/crystal";
import { getDistanceToTarget, moveSpecialTileCheck, SPIKE_ARMOR_HP_THRESHOLD } from "../../../utils/boardUtils";
import { attackAnimation, sizeReduceTween, turnIfBehind } from "../../../utils/unitAnimations";
import { isKoUnitOnEnemySpawn, isPhantomAndKO } from "../../../utils/gameUtils";

export class Ninja extends Council {
  constructor(data: IHero) {
    super(data);
  }

  attack(target: Hero | Crystal): void {
    attackAnimation(this);

    turnIfBehind(this.context, this, target);

    const distance = getDistanceToTarget(this, target);

    const ninjaAttackSound = () => {
      // if (this.stats.superCharge) this.scene.sound.play(EGameSounds.NINJA_ATTACK_BIG);
      // if (!this.stats.superCharge) this.scene.sound.play(EGameSounds.NINJA_ATTACK);
    };

    let damageDealt = 0;
    if (distance === 1) {
      // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
      if (isKoUnitOnEnemySpawn(target)) {
        // this.scene.sound.play(EGameSounds.NINJA_ATTACK);
        target.removeFromGame();
      } else {
        ninjaAttackSound();
        damageDealt = target.getsDamaged({
          damage: this.getTotalPower(2),
          attackType: this.stats.attackType,
          attacker: this
        });
        this.removeAttackModifiers();
      }
    } else {
      ninjaAttackSound();
      damageDealt = target.getsDamaged({
        damage: this.getTotalPower(),
        attackType: this.stats.attackType,
        attacker: this
      });
      this.removeAttackModifiers();
    }

    if (this.stats.currentHealth > SPIKE_ARMOR_HP_THRESHOLD) this.checkForDamageReflected(target, damageDealt);
    if (isPhantomAndKO(target)) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  teleport(target: Hero): void {
    // this.scene.sound.play(EGameSounds.NINJA_SMOKE);
    const targetDestination = this.getTile();
    const unitDestination = target.getTile();

    // Smoke bomb animation
    sizeReduceTween(this.visuals.smokeAnimationImage!, 500, this.visuals.smokeAnimationImage.scale);
    sizeReduceTween(target.visuals.smokeAnimationImage!, 500, this.visuals.smokeAnimationImage.scale);

    moveSpecialTileCheck(target, targetDestination);
    target.updatePosition(targetDestination);

    moveSpecialTileCheck(this, unitDestination);
    this.updatePosition(unitDestination);

    this.context.afterAction(EActionType.TELEPORT, targetDestination.boardPosition, unitDestination.boardPosition);
  };

  heal(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {}
}