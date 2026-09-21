import { EClass } from "../enums/gameEnums";
import { IGameState, IHeroBE, IItemBE } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";
import { createNewHero, createNewItem } from "../utils/createUnit";
import { Hero } from "./factions/hero";
import { Item } from "./factions/item";

export class Hand {
  context: GameScene;
  hand: (Hero | Item)[];

  constructor(context: GameScene, lastTurnState: IGameState) {
    this.context = context;

    let handData: (IHeroBE | IItemBE)[];
    if (context.isPlayerOne){
      handData = structuredClone(lastTurnState.player1.hand) ?? [];
    } else {
      handData = structuredClone(lastTurnState.player2!.hand) ?? [];
    }

    this.hand = handData?.map(unit => this.renderUnit(unit)) ?? [];
  }

  getHandSize(): number {
    return this.hand.length;
  }

  getHand(): (Hero | Item)[] {
    return this.hand;
  }

  renderUnit(unit: IHeroBE | IItemBE): Hero | Item {
    if (unit.class === EClass.HERO) return createNewHero(unit as IHeroBE);
    if (unit.class === EClass.ITEM) return createNewItem(unit as IItemBE);
    throw new Error('Unit passed to renderUnit is not a recognized type');
  }

  addToHand(units: (IHeroBE | IItemBE)[]): void {
    const defaultPositions = [45, 46, 47, 48, 49, 50];

    let previousIndex = -1;
    defaultPositions.forEach(element => {
      const matchIndex = this.hand.findIndex((unit) => unit.stats.boardPosition === element);

      if (matchIndex !== -1) {
        previousIndex = matchIndex;
      } else {
        const unitData = units.shift();
        if (unitData) {
          unitData.boardPosition = element;
          const newUnit = this.renderUnit(unitData);
          this.hand.splice(++previousIndex, 0, newUnit);
        }
      }
    });
  }

  removeFromHand(unitId: string): void {
    const index = this.hand.findIndex(unit => unit.stats.unitId === unitId);
    if (index !== -1) this.hand.splice(index, 1);
  }

  exportHandData(): (IHeroBE | IItemBE)[] {
    if (this.hand.length === 0) return [];
    return this.hand.map(unit => unit.exportData());
  }
}
