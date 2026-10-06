import { EClass } from "../enums/gameEnums";
import { IHeroBE, IItemBE } from "../interfaces/gameInterface";
import { createNewHero, createNewItem } from "../utils/createUnit";
import { Hero } from "./factions/hero";
import { Item } from "./factions/item";

export class Hand {
  hand: (Hero | Item)[];
  isVisible = true;

  constructor(handData: (IHeroBE | IItemBE)[], isVisible?: boolean) {
    this.hand = handData?.map(unit => this.renderUnit(unit)) ?? [];
    if (isVisible) this.isVisible = isVisible;
  }

  getHandSize(): number {
    return this.hand.length;
  }

  getHand(): (Hero | Item)[] {
    return this.hand;
  }

  getHandElement(unitId: string): Hero | Item | undefined {
    return this.hand.find(u => u.stats.unitId === unitId);
  }

  renderUnit(unit: IHeroBE | IItemBE): Hero | Item {
    if (unit.class === EClass.HERO) return createNewHero(unit as IHeroBE);
    if (unit.class === EClass.ITEM) return createNewItem(unit as IItemBE);
    throw new Error('Unit passed to renderUnit is not a recognized type');
  }

  addToHand(units: (IHeroBE | IItemBE)[], isPlayerHand = true): void {
    const defaultPositions = [45, 46, 47, 48, 49, 50];

    let previousIndex = -1;
    defaultPositions.forEach(element => {
      if (!units.length) return;
      const matchIndex = this.hand.findIndex((unit) => unit.stats.boardPosition === element);

      if (matchIndex !== -1) {
        previousIndex = matchIndex;
      } else {
        const unitData = units.shift();
        if (unitData) {
          unitData.boardPosition = element;
          const newUnit = this.renderUnit(unitData).setVisible(this.isVisible);
          this.hand.push(newUnit);
        }
      }
    });

    this.hand.sort((a, b) => a.stats.boardPosition - b.stats.boardPosition);
  }

  removeFromHand(unitId: string): void {
    const index = this.hand.findIndex(unit => unit.stats.unitId === unitId);
    if (index === -1) console.log('missing item in hand', unitId, this.hand);
    if (index !== -1) this.hand.splice(index, 1);
  }

  exportHandData(): (IHeroBE | IItemBE)[] {
    if (this.hand.length === 0) return [];
    return this.hand.map(unit => unit.exportData());
  }

  disableOpponentHand(): void {
    this.hand.forEach(u => u.setVisible(false).setInteractive(false));
    this.isVisible = false;
  }
}
