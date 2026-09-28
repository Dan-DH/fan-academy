import { EActionType, EClass, EFaction, EHeroes } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { Hero } from "../hero";
import { DarkElf } from "./elves";
import { Crystal } from "../../board/crystal";
import { attackAnimation, turnIfBehind } from "../../../utils/unitAnimations";
import { Phantom } from "./phantom";
import { mapUnitBaseStats } from "../../../utils/mapHeroFromBE";
import { generateFourDigitId } from "../../../utils/gameUtils";

export class Necromancer extends DarkElf {
  constructor(data: IHero) {
    super(data);
  }

  attack(target: Hero | Crystal): void {
    attackAnimation(this);
    turnIfBehind(this.context, this, target);

    if (target instanceof Hero && target.stats.isKO) {
      const tile = target.getTile();

      // this.scene.sound.play(EGameSounds.PHANTOM_SPAWN);

      const phantom = new Phantom({
        unitId: `${this.context.userId}_phantom_${generateFourDigitId()}`,
        class: EClass.HERO,
        faction: EFaction.DARK_ELVES,
        unitType: EHeroes.PHANTOM,
        boardPosition: target.stats.boardPosition,
        belongsTo: this.stats.belongsTo,
        row: target.stats.row,
        col: target.stats.col,
        maxHealth: 100,
        currentHealth: 100,
        status: 0,
        unitsConsumed: 0,
        isKO: false,
        lastBreath: false,
        ...mapUnitBaseStats(EHeroes.PHANTOM)
      }, tile, true);

      target.removeFromGame(true);

      this.context.board!.units.push(phantom);

      this.context.afterAction(EActionType.SPAWN_PHANTOM, this.stats.boardPosition, target.stats.boardPosition);

      return;
    } else {
      // if (this.stats.superCharge) this.scene.sound.play(EGameSounds.NECROMANCER_ATTACK_BIG);
      // if (!this.stats.superCharge) this.scene.sound.play(EGameSounds.NECROMANCER_ATTACK);

      const damageDone = target.getsDamaged(this.getTotalPower(), this.stats.attackType, this);
      if (damageDone) this.lifeSteal(damageDone);
      this.removeAttackModifiers();
    }

    if (target && target instanceof Hero && target.stats.isKO && target.stats.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_target: Hero | Crystal): void {}
}
