import { Types } from "phaser";
import { Crystal } from "../classes/board/crystal";
import { Hero } from "../classes/factions/hero";
import { Item } from "../classes/factions/item";
import { EGameStatus } from "../enums/gameEnums";
import GameScene from "../scenes/game.scene";
import { visibleUnitCardCheck } from "./unitCards";

export function handleCrystalClick(crystal: Crystal, context: GameScene): void {
  crystal.on('pointerdown', (pointer: Phaser.Input.Pointer, _x: number, _Y: number, event: Types.Input.EventData) => {
    if (context.currentGame.status === EGameStatus.FINISHED) return;
    console.log('CRYSTAL DEPTH', crystal.depth);

    console.log(`Crystal on ${crystal.stats.boardPosition}`, crystal);

    visibleUnitCardCheck(context);

    // Handling right click
    if (pointer.button === 2) {
      crystal.setDepth(1001);
      crystal.unitCard.setVisible(true);
      context.visibleUnitCard = crystal;
      event.stopPropagation();
      return;
    }

    // Set a timer for the a hold press on mobile
    context.longPressStart = context.time.now;

    // Handling left click
    if (pointer.button === 0) {
      const attackReticle = crystal.visuals.attackReticle;
      const healReticle = crystal.visuals.healReticle;
      const activeUnit = context.activeUnit;

      if (activeUnit) {
        if (activeUnit instanceof Hero && attackReticle.visible) {
          activeUnit.attack(crystal);
          return;
        }
        if (activeUnit instanceof Hero && healReticle.visible) {
          activeUnit.shieldAlly(crystal);
          return;
        }
        if (activeUnit instanceof Item && activeUnit?.stats.dealsDamage) {
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

    crystal.setDepth(crystal.stats.row + 10);
    crystal.unitCard.setVisible(false);
  });
}