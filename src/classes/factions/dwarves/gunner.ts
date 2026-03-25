import { EGameSounds, EHeroes, EActionType, EAttackType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { getDistanceToTarget, isEnemySpawn } from "../../../utils/boardUtils";
import { playSound } from "../../../utils/gameSounds";
import { actionAnimation, turnIfBehind } from "../../../utils/unitAnimations";
import { Crystal } from "../../board/crystal";
import { Tile } from "../../board/tile";
import { Hero } from "../hero";
import { Dwarf } from "./dwarves";

export class Gunner extends Dwarf {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(target: Hero | Crystal): void {
    actionAnimation(this);
    turnIfBehind(this.context, this, target);

    const distance = getDistanceToTarget(this, target);

    if (distance === 1) {
      this.singleTargetAttack(target);
    } else {
      this.multiTargetAttack(target);
    }

    if (target && target instanceof Hero && target.stats.isKO && target.stats.unitType === EHeroes.PHANTOM) target.removeFromGame();

    this.context.gameController!.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  singleTargetAttack(target: Hero | Crystal): void {
    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (target instanceof Hero && target.stats.isKO && isEnemySpawn(this.context, target.getTile())) {
      playSound(this.scene, EGameSounds.GRENADIER_ATTACK_MELEE);
      target.removeFromGame();
    } else {
      playSound(this.scene, EGameSounds.GUNNER_ATTACK);
      target.getsDamaged(this.getTotalPower(), this.stats.attackType, this);
      this.removeAttackModifiers();
    }
  }

  multiTargetAttack(target: Hero | Crystal): void {
    playSound(this.scene, EGameSounds.GUNNER_ATTACK);
    this.context.time.delayedCall(100, () => playSound(this.scene, EGameSounds.GUNNER_ATTACK));
    this.context.time.delayedCall(200, () => playSound(this.scene, EGameSounds.GUNNER_ATTACK));

    const splashedUnits = this.context.gameController?.board.getGunnerSplashTargets(this, target);

    splashedUnits?.forEach(unit =>  {
      unit.getsDamaged(this.getTotalPower(0.666), EAttackType.PHYSICAL, this, true);
      if (unit instanceof Hero && unit.stats.isKO && unit.stats.unitType === EHeroes.PHANTOM) unit.removeFromGame();
    });

    target.getsDamaged(this.getTotalPower(0.66), EAttackType.PHYSICAL, this);
    this.removeAttackModifiers();
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_arget: Hero | Crystal): void {}
}