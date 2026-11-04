import { EActionType, EUnitMoveType } from "../../../enums/gameEnums";
import { IItem } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { typhoonAnimation, unitMoveAnimation } from "../../../utils/unitAnimations";
import { Tile } from "../../board/tile";
import { Hero } from "../hero";
import { Item } from "../item";

export class SpikeArmor extends Item{
  constructor(data: IItem) {
    super(data);
  }

  use(target: Hero): void {
    target.equipFactionEquipment(this.stats.boardPosition);
    this.removeFromGame();
  }
}

export class Typhoon extends Item {
  constructor(data: IItem) {
    super(data);
  }

  async use(targetTile: Tile): Promise<void> {
    const scene = targetTile.scene as GameScene;
    const typhoonImage = this.scene.add.image(targetTile.x + 15, 400, 'gameAtlas', 'Typhoon_Wave2-hd').setScale(2.5).setDepth(100);
    typhoonAnimation(typhoonImage, targetTile.col);

    const isPlayerOne = scene.isPlayerOne;

    const enemyUnits = scene.board?.units.filter((u): u is Hero => u.stats.belongsTo !== this.stats.belongsTo && u instanceof Hero);
    if (!enemyUnits) return;

    if (targetTile.col !== 0) {
      for (let i = 0; i < targetTile.col; i++) await this.handlePushing(scene, enemyUnits as Hero[], i, false);
    }
    if (targetTile.col !== 8) {
      for (let i = 8; i > targetTile.col; i--) await this.handlePushing(scene, enemyUnits as Hero[], i, true);
    }

    enemyUnits.forEach(u => {
      if (u.stats.col === targetTile.col) {
        let goingRight = isPlayerOne!;
        if (targetTile.col === 8 && isPlayerOne) goingRight = false;
        if (targetTile.col === 0 && !isPlayerOne) goingRight = true;

        this.handlePushing(scene, [u] as Hero[], targetTile.col, goingRight);
      }
    });

    this.context.afterAction(EActionType.USE, this.stats.boardPosition, targetTile.boardPosition);
    this.removeFromGame();
  }

  private async handlePushing(scene: GameScene, enemyUnits: Hero[], col: number, goingRight: boolean): Promise<void> {
    const matchingUnits = enemyUnits.filter(u => u.stats.col === col);
    const offset = goingRight ? -1 : 1;
    for (const u of matchingUnits) {
      const pushTarget = {
        row: u.stats.row,
        col: u.stats.col + offset
      };

      const params = {
        attackerCoords: pushTarget,
        target: u as Hero,
        isPush: true
      };

      let targetTile = await scene.board?.calculateDisplaceUnit(params);

      if (targetTile) {
        u.stats.col = targetTile.col;
        u.stats.row = targetTile.row;

        const movedAgain = await scene.board?.calculateDisplaceUnit(params);

        if (movedAgain) targetTile = movedAgain;

        unitMoveAnimation({
          move: EUnitMoveType.FORCED_MOVE,
          hero: u,
          targetTile,
          angle: 0
        });
      }
    };
  }
}

export class Meat extends Item {
  constructor(data: IItem) {
    super(data);
  }

  use(target: Hero): void {
    // this.scene.sound.play(EGameSounds.POTION_USE);
    target.consumeMeat(this.stats.boardPosition);
    this.removeFromGame();
  }
}