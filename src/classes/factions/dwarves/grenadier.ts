import { EActionType, EAttackType, EGameSounds, EHeroes } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { getAOETiles, getDistanceToTarget, isEnemySpawn } from "../../../utils/boardUtils";
import { playSound } from "../../../utils/gameSounds";
import { actionAnimation, turnIfBehind } from "../../../utils/unitAnimations";
import { Crystal } from "../../board/crystal";
import { Tile } from "../../board/tile";
import { Hero } from "../hero";
import { Dwarf } from "./dwarves";

export class Grenadier extends Dwarf {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(target: Hero | Crystal): void {
    actionAnimation(this);
    turnIfBehind(this.context, this, target);

    const distance = getDistanceToTarget(this, target);

    if (distance === 1) {
      this.meleeAttack(target);
    } else {
      this.rangedAttack(target);
    }

    if (target && target instanceof Hero && target.stats.isKO && target.stats.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.gameController!.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  meleeAttack(target: Hero | Crystal): void {
    playSound(this.scene, EGameSounds.GRENADIER_ATTACK_MELEE);
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
    const { enemyHeroTiles, enemyCrystalTiles } = getAOETiles(this, target.getTile());
    playSound(this.scene, EGameSounds.GRENADIER_ATTACK);

    enemyHeroTiles?.forEach(tile => {
      const enemyHero = this.context.gameController!.board.units.find(unit => unit.stats.boardPosition === tile.boardPosition);
      if (!enemyHero) throw new Error('Grenadier attack() hero not found');

      if (enemyHero.stats.boardPosition === target.stats.boardPosition) {
        enemyHero.getsDamaged(this.getTotalPower(), EAttackType.MAGICAL, this);
      } else {
        enemyHero.getsDamaged(this.getTotalPower(0.5), EAttackType.MAGICAL, this);
        if (enemyHero.stats.isKO && enemyHero.stats.unitType === EHeroes.PHANTOM) enemyHero.removeFromGame();
      }
    });

    enemyCrystalTiles.forEach(tile => {
      const enemyCrystal = this.context.gameController!.board.crystals.find(crystal => crystal.stats.boardPosition === tile.boardPosition);
      if (!enemyCrystal) throw new Error('Grenadier attack() crystal not found');

      if (enemyCrystal.stats.boardPosition === target.stats.boardPosition) {
        enemyCrystal.getsDamaged(this.getTotalPower(), EAttackType.MAGICAL, this);
      } else {
        enemyCrystal.getsDamaged(this.getTotalPower(0.5), EAttackType.MAGICAL, this, true);
      }
    });

    this.removeAttackModifiers();
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_arget: Hero | Crystal): void {}
}