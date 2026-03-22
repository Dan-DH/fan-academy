import { Types } from "phaser";
import { Tile } from "../classes/board/tile";
import { Hero } from "../classes/factions/hero";
import { Item } from "../classes/factions/item";
import { EGameStatus, ETiles, EGameSounds } from "../enums/gameEnums";
import GameScene from "../scenes/game.scene";
import { playSound } from "./gameSounds";
import { visibleUnitCardCheck } from "./unitCards";

export function handleTileClick(tile: Tile, context: GameScene): void {
  tile.on('pointerdown', (pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Types.Input.EventData) => {
    if (context.currentGame.status === EGameStatus.FINISHED || tile.hero || tile.crystal) return;

    visibleUnitCardCheck(context);
    context.longPressStart = context.time.now;

    // Handle right click: show card if empty special tile
    if (pointer.button === 2) {
      const isSpecial = tile.tileType !== ETiles.BASIC && tile.tileType !== ETiles.CRYSTAL;
      const isEmpty = !tile.hero && !tile.crystal;
      if (isSpecial && isEmpty) {
        tile.setDepth(1001);
        if (tile.unitCard) tile.unitCard.setVisible(true);
        context.visibleUnitCard = tile;
        event.stopPropagation();
      }
      return;
    }

    // Only the active player can click on tiles, and only if they still have actions available
    if (context.activePlayer !== context.userId || context.currentTurnAction! > 5) return;

    const activeUnit = context.activeUnit;
    const gameController = context.gameController;
    if (!activeUnit || !gameController) return;

    // If unit is on the board and the tile clicked on is in range, move the unit
    if (activeUnit.stats.boardPosition < 45 && tile.isHighlighted && activeUnit instanceof Hero) {
      activeUnit.move(activeUnit.getTile(), tile);
      playSound(context, EGameSounds.HERO_MOVE);
    }

    // If unit is in hand and clicked tile is highlighted, spawn. Otherwise, use item
    if (activeUnit.stats.boardPosition > 44 && tile.isHighlighted) {
      if (activeUnit instanceof Hero) activeUnit.spawn(tile);
      if (activeUnit instanceof Item && activeUnit.stats.dealsDamage) activeUnit.use(tile);
    }
  });

  // Handle click outside of the tile
  context.input.on('pointerdown', () => {
    if (tile.icon) {
      tile.icon.setDepth(2);
    }
  });

  // Handle long press on the tile
  tile.on('pointerup', () => {
    if (context.currentGame.status === EGameStatus.FINISHED || tile.hero || tile.crystal) return;

    if (context.longPressStart && context.time.now - context.longPressStart > 500) {
      tile.setDepth(1001);

      if (tile.unitCard) tile.unitCard.setVisible(true);
      context.visibleUnitCard = tile;
    }
  });

  tile.on('pointerout', () => {
    // Ignore if there was a long press. Used on mobile
    if (context.visibleUnitCard) return;

    if (tile.icon) tile.icon.setDepth(2);
    if (tile.unitCard) tile.unitCard.setVisible(false);
  });
}