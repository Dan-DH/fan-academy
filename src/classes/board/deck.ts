import { IHeroBE, IItemBE } from "../../interfaces/gameInterface";

export class Deck {
  deck: (IHeroBE | IItemBE)[];
  constructor(deckData: (IHeroBE | IItemBE)[]) {
    this.deck = deckData;
  }

  getDeckSize(): number {
    return this.deck.length;
  }

  getDeck() {
    return this.deck;
  }

  removeFromDeck(amount: number): (IHeroBE | IItemBE)[] {
    return this.deck.splice(0, amount);
  }

  addToDeck(unit: IHeroBE | IItemBE): (IHeroBE | IItemBE)[] {
    this.deck.push(unit);
    return this.deck;
  }
}