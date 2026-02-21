import { GameObjects } from "phaser";
import { Crystal } from "../classes/board/crystal";
import { Tile } from "../classes/board/tile";
import { Hero } from "../classes/factions/hero";
import { EHeroes, EGameSounds, ETiles } from "../enums/gameEnums";
import { ITile } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";
import { playSound } from "./gameSounds";

export async function moveAnimation(context: GameScene, hero: Hero, targetTile: Tile): Promise<void> {
  const flyingUnits = [EHeroes.NECROMANCER, EHeroes.WRAITH, EHeroes.PHANTOM];
  if (flyingUnits.includes(hero.unitType)) {
    playSound(context, EGameSounds.MOVE_FLY);
  } else {
    playSound(context, EGameSounds.MOVE_WALK);
  }

  // Stop user input until the animation finishes playing
  context.input.enabled = false;

  const unitImage: Phaser.GameObjects.Image = hero.getByName('body');

  // If the unit is moving backwards, flip the unit's image for the duration of the animation
  let temporaryFlip: boolean;
  if (hero.belongsTo === 1 &&  targetTile.x < hero.x) {
    unitImage.setFlipX(true);
    temporaryFlip = true;
  }

  if (hero.belongsTo === 2 &&  targetTile.x > hero.x ) {
    unitImage.setFlipX(false);
    temporaryFlip = true;
  }

  const animation = (hero: Hero, targetTile: Tile): Promise<void> => {
    return new Promise((resolve) => {
      context.tweens.add({
        targets: hero,
        x: targetTile.x,
        y: targetTile.y,
        duration: 400,
        ease: 'Linear',
        onComplete: () => {
          context.input.enabled = true;
          if (temporaryFlip) unitImage.setFlipX(!unitImage.flipX);
          resolve();
        }
      });
    });
  };

  await animation.call(context, hero, targetTile);
}

export async function forcedMoveAnimation(context: GameScene, hero: Hero, targetTile: Tile): Promise<void> {
  context.input.enabled = false;

  const animation = (hero: Hero, targetTile: Tile): Promise<void> => {
    return new Promise((resolve) => {
      context.tweens.add({
        targets: hero,
        x: targetTile.x,
        y: targetTile.y,
        duration: 200,
        ease: 'Linear',
        onComplete: () => {
          context.input.enabled = true;
          resolve();
        }
      });
    });
  };

  await animation.call(context, hero, targetTile);
};

export function getNewPositionAfterForce(attackerRow: number, attackerCol: number, targetRow: number, targetCol: number, isPush: boolean) {
  // Direction from attacker to target
  let directionRow = targetRow - attackerRow;
  let directionColumn = targetCol - attackerCol;

  // Normalize to single step
  directionRow = Math.sign(directionRow);
  directionColumn = Math.sign(directionColumn);

  // For pull, reverse the direction
  if (!isPush) {
    directionRow *= -1;
    directionColumn *= -1;
  }

  return {
    row: targetRow + directionRow,
    col: targetCol + directionColumn
  };
}

export function forcedMoveSpawnCheck(tile: Tile | ITile, hero: Hero): boolean {
  const spawnBelongsTo = tile.col < 5 ? 1 : 2;
  return tile.tileType === ETiles.SPAWN && hero.belongsTo === spawnBelongsTo;
}

export function turnIfBehind(context: GameScene, attacker: Hero, target: Hero | Crystal): void {
  const isLookingRight = attacker.belongsTo === 1;
  const attackerImage = attacker.characterImage;

  if (isLookingRight && target.col >= attacker.col) return;
  if (!isLookingRight && target.col <= attacker.col) return;

  if (!isLookingRight) attackerImage.setFlipX(false);
  if (isLookingRight)  attackerImage.setFlipX(true);

  context.time.delayedCall(500, () => {
    attackerImage.setFlipX(!attacker.characterImage.flipX);
  });
}

export function useAnimation(image: GameObjects.Image, scale = 2): void {
  image.scene.tweens.add({
    targets: image,
    scale,
    alpha: 0,
    duration: 1000,
    onComplete: () => {
      image.destroy();
    }
  });
}