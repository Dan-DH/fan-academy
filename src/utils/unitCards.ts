import { Tile } from "../classes/board/tile";
import { EHeroes, EItems, ECardType } from "../enums/gameEnums";
import GameScene from "../scenes/game.scene";

// Used to remove any visible unit cards from a mobile long press action
export function visibleUnitCardCheck(context: GameScene): void {
  if (!context.visibleUnitCard) return;

  if (context.visibleUnitCard instanceof Tile) {
    context.visibleUnitCard.setDepth(2);
  } else {
    context.visibleUnitCard.setDepth(context.visibleUnitCard.stats.row + 10);
  }

  context.visibleUnitCard.unitCard?.setVisible(false);
}

export function getCardText(unit: EHeroes | EItems): {
  cardType: ECardType,
  cardText: string,
  cardName?: string
} {
  const unitMap = {
    [EHeroes.ARCHER]: {
      cardType: ECardType.SHOOTER,
      cardText: "Marksman who does high damage to enemies at range. Weak melee attack."
    },
    [EHeroes.CLERIC]: {
      cardType: ECardType.SUPPORT,
      cardText: "Spellcaster who revives and heals allies. Attacks enemies at range."
    },
    [EHeroes.KNIGHT]: {
      cardType: ECardType.FIGHTER,
      cardText: "Heavily armored and an excellent defender. His attacks knock back enemies."
    },
    [EHeroes.NINJA]: {
      cardType: ECardType.SUPER,
      cardText: "Deals double damage in melee range. He can teleport to allies."
    },
    [EHeroes.WIZARD]: {
      cardType: ECardType.CASTER,
      cardText: "Powerful spellcaster, damages groups of enemies with chain lightning."
    },

    [EHeroes.PRIESTESS]: {
      cardType: ECardType.SUPPORT,
      cardText: "She can heal up to 3 tiles away, and weakens enemy attacks."
    },
    [EHeroes.IMPALER]: {
      cardType: ECardType.SHOOTER,
      cardText: "Wields a powerful harpoon that can pull enemies close."
    },
    [EHeroes.NECROMANCER]: {
      cardType: ECardType.CASTER,
      cardText: "Dark caster who can create Phantoms from fallen units."
    },
    [EHeroes.PHANTOM]: {
      cardType: ECardType.SUMMONED,
      cardText: "A summoned phantom from beyond."
    },
    [EHeroes.VOIDMONK]: {
      cardType: ECardType.FIGHTER,
      cardText: "Strong melee fighter whose hits do splash damage."
    },
    [EHeroes.WRAITH]: {
      cardType: ECardType.SUPER,
      cardText: "A terror who gains max health and power by draining K.O.'d units."
    },

    [EHeroes.GUNNER]: {
      cardType: ECardType.SHOOTER,
      cardText: "Shooter who deals high damage to a nearby enemy. AoE damage at range."
    },
    [EHeroes.PALADIN]: {
      cardType: ECardType.FIGHTER,
      cardText: "Holy warrior; heals and revives allies, healing herself in the process. Nearby allies gain defenses and power."
    },
    [EHeroes.ENGINEER]: {
      cardType: ECardType.SUPPORT,
      cardText: "Shield a single ally/crystal. Higher bonus from premium squares."
    },
    [EHeroes.ANNIHILATOR]: {
      cardType: ECardType.SUPER,
      cardText: "Deals heavy damage with AoE knockback. Direct hits weaken physical defenses."
    },
    [EHeroes.GRENADIER]: {
      cardType: ECardType.CASTER,
      cardText: "Lobs molotovs over enemies for AoE damage. Weak melee attack."
    },

    [EItems.SHINING_HELM]: {
      cardName: 'Shining Helm',
      cardType: ECardType.EQUIPMENT,
      cardText: "Adds 20% magical defense, and 10% max health."
    },
    [EItems.SUPERCHARGE]: {
      cardName: 'Scroll',
      cardType: ECardType.BUFF,
      cardText: "Multiplies an ally's attack power by 3 for one attack."
    },
    [EItems.RUNE_METAL]: {
      cardName: 'Runemetal',
      cardType: ECardType.EQUIPMENT,
      cardText: "Permanently increases an ally's power by 50%."
    },

    [EItems.DRAGON_SCALE]: {
      cardName: 'Dragonscale',
      cardType: ECardType.EQUIPMENT,
      cardText: "Adds 20% physical defense, and 10% max health."
    },
    [EItems.HEALING_POTION]: {
      cardName: 'Healing Potion',
      cardType: ECardType.CONSUMABLE,
      cardText: "Heals an ally for 1000 HP, or revives an ally with 100 HP."
    },
    [EItems.INFERNO]: {
      cardName: 'Inferno',
      cardType: ECardType.SPELL,
      cardText: "Damages all enemies in a 3x3 area and destroys knocked-out units."
    },

    [EItems.MANA_VIAL]: {
      cardName: 'Mana Vial',
      cardType: ECardType.CONSUMABLE,
      cardText: "Heals an ally for 1000 HP and increases max health by 50 HP."
    },
    [EItems.SOUL_HARVEST]: {
      cardName: 'Soul Harvest',
      cardType: ECardType.SPELL,
      cardText: "Drains health from enemies in a 3x3 area. Increases max health for all allies and revives knocked-out units."
    },
    [EItems.SOUL_STONE]: {
      cardName: 'Soulstone',
      cardType: ECardType.EQUIPMENT,
      cardText: "Doubles the effect of a unit's life leech and increases max health by 10%."
    },

    [EItems.DWARVEN_BREW]: {
      cardName: 'Dwarven Brew',
      cardType: ECardType.CONSUMABLE,
      cardText: "Heals an ally for 1000 HP and increases damage resistance by 50% until the next hit."
    },
    [EItems.PULVERIZER]: {
      cardName: 'Pulverizer',
      cardType: ECardType.SPELL,
      cardText: "Deals 600 physical damage to a target. Crystal hits damage all nearby units, while unit direct hits destroy equipped Armor."
    }
  };

  return unitMap[unit];
}