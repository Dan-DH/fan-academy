import { EActionType, EAttackType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { SPIKE_ARMOR_HP_THRESHOLD } from "../../../utils/boardUtils";
import { isPhantomAndKO } from "../../../utils/gameUtils";
import { attackAnimation, turnIfBehind } from "../../../utils/unitAnimations";
import { Crystal } from "../../board/crystal";
import { Hero } from "../hero";
import { Tribe } from "./tribe";

export class Witch extends Tribe {
  constructor(data: IHero) {
    super(data);
  }

  attack(target: Hero | Crystal): void {
    attackAnimation(this);
    turnIfBehind(this.context, this, target);

    if (target instanceof Hero && target.stats.isKO) {
      // this.scene.sound.play(EGameSounds.ARCHER_ATTACK_MELEE); // FIXME: add audio bits
      this.explodeCorpse(target);
    } else {
      // this.scene.sound.play(EGameSounds.ARCHER_ATTACK_MELEE);
      const damageDealt = target.getsDamaged({
        damage: this.getTotalPower(),
        attackType: this.stats.attackType,
        attacker: this
      });
      this.removeAttackModifiers();
      if (this.stats.currentHealth > SPIKE_ARMOR_HP_THRESHOLD) this.checkForDamageToReflect(target, damageDealt);
    }

    if (target && isPhantomAndKO(target)) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  private explodeCorpse(target: Hero): void {
    // get extra health
    const explosionDamagePercentIncrease = Math.max(target.getExtraHealthPercent(), 0);
    const board = this.context.board!;
    board.units.forEach(u => {
      if (target.stats.belongsTo === u.stats.belongsTo && board.isAdjacent(target, u)) {
        u.getsDamaged({
          damage: this.getTotalPower(0.5 + explosionDamagePercentIncrease),
          attackType: EAttackType.MAGICAL,
          attacker: this
        });
        if (isPhantomAndKO(u)) u.removeFromGame();
      }
    });

    // get adjacent enemy units
    // loop and do damage
    this.removeAttackModifiers();
    target.getsStompedOrDestroyed();
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {};
}