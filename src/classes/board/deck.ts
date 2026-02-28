import { IHero, IItem } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { getCurrentPlayer } from "../../utils/playerUtils";

export class Deck {
  context: GameScene;
  deck: (IHero | IItem)[];
  constructor(context: GameScene) {
    this.context = context;
    this.deck = structuredClone(getCurrentPlayer(context).factionData.unitsInDeck);
  }

  getDeckSize(): number {
    return this.deck.length;
  }

  getDeck() {
    return this.deck;
  }

  removeFromDeck(amount: number): (IHero | IItem)[] {
    return this.deck.splice(0, amount);
  }

  addToDeck(unit: IHero | IItem): (IHero | IItem)[] {
    this.deck.push(unit);
    return this.deck;
  }
}