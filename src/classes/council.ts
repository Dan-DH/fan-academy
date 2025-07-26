import { EActionType, EAttackType, EHeroes, ECouncilSounds, EGameSounds } from "../enums/gameEnums";
import { IHero, IItem } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";
import { canBeAttacked, getAOETiles, isEnemySpawn, isOnBoard, turnIfBehind, useAnimation, effectSequence, timeDelay } from "../utils/gameUtils";
import { Board } from "./board";
import { Crystal } from "./crystal";
import { Hero } from "./hero";
import { Item } from "./item";
import { Tile } from "./tile";

export abstract class Human extends Hero {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  equipFactionBuff(handPosition: number): void {
    const dragonScaleImg = this.scene.add.image(this.x + 10, this.y - 10, 'dragonScale').setOrigin(0.5).setDepth(100);
    useAnimation(dragonScaleImg);

    this.factionBuff = true;
    this.factionBuffImage.setVisible(true);
    this.characterImage.setTexture(this.updateCharacterImage());

    this.physicalDamageResistance += 20;

    this.increaseMaxHealth(this.baseHealth * 0.1);

    this.unitCard.updateCardHealth(this);
    this.unitCard.updateCardPhysicalResistance(this);
    this.updateTileData();

    effectSequence(this.scene, EGameSounds.USE_SHIELD);

    this.context.gameController!.afterAction(EActionType.USE, handPosition, this.boardPosition);
  }
}

export class Archer extends Human {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }
  
  async attack(target: Hero | Crystal): Promise<void> {
    this.flashActingUnit();

    const distance = this.getDistanceToTarget(target);

    turnIfBehind(this.context, this, target);

    let delay = 0;
    let replayWait: Promise<void>;

    if (distance === 1) {
      // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
      if (
        target instanceof Hero &&
        target.isKO &&
        isEnemySpawn(this.context, target.getTile())
      ) {
        effectSequence(this.scene, ECouncilSounds.ARCHER_ATTACK_MELEE);
        replayWait = timeDelay(this.context, 500);
        target.removeFromGame();
      } else {
        effectSequence(this.scene, ECouncilSounds.ARCHER_ATTACK_MELEE);
        delay = 500;
        [replayWait, ] = target.getsDamaged(this.getTotalPower(0.5), this.attackType, delay);
        this.removeAttackModifiers();
      }
    } else {
      if (this.superCharge) {
        effectSequence(this.scene, ECouncilSounds.ARCHER_ATTACK_BIG);
        delay = 750;
      } else {
        effectSequence(this.scene, ECouncilSounds.ARCHER_ATTACK);
        delay = 650
      }

      [replayWait, ] = target.getsDamaged(this.getTotalPower(), this.attackType, delay);

      this.removeAttackModifiers();
    }
  
    this.context.gameController!.afterAction(EActionType.ATTACK, this.boardPosition, target.boardPosition);

    await replayWait;
    await timeDelay(this.context, 500);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
}

export class Knight extends Human {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  async attack(target: Hero | Crystal): Promise<void> {
    this.flashActingUnit();

    const gameController = this.context.gameController!;
    turnIfBehind(this.context, this, target);

    let delay = 0;
    let replayWait: Promise<void>;

    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (
      target instanceof Hero &&
      target.isKO &&
      isEnemySpawn(this.context, target.getTile())
    ) {
      target.removeFromGame();
      effectSequence(this.scene, ECouncilSounds.KNIGHT_ATTACK);
      replayWait = timeDelay(this.context, 500);
    } else {
      if (this.superCharge) {
        effectSequence(this.scene, ECouncilSounds.KNIGHT_ATTACK_BIG);
        delay = 750;
      } else {
        effectSequence(this.scene, ECouncilSounds.KNIGHT_ATTACK);
        delay = 500;
      }

      [replayWait, ] = target.getsDamaged(this.getTotalPower(), this.attackType, delay);

      if (target instanceof Hero && target.unitType !== EHeroes.PHANTOM) gameController.pushEnemy(this, target, delay);

      this.removeAttackModifiers();
    }

    this.context.gameController!.afterAction(EActionType.ATTACK, this.boardPosition, target.boardPosition);
    
    await replayWait;
    await timeDelay(this.context, 500);
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
}

export class Wizard extends Human {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  async attack(target: Hero | Crystal): Promise<void> {
    this.flashActingUnit();
  
    const gameController = this.context.gameController!;
    turnIfBehind(this.context, this, target);
  
    const distance = this.getDistanceToTarget(target);
  
    let replayWait: Promise<void>[] = [];
    let targets: (Hero | Crystal)[] = [target];
  
    // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
    if (
      distance === 1 &&
      target instanceof Hero &&
      target.isKO &&
      isEnemySpawn(this.context, target.getTile())
    ) {
      target.removeFromGame();
    } else {
      // Get directions for finding out the next targets
      const attackDirection = gameController.board.getAttackDirection(this.boardPosition, target.boardPosition);
      const opponentDirection = this.context.isPlayerOne ? [2, 3, 4] : [6, 7, 8];
  
      // Collect all targets
      const secondTarget = this.getNextTarget(target, attackDirection, opponentDirection, gameController.board, false);
      if (secondTarget) {
        targets.push(secondTarget);
        const thirdTarget = this.getNextTarget(secondTarget, attackDirection, opponentDirection, gameController.board, false, [target.boardPosition, secondTarget.boardPosition]);
        if (thirdTarget) {
          targets.push(thirdTarget);
        }
      }
  
      if (this.superCharge) {
        effectSequence(this.scene, ECouncilSounds.WIZARD_ATTACK_BIG);
      } else {
        effectSequence(this.scene, ECouncilSounds.WIZARD_ATTACK);
      }
  
      // Apply damage to targets dynamically
      const damageMultipliers = [1, 0.75, 0.56];
      const delayIncrements = [650, 750, 850];
  
      targets.forEach((current_target, index) => {
        const power = this.getTotalPower() * (damageMultipliers[index] || 0); // Default to 0 if no multiplier
        const delay = delayIncrements[index] || delayIncrements[0]; // Default to first delay if no specific delay
        const [currentReplayWait,] = current_target.getsDamaged(power, this.attackType, delay);
        replayWait.push(currentReplayWait);
      });
  
      this.removeAttackModifiers();
    }
  
    this.context.gameController!.afterAction(EActionType.ATTACK, this.boardPosition, target.boardPosition);
  
    await Promise.all(replayWait);
    await timeDelay(this.context, 500);
  }
  getNextTarget(target: Hero | Crystal, attackDirection: number, opponentDirection: number[], board: Board, isLastTarget: boolean, toIgnore?: number[]): Hero | Crystal | undefined {
    const positionsToIgnore = toIgnore ? toIgnore : [target.boardPosition];
    const adjacentEnemies = this.getAdjacentEnemyTiles(target.boardPosition, positionsToIgnore);

    let maxScore = -1;
    let bestTarget: Tile | undefined;

    for (const enemyTile of adjacentEnemies) {
      const enemyTileDirection = board.getAttackDirection(target.boardPosition, enemyTile.boardPosition);

      let score = 0;

      /**
       *  An enemy unit gets points for:
       *    -being in the same direction of the attack
       *    -being in the general direction of the attack
       *    -being in the direction of the opponent's side of the board
       *    -being in an orthogonal direction (tie breaker)
       *    -having an adjacent enemy unit (the attack prioritizes number of target versus direction)
       *  */
      if (enemyTileDirection === attackDirection) score += 2;
      if (this.getGeneralDirections(attackDirection).includes(enemyTileDirection)) score += 1.5;
      if (opponentDirection.includes(enemyTileDirection)) score += 1;
      if ([1, 3, 5, 7].includes(enemyTileDirection)) score += 1;

      if (!isLastTarget) {
        const enemyHasAdjacentEnemies = this.getAdjacentEnemyTiles(enemyTile.boardPosition, [enemyTile.boardPosition]);
        if (enemyHasAdjacentEnemies.length) {
          score += 1.5;
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestTarget = enemyTile;
      }

      if (maxScore === 6) break;
    }

    if (!bestTarget) {
      console.log("getNextTarget() No suitable adjacent target found.");
      return undefined;
    }

    if (bestTarget.hero) {
      const hero = board.units.find(unit => unit.unitId === bestTarget.hero!.unitId);
      if (hero) return hero;
    }

    if (bestTarget.crystal) {
      const crystal = board.crystals.find(c => c.boardPosition === bestTarget.crystal!.boardPosition);
      if (crystal) return crystal;
    }

    throw new Error("getNextTarget() Target found on tile, but not in board units or crystals");
  }

  getAdjacentEnemyTiles(boardPosition: number, ignorePosition: number[] = []): Tile[] {
    const adjacentBoardPositions = [-10, -9, -8, -1, +1, +8, +9, +10];

    const adjacentTiles: Tile[] = [];

    adjacentBoardPositions.forEach(adjacentBp => {
      const tilePosition = boardPosition + adjacentBp;

      if (isOnBoard(tilePosition)) {
        const tile = this.context.gameController!.board.getTileFromBoardPosition(tilePosition);

        if (canBeAttacked(this, tile) &&
        !ignorePosition.includes(tile.boardPosition)) {
          adjacentTiles.push(tile);
        }}
    });

    return adjacentTiles;
  }

  private getGeneralDirections(direction: number): number[] {
    switch (direction) {
      case 1: return [1, 2, 8];
      case 2: return [[1, 2, 8], [2, 3, 4]].flat();
      case 3: return [2, 3, 4];
      case 4: return [[2, 3, 4], [4, 5, 6]].flat();
      case 5: return [4, 5, 6];
      case 6: return [[4, 5, 6], [6, 7, 8]].flat();
      case 7: return [6, 7, 8];
      case 8: return [[1, 2, 8], [6, 7, 8]].flat();
      default: return [];
    }
  }

  heal(_target: Hero): void {};
  teleport(_target: Hero): void {};
}

export class Ninja extends Human {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  async attack(target: Hero | Crystal): Promise<void> {
    this.flashActingUnit();

    turnIfBehind(this.context, this, target);

    const distance = this.getDistanceToTarget(target);

    let delay = 0;
    let replayWait: Promise<void>;

    if (distance === 1) {
      // Check required for the very specific case of being orthogonally adjacent to a KO'd enemy unit on an enemy spawn
      if (
        target instanceof Hero &&
        target.isKO &&
        isEnemySpawn(this.context, target.getTile())
      ) {
        effectSequence(this.scene, ECouncilSounds.NINJA_ATTACK);
        replayWait = timeDelay(this.context, 500);
        target.removeFromGame();
      } else {
        if (this.superCharge) {
          effectSequence(this.scene, ECouncilSounds.NINJA_ATTACK_BIG);
          delay = 650;
        } else {
          effectSequence(this.scene, ECouncilSounds.NINJA_ATTACK);
          delay = 500;
        }
        [replayWait, ] = target.getsDamaged(this.getTotalPower(2), this.attackType, delay);
      }
      this.removeAttackModifiers();

    } else {
      if (this.superCharge) {
        effectSequence(this.scene, ECouncilSounds.NINJA_ATTACK_BIG);
        delay = 500;
      } else {
        effectSequence(this.scene, ECouncilSounds.NINJA_ATTACK_RANGED);
        delay = 500
      }
            [replayWait, ] = target.getsDamaged(this.getTotalPower(), this.attackType, delay);
      this.removeAttackModifiers();
    }

    this.context.gameController!.afterAction(EActionType.ATTACK, this.boardPosition, target.boardPosition);

    await replayWait;
    await timeDelay(this.context, 500);

    
  }

  async teleport(target: Hero): Promise<void> {
    const targetDestination = this.getTile();
    const unitDestination = target.getTile();

    this.context.thinkingMusic.stop();

    // Smoke bomb animation
    this.singleTween(this.smokeAnim!, 500);
    target.singleTween(target.smokeAnim!, 500);

    target.specialTileCheck(targetDestination.tileType, unitDestination.tileType);
    target.updatePosition(targetDestination);
    targetDestination.hero = target.exportData();

    this.specialTileCheck(unitDestination.tileType, targetDestination.tileType);
    this.updatePosition(unitDestination);
    unitDestination.hero = this.exportData();

    this.context.gameController!.afterAction(EActionType.TELEPORT, targetDestination.boardPosition, unitDestination.boardPosition);

    effectSequence(this.scene, ECouncilSounds.NINJA_SMOKE);

    await timeDelay(this.context, 750);
  };

  heal(_target: Hero): void {};
}

export class Cleric extends Human {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  async attack(target: Hero | Crystal): Promise<void> {
    this.flashActingUnit();

    turnIfBehind(this.context, this, target);

    let delay = 0;
    let replayWait: Promise<void>;
    const distance = this.getDistanceToTarget(target);

    if (
      distance === 1 &&
      target instanceof Hero &&
      target.isKO &&
      isEnemySpawn(this.context, target.getTile())
    ) {
      effectSequence(this.scene, ECouncilSounds.CLERIC_ATTACK);
      replayWait = timeDelay(this.context, 300)
      target.removeFromGame();
    } else {
      if (this.superCharge) {
        effectSequence(this.scene, ECouncilSounds.CLERIC_ATTACK_BIG);
        delay = 750;
      } else {
        effectSequence(this.scene, ECouncilSounds.CLERIC_ATTACK);
        delay = 300;
      }
      [replayWait, ] = target.getsDamaged(this.getTotalPower(), this.attackType, delay)

      this.removeAttackModifiers();
    }
    
    this.context.gameController!.afterAction(EActionType.ATTACK, this.boardPosition, target.boardPosition);

    await replayWait;
    await timeDelay(this.context, 500);

    
  }

  async heal(target: Hero): Promise<void> {
    this.flashActingUnit();
    
    turnIfBehind(this.context, this, target);

    if (target.isKO) {
      const healingAmount = this.getTotalHealing(this.basePower, 2);
      target.getsHealed(healingAmount);
    } else {
      const healingAmount = this.getTotalHealing(this.basePower, 3);
      target.getsHealed(healingAmount);
    }

    this.context.gameController!.afterAction(EActionType.HEAL, this.boardPosition, target.boardPosition);

    effectSequence(this.scene, EGameSounds.HEAL);
    await timeDelay(this.context, 750);
    effectSequence(this.scene, EGameSounds.HEAL_EXTRA);

    await timeDelay(this.context, 750)
  };

  teleport(_target: Hero): void {};
}

export class DragonScale extends Item {
  constructor(context: GameScene, data: IItem) {
    super(context, data);
  }

  async use(target: Hero): Promise<void> {
    target.equipFactionBuff(this.boardPosition);
    this.removeFromGame();
    await timeDelay(this.context, 1000)
  }
}

export class HealingPotion extends Item {
  constructor(context: GameScene, data: IItem) {
    super(context, data);
  }

  async use(target: Hero): Promise<void> {
    const potionImage = this.scene.add.image(target.x, target.y - 10, 'healingPotion').setDepth(100);
    useAnimation(potionImage);

    const healingAmount = target.isKO ? 100 : 1000;
    target.getsHealed(healingAmount);

    effectSequence(this.scene, EGameSounds.USE_POTION);

    this.removeFromGame();

    this.context.gameController!.afterAction(EActionType.USE, this.boardPosition, target.boardPosition);

    await timeDelay(this.context, 1000);
  }
}

export class Inferno extends Item {
  constructor(context: GameScene, data: IItem) {
    super(context, data);
  };

  async use(targetTile: Tile): Promise<void> {
    const infernoImage = this.scene.add.image(targetTile.x, targetTile.y, 'infernoShockWave').setDepth(100);
    useAnimation(infernoImage, 3);

    // Damages enemy units and crystals, and removes enemy KO'd units
    const damage = 350;

    const { enemyHeroTiles, enemyCrystalTiles } = getAOETiles(this.context, this, targetTile);

    let replayWait: Promise<void>[] = [timeDelay(this.context, 250)];
    let currentReplayWait: Promise<void>;

    effectSequence(this.scene, ECouncilSounds.USE_FIREBOMB);

    let playSound = true;
    enemyHeroTiles?.forEach(tile => {
      const hero = this.context.gameController!.board.units.find(unit => unit.boardPosition === tile.boardPosition);
      if (!hero) throw new Error('Inferno use() hero not found');

      // Inferno removes KO'd enemy units
      if (hero.isKO){
        hero.removeFromGame(true);
        return;
      }

      [currentReplayWait, ] = hero.getsDamaged(damage, EAttackType.MAGICAL, 800, playSound);
      replayWait.push(currentReplayWait);
      playSound = false; // don't stack sound for loud volume (will stack ko sound)
    });

    playSound = true
    enemyCrystalTiles.forEach(tile => {
      const crystal = this.context.gameController!.board.crystals.find(crystal => crystal.boardPosition === tile.boardPosition);
      if (!crystal) throw new Error('Inferno use() crystal not found');

      [currentReplayWait, ] = crystal.getsDamaged(damage, EAttackType.MAGICAL, 800, playSound);
      
      replayWait.push(currentReplayWait);
      playSound = false; // don't stack sound for loud volume (will stack ko sound)
    });

    this.removeFromGame();
    this.context.gameController!.afterAction(EActionType.USE, this.boardPosition, targetTile.boardPosition);

    if (enemyCrystalTiles.length === 0 && enemyHeroTiles.length === 0) {
      await timeDelay(this.context, 800);
    }

    await Promise.all(replayWait);
    await timeDelay(this.context, 250);
  }
}
