import { EHeroes, EActionType } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import { Hero } from "../hero";
import { Crystal } from "../../board/crystal";
import { enterSpecialTileCheck, isEnemySpawn } from "../../../utils/boardUtils";
import { attackAnimation, sizeReduceTween, turnIfBehind } from "../../../utils/unitAnimations";
import { Tile } from "../../board/tile";

export class Phantom extends Hero {
  spawnAnim?: Phaser.GameObjects.Image;

  constructor(data: IHero, spawned = false, tile?: Tile) {
    super(data);

    if (spawned) {
      this.spawnAnim = this.context.add.image(0, -15, 'gameAtlas', 'phantomSpawnAnim_1').setOrigin(0.5).setScale(1.3);
      if (tile) enterSpecialTileCheck(this, tile);
      this.add([this.spawnAnim]);
      sizeReduceTween(this.spawnAnim, 500, this.spawnAnim.scale);
    }
  }

  async attack(target: Hero | Crystal): Promise<void> {
    attackAnimation(this);

    turnIfBehind(this.context, this, target);

    // this.scene.sound.play(EGameSounds.WRAITH_ATTACK);

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
    this.context.afterAction(EActionType.ATTACK, this.stats.boardPosition, target.stats.boardPosition);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
  equipFactionEquipment(): void {};
  shieldAlly(_target: Hero | Crystal): void {}
}
