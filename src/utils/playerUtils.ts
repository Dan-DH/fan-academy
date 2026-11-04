import { Hero } from "../classes/factions/hero";
import { Item } from "../classes/factions/item";
import { EGameModes, EGameStatus, ETurnTimer } from "../enums/gameEnums";
import { IGame } from "../interfaces/gameInterface";
import { fanAcademy } from "../main";
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
  if (unit instanceof Hero) context.onHeroClicked(unit);
  if (unit instanceof Item) context.onItemClicked(unit);
}

export function deselectUnit(context: GameScene): void {
  if (!context.activeUnit) return;

  context.activeUnit.isActive = false;
  context.activeUnit = undefined;
  context.board!.clearHighlights();
  context.board!.removeReticles();
}

export function getAllOpponentIds(mode: EGameModes, timer: ETurnTimer): string[] {
  const gameList = fanAcademy.registry.get('gameList') as IGame[];
  const playerIds: string[] = gameList.filter(g => g.turnTimer === timer && g.gameMode === mode && g.status !== EGameStatus.FINISHED).flatMap(g => [
    g.players[0].userData._id,
    g.players[1]?.userData._id
  ]);

  return [...new Set(playerIds)];
}
