import { IGameState, IHero, IItem } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { getCurrentPlayer } from "../../utils/playerUtils";

export class Deck {
  deck: (IHero | IItem)[];
  constructor(context: GameScene, lasTurnState: IGameState) {
    if (context.isPlayerOne){
      this.deck = structuredClone(lasTurnState.player1.factionData.unitsInDeck) ?? [];
    } else {
      this.deck = structuredClone(lasTurnState.player2!.factionData.unitsInDeck) ?? [];
    }
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