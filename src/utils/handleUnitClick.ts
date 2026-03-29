import { Types } from "phaser";
import { Hero } from "../classes/factions/hero";
import { Item } from "../classes/factions/item";
import { EGameSounds, EGameStatus, EHeroes, EItems, ERange, ETiles } from "../enums/gameEnums";
import GameScene from "../scenes/game.scene";
import { deselectUnit, selectUnit } from "./playerUtils";
import { adjustUnitCardPositionAndMakeVisible, isEnemySpawn } from "./boardUtils";
import { playSound, selectItemSound } from "./gameSounds";
import { visibleUnitCardCheck } from "./unitCards";
import { belongsToPlayer } from "./gameUtils";
import { HealingPotion } from "../classes/factions/council/items";

export function handleUnitClick(unit: Hero | Item, context: GameScene): void {
  unit.on('pointerdown', (pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
    if (context.currentGame.status === EGameStatus.FINISHED) return;
    visibleUnitCardCheck(context);

    if (pointer.button === 2) {
      unit.setDepth(1001);
      adjustUnitCardPositionAndMakeVisible(unit);
      context.visibleUnitCard = unit;
      event.stopPropagation();
      return;
    }

    if (pointer.button === 0) handleOnUnitLeftClick(unit, context);
  });

  unit.on('pointerup', (pointer: Phaser.Input.Pointer) => {
    if (context.currentGame.status === EGameStatus.FINISHED) return;

    if (pointer.button === 2) return;

    if (context.longPressStart && context.time.now - context.longPressStart > 500) {
      unit.setDepth(1001);
      adjustUnitCardPositionAndMakeVisible(unit);
      context.visibleUnitCard = unit;
    }
  });
}

function handleOnUnitLeftClick(unit: Hero | Item, context: GameScene): void {
  // console.log(`Unit in ${unit.stats.boardPosition}`, unit);

  // Set a timer for the a hold press on mobile
  context.longPressStart = context.time.now;

  // Only the active player can click on tiles, and only if they still have actions available
  if (context.activePlayer !== context.userId || context.currentTurnAction! > 5) return;

  const activeUnit = context.activeUnit;
  const activeUnitTile = activeUnit && activeUnit instanceof Hero && activeUnit.stats.boardPosition < 45 ? activeUnit.getTile() : undefined;
  const isFriendly = belongsToPlayer(context, unit);
  const isEnemy = unit instanceof Hero && !isFriendly;
  const isSameUnit = activeUnit?.stats.unitId === unit.stats.unitId;

  const healReticle = unit instanceof Hero ? unit.visuals.getByName('healReticle') as Phaser.GameObjects.Image : undefined;
  const attackReticle = unit instanceof Hero ? unit.visuals.getByName('attackReticle') as Phaser.GameObjects.Image : undefined;
  const allyReticle = unit instanceof Hero ? unit.visuals.getByName('allyReticle') as Phaser.GameObjects.Image : undefined;

  // CASE 1: No active unit
  if (!activeUnit && isFriendly) {
    if (unit instanceof Hero && unit.stats.isKO) return;

    if (unit.stats.boardPosition >= 45) {
      if (unit instanceof Hero) playSound(context, EGameSounds.HERO_HAND_SELECT);
      if (unit instanceof Item) selectItemSound(context, unit.stats.itemType);
    } else {
      playSound(context, EGameSounds.HERO_BOARD_SELECT);
    }

    selectUnit(context, unit);
    return;
  }

  // CASE 2: Clicking the active unit deselects it
  if (isSameUnit) {
    deselectUnit(context);
    return;
  }

  // CASE 3: There is already an active unit
  if (activeUnit && !isSameUnit) {
    // Unique case: Wraith can spawn on a KO'd unit
    if (
      unit instanceof Hero &&
      unit.stats.isKO &&
      activeUnit instanceof Hero &&
      activeUnit.stats.unitType === EHeroes.WRAITH &&
      activeUnit.stats.boardPosition >= 45 &&
      !isEnemySpawn(context, unit.getTile()) &&
      unit.getTile().isHighlighted
    ) {
      activeUnit.spawn(unit.getTile());
      return;
    }

    // CASE 3.1: Clicking an enemy unit
    if (isEnemy) {
      const unitTile = context.gameController!.board.getTileFromBoardPosition(unit.stats.boardPosition);

      if (activeUnit instanceof Hero && attackReticle?.visible) {
        activeUnit.attack(unit);
        return;
      }

      // Stomp enemy KO'd units
      if (activeUnit instanceof Hero && activeUnit.stats.boardPosition < 45) {
        const tilesInMovingRange = context.gameController!.board.getHeroTilesInRange(activeUnit, ERange.MOVE);
        const tilesInAttackingRange = context.gameController!.board.getHeroTilesInRange(activeUnit, ERange.ATTACK);
        const withinStompingRange = tilesInMovingRange.find(tile => tile.boardPosition === unit.stats.boardPosition);
        const withinAttackingRange = tilesInAttackingRange.find(tile => tile.boardPosition === unit.stats.boardPosition);
        const necromancerStompCheck = context.gameController!.board.necromancerStompCheck(activeUnit, unit, !!withinAttackingRange, !!withinStompingRange);

        if (
          unit.stats.isKO &&
          necromancerStompCheck &&
          (withinStompingRange || unitTile.isHighlighted)
        ) {
          activeUnit.move(activeUnit.getTile(), unitTile);
          return;
        }
        if (
          unit.stats.isKO && unitTile.tileType === ETiles.TELEPORTER && activeUnitTile?.tileType === ETiles.TELEPORTER
        ) {
          activeUnit.move(activeUnit.getTile(), unitTile);
          return;
        }
      }

      // Stomp a KO unit or Phantom on a friendly spawn tile with a unit from hand
      if (
        activeUnit instanceof Hero &&
        activeUnit.stats.boardPosition >= 45 &&
        (unit.stats.isKO || unit.stats.unitType === EHeroes.PHANTOM) &&
        !isEnemySpawn(context, unitTile) &&
        unitTile.isHighlighted
      ) {
        activeUnit.spawn(unit.getTile());
        return;
      }

      // Stomp enemy phantoms on friendly spawn tiles with a unit from hand
      if (
        activeUnit instanceof Hero &&
        activeUnit.stats.boardPosition >= 45 &&
        unit.stats.unitType === EHeroes.PHANTOM &&
        unitTile.tileType === ETiles.SPAWN &&
        !isEnemySpawn(context, unitTile) &&
        unitTile.isHighlighted
      ) {
        activeUnit.spawn(unit.getTile());
        return;
      }

      if (activeUnit instanceof Item && activeUnit.stats.dealsDamage) {
        activeUnit.use(unit.getTile());
        return;
      }
    }

    // CASE 3.2: Clicking a friendly unit on the board
    if (unit instanceof Hero && isFriendly && unit.stats.boardPosition < 45) {
      // Necromancer and Wraith can target friendly units if they are knocked down. NOTE: this check should always go before the stomping check
      if (activeUnit instanceof Hero && [EHeroes.NECROMANCER, EHeroes.WRAITH].includes(activeUnit.stats.unitType) && unit.stats.isKO && attackReticle?.visible) {
        activeUnit.attack(unit);
        return;
      }

      if (activeUnit instanceof Hero) {
        // Spawn stomp friendly units with a unit from hand
        const unitTile = unit.getTile();
        if (unit.stats.isKO && unitTile.tileType === ETiles.SPAWN && unitTile.isHighlighted && activeUnit.stats.boardPosition >= 45) {
          activeUnit.spawn(unitTile);
          return;
        }

        if (activeUnit.stats.canHeal && healReticle?.visible) {
          activeUnit.heal(unit);
          return;
        }

        if (activeUnit.stats.canBuff && healReticle?.visible) {
          activeUnit.shieldAlly(unit); // Engineers only
          return;
        }

        // Ninja can swap places with any friendly unit on the board
        if (activeUnit.stats.unitType === EHeroes.NINJA && allyReticle?.visible && !unit.stats.isKO) {
          activeUnit.teleport(unit);
          return;
        }

        // Stomp friendly KO'd units, unless you are a Necromancer
        if (activeUnit.stats.boardPosition < 45) {
          const tilesInRange = context.gameController!.board.getHeroTilesInRange(activeUnit, ERange.MOVE);
          const withinStompingRange = tilesInRange.find(tile => tile.boardPosition === unit.stats.boardPosition);
          if (
            unit.stats.isKO &&
            activeUnit.stats.unitType !== EHeroes.NECROMANCER &&
            (withinStompingRange || unitTile.isHighlighted)
          ) {
            const unitTile = context.gameController!.board.getTileFromBoardPosition(unit.stats.boardPosition);
            activeUnit.move(activeUnit.getTile(), unitTile);
            return;
          }
        }
      }

      if (activeUnit instanceof Item) {
        if (unit.isAlreadyEquipped(activeUnit) || unit.stats.unitType === EHeroes.PHANTOM && !activeUnit.stats.dealsDamage) return;

        if (activeUnit.stats.dealsDamage) activeUnit.use(unit.getTile());

        if (activeUnit instanceof HealingPotion && unit.isFullHP()) {
          console.log('this triggers');

          return;
        }

        if (!activeUnit.stats.dealsDamage &&
          (unit.stats.isKO && activeUnit.stats.itemType === EItems.HEALING_POTION ||
            !unit.stats.isKO)) activeUnit.use(unit);

        return;
      }
    }

    // If the new unit can't be attacked, healed or teleported, and it's a friendly unit, switch focus to new unit
    if (isFriendly) {
      if (unit instanceof Hero && unit.stats.isKO) return;
      deselectUnit(context);

      if (unit.stats.boardPosition >= 45) {
        if (unit instanceof Hero) playSound(context, EGameSounds.HERO_HAND_SELECT);
        if (unit instanceof Item) selectItemSound(context, unit.stats.itemType);
      } else {
        playSound(context, EGameSounds.HERO_BOARD_SELECT);
      }

      selectUnit(context, unit);
      return;
    }
  }
}
