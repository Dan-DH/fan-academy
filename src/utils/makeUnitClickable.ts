import { Types } from "phaser";
import { Crystal } from "../classes/crystal";
import { Hero } from "../classes/hero";
import { Item } from "../classes/item";
import { Tile } from "../classes/tile";
import { EGameStatus, EHeroes, EItems, ERange, ETiles } from "../enums/gameEnums";
import GameScene from "../scenes/game.scene";
import { belongsToPlayer, isEnemySpawn, isHero, isItem, visibleUnitCardCheck } from "./gameUtils";
import { deselectUnit, selectUnit } from "./playerUtils";

export function makeUnitClickable(unit: Hero | Item, context: GameScene): void {
  unit.on('pointerdown', (pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
    if (context.currentGame.status === EGameStatus.FINISHED) return;

    visibleUnitCardCheck(context);

    if (pointer.button === 2) {
      unit.setDepth(1001);
      unit.unitCard.setVisible(true);
      context.visibleUnitCard = unit;
      event.stopPropagation();
    }

    // Set a timer for the a hold press on mobile
    context.longPressStart = context.time.now;

    if (pointer.button === 0) handleOnUnitLeftClick(unit, context);
  });

  unit.on('pointerup', (pointer: Phaser.Input.Pointer) => {
    if (context.currentGame.status === EGameStatus.FINISHED) return;

    if (pointer.button === 2) return;

    if (context.longPressStart && context.time.now - context.longPressStart > 500) {
      unit.setDepth(1001);
      unit.unitCard.setVisible(true);
      context.visibleUnitCard = unit;
    }
  });
}

function handleOnUnitLeftClick(unit: Hero | Item, context: GameScene): void {
  console.log(`Unit in ${unit.boardPosition}`, unit);

  // Only the active player can click on tiles, and only if they still have actions available
  if (context.activePlayer !== context.userId || context.currentTurnAction! > 5) return;

  const activeUnit = context.activeUnit;
  const isFriendly = belongsToPlayer(context, unit);
  const isEnemy = isHero(unit) && !isFriendly;
  const isSameUnit = activeUnit?.unitId === unit.unitId;

  const healReticle = isHero(unit) ? unit.getByName('healReticle') as Phaser.GameObjects.Image : undefined;
  const attackReticle = isHero(unit) ? unit.getByName('attackReticle') as Phaser.GameObjects.Image : undefined;
  const allyReticle = isHero(unit) ? unit.getByName('allyReticle') as Phaser.GameObjects.Image : undefined;

  // CASE 1: No active unit
  if (!activeUnit && isFriendly) {
    if (isHero(unit) && unit.isKO) return; // Can't select KO'd units

    selectUnit(context, unit);
    return;
  }

  // CASE 2: Clicking the active unit deselects it, unless it's a healer
  if (isSameUnit) {
    if (isHero(activeUnit) && activeUnit.canHeal && healReticle?.visible && isHero(unit)) {
      activeUnit.heal(unit);
      return;
    } else {
      deselectUnit(context);
    }
    return;
  }

  // CASE 3: There is already an active unit
  if (activeUnit && !isSameUnit) {
    // Unique case: Wraith can spawn on a KO'd unit
    if (isHero(unit) && unit.isKO && isHero(activeUnit) && activeUnit.unitType === EHeroes.WRAITH && activeUnit.boardPosition >= 45) {
      activeUnit.spawn(unit.getTile()) && !isEnemySpawn(context, unit.getTile());
      return;
    }

    // CASE 3.1: Clicking an enemy unit
    if (isEnemy) {
      const unitTile = context.gameController!.board.getTileFromBoardPosition(unit.boardPosition);

      if (isHero(activeUnit) && attackReticle?.visible) {
        activeUnit.attack(unit);
        return;
      }

      // Stomp enemy KO'd units
      if (
        isHero(activeUnit) &&
        activeUnit.boardPosition < 45 &&
        unit.isKO && !isEnemySpawn(context, unitTile)) {
        activeUnit.move(unitTile);
        return;
      }

      // Stomp a KO unit or Phantom on a friendly spawn tile with a unit from hand
      if (
        isHero(activeUnit) &&
        activeUnit.boardPosition >= 45 &&
        (unit.isKO || unit.unitType === EHeroes.PHANTOM) &&
        !isEnemySpawn(context, unitTile) &&
        unitTile.isHighlighted
      ) {
        activeUnit.spawn(unit.getTile());
        return;
      }

      // Stomp enemy phantoms on friendly spawn tiles with a unit from hand
      if (isHero(activeUnit) && activeUnit.boardPosition >= 45 && unit.unitType === EHeroes.PHANTOM && !isEnemySpawn(context, unitTile)) {
        activeUnit.spawn(unit.getTile());
        return;
      }

      if (isItem(activeUnit) && activeUnit.dealsDamage) {
        activeUnit.use(unit.getTile());
        return;
      }
    }

    // CASE 3.2: Clicking a friendly unit on the board
    if (isHero(unit) && isFriendly && unit.boardPosition < 45) {
      // Necromancer and Wraith can target friendly units if they are knocked down. NOTE: this check should always go before the stomping check
      if (isHero(activeUnit) && [EHeroes.NECROMANCER, EHeroes.WRAITH].includes(activeUnit.unitType) && unit.isKO && attackReticle?.visible) {
        activeUnit.attack(unit);
        return;
      }

      if (isHero(activeUnit)) {
        // Spawn stomp friendly units with a unit from hand
        const unitTile = unit.getTile();
        if (unit.isKO && unitTile.tileType === ETiles.SPAWN && unitTile.isHighlighted && activeUnit.boardPosition >= 45) {
          activeUnit.spawn(unitTile);
          return;
        }

        if (activeUnit.canHeal && healReticle?.visible) {
          activeUnit.heal(unit);
          return;
        }

        // Ninja can swap places with any friendly unit on the board
        if (activeUnit.unitType === EHeroes.NINJA && allyReticle?.visible && !unit.isKO) {
          activeUnit.teleport(unit);
          return;
        }

        // Stomp friendly KO'd units, unless you are a Necromancer
        if (activeUnit.boardPosition < 45) {
          const tilesInRange = context.gameController!.board.getHeroTilesInRange(activeUnit, ERange.MOVE);
          const withinStompingRange = tilesInRange.find(tile => tile.boardPosition === unit.boardPosition);
          if (
            unit.isKO &&
          activeUnit.unitType !== EHeroes.NECROMANCER &&
          withinStompingRange
          ) {
            const unitTile = context.gameController!.board.getTileFromBoardPosition(unit.boardPosition);
            activeUnit.move(unitTile);
            return;
          }
        }
      }

      if (isItem(activeUnit)) {
        if (unit.isAlreadyEquipped(activeUnit) || unit.unitType === EHeroes.PHANTOM) return;

        if (activeUnit.dealsDamage) activeUnit.use(unit.getTile());

        if (!activeUnit.dealsDamage && (!unit.isKO || activeUnit.itemType === EItems.HEALING_POTION)) activeUnit.use(unit);

        return;
      }
    }

    // If the new unit can't be attacked, healed or teleported, and it's a friendly unit, switch focus to new unit
    if (isFriendly) {
      if (isHero(unit) && unit.isKO) return;
      deselectUnit(context);
      return selectUnit(context, unit);
    }
  }
}

export function makeTileClickable(tile: Tile, context: GameScene): void {
  tile.on('pointerdown', () => {
    if (context.currentGame.status === EGameStatus.FINISHED) return;

    visibleUnitCardCheck(context);
    context.longPressStart = undefined;

    // Only the active player can click on tiles, and only if they still have actions available
    if (context.activePlayer !== context.userId || context.currentTurnAction! > 5) return;

    const activeUnit = context.activeUnit;
    const gameController = context.gameController;
    if (!activeUnit || !gameController) return;

    // If unit is on the board and the tile clicked on is in range, move the unit
    if (activeUnit.boardPosition < 45 && tile.isHighlighted && isHero(activeUnit)) activeUnit.move(tile);

    // If unit is in hand and clicked tile is highlighted, spawn. Otherwise, use item
    if (activeUnit.boardPosition > 44 && tile.isHighlighted) {
      if (isHero(activeUnit) && !tile.isOccupied()) activeUnit.spawn(tile);
      if (isItem(activeUnit) && activeUnit.dealsDamage) activeUnit.use(tile);
    }
  });
}

export function makeCrystalClickable(crystal: Crystal, context: GameScene): void {
  crystal.on('pointerdown', (pointer: Phaser.Input.Pointer, _x: number, _Y: number, event: Types.Input.EventData) => {
    if (context.currentGame.status === EGameStatus.FINISHED) return;

    visibleUnitCardCheck(context);

    // Handling right click
    if (pointer.button === 2) {
      crystal.setDepth(1001);
      crystal.unitCard.setVisible(true);
      context.visibleUnitCard = crystal;
      event.stopPropagation();
    }

    // Set a timer for the a hold press on mobile
    context.longPressStart = context.time.now;

    // Handling left click
    if (pointer.button === 0) {
      const attackReticle = crystal.attackReticle;
      const activeUnit = context.activeUnit;

      if (activeUnit) {
        if (isHero(activeUnit) && attackReticle.visible) {
          activeUnit.attack(crystal);
          return;
        }
        if (isItem(activeUnit) && activeUnit?.dealsDamage) {
          activeUnit.use(crystal.getTile());
          return;
        }
      }
    }
  });

  crystal.on('pointerup', () => {
    if (context.currentGame.status === EGameStatus.FINISHED) return;

    if (context.longPressStart && context.time.now - context.longPressStart > 500) {
      crystal.setDepth(1001);
      crystal.unitCard.setVisible(true);
      context.visibleUnitCard = crystal;
    }
  });

  crystal.on('pointerout', () => {
    // Ignore if there was a long press. Used on mobile
    if (context.visibleUnitCard) return;

    crystal.setDepth(crystal.boardPosition + 10);
    crystal.unitCard.setVisible(false);
  });
}
