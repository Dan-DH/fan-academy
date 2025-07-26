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

  context.load.image('debuff', `${CDN_PATH}/images/gameItems/animations/MoveDebuff_PurpleGlow-hd.webp`);

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



  // --- audio ---
  // Wow, Robot sucks at file naming (look at council). TODO: Fix file names

  // general/universal game audio
  //context.load.audio('backgroundMusic', `${CDN_PATH}/audio/.mp3`);
  context.load.audio('battleButton', `${CDN_PATH}/audio/UI_Front_End_Begin_Battle.mp3`);
  context.load.audio('buttonPressGeneric', `${CDN_PATH}/audio/UI_Front_End_Select.mp3`);
  context.load.audio('sendMove', `${CDN_PATH}/audio/Game_Submit_Round.mp3`);
  context.load.audio('chatMessage', `${CDN_PATH}/audio/UI_Front_End_Tutorial_SlideThrough.mp3`);
  context.load.audio('buttonFailed', `${CDN_PATH}/audio/Unit_Damage.mp3`);
  context.load.audio('deleteGame', `${CDN_PATH}/audio/Game_Delete.mp3`);
  context.load.audio('resign', `${CDN_PATH}/audio/Game_Resign.mp3`);
  context.load.audio('thinkingMusic', `${CDN_PATH}/audio/Game_Ponder_LP.mp3`);
  context.load.audio('selectHeroFromHand', `${CDN_PATH}/audio/Game_Pickup_CharacterTile_Generic.mp3`);
  context.load.audio('spawnHero', `${CDN_PATH}/audio/Game_Place_CharacterTile.mp3`);
  context.load.audio('selectHeroFromBoard', `${CDN_PATH}/audio/Game_Select_Character.mp3`);
  context.load.audio('moveHero', `${CDN_PATH}/audio/Game_Release_ToMove_Character.mp3`);
  context.load.audio('moveFly', `${CDN_PATH}/audio/Character_Movement_Flying.mp3`);
  context.load.audio('moveWalk', `${CDN_PATH}/audio/Character_Movement_Steps.mp3`);
  context.load.audio('stomp', `${CDN_PATH}/audio/KO_Player_Stomp.mp3`);
  context.load.audio('vanish', `${CDN_PATH}/audio/KO_Player_Vanish.mp3`);
  context.load.audio('selectsuperCharge', `${CDN_PATH}/audio/Game_Touch_Scroll.mp3`);
  context.load.audio('useScroll', `${CDN_PATH}/audio/Game_Use_Scroll.mp3`);
  context.load.audio('selectruneMetal', `${CDN_PATH}/audio/Touch_Sword.mp3`);
  context.load.audio('useSword', `${CDN_PATH}/audio/Game_Equip_Sword.mp3`);
  context.load.audio('selectdragonScale', `${CDN_PATH}/audio/Touch_Shield.mp3`);
  context.load.audio('useShield', `${CDN_PATH}/audio/Deploy_Shield.mp3`);
  context.load.audio('selectItemGeneric', `${CDN_PATH}/audio/Touch_Ring.mp3`);
  context.load.audio('useItemGeneric', `${CDN_PATH}/audio/Deploy_Ring.mp3`);
  context.load.audio('selectPotion', `${CDN_PATH}/audio/Touch_Potion.mp3`);
  context.load.audio('usePotion', `${CDN_PATH}/audio/Deploy_Potion.mp3`);
  context.load.audio('resetTurn', `${CDN_PATH}/audio/Generic_Push_Button.mp3`);
  context.load.audio('reviveHero', `${CDN_PATH}/audio/Game_Revive.mp3`);
  context.load.audio('landSword', `${CDN_PATH}/audio/Game_Land_Sword.mp3`);
  context.load.audio('landShield', `${CDN_PATH}/audio/Game_Land_Shield.mp3`);
  context.load.audio('landHelm', `${CDN_PATH}/audio/Tile_Resist_Magic.mp3`);
  context.load.audio('landCrystal', `${CDN_PATH}/audio/Game_Land_X.mp3`);
  context.load.audio('ko', `${CDN_PATH}/audio/KO_Slow_Mo_Punch.mp3`);
  context.load.audio('newItems', `${CDN_PATH}/audio/UI_Door_KickOpenClose.mp3`);
  context.load.audio('returnItem', `${CDN_PATH}/audio/UI_Game_Chest_Tap.mp3`);
  context.load.audio('damageCrystal1', `${CDN_PATH}/audio/Game_Crystal_Damage_1.mp3`);
  context.load.audio('damageCrystal2', `${CDN_PATH}/audio/Game_Crystal_Damage_2.mp3`);
  context.load.audio('destroyCrystal', `${CDN_PATH}/audio/Game_Crystal_Destroy.mp3`);
  context.load.audio('hit1', `${CDN_PATH}/audio/Game_Damage_Opponent_1.mp3`);
  context.load.audio('hit2', `${CDN_PATH}/audio/Game_Damage_Opponent_2.mp3`);
  context.load.audio('hit3', `${CDN_PATH}/audio/Game_Damage_Opponent_3.mp3`);
  context.load.audio('hit4', `${CDN_PATH}/audio/Game_Damage_Opponent_4.mp3`);
  context.load.audio('heal', `${CDN_PATH}/audio/Civ_Cleric_Heal.mp3`);
  context.load.audio('healExtra', `${CDN_PATH}/audio/Game_Heal.mp3`); // used on top of base heal sound sometimes
  context.load.audio('winSFX', `${CDN_PATH}/audio/Game_Win_SFX_01.mp3`);
  context.load.audio('loseSFX', `${CDN_PATH}/audio/Game_Lose_SFX_01.mp3`);

  // music
  context.load.audio('titleMusic', `${CDN_PATH}/audio/Mx_Title_Theme_v4.mp3`);
  context.load.audio('backgroundMusic', `${CDN_PATH}/audio/Background_Music.mp3`);
  context.load.audio('winMusic', `${CDN_PATH}/audio/Mx_Win_Theme_v3.mp3`);
  context.load.audio('loseMusic', `${CDN_PATH}/audio/Mx_Lose_Theme_v3.mp3`);

  // council
  context.load.audio('archerAttack', `${CDN_PATH}/audio/Civ_Archer_Attack_Arrow.mp3`);
  context.load.audio('archerAttackBig', `${CDN_PATH}/audio/Civ_Human_Archer_BigAttack.mp3`);
  context.load.audio('archerAttackMelee', `${CDN_PATH}/audio/Civ_Human_Archer_Attack_CloseRange.mp3`);
  context.load.audio('archerDeath', `${CDN_PATH}/audio/Civ_Death_Archer_Element.mp3`);
  context.load.audio('clericAttack', `${CDN_PATH}/audio/Civ_Human_Cleric_Attack_CloseRange.mp3`);
  context.load.audio('clericAttackBig', `${CDN_PATH}/audio/Civ_Human_Cleric_AttackBig.mp3`);
  context.load.audio('clericDeath', `${CDN_PATH}/audio/Civ_Death_Cleric_Element.mp3`);
  context.load.audio('knightAttack', `${CDN_PATH}/audio/Civ_Knight_Attack.mp3`);
  context.load.audio('knightAttackBig', `${CDN_PATH}/audio/Civ_Human_Fighter_BigAttack.mp3`);
  context.load.audio('knightDeath', `${CDN_PATH}/audio/Civ_Death_Knight_Element.mp3`);
  context.load.audio('ninjaAttack', `${CDN_PATH}/audio/Civ_Human_Ninja_Attack_CloseRange.mp3`);
  context.load.audio('ninjaAttackBig', `${CDN_PATH}/audio/Civ_Human_Ninja_AttackBig.mp3`);
  context.load.audio('ninjaAttackRanged', `${CDN_PATH}/audio/Civ_Ninja_ThrowingStar_Attack.mp3`);
  context.load.audio('ninjaDeath', `${CDN_PATH}/audio/Civ_Death_Ninja_Element.mp3`);
  context.load.audio('ninjaSmoke', `${CDN_PATH}/audio/Civ_Ninja_Deploy_SmokeBomb.mp3`);
  context.load.audio('wizardAttack', `${CDN_PATH}/audio/Civ_Wizard_Attack.mp3`);
  context.load.audio('wizardAttackBig', `${CDN_PATH}/audio/Civ_Human_Wizard_BigAttack.mp3`);
  context.load.audio('wizardDeath', `${CDN_PATH}/audio/Civ_Death_Wizard_Element.mp3`);
  context.load.audio('selectinferno', `${CDN_PATH}/audio/Game_FireBomb_Grab_Tile.mp3`);
  context.load.audio('useFirebomb', `${CDN_PATH}/audio/Game_FireBomb_Activate.mp3`);


  // elves
  context.load.audio('priestessAttack', `${CDN_PATH}/audio/DE-Heretic_Attack_Curse.mp3`);
  context.load.audio('priestessDeath', `${CDN_PATH}/audio/DE-Heretic_Death.mp3`); // correct
  context.load.audio('impalerAttack', `${CDN_PATH}/audio/DE-Impaler_Attack_Throw_Spear.mp3`);
  context.load.audio('impalerAttackBig', `${CDN_PATH}/audio/DE-Impaler_BigAttack.mp3`);
  context.load.audio('impalerAttackMelee', `${CDN_PATH}/audio/DE-Impaler_Melee_Attack.mp3`);
  context.load.audio('impalerDeath', `${CDN_PATH}/audio/DE-Impaler_Death.mp3`);
  context.load.audio('necroAttack', `${CDN_PATH}/audio/DE-Necro_Attack.mp3`);
  context.load.audio('necroAttackBig', `${CDN_PATH}/audio/DE-Necro_AttackBig.mp3`);
  context.load.audio('necromancerDeath', `${CDN_PATH}/audio/DE-Heretic_Death.mp3`);
  context.load.audio('phantomSpawn', `${CDN_PATH}/audio/DE-Phantom_Spawn.mp3`);
  context.load.audio('phantomDeath', `${CDN_PATH}/audio/DE-Phantom_Death.mp3`);
  context.load.audio('voidMonkAttack', `${CDN_PATH}/audio/DE-VoidMonk_Attack_Punch.mp3`);
  context.load.audio('voidMonkAttackBig', `${CDN_PATH}/audio/DE-VoidMonk_AttackBig.mp3`);
  context.load.audio('voidmonkDeath', `${CDN_PATH}/audio/DE-VoidMonk_Death.mp3`);
  context.load.audio('wraithSpawn', `${CDN_PATH}/audio/DE-Wraith_Birth.mp3`);
  context.load.audio('wraithAttack', `${CDN_PATH}/audio/Civ_DarkElf_Attack_Spell_1.mp3`);
  context.load.audio('wraithAttackBig', `${CDN_PATH}/audio/DE-Wraith_BigAttack.mp3`);
  context.load.audio('wraithDeath', `${CDN_PATH}/audio/DE-Wraith_Death.mp3`);
  context.load.audio('wraithConsume', `${CDN_PATH}/audio/DE-Wraith_Consume.mp3`);
  context.load.audio('useHarvest', `${CDN_PATH}/audio/Civ_DarkElf_Inferno_Explosion.mp3`);
}
