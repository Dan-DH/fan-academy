import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { Tile } from "../../board/tile";
import { Crystal } from "../../board/crystal";
import { Dwarf } from "./dwarves";
import { Hero } from "../hero";
import { EActionType, EGameSounds, EHeroes } from "../../../enums/gameEnums";
import { getDistanceToTarget, isEnemySpawn } from "../../../utils/boardUtils";
import { playSound } from "../../../utils/gameSounds";
import { turnIfBehind } from "../../../utils/unitAnimations";

export class Annihilator extends Dwarf {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  attack(target: Hero | Crystal): void {
    // annie debuff also affects crystals!
    this.flashActingUnit();

    const gameController = this.context.gameController!;
    turnIfBehind(this.context, this, target);

    const distance = getDistanceToTarget(this, target);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (
      distance === 1 &&
      target instanceof Hero &&
      target.stats.isKO &&
      isEnemySpawn(this.context, target.getTile())
    ) {
      playSound(this.scene, EGameSounds.WIZARD_ATTACK);
      target.removeFromGame();
    } else {
      if (this.stats.superCharge) playSound(this.scene, EGameSounds.ARCHER_ATTACK_BIG);
      if (!this.stats.superCharge) playSound(this.scene, EGameSounds.ARCHER_ATTACK);

      const isTargetShielded = target.stats.engineerShield;
      target.getsDamaged(this.getTotalPower(), this.stats.attackType, this);

      if (target instanceof Hero && !isTargetShielded) {
        target.stats.annihilatorDebuff = true;
        target.visuals.annihilatorDebuffImage.setVisible(true);
        target.updateTileData();
        target.unitCard.updateCardData(target);
      }

      const adjacentFriendlyUnits = gameController.board.getAdjacentFriendlyUnitsOnBoard(target);

      if (adjacentFriendlyUnits.length) {
        adjacentFriendlyUnits.forEach(unit => gameController.pushEnemy(target, unit));
      }

      this.removeAttackModifiers();
    }

    if (target && target instanceof Hero && target.stats.isKO && target.stats.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.gameController!.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  shieldAlly(_arget: Hero | Crystal): void {}
}
