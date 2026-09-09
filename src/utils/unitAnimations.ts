import { GameObjects } from "phaser";
import { Crystal } from "../classes/board/crystal";
import { Tile } from "../classes/board/tile";
import { Hero } from "../classes/factions/hero";
import { EHeroes, ETiles } from "../enums/gameEnums";
import { ITile } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";

export function flashActingUnit(hero: Hero): void {
  hero.visuals.characterImage.setTint(0x3399ff);
  hero.scene.time.delayedCall(800, () => hero.visuals.characterImage.clearTint());
}

export function attackAnimation(hero: Hero): void {
  flashActingUnit(hero);
  hero.visuals.characterImage.scene.tweens.add({
    targets: hero.visuals.characterImage,
    x: `+=${15}`,
    duration: 50,
    yoyo: true,
    ease: 'Cubic.easeOut'
  });
}

export function getDamagedAnimation(hero: Hero): void {
  hero.visuals.characterImage.setTint(0xff0000);
  hero.scene.time.delayedCall(500, () => hero.visuals.characterImage.clearTint());

  const positionX = hero.visuals.characterImage.x;
  hero.visuals.characterImage.scene.tweens.add({
    targets: hero.visuals.characterImage,
    x: {
      from: positionX - 5,
      to: positionX + 5
    },
    duration: 50,
    repeat: 3,
    yoyo: true,
    onComplete: () => hero.visuals.characterImage.setX(positionX)
  });
}

export async function moveAnimation(hero: Hero, targetTile: Tile, tilesMoved: number): Promise<void> {
  const isFlying = [EHeroes.NECROMANCER, EHeroes.WRAITH, EHeroes.PHANTOM].includes(hero.stats.unitType);

  hero.context.input.enabled = false;
  const unitImage = hero.visuals.characterImage;

  let temporaryFlip = false;
  if (hero.stats.belongsTo === 1 && targetTile.x < hero.x ||
      hero.stats.belongsTo === 2 && targetTile.x > hero.x) {
    unitImage.setFlipX(!unitImage.flipX);
    temporaryFlip = true;
  }

  if (isFlying) {
    await flyingAnimation(hero, targetTile, tilesMoved);
  } else {
    await hoppingAnimation(hero, targetTile, tilesMoved);
  }

  hero.context.input.enabled = true;
  if (temporaryFlip) unitImage.setFlipX(!unitImage.flipX);
}

async function flyingAnimation(hero: Hero, targetTile: Tile, tilesMoved: number): Promise<void> {
  const unitImage = hero.visuals.characterImage;
  const moveDuration = 200 * tilesMoved;
  const isMovingRight = targetTile.x >= hero.x;
  const baseTiltAngle = hero.stats.unitType === EHeroes.NECROMANCER ? 0 : 25;
  const tiltAngle = isMovingRight ? baseTiltAngle : -baseTiltAngle;

  return new Promise((resolve) => {
    unitImage.scene.tweens.add({
      targets: unitImage,
      angle: tiltAngle,
      duration: 100,
      ease: 'Cubic.easeInOut'
    });

    unitImage.scene.tweens.add({
      targets: hero,
      x: targetTile.x,
      y: targetTile.y,
      duration: moveDuration,
      ease: 'Power1',
      onComplete: () => {
        unitImage.scene.tweens.add({
          targets: unitImage,
          angle: 0,
          duration: 50
        });
        resolve();
      }
    });
  });
}

async function hoppingAnimation(hero: Hero, targetTile: Tile, tilesMoved: number): Promise<void> {
  const hopSpeed = 100;
  const moveDuration = hopSpeed * 2 * tilesMoved;
  const unitImage = hero.visuals.characterImage;
  const unitBaseY = unitImage.y;

  return new Promise((resolve) => {
    unitImage.scene.tweens.add({
      targets: hero,
      x: targetTile.x,
      y: targetTile.y,
      duration: moveDuration,
      ease: 'Power1',
      onComplete: () => {
        hop.stop();
        resolve();
      }
    });

    const hop = unitImage.scene.tweens.add({
      targets: unitImage,
      scale: 1.2,
      y: '-=20',
      duration: hopSpeed,
      yoyo: true,
      repeat: tilesMoved - 1,
      ease: 'Sine.easeOut',
      onStop: () => {
        unitImage.y = unitBaseY;
        unitImage.setScale(1);
      }
    });
  });
}

export async function forcedMoveAnimation(context: GameScene, hero: Hero, targetTile: Tile, angle = 0): Promise<void> {
  context.input.enabled = false;

  const animation = (hero: Hero, targetTile: Tile): Promise<void> => {
    return new Promise((resolve) => {
      context.tweens.add({
        targets: hero,
        x: targetTile.x,
        y: targetTile.y,
        angle,
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

export function canBeMovedIntoSpawn(tile: Tile | ITile, hero: Hero): boolean {
  const spawnBelongsTo = tile.col < 5 ? 1 : 2;
  return tile.tileType === ETiles.SPAWN && hero.stats.belongsTo === spawnBelongsTo;
}

export function turnIfBehind(context: GameScene, attacker: Hero, target: Hero | Crystal): void {
  const isLookingRight = attacker.stats.belongsTo === 1;
  const attackerImage = attacker.visuals.characterImage;

  if (isLookingRight && target.stats.col >= attacker.stats.col) return;
  if (!isLookingRight && target.stats.col <= attacker.stats.col) return;

  if (!isLookingRight) attackerImage.setFlipX(false);
  if (isLookingRight)  attackerImage.setFlipX(true);

  context.time.delayedCall(500, () => {
    attackerImage.setFlipX(!attacker.visuals.characterImage.flipX);
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

export function addPriestessDebuffTween(debuffImage: Phaser.GameObjects.Image): void {
  const priestessDebuffTween = addCirclingTween(debuffImage);
  debuffImage.setData('priestessDebuffTween', priestessDebuffTween);
  debuffImage.setVisible(true);
};

export function removePriestessDebuffTween(debuffImage: Phaser.GameObjects.Image): void {
  const priestessDebuffTween = debuffImage.getData('priestessDebuffTween');
  if (priestessDebuffTween) {
    priestessDebuffTween.stop();
    priestessDebuffTween.remove();
    debuffImage.setData('priestessDebuffTween', null);
    debuffImage.setVisible(false);
  }
};

export function addReticleTween(reticle: Phaser.GameObjects.Image): void {
  const reticleTween = addCirclingTween(reticle);
  reticle.setData('reticleTween', reticleTween);
  reticle.setVisible(true);
}

export function removeReticleTween(reticle: Phaser.GameObjects.Image): void {
  const reticleTween = reticle.getData('reticleTween');
  if (reticleTween) {
    reticleTween.stop();
    reticleTween.remove();
    reticle.setData('reticleTween', null);
    reticle.setVisible(false);
  }
}

export function addCirclingTween(reticle: Phaser.GameObjects.Image): Phaser.Tweens.Tween {
  return reticle.scene.tweens.add({
    targets: reticle,
    angle: 360,
    duration: 7000,
    repeat: -1,
    ease: 'Linear',
    onRepeat: () => {
      // Reset the angle to 0 each time to prevent overflow
      reticle.angle = 0;
    }
  });
};

export function sizeReduceTween(image: Phaser.GameObjects.Image, duration: number, originalScale?: number): void {
  image.setVisible(true);
  image.scene.tweens.add({
    targets: image,
    scaleX: 0,
    scaleY: 0,
    duration,
    ease: 'Cubic.easeIn',
    onComplete: () => {
      image.setVisible(false).setScale(originalScale);
    }
  });
}

export function paladinAuraAnimation(image: Phaser.GameObjects.Image): void {
  image.scene.tweens.add({
    targets: image,
    scaleX: 4,
    scaleY: 0.5,
    alpha: 0,
    duration: 3000,
    ease: 'Cubic.Out',
    repeat: -1
  });
}

export function engineerShieldAnimation(image: Phaser.GameObjects.Image): void {
  image.scene.tweens.add({
    targets: image,
    scaleX: 0.9,
    scaleY: 1.1,
    duration: 1000,
    yoyo: true,
    ease: 'Cubic.easeOut',
    repeat: -1,
    repeatDelay: 2000
  });
}

export function pulverizerAnimation(image: Phaser.GameObjects.Image, targetY: number): void {
  const hoverY = targetY - 80;
  image.setScale(1.5);
  image.y = hoverY - 20;

  image.scene.tweens.chain({
    targets: image,
    tweens: [
      {
        y: hoverY,
        duration: 100,
        ease: 'Cubic.easeIn'
      },
      {
        y: '+=8',
        duration: 40,
        yoyo: true,
        repeat: 8,
        ease: 'Sine.easeInOut'
      },
      {
        y: hoverY + 5,
        duration: 150,
        ease: 'Power2'
      }
    ],
    onComplete: () => {
      image.destroy(true);
    }
  });
}