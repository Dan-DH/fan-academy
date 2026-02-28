import { EGameSounds, EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { Hero } from "../hero";
import { Tile } from "../../board/tile";
import { Crystal } from "../../board/crystal";
import { isEnemySpawn, specialTileCheck } from "../../../utils/boardUtils";
import { playSound } from "../../../utils/gameSounds";
import { singleTween, turnIfBehind } from "../../../utils/unitAnimations";

export class Phantom extends Hero {
  spawnAnim?: Phaser.GameObjects.Image;

  constructor(context: GameScene, data: IHero, tile?: Tile, spawned = false) {
    super(context, data, tile);

    if (spawned && tile) {
      this.spawnAnim = context.add.image(0, -15, 'phantomSpawnAnim_1').setOrigin(0.5).setScale(0.9);

      specialTileCheck(this, tile.tileType);
      this.add([this.spawnAnim]);
      singleTween(this.spawnAnim, 200);
    }
  }

  async attack(target: Hero | Crystal): Promise<void> {
    this.flashActingUnit();

    turnIfBehind(this.context, this, target);

    playSound(this.scene, EGameSounds.WRAITH_ATTACK);

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (
      target instanceof Hero &&
      target.stats.isKO &&
      isEnemySpawn(this.context, target.getTile())
    ) {
      target.removeFromGame();
    } else {
      target.getsDamaged(this.getTotalPower(), this.stats.attackType, this);

      this.removeAttackModifiers();
    }

    if (target && target instanceof Hero && target.stats.isKO && target.stats.unitType === EHeroes.PHANTOM) target.removeFromGame();
    this.context.gameController!.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  equipFactionEquipment(): void {};
  shieldAlly(_target: Hero | Crystal): void {}
}
