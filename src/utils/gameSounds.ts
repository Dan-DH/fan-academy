import { EGameSounds, EUiSounds, EItems, EHeroes } from "../enums/gameEnums";

export function playSound(scene: Phaser.Scene, sound: EGameSounds | EUiSounds): void {
  scene.sound.play(sound);
}

export function selectItemSound(scene: Phaser.Scene, item: EItems): void {
  const itemMap = {
    [EItems.RUNE_METAL]: EGameSounds.RUNE_METAL_SELECT,
    [EItems.SUPERCHARGE]: EGameSounds.SCROLL_SELECT,
    [EItems.SHINING_HELM]: EGameSounds.ITEM_SELECT,

    [EItems.DRAGON_SCALE]: EGameSounds.SHIELD_SELECT,
    [EItems.HEALING_POTION]: EGameSounds.POTION_SELECT,
    [EItems.INFERNO]: EGameSounds.AOE_SPELL_SELECT,

    [EItems.SOUL_STONE]: EGameSounds.ITEM_SELECT,
    [EItems.MANA_VIAL]: EGameSounds.POTION_SELECT,
    [EItems.SOUL_HARVEST]: EGameSounds.AOE_SPELL_SELECT,

    [EItems.DWARVEN_BREW]: EGameSounds.DWARVEN_BREW_SELECT,
    [EItems.PULVERIZER]: EGameSounds.PULVERIZER_SELECT
  };

  const soundToPlay = itemMap[item];
  if (!soundToPlay) return;

  playSound(scene, soundToPlay);
}

export function selectDeathSound(scene: Phaser.Scene, hero: EHeroes): void {
  const heroMap = {
    [EHeroes.ARCHER]: EGameSounds.ARCHER_DEATH,
    [EHeroes.KNIGHT]: EGameSounds.KNIGHT_DEATH,
    [EHeroes.CLERIC]: EGameSounds.CLERIC_DEATH,
    [EHeroes.WIZARD]: EGameSounds.WIZARD_DEATH,
    [EHeroes.NINJA]: EGameSounds.NINJA_DEATH,

    [EHeroes.IMPALER]: EGameSounds.IMPALER_DEATH,
    [EHeroes.VOIDMONK]: EGameSounds.VOIDMONK_DEATH,
    [EHeroes.PRIESTESS]: EGameSounds.PRIESTESS_DEATH,
    [EHeroes.NECROMANCER]: EGameSounds.NECROMANCER_DEATH,
    [EHeroes.WRAITH]: EGameSounds.WRAITH_DEATH,
    [EHeroes.PHANTOM]: EGameSounds.PHANTOM_DEATH,

    [EHeroes.PALADIN]: EGameSounds.HERO_DEATH,
    [EHeroes.GUNNER]: EGameSounds.HERO_DEATH,
    [EHeroes.ENGINEER]: EGameSounds.HERO_DEATH,
    [EHeroes.GRENADIER]: EGameSounds.HERO_DEATH,
    [EHeroes.ANNIHILATOR]: EGameSounds.HERO_DEATH
  };

  const soundToPlay = heroMap[hero];
  if (!soundToPlay) return;

  playSound(scene, soundToPlay);
}