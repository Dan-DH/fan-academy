import { EHeroes, EItems } from "../../enums/gameEnums";
import GameScene from "../game.scene";
import { CDN_PATH } from "../preloader.scene";

export function loadGameAssets(context: GameScene) {
  // --- IMAGES --

  // Load tiles
  context.load.image('spawnTile', `${CDN_PATH}/images/gameItems/DeployZone01-hd.webp`);
  context.load.image('helmetTile', `${CDN_PATH}/images/gameItems/PremiumTile_Resist-hd.webp`);
  context.load.image('powerTile', `${CDN_PATH}/images/gameItems/PremiumTile_Sword-hd.webp`);
  context.load.image('shieldTile', `${CDN_PATH}/images/gameItems/PremiumTile_Shield-hd.webp`);
  context.load.image('speedTile', `${CDN_PATH}/images/gameItems/PremiumTile_Speed-hd.webp`);
  context.load.image('crystalDamageTile', `${CDN_PATH}/images/gameItems/PremiumTile_VictoryDamageMultiplier-hd.webp`);
  context.load.image('teleporterTile', `${CDN_PATH}/images/gameItems/PremiumTile_Teleport-hd.webp`);

  // Special tiles animation
  context.load.image('crystalDamageAnim_1', `${CDN_PATH}/images/gameItems/animations/CrystalPremiumTile_BottomSplash01-hd.webp`);
  context.load.image('crystalDamageAnim_2', `${CDN_PATH}/images/gameItems/animations/CrystalPremiumTile_BottomSplash02-hd.webp`);
  context.load.image('crystalDamageAnim_3', `${CDN_PATH}/images/gameItems/animations/CrystalPremiumTile_BottomSplash03-hd.webp`);

  context.load.image('magicalResistanceAnim_1', `${CDN_PATH}/images/gameItems/animations/ResistPremiumTile_BottomSplash01-hd.webp`);
  context.load.image('magicalResistanceAnim_2', `${CDN_PATH}/images/gameItems/animations/ResistPremiumTile_BottomSplash02-hd.webp`);
  context.load.image('magicalResistanceAnim_3', `${CDN_PATH}/images/gameItems/animations/ResistPremiumTile_BottomSplash03-hd.webp`);

  context.load.image('physicalResistanceAnim_1', `${CDN_PATH}/images/gameItems/animations/ShieldPremiumTile_BottomSplash01-hd.webp`);
  context.load.image('physicalResistanceAnim_2', `${CDN_PATH}/images/gameItems/animations/ShieldPremiumTile_BottomSplash02-hd.webp`);
  context.load.image('physicalResistanceAnim_3', `${CDN_PATH}/images/gameItems/animations/ShieldPremiumTile_BottomSplash03-hd.webp`);

  context.load.image('powerTileAnim_1', `${CDN_PATH}/images/gameItems/animations/SwordPremiumTile_BottomSplash01-hd.webp`);
  context.load.image('powerTileAnim_2', `${CDN_PATH}/images/gameItems/animations/SwordPremiumTile_BottomSplash02-hd.webp`);
  context.load.image('powerTileAnim_3', `${CDN_PATH}/images/gameItems/animations/SwordPremiumTile_BottomSplash03-hd.webp`);

  // Item animations
  context.load.image('superChargeAnim_1', `${CDN_PATH}/images/gameItems/animations/Scroll_Backspash01-hd.webp`);
  context.load.image('superChargeAnim_2', `${CDN_PATH}/images/gameItems/animations/Scroll_Backspash02-hd.webp`);
  context.load.image('superChargeAnim_3', `${CDN_PATH}/images/gameItems/animations/Scroll_Backspash03-hd.webp`);

  context.load.image('soulHarvestAnim_1', `${CDN_PATH}/images/gameItems/animations/SoulHarvest_Explosion01-hd.webp`);
  context.load.image('soulHarvestAnim_2', `${CDN_PATH}/images/gameItems/animations/SoulHarvest_Explosion02-hd.webp`);
  context.load.image('soulHarvestAnim_3', `${CDN_PATH}/images/gameItems/animations/SoulHarvest_Explosion03-hd.webp`);

  context.load.image('infernoAnim_1', `${CDN_PATH}/images/gameItems/animations/Inferno_Fireball01-hd.webp`);
  context.load.image('infernoAnim_2', `${CDN_PATH}/images/gameItems/animations/Inferno_Fireball02-hd.webp`);
  context.load.image('infernoAnim_3', `${CDN_PATH}/images/gameItems/animations/Inferno_Fireball03-hd.webp`);
  context.load.image('infernoAnim_4', `${CDN_PATH}/images/gameItems/animations/Inferno_Fireball04-hd.webp`);
  context.load.image('infernoAnim_5', `${CDN_PATH}/images/gameItems/animations/Inferno_Fireball05-hd.webp`);
  context.load.image('infernoAnim_6', `${CDN_PATH}/images/gameItems/animations/Inferno_Fireball06-hd.webp`);

  context.load.image('infernoShockWave', `${CDN_PATH}/images/factions/council/Inferno_Shockwave01-hd.webp`);
  context.load.image('soulHarvestShockWave', `${CDN_PATH}/images/factions/darkElves/SoulHarvest_Shockwave01-hd.webp`);

  // Character animations
  context.load.image('smokeAnim_1', `${CDN_PATH}/images/gameItems/animations/NinjaSmoke_Puff01-hd.webp`);
  context.load.image('smokeAnim_2', `${CDN_PATH}/images/gameItems/animations/NinjaSmoke_Puff02-hd.webp`);
  context.load.image('smokeAnim_3', `${CDN_PATH}/images/gameItems/animations/NinjaSmoke_Puff03-hd.webp`);

  context.load.image('reviveAnim_1', `${CDN_PATH}/images/gameItems/animations/Revive_Backsplash01-hd.webp`);
  context.load.image('reviveAnim_2', `${CDN_PATH}/images/gameItems/animations/Revive_Backsplash02-hd.webp`);
  context.load.image('reviveAnim_3', `${CDN_PATH}/images/gameItems/animations/Revive_Backsplash03-hd.webp`);

  context.load.image('phantomSpawnAnim_1', `${CDN_PATH}/images/gameItems/animations/PhantomSpawn_Explosion01-hd.webp`);
  context.load.image('phantomSpawnAnim_2', `${CDN_PATH}/images/gameItems/animations/PhantomSpawn_Explosion02-hd.webp`);

  context.load.image('debuff', `${CDN_PATH}/images/gameItems/animations/MoveDebuff_PurpleGlow-hd.webp`); // priestess debuff
  context.load.image('annihilatorDebuff_1', `./assetsd/images/factions/dwarves/annihilator_debuff_1.png`); // TODO: update
  context.load.image('annihilatorDebuff_2', `./assetsd/images/factions/dwarves/annihilator_debuff_2.png`); // TODO: update

  // Crystal tile images
  context.load.image('crystalFull', `${CDN_PATH}/images/gameItems/crystal_full.webp`);
  context.load.image('pedestal', `${CDN_PATH}/images/gameItems/crystal_pedestal.webp`);
  context.load.image('crystalDamaged', `${CDN_PATH}/images/gameItems/crystal_damaged.webp`);
  context.load.image('crystalDebuff_1', `${CDN_PATH}/images/gameItems/animations/CrystalDebuff1_BgFlames01-hd.webp`);
  context.load.image('crystalDebuff_2', `${CDN_PATH}/images/gameItems/animations/CrystalDebuff1_BgFlames02-hd.webp`);
  context.load.image('crystalDebuff_3', `${CDN_PATH}/images/gameItems/animations/CrystalDebuff2_BgFlames01-hd.webp`);
  context.load.image('crystalDebuff_4', `${CDN_PATH}/images/gameItems/animations/CrystalDebuff2_BgFlames02-hd.webp`);

  // Crystal card icon
  context.load.image('crystalCardPic', `${CDN_PATH}/images/profilePics/crystalIcon.webp`);

  // Loading units
  const councilArray = ['archer', 'cleric', 'knight', 'ninja', 'wizard'];
  const darkElvesArray = ['priestess', 'impaler', 'necromancer', 'phantom', 'voidmonk', 'wraith'];
  const dwarvesArray = ['paladin', 'engineer', 'gunner', 'grenadier', 'annihilator'];

  councilArray.forEach(asset => {
    for (let i = 1; i <= 9; i++) {
      context.load.image(`${asset}_${i}`, `${CDN_PATH}/images/factions/council/${asset}/${asset}_${i}.webp`);
    }
    context.load.image(`${asset}CardPic`, `${CDN_PATH}/images/profilePics/${asset}_v1-hd.webp`); // Unit picture for its unit card
  });
  darkElvesArray.forEach(asset => {
    if (asset !== EHeroes.PHANTOM) {
      for (let i = 1; i <= 9; i++) {
        context.load.image(`${asset}_${i}`, `${CDN_PATH}/images/factions/darkElves/${asset}/${asset}_${i}.webp`);
      }
    } else {
      context.load.image(`${asset}_1`, `${CDN_PATH}/images/factions/darkElves/${asset}/${asset}_1.webp`);
    }
    context.load.image(`${asset}CardPic`, `${CDN_PATH}/images/profilePics/${asset}_v1-hd.webp`); // Unit picture for its unit card
  });
  // TODO: change to webp
  dwarvesArray.forEach(asset => {
    for (let i = 1; i <= 9; i++) {
      context.load.image(`${asset}_${i}`, `./assetsd/images/factions/dwarves/${asset}/${asset}_${i}.png`);
    }
    context.load.image(`${asset}CardPic`, `./assetsd/images/profilePics/${asset}_v1-hd.jpg`); // Unit picture for its unit card
  });

  // Loading item card icons
  Object.entries(EItems).forEach(([_key, value]) => {
    context.load.image(`${value}CardPic`, `${CDN_PATH}/images/profilePics/${value}Icon.webp`);
  });

  // Council
  context.load.image('dragonScale', `${CDN_PATH}/images/factions/council/dragon_scale.webp`);
  context.load.image('inferno', `${CDN_PATH}/images/factions/council/inferno.webp`);
  context.load.image('healingPotion', `${CDN_PATH}/images/factions/council/healing_potion.webp`);

  // Dark Elves
  context.load.image('soulStone', `${CDN_PATH}/images/factions/darkElves/soul_stone.webp`);
  context.load.image('soulHarvest', `${CDN_PATH}/images/factions/darkElves/soul_harvest.webp`);
  context.load.image('manaVial', `${CDN_PATH}/images/factions/darkElves/mana_vial.webp`);

  // Dwarves // TODO:
  context.load.image('dwarvenBrew', `./assetsd/images/factions/dwarves/dwarven_brew.webp`);
  context.load.image('pulverizer', `./assetsd/images/factions/dwarves/pulverizer.webp`);
  context.load.image('enginnerShield', `./assetsd/images/factions/dwarves/EngineerShield-hd.png`);
  context.load.image('paladinAura', `./assetsd/images/factions/dwarves/PaladinAura_Glow-hd.png`);

  // Shared items
  context.load.image('superCharge', `${CDN_PATH}/images/factions/common/super_charge.webp`);
  context.load.image('runeMetal', `${CDN_PATH}/images/factions/common/rune_metal.webp`);
  context.load.image('shiningHelm', `${CDN_PATH}/images/factions/common/shining_helm.webp`);

  // Load reticles (attack and healing)
  context.load.image('attackReticle', `${CDN_PATH}/images/gameItems/attack_reticle.webp`);
  context.load.image('healReticle', `${CDN_PATH}/images/gameItems/heal_reticle.webp`);
  context.load.image('allyReticle', `${CDN_PATH}/images/gameItems/ally_reticle.webp`);

  // Blocked line of sight
  context.load.image('blockedLOS', `${CDN_PATH}/images/gameItems/blocked_los.webp`);

  // Health bar
  context.load.image('HpBackground', `${CDN_PATH}/images/gameItems/hp_background.webp`);
  context.load.image('HpAlly', `${CDN_PATH}/images/gameItems/hp_green.webp`);
  context.load.image('HpEnemy', `${CDN_PATH}/images/gameItems/hp_red.webp`);

  // Floating text fonts
  context.load.atlas(
    'greenFont',
    `${CDN_PATH}/fonts/green_font.png`,
    `${CDN_PATH}/fonts/green_font.json`
  );
  context.load.atlas(
    'redFont',
    `${CDN_PATH}/fonts/red_font.png`,
    `${CDN_PATH}/fonts/red_font.json`
  );

  // Unit card images -the unit picture is loaded above, alognside the profile pictures
  context.load.image('cardBackground', `${CDN_PATH}/images/gameItems/card/HelpTooltip_BG-hd.webp`);
  context.load.image('cardSeparator', `${CDN_PATH}/images/gameItems/card/HelpTooltip_Separator.webp`);
  context.load.image('hpBackground', `${CDN_PATH}/images/gameItems/card/HelpTooltip_InsetHP-hd.webp`);
  context.load.image('hpBar', `${CDN_PATH}/images/gameItems/card/HelpTooltip_HPBar-hd.webp`);
  context.load.image('magicalDamage', `${CDN_PATH}/images/gameItems/card/TooltipIcon_MagicDmg-hd.webp`);
  context.load.image('physicalDamage', `${CDN_PATH}/images/gameItems/card/TooltipIcon_PhysDmg-hd.webp`);
  context.load.image('magicalResistance', `${CDN_PATH}/images/gameItems/card/TooltipIcon_MagicRes-hd.webp`);
  context.load.image('physicalResistance', `${CDN_PATH}/images/gameItems/card/TooltipIcon_PhysDef-hd.webp`);
  context.load.image('movementRange', `${CDN_PATH}/images/gameItems/card/TooltipIcon_Movement-hd.webp`);
  context.load.image('attackRange', `${CDN_PATH}/images/gameItems/card/TooltipIcon_Range-hd.webp`);
  context.load.image('movementSquare', `${CDN_PATH}/images/gameItems/card/TooltipIcon_MovementTile-hd.webp`);
  context.load.image('attackSquare', `${CDN_PATH}/images/gameItems/card/TooltipIcon_RangeTile-hd.webp`);
  context.load.image('hpIcon', `${CDN_PATH}/images/gameItems/card/HelpTooltip_HP-hd.webp`);

  // --- AUDIO --

  // UI audio
  context.load.audio('resignSound', `${CDN_PATH}/audio/ui/resignGame.mp3`);
  context.load.audio('resetTurnSound', `${CDN_PATH}/audio/ui/turnReset.mp3`);

  // Generic game sounds
  context.load.audio('selectHeroFromHandSound', `${CDN_PATH}/audio/game/Game_Pickup_CharacterTile_Generic.mp3`);
  context.load.audio('selectHeroFromBoardSound', `${CDN_PATH}/audio/game/Game_Select_Character.mp3`);
  context.load.audio('spawnHeroSound', `${CDN_PATH}/audio/game/Game_Place_CharacterTile.mp3`);
  context.load.audio('moveHeroSound', `${CDN_PATH}/audio/game/Game_Release_ToMove_Character.mp3`);
  context.load.audio('moveFlySound', `${CDN_PATH}/audio/game/Character_Movement_Flying.mp3`);
  context.load.audio('moveWalkSound', `${CDN_PATH}/audio/game/Character_Movement_Steps.mp3`);
  context.load.audio('stompSound', `${CDN_PATH}/audio/game/KO_Player_Stomp.mp3`);
  context.load.audio('vanishSound', `${CDN_PATH}/audio/game/KO_Player_Vanish.mp3`);
  context.load.audio('reviveHeroSound', `${CDN_PATH}/audio/game/Game_Revive.mp3`);
  context.load.audio('healSound', `${CDN_PATH}/audio/game/Civ_Cleric_Heal.mp3`);
  context.load.audio('healExtraSound', `${CDN_PATH}/audio/game/Game_Heal.mp3`);

  context.load.audio('selectScrollSound', `${CDN_PATH}/audio/game/Game_Touch_Scroll.mp3`);
  context.load.audio('selectRuneMetalSound', `${CDN_PATH}/audio/game/Touch_Sword.mp3`);
  context.load.audio('selectDragonScaleSound', `${CDN_PATH}/audio/game/Touch_Shield.mp3`);
  context.load.audio('selectItemGenericSound', `${CDN_PATH}/audio/game/Touch_Generic.mp3`);
  context.load.audio('selectPotionSound', `${CDN_PATH}/audio/game/Touch_Potion.mp3`);

  context.load.audio('useScrollSound', `${CDN_PATH}/audio/game/Game_Use_Scroll.mp3`);
  context.load.audio('useRuneMetalSound', `${CDN_PATH}/audio/game/Game_Equip_Sword.mp3`);
  context.load.audio('useDragonScaleSound', `${CDN_PATH}/audio/game/Deploy_Shield.mp3`);
  context.load.audio('useItemGenericSound', `${CDN_PATH}/audio/game/Deploy_Generic.mp3`);
  context.load.audio('usePotionSound', `${CDN_PATH}/audio/game/Deploy_Potion.mp3`);
  context.load.audio('useInfernoSound', `${CDN_PATH}/audio/game/Game_FireBomb_Activate.mp3`);

  context.load.audio('swordTileSound', `${CDN_PATH}/audio/game/Game_Land_Sword.mp3`);
  context.load.audio('shieldTileSound', `${CDN_PATH}/audio/game/Game_Land_Shield.mp3`);
  context.load.audio('helmTileSound', `${CDN_PATH}/audio/game/Tile_Resist_Magic.mp3`);
  context.load.audio('crystalTileSound', `${CDN_PATH}/audio/game/Game_Land_X.mp3`);

  context.load.audio('newItemsSound', `${CDN_PATH}/audio/game/UI_Door_KickOpenClose.mp3`);
  context.load.audio('returnItemSound', `${CDN_PATH}/audio/game/UI_Game_Chest_Tap.mp3`);

  context.load.audio('damageCrystal1Sound', `${CDN_PATH}/audio/game/Game_Crystal_Damage_1.mp3`);
  context.load.audio('damageCrystal2Sound', `${CDN_PATH}/audio/game/Game_Crystal_Damage_2.mp3`);
  context.load.audio('destroyCrystalSound', `${CDN_PATH}/audio/game/Game_Crystal_Destroy.mp3`);

  context.load.audio('winSFXSound', `${CDN_PATH}/audio/game/Game_Win_SFX_01.mp3`);
  context.load.audio('loseSFXSound', `${CDN_PATH}/audio/game/Game_Lose_SFX_01.mp3`);

  // Council specific audio
  context.load.audio('archerAttackSound', `${CDN_PATH}/audio/council/Civ_Archer_Attack_Arrow.mp3`);
  context.load.audio('archerAttackBigSound', `${CDN_PATH}/audio/council/Civ_Human_Archer_BigAttack.mp3`);
  context.load.audio('archerAttackMeleeSound', `${CDN_PATH}/audio/council/Civ_Human_Archer_Attack_CloseRange.mp3`);
  context.load.audio('archerDeathSound', `${CDN_PATH}/audio/council/Civ_Death_Archer_Element.mp3`);
  context.load.audio('clericAttackSound', `${CDN_PATH}/audio/council/Civ_Human_Cleric_Attack_CloseRange.mp3`);
  context.load.audio('clericAttackBigSound', `${CDN_PATH}/audio/council/Civ_Human_Cleric_AttackBig.mp3`);
  context.load.audio('clericDeathSound', `${CDN_PATH}/audio/council/Civ_Death_Cleric_Element.mp3`);
  context.load.audio('knightAttackSound', `${CDN_PATH}/audio/council/Civ_Knight_Attack.mp3`);
  context.load.audio('knightAttackBigSound', `${CDN_PATH}/audio/council/Civ_Human_Fighter_BigAttack.mp3`);
  context.load.audio('knightDeathSound', `${CDN_PATH}/audio/council/Civ_Death_Knight_Element.mp3`);
  context.load.audio('ninjaAttackSound', `${CDN_PATH}/audio/council/Civ_Human_Ninja_Attack_CloseRange.mp3`);
  context.load.audio('ninjaAttackBigSound', `${CDN_PATH}/audio/council/Civ_Human_Ninja_AttackBig.mp3`);
  context.load.audio('ninjaAttackRangedSound', `${CDN_PATH}/audio/council/Civ_Ninja_ThrowingStar_Attack.mp3`);
  context.load.audio('ninjaDeathSound', `${CDN_PATH}/audio/council/Civ_Death_Ninja_Element.mp3`);
  context.load.audio('ninjaSmokeSound', `${CDN_PATH}/audio/council/Civ_Ninja_Deploy_SmokeBomb.mp3`);
  context.load.audio('wizardAttackSound', `${CDN_PATH}/audio/council/Civ_Wizard_Attack.mp3`);
  context.load.audio('wizardAttackBigSound', `${CDN_PATH}/audio/council/Civ_Human_Wizard_BigAttack.mp3`);
  context.load.audio('wizardDeathSound', `${CDN_PATH}/audio/council/Civ_Death_Wizard_Element.mp3`);
  context.load.audio('selectInfernoSound', `${CDN_PATH}/audio/council/Game_FireBomb_Grab_Tile.mp3`);

  // Elves specific audio
  context.load.audio('priestessAttackSound', `${CDN_PATH}/audio/elves/DE-Heretic_Attack_Curse.mp3`);
  context.load.audio('priestessDeathSound', `${CDN_PATH}/audio/elves/DE-Heretic_Death.mp3`);
  context.load.audio('impalerAttackSound', `${CDN_PATH}/audio/elves/DE-Impaler_Attack_Throw_Spear.mp3`);
  context.load.audio('impalerAttackBigSound', `${CDN_PATH}/audio/elves/DE-Impaler_BigAttack.mp3`);
  context.load.audio('impalerAttackMeleeSound', `${CDN_PATH}/audio/elves/DE-Impaler_Melee_Attack.mp3`);
  context.load.audio('impalerDeathSound', `${CDN_PATH}/audio/elves/DE-Impaler_Death.mp3`);
  context.load.audio('necroAttackSound', `${CDN_PATH}/audio/elves/DE-Necro_Attack.mp3`);
  context.load.audio('necroAttackBigSound', `${CDN_PATH}/audio/elves/DE-Necro_AttackBig.mp3`);
  context.load.audio('necromancerDeathSound', `${CDN_PATH}/audio/elves/DE-Heretic_Death.mp3`);
  context.load.audio('phantomSpawnSound', `${CDN_PATH}/audio/elves/DE-Phantom_Spawn.mp3`);
  context.load.audio('phantomDeathSound', `${CDN_PATH}/audio/elves/DE-Phantom_Death.mp3`);
  context.load.audio('voidmonkAttackSound', `${CDN_PATH}/audio/elves/DE-VoidMonk_Attack_Punch.mp3`);
  context.load.audio('voidmonkAttackBigSound', `${CDN_PATH}/audio/elves/DE-VoidMonk_AttackBig.mp3`);
  context.load.audio('voidmonkDeathSound', `${CDN_PATH}/audio/elves/DE-VoidMonk_Death.mp3`);
  context.load.audio('wraithSpawnSound', `${CDN_PATH}/audio/elves/DE-Wraith_Birth.mp3`);
  context.load.audio('wraithAttackSound', `${CDN_PATH}/audio/elves/Civ_DarkElf_Attack_Spell_1.mp3`);
  context.load.audio('wraithAttackBigSound', `${CDN_PATH}/audio/elves/DE-Wraith_BigAttack.mp3`);
  context.load.audio('wraithDeathSound', `${CDN_PATH}/audio/elves/DE-Wraith_Death.mp3`);
  context.load.audio('wraithConsumeSound', `${CDN_PATH}/audio/elves/DE-Wraith_Consume.mp3`);
  context.load.audio('useHarvestSound', `${CDN_PATH}/audio/elves/Civ_DarkElf_Inferno_Explosion.mp3`);
}
