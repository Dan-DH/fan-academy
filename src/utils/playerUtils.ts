import { Hero } from "../classes/factions/hero";
import { Item } from "../classes/factions/item";
import { IPlayerState } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";

export function getPlayersKey(context: GameScene): {
  player: 'player1' | 'player2',
  opponent: 'player1' | 'player2'
} {
  return context.player1?.playerId === context.userId ? {
    player: 'player1',
    opponent: 'player2'
  } : {
    player: 'player2',
    opponent: 'player1'
  };
}

export function getCurrentPlayer(context: GameScene): IPlayerState {
  return context.isPlayerOne! ? context.player1! : context.player2!;
}

export function isValidPassword(password: string): boolean {
  const minLength = 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  return password.length >= minLength && hasLetter && hasNumber;
}

export function selectUnit(context: GameScene, unit: Hero | Item): void {
  unit.isActive = true;
  context.activeUnit = unit;

  // Highlight tiles
  if (unit instanceof Hero) context.gameController?.onHeroClicked(unit);
  if (unit instanceof Item) context.gameController?.onItemClicked(unit);
}

export function deselectUnit(context: GameScene): void {
  if (!context.activeUnit) return;

  context.activeUnit.isActive = false;
  context.activeUnit = undefined;
  context.gameController?.board.clearHighlights();
  context.gameController?.board.removeReticles();
}
