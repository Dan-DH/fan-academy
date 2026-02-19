import { EActionType, EGameSounds } from "../../../enums/gameEnums";
import { IHero } from "../../../interfaces/gameInterface";
import GameScene from "../../../scenes/game.scene";
import { playSound, useAnimation } from "../../../utils/gameUtils";
import { Hero } from "../../hero";
import { Tile } from "../../tile";

export abstract class Council extends Hero {
  constructor(context: GameScene, data: IHero, tile?: Tile) {
    super(context, data, tile);
  }

  equipFactionBuff(handPosition: number): void {
    playSound(this.scene, EGameSounds.DRAGON_SCALE_USE);

    const dragonScaleImg = this.scene.add.image(this.x + 10, this.y - 10, 'dragonScale').setOrigin(0.5).setDepth(100);
    useAnimation(dragonScaleImg);

    this.factionBuff = true;
    this.factionBuffImage.setVisible(true);
    this.characterImage.setTexture(this.updateCharacterImage());

    this.physicalDamageResistance += 20;

    this.increaseMaxHealth(this.baseHealth * 0.1);

    this.unitCard.updateCardData(this);
    this.updateTileData();

    this.scene.sound.play(EGameSounds.DRAGON_SCALE_USE);

    this.context.gameController!.afterAction(EActionType.USE, handPosition, this.boardPosition);
  }
}
