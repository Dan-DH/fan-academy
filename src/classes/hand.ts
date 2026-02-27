import { EClass } from "../enums/gameEnums";
import { IHero, IItem } from "../interfaces/gameInterface";
import GameScene from "../scenes/game.scene";
import { createNewHero, createNewItem } from "../utils/createUnit";
import { getCurrentPlayer } from "../utils/playerUtils";
import { Hero } from "./factions/hero";
import { Item } from "./factions/item";

export class Hand {
  context: GameScene;
  handData: (IHero | IItem)[];
  hand: (Hero | Item)[];

  constructor(context: GameScene) {
    this.context = context;
    this.handData = getCurrentPlayer(context).factionData.unitsInHand ?? [];
    this.hand = this.handData?.map(unit => this.renderUnit(unit)) ?? [];
  }

  getHandSize(): number {
    return this.hand.length;
  }

  getHand(): (Hero | Item)[] {
    return this.hand;
  }

  renderUnit(unit: IHero | IItem): Hero | Item {
    if (unit.class === EClass.HERO) return createNewHero(this.context, unit as IHero);
    if (unit.class === EClass.ITEM) return createNewItem(this.context, unit as IItem);
    throw new Error('Unit passed to renderUnit is not a recognized type');
  }

  addToHand(units: (IHero | IItem)[]): void {
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
    if (index !== -1) this.hand.splice(index, 1);// can't use filter because creating a new array breaks the reference with factionData
  }

  exportHandData(): (IHero | IItem)[] {
    if (this.hand.length === 0) return [];
    return this.hand.map(unit =>  unit.exportData());
  }
}
