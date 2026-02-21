export enum EAttackType {
  PHYSICAL = 'physical',
  MAGICAL = 'magical'
};

export enum EGameStatus {
  SEARCHING = 'searching',
  PLAYING = 'playing',
  FINISHED = 'finished',
  CHALLENGE = 'challenge'
};

export enum EGameTermination {
  CONCEDED = 'conceded',
  CANCELED = 'canceled'
}

export enum EWinConditions {
  CRYSTAL = 'Crystal victory',
  UNITS = 'Hero victory',
  TIME = 'Timeout',
  CONCEDED = 'Game conceded'
};

export enum EFaction {
  COUNCIL = 'Council',
  DARK_ELVES = 'Dark Elves',
  DWARVES = 'Dwarves'
}

export enum EActionType {
  MOVE = 'move',
  ATTACK = 'attack',
  HEAL = 'heal',
  SPAWN = 'spawn',
  SPAWN_PHANTOM = 'phantom',
  USE = 'use',
  SHUFFLE = 'shuffle',
  TELEPORT = 'teleport',
  CONCEDE = 'concede',

  // Automated actions
  DRAW = 'draw',
  PASS = 'pass',
  REMOVE_UNITS = 'removeUnits'
}

export enum EActionClass {
  USER = 'user',
  AUTO = 'automatic'
}

export enum EItems {
  // Generic
  SHINING_HELM = 'shiningHelm',
  RUNE_METAL = 'runeMetal',
  SUPERCHARGE = 'superCharge',

  // Council
  DRAGON_SCALE = 'dragonScale',
  HEALING_POTION = 'healingPotion',
  INFERNO = 'inferno',

  // Dark elves
  SOUL_STONE = 'soulStone',
  SOUL_HARVEST = 'soulHarvest',
  MANA_VIAL = 'manaVial',

  // Dwarves
  DWARVEN_BREW = 'dwarvenBrew',
  PULVERIZER = 'pulverizer'
}

export enum EClass {
  HERO = 'hero',
  ITEM = 'item'
}

export enum EHeroes {
  // Council
  ARCHER = 'archer',
  CLERIC = 'cleric',
  KNIGHT = 'knight',
  NINJA = 'ninja',
  WIZARD = 'wizard',

  // Dark Elves
  PRIESTESS = 'priestess',
  IMPALER = 'impaler',
  NECROMANCER = 'necromancer',
  PHANTOM = 'phantom',
  VOIDMONK = 'voidmonk',
  WRAITH = 'wraith',

  // Dwarves
  PALADIN = 'paladin',
  GUNNER = 'gunner',
  ENGINEER = 'engineer',
  GRENADIER = 'grenadier',
  ANNIHILATOR = 'annihilator'

}

export enum ETiles {
  BASIC = 'basic',
  POWER = 'powerTile',
  PHYSICAL_RESISTANCE = 'shieldTile',
  MAGICAL_RESISTANCE = 'helmetTile',
  CRYSTAL_DAMAGE = 'crystalDamageTile',
  TELEPORTER = 'teleporterTile',
  CRYSTAL = 'crystal',
  CRYSTAL_BIG = 'crystalBig',
  CRYSTAL_SMALL = 'crystalSmall',
  SPAWN = 'spawnTile',
  SPEED = 'speedTile'
}

export enum ERange {
  MOVE = 'move',
  ATTACK = 'attack',
  HEAL = 'healing'
}

export enum ECardType {
  SHOOTER = 'Shooter',
  FIGHTER = 'Fighter',
  CASTER = 'Caster',
  SUPPORT = 'Support',
  EQUIPMENT = 'Equipment',
  BUFF = 'Buff',
  VICTORY = 'Victory Unit',
  SUPER = 'Super Unit',
  SUMMONED = 'Summoned',
  SPELL = 'Spell',
  CONSUMABLE = 'Consumable',
  SPECIAL_TILE = 'Special Tile'
}

export enum EChallengePopup {
  SEND = 'send',
  ACCEPT = 'accept',
  OPEN = 'open'
}

export enum EPopups {
  TURN = 'turn',
  CONCEDE = 'concede'
}

export enum EUiSounds {
  BUTTON_PLAY = 'battleButtonSound',
  BUTTON_GENERIC = 'buttonPressGenericSound',
  BUTTON_FAILED = 'buttonFailedSound',
  GAME_DELETE = 'deleteGameSound',
  RESIGN = 'resignSound',
  WIN_SFX = 'winSFXSound',
  LOSE_SFX = 'loseSFXSound'
}

export enum EGameSounds {
  HERO_HAND_SELECT = 'selectHeroFromHandSound',
  HERO_BOARD_SELECT = 'selectHeroFromBoardSound',
  HERO_SPAWN = 'spawnHeroSound',
  HERO_MOVE = 'moveHeroSound',
  MOVE_FLY = 'moveFlySound',
  MOVE_WALK = 'moveWalkSound',
  HEAL = 'healSound',
  HEAL_EXTRA = 'healExtraSound',
  HERO_STOMP = 'stompSound',
  VANISH = 'vanishSound',
  HERO_REVIVE = 'reviveHeroSound',

  SCROLL_SELECT = 'selectScrollSound',
  RUNE_METAL_SELECT = 'selectRuneMetalSound',
  SHIELD_SELECT = 'selectDragonScaleSound',
  ITEM_SELECT = 'selectItemGenericSound',
  POTION_SELECT = 'selectPotionSound',
  AOE_SPELL_SELECT = 'selectInfernoSound',

  SCROLL_USE = 'useScrollSound',
  RUNE_METAL_USE = 'useRuneMetalSound',
  DRAGON_SCALE_USE = 'useDragonScaleSound',
  ITEM_USE = 'useItemGenericSound', // Shining helm and Soul stone
  POTION_USE = 'usePotionSound',

  SWORD_TILE = 'swordTileSound',
  SHIELD_TILE = 'shieldTileSound',
  HELM_TILE = 'helmTileSound',
  CRYSTAL_TILE = 'crystalTileSound',

  RESET_TURN = 'resetTurnSound',
  DRAW = 'newItemsSound',
  SHUFFLE = 'returnItemSound',
  CRYSTAL_DAMAGE = 'damageCrystal1Sound',
  CRYSTAL_DAMAGE_BUFF = 'damageCrystal2Sound',
  CRYSTAL_DESTROY = 'destroyCrystalSound',

  // Council sounds
  ARCHER_ATTACK = 'archerAttackSound',
  ARCHER_ATTACK_BIG = 'archerAttackBigSound',
  ARCHER_ATTACK_MELEE = 'archerAttackMeleeSound',
  ARCHER_DEATH = 'archerDeathSound',
  CLERIC_ATTACK = 'clericAttackSound',
  CLERIC_ATTACK_BIG = 'clericAttackBigSound',
  CLERIC_DEATH = 'clericDeathSound',
  KNIGHT_ATTACK = 'knightAttackSound',
  KNIGHT_ATTACK_BIG = 'knightAttackBigSound',
  KNIGHT_DEATH = 'knightDeathSound',
  NINJA_ATTACK = 'ninjaAttackSound',
  NINJA_ATTACK_BIG = 'ninjaAttackBigSound',
  NINJA_ATTACK_RANGED = 'ninjaAttackRangedSound',
  NINJA_DEATH = 'ninjaDeathSound',
  NINJA_SMOKE = 'ninjaSmokeSound',
  WIZARD_ATTACK = 'wizardAttackSound',
  WIZARD_ATTACK_BIG = 'wizardAttackBigSound',
  WIZARD_DEATH = 'wizardDeathSound',
  INFERNO_USE = 'useInfernoSound',

  // Elves sounds
  PRIESTESS_ATTACK = 'priestessAttackSound',
  PRIESTESS_DEATH = 'priestessDeathSound',
  IMPALER_ATTACK = 'impalerAttackSound',
  IMPALER_ATTACK_BIG = 'impalerAttackBigSound',
  IMPALER_ATTACK_MELEE = 'impalerAttackMeleeSound',
  IMPALER_DEATH = 'impalerDeathSound',
  NECROMANCER_ATTACK = 'necroAttackSound',
  NECROMANCER_ATTACK_BIG = 'necroAttackBigSound',
  NECROMANCER_DEATH = 'necromancerDeathSound',
  PHANTOM_SPAWN = 'phantomSpawnSound',
  PHANTOM_DEATH = 'phantomDeathSound',
  VOIDMONK_ATTACK = 'voidmonkAttackSound',
  VOIDMONK_ATTACK_BIG = 'voidmonkAttackBigSound',
  VOIDMONK_DEATH = 'voidmonkDeathSound',
  WRAITH_ATTACK = 'wraithAttackSound',
  WRAITH_ATTACK_BIG = 'wraithAttackBigSound',
  WRAITH_DEATH = 'wraithDeathSound', // used also for Necromancer's death
  WRAITH_CONSUME = 'wraithConsumeSound',
  USE_HARVEST = 'useHarvestSound'

  // TODO: dwarven noises
}