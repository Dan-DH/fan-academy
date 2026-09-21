import { IGameState, IHeroBE, IItemBE } from "../../interfaces/gameInterface";
import GameScene from "../../scenes/game.scene";
import { getCurrentPlayer } from "../../utils/playerUtils";

export class Deck {
  deck: (IHeroBE | IItemBE)[];
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

  removeFromDeck(amount: number): (IHeroBE | IItemBE)[] {
    return this.deck.splice(0, amount);
  }

  addToDeck(unit: IHeroBE | IItemBE): (IHeroBE | IItemBE)[] {
    this.deck.push(unit);
    return this.deck;
  }
}