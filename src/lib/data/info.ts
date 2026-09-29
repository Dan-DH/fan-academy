import type { GameStatusGuide, APActionGuide, SpecialTileGuide, FactionGuide } from "$lib/types/GuideType";

export const CDN_BASE = 'https://cdn.jsdelivr.net/gh/Dan-DH/fa-assets@cc4a03e';

export const aboutData = {
  fanAcademy: {
    title: 'What is Fan Academy?',
    content: [
      'Fan Academy is a fan-made revival of the game Hero Academy, a turn-based tactics game developed by Robot Entertainment. This project aims to bring back the joy of the original game, offering a way for fans to rediscover it.',
      "This is not a reverse engineering of the game. The game logic is being implemented from scratch while using the original assets to try to preserve the game's aesthetic as much as possible."
    ]
  },
  heroAcademy: {
    title: 'What is Hero Academy?',
    content: [
      'Hero Academy is a player-versus-player turn-based tactics game where players choose a team of heroes and use their units and items to defeat their opponents.',
      'Unfortunately, the game is currently dead, delisted from all stores and its online servers shut down. It is no longer possible for people who purchased the game to play it.'
    ]
  },
  disclaimer: {
    title: 'Disclaimer for Third-Party Assets',
    content:
      'This project includes proprietary assets from Hero Academy, which are the property of Robot Entertainment. These assets are used for educational and non-commercial purposes under the assumption of fair use for a fan project. This license applies only to the code in this repository and not to the assets. All rights to the proprietary assets remain with their respective owners.'
  },
  citation: {
    author: 'Hamlet',
    source: 'iam.yellingontheinternet.com (via Internet Archive)',
    note: 'The tactical combat information and unit statistics in this guide are adapted and clarified from the original guide written by community veteran Hamlet on iam.yellingontheinternet.com.'
  }
};

export const gameStatusList: GameStatusGuide[] = [
  {
    status: 'Your Turn',
    badgeColor: 'badge-success text-success-content font-bold',
    icon: 'icon-[material-symbols--play-circle-outline]',
    description: 'You have active moves to make! Click on these games to enter the grid and spend your action points.'
  },
  {
    status: 'Challenges Received',
    badgeColor: 'badge-warning text-warning-content font-bold',
    icon: 'icon-[akar-icons--double-sword]',
    description: 'Another player challenged you. Click to select your faction and start playing against them. You can also decline by clicking the X button in the top-right corner.'
  },
  {
    status: "Opponent's Turn",
    badgeColor: 'badge-info text-info-content font-bold',
    icon: 'icon-[material-symbols--hourglass-top]',
    description: 'Your opponent is currently plotting and playing their turn. You will receive an email or dashboard notification when it is your turn again.'
  },
  {
    status: 'Searching for Players',
    badgeColor: 'badge-secondary text-secondary-content font-bold',
    icon: 'icon-[material-symbols--search]',
    description: 'Open games created by you waiting in matchmaking. When another player looks for a match, you will be paired immediately. Cancel anytime by clicking the X button.'
  },
  {
    status: 'Challenges Sent',
    badgeColor: 'badge-accent text-accent-content font-bold',
    icon: 'icon-[material-symbols--forward-to-inbox-outline]',
    description: 'Games waiting for the player you challenged to pick a faction or decline. You can retract the challenge anytime by clicking the X button.'
  },
  {
    status: 'Finished',
    badgeColor: 'badge-neutral font-bold',
    icon: 'icon-[akar-icons--trophy]',
    description: 'Your 5 most recent finished games. Click on any game to inspect the final board state and challenge your opponent to an immediate rematch.'
  }
];

export const apActionsList: APActionGuide[] = [
  {
    action: 'Deploy Unit',
    cost: '1 AP',
    icon: 'icon-[material-symbols--person-add-outline]',
    description: 'Deploy a hero from your hand onto your designated deploy square.'
  },
  {
    action: 'Move Unit',
    cost: '1 AP',
    icon: 'icon-[material-symbols--directions-run]',
    description: 'Move a friendly unit up to its movement stat orthogonally on the grid.'
  },
  {
    action: 'Attack Target',
    cost: '1 AP',
    icon: 'icon-[akar-icons--double-sword]',
    description: 'Attack an enemy unit or crystal within your unit’s attack range.'
  },
  {
    action: 'Heal / Revive',
    cost: '1 AP',
    icon: 'icon-[material-symbols--favorite-outline]',
    description: 'Heal an injured ally or revive a fallen (KO’d) teammate back into combat.'
  },
  {
    action: 'Special Ability',
    cost: '1 AP',
    icon: 'icon-[material-symbols--auto-awesome-outline]',
    description: 'Trigger unit abilities (Ninja Swap, Necromancer Phantom summon, Engineer Shield, Wraith Devour).'
  },
  {
    action: 'Equip Upgrade',
    cost: '1 AP',
    icon: 'icon-[material-symbols--shield-outline]',
    description: 'Apply permanent upgrades like Runemetal, Dragonscale, Soulstone, or Shining Helm to a hero.'
  },
  {
    action: 'Use Consumable',
    cost: '1 AP',
    icon: 'icon-[material-symbols--science-outline]',
    description: 'Cast powerful one-time items such as Supercharge, Inferno, Pulverizer, Soul Harvest, or Potions.'
  },
  {
    action: 'Recycle Card',
    cost: '1 AP',
    icon: 'icon-[material-symbols--meeting-room-outline]',
    description: 'Return a unit or item from your hand back into the deck (the door icon) to draw a random card next turn.'
  }
];

export const specialTilesList: SpecialTileGuide[] = [
  {
    id: 'crystal',
    name: 'Power Crystals',
    iconName: 'icon-[material-symbols--diamond-outline]',
    colorClass: 'text-rose-400 bg-rose-950/60 border-rose-500/40',
    badgeColor: 'badge-error',
    effect: '4,500 HP each • 2 per faction',
    details: 'The ultimate win objective. Each team protects two crystals. Crystals block line of sight, cannot move, and have no inherent defense. Destroy both opposing crystals to win the game.',
    tacticalTip: 'Assault squares accelerate crystal destruction with +300 bonus pure damage per attack!'
  },
  {
    id: 'deploy',
    name: 'Deploy Square',
    iconName: 'icon-[material-symbols--flag-outline]',
    colorClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40',
    badgeColor: 'badge-success',
    effect: 'Sanctuary Spawn Zone',
    details: 'Enemy units cannot move onto your deploy square, even to stomp. Adjacent enemies can still attack corpses on it without stepping onto the tile. Necromancers and Inferno can also target corpses on deploy squares.',
    tacticalTip: 'A friendly corpse on its own deploy square is stomped automatically if a fresh friendly unit deploys there.'
  },
  {
    id: 'attack',
    name: 'Attack Square (Red Sword)',
    iconName: 'icon-[material-symbols--swords]',
    colorClass: 'text-red-400 bg-red-950/60 border-red-500/40',
    badgeColor: 'badge-error',
    effect: '+100 Flat Attack Power',
    details: 'A unit standing on this square gains +100 Attack Power. This flat bonus is added before all percentage-based bonuses and Supercharge multipliers are calculated.',
    tacticalTip: 'Stacking an attack square with Supercharge (+300% attack) unleashes massive burst rounds!'
  },
  {
    id: 'defense',
    name: 'Defense Square (Blue Shield)',
    iconName: 'icon-[material-symbols--shield]',
    colorClass: 'text-blue-400 bg-blue-950/60 border-blue-500/40',
    badgeColor: 'badge-info',
    effect: '+20% Physical Resistance',
    details: 'A unit on this square has +20% Physical Resistance, mitigating incoming melee strikes, arrows, and shotgun blasts.',
    tacticalTip: 'Position your tankiest hero here to create an immovable choke point.'
  },
  {
    id: 'magic-defense',
    name: 'Magic Defense (Dark Blue Helm)',
    iconName: 'icon-[material-symbols--security]',
    colorClass: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/40',
    badgeColor: 'badge-primary',
    effect: '+20% Magical Resistance',
    details: 'A unit on this square has +20% Magical Resistance, mitigating Wizard chain attacks, Grenadier shells, Priestess spells, and Annihilators.',
    tacticalTip: 'Critical tactical tile when engaging spellcasters or magical splash damage.'
  },
  {
    id: 'assault',
    name: 'Assault Square (Purple Gem)',
    iconName: 'icon-[material-symbols--crisis-alert]',
    colorClass: 'text-purple-400 bg-purple-950/60 border-purple-500/40',
    badgeColor: 'badge-secondary',
    effect: '+300 Pure Crystal Damage',
    details: 'While a friendly unit stands on this square, ALL attacks against enemy crystals deal an extra 300 damage. Multiple friendly units on assault squares stack! The bonus damage has no type and is not reduced by any resistance.',
    tacticalTip: 'The bonus is reduced proportionally if the crystal takes AoE or chain damage.'
  },
  {
    id: 'teleport',
    name: 'Teleport Square (Light Blue Dot)',
    iconName: 'icon-[material-symbols--sync-alt]',
    colorClass: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40',
    badgeColor: 'badge-accent',
    effect: '1 AP Instant Teleport',
    details: 'A unit on this square can spend 1 AP to teleport across the board to the linked teleport square, provided it is currently vacant.',
    tacticalTip: 'Use for surprise crystal assaults, flanking snipers, or rapid escapes from danger.'
  }
];

export const factionsList: FactionGuide[] = [
  {
    id: 'council',
    name: 'The Council',
    title: 'The Valiant Alliance',
    splashImage: `${CDN_BASE}/images/aboutImages/Council_SplashScreen1.webp`,
    color: 'from-amber-600/30 via-blue-900/20 to-stone-950',
    borderAccent: 'border-amber-400',
    badgeClass: 'badge-warning',
    description:
      'The foundational faction of Hero Academy. Built on balanced martial discipline, high physical defense, knockbacks, lethal chain lightning, and unmatched positional mobility.',
    passiveName: 'Tactical Balance',
    passiveDescription: 'The Council has no passive faction trait, relying instead on solid fundamentals, chain damage, and team repositioning.',
    units: [
      {
        name: 'Knight',
        count: 3,
        role: 'Frontline Vanguard',
        hp: 1000,
        attack: 200,
        attackType: 'Physical',
        range: 1,
        move: 2,
        physicalResist: 20,
        magicalResist: 0,
        special: 'Attack knocks target back one square. Move 2.',
        image: `${CDN_BASE}/images/aboutImages/Knight_tile.webp`,
        tacticalTip: 'Knock enemies off special tiles or push them into hazard zones!'
      },
      {
        name: 'Archer',
        count: 3,
        role: 'Long-Range Sniper',
        hp: 800,
        attack: 300,
        attackType: 'Physical',
        range: 3,
        move: 2,
        physicalResist: 0,
        magicalResist: 0,
        special: '50% damage in melee (150), 100% damage at range (300). Move 2.',
        image: `${CDN_BASE}/images/aboutImages/Archer_tile.webp`,
        tacticalTip: 'Keep behind Knights and snipe enemy crystals from across the map.'
      },
      {
        name: 'Wizard',
        count: 3,
        role: 'Chain Nuker',
        hp: 800,
        attack: 200,
        attackType: 'Magical',
        range: 2,
        move: 2,
        physicalResist: 0,
        magicalResist: 10,
        special: 'Attack hits up to 3 adjacent enemy units or crystals! Main target takes 100% (200), first jump does 75% (150), second jump does 56% (112). Move 2.',
        image: `${CDN_BASE}/images/aboutImages/Wizard_tile.webp`,
        tacticalTip: 'Punish opponents who cluster units together near crystals.'
      },
      {
        name: 'Cleric',
        count: 3,
        role: 'Support Healer',
        hp: 800,
        attack: 200,
        attackType: 'Magical',
        range: 2,
        move: 2,
        physicalResist: 0,
        magicalResist: 0,
        special: 'Heals for 300% attack (600 HP), revives for 200% attack (400 HP) at range 2. Move 2.',
        image: `${CDN_BASE}/images/aboutImages/Cleric_tile.webp`,
        tacticalTip: 'A clutch Cleric revive preserves your team numbers without consuming card draws.'
      },
      {
        name: 'Ninja',
        count: 1,
        role: 'Elite Assassin',
        hp: 800,
        attack: 200,
        attackType: 'Physical',
        range: 2,
        move: 3,
        physicalResist: 0,
        magicalResist: 0,
        special: '200% damage in melee (400 damage!), 100% damage at range (200). Can spend 1 AP to swap places with any friendly unit. Move 3.',
        image: `${CDN_BASE}/images/aboutImages/Ninja_tile.webp`,
        tacticalTip: 'Swap places with an ally to surprise an enemy backliner or escape death!'
      }
    ],
    items: [
      {
        name: 'Runemetal',
        count: 3,
        type: 'Upgrade',
        target: 'Friendly Hero',
        effect: '+50% Attack power permanently.',
        tacticalTip: 'Equip on Archers or Ninjas for lethal single-turn strikes.'
      },
      {
        name: 'Dragonscale',
        count: 3,
        type: 'Upgrade',
        target: 'Friendly Hero',
        effect: '+20% Physical Resistance and +10% Maximum HP.',
        tacticalTip: 'Turns a Knight into an impenetrable frontline fortress.'
      },
      {
        name: 'Shining Helm',
        count: 3,
        type: 'Upgrade',
        target: 'Friendly Hero',
        effect: '+20% Magical Resistance and +10% Maximum HP.',
        tacticalTip: 'Protects key heroes against enemy magical bombardment.'
      },
      {
        name: 'Supercharge',
        count: 2,
        type: 'Consumable',
        target: '1 Friendly Hero',
        effect: 'Unit has 300% attack power for one attack or heal.',
        tacticalTip: 'Massive burst round that pairs amazingly with Archers or Clerics.'
      },
      {
        name: 'Inferno',
        count: 2,
        type: 'Consumable',
        target: '3×3 Area',
        effect: 'KO’d enemies in the area are permanently destroyed, and all other enemies take 350 Magical damage.',
        tacticalTip: 'Obliterates clusters of enemy units and wipes out fallen heroes on deploy squares!'
      },
      {
        name: 'Potion',
        count: 2,
        type: 'Consumable',
        target: '1 Friendly Hero',
        effect: 'Heals target for 1,000 HP. In addition, can revive a KO’d unit for 100 HP.',
        tacticalTip: 'Emergency revive or burst heal when Cleric is out of range.'
      }
    ]
  },
  {
    id: 'dark-elves',
    name: 'Dark Elves',
    title: 'Masters of the Shadow',
    splashImage: `${CDN_BASE}/images/aboutImages/DarkElves_SplashScreen.webp`,
    color: 'from-purple-900/40 via-violet-900/20 to-stone-950',
    borderAccent: 'border-purple-500',
    badgeClass: 'badge-secondary',
    description:
      'Wielders of necromancy, life drain, and positional disruption. They turn enemy casualties into ethereal Phantoms and feed on battlefield fallen.',
    passiveName: 'Life Leech',
    passiveDescription:
      'Units are healed for 33% of any damage they deal to enemy units (does not trigger on crystals).',
    units: [
      {
        name: 'Void Monk',
        count: 3,
        role: 'Martial Cleaver',
        hp: 800,
        attack: 200,
        attackType: 'Physical',
        range: 1,
        move: 3,
        physicalResist: 20,
        magicalResist: 20,
        special: '100% damage to target (200), splashes for 66% damage (132) to any enemies adjacent (not diagonal) to target. Move 3.',
        image: `${CDN_BASE}/images/aboutImages/VoidMonk_tile.webp`,
        tacticalTip: 'High dual resists (20%/20%) and 3 movement make them deadly skirmishers.'
      },
      {
        name: 'Impaler',
        count: 3,
        role: 'Disruptive Harpooner',
        hp: 800,
        attack: 300,
        attackType: 'Physical',
        range: 2,
        move: 2,
        physicalResist: 0,
        magicalResist: 0,
        special: 'If target is at range 2 in a straight line, pulled one square towards Impaler. Move 2.',
        image: `${CDN_BASE}/images/aboutImages/Impaler_tile.webp`,
        tacticalTip: 'Drag enemy backliners off special tiles into your melee meat-grinder.'
      },
      {
        name: 'Necromancer',
        count: 3,
        role: 'Soul Weaver',
        hp: 800,
        attack: 200,
        attackType: 'Magical',
        range: 3,
        move: 2,
        physicalResist: 0,
        magicalResist: 0,
        special: 'Can use 1 AP to turn any KO’d unit into a Phantom at range 3, including on an enemy start tile! Move 2.',
        image: `${CDN_BASE}/images/aboutImages/Necromancer_tile.webp`,
        tacticalTip: 'Deny enemy revives while gaining extra combat bodies on the board.'
      },
      {
        name: 'Priestess',
        count: 3,
        role: 'Debuffing Healer',
        hp: 800,
        attack: 200,
        attackType: 'Magical',
        range: 2,
        move: 2,
        physicalResist: 0,
        magicalResist: 0,
        special: 'Heals for 200% attack (400), revives for 50% attack (100) range 3. A unit damaged by the Priestess has 50% attack power for its next attack/heal (doesn’t affect Barbed Crystals). Move 2.',
        image: `${CDN_BASE}/images/aboutImages/Priestess_tile.webp`,
        tacticalTip: 'Her attack reduction debuff halves enemy nuke threats.'
      },
      {
        name: 'Wraith',
        count: 1,
        role: 'Apex Devourer',
        hp: 800,
        attack: 250,
        attackType: 'Magical',
        range: 1,
        move: 3,
        physicalResist: 0,
        magicalResist: 0,
        special: 'Can deploy onto any KO’d unit (stomping it) instead of a deploy tile, unless the KO’d unit is on an enemy deploy tile. Can use 1 AP to consume a KO’d unit at range 1: increases current and max HP by 100 and attack power by 50 (up to 3 times per game). Move 3.',
        image: `${CDN_BASE}/images/aboutImages/Wraith_tile.webp`,
        tacticalTip: 'Deploy directly across the map onto a downed hero to secure a permanent stomp!'
      },
      {
        name: 'Phantom',
        count: 0,
        role: 'Summoned Thrall',
        hp: 100,
        attack: 100,
        attackType: 'Magical',
        range: 1,
        move: 3,
        physicalResist: 0,
        magicalResist: 0,
        special: 'Summoned by Necromancer. Does not leave a corpse when killed. If spawned on an enemy deploy tile, will be automatically destroyed if an enemy deploys there. Move 3.',
        image: `${CDN_BASE}/images/aboutImages/Phantom_tile.webp`,
        tacticalTip: 'Harass enemy squishies, trigger proximity effects, and screen for allies.'
      }
    ],
    items: [
      {
        name: 'Runemetal',
        count: 3,
        type: 'Upgrade',
        target: 'Friendly Hero',
        effect: '+50% Attack power permanently.',
        tacticalTip: 'Increases both strike damage and Life Leech healing amounts.'
      },
      {
        name: 'Soulstone',
        count: 3,
        type: 'Upgrade',
        target: 'Friendly Hero',
        effect: 'Passive life leech increased to 66%, +10% HP (bonus applied to base HP only).',
        tacticalTip: 'Equip on Void Monks or Wraiths for unmatched combat sustain.'
      },
      {
        name: 'Shining Helm',
        count: 3,
        type: 'Upgrade',
        target: 'Friendly Hero',
        effect: '+20% Magical Resistance and +10% Maximum HP.',
        tacticalTip: 'Fortifies frontline fighters against spell damage.'
      },
      {
        name: 'Supercharge',
        count: 2,
        type: 'Consumable',
        target: '1 Friendly Hero',
        effect: 'Unit has 300% attack power for one attack or heal.',
        tacticalTip: 'High-damage strikes that also trigger massive Life Leech recovery.'
      },
      {
        name: 'Soul Harvest',
        count: 2,
        type: 'Consumable',
        target: '3×3 Area',
        effect: 'Enemies take 100 Magical damage. All friendly units in play gain D/(N+3) current and max HP (reviving KO’d units in the process), where D is total non-crystal damage dealt and N is friendly unit count.',
        tacticalTip: 'Hit densely clustered enemy units to trigger a board-wide resurrection!'
      },
      {
        name: 'Mana Vial',
        count: 2,
        type: 'Consumable',
        target: '1 Friendly Hero',
        effect: 'Heals for 1,000 HP and increases maximum HP by 50.',
        tacticalTip: 'Great for bolstering your Wraith or Priestess survivability.'
      }
    ]
  },
  {
    id: 'dwarves',
    name: 'Dwarves',
    title: 'The Iron Bastion',
    splashImage: `${CDN_BASE}/images/aboutImages/Dwarves_SplashScreen.webp`,
    color: 'from-amber-700/30 via-orange-900/20 to-stone-950',
    borderAccent: 'border-orange-500',
    badgeClass: 'badge-accent',
    description:
      'Masters of siege engineering, heavy ordnance, protective force fields, and tile manipulation. Their passive magnifies special tile power.',
    passiveName: 'Rune Mastery',
    passiveDescription:
      '+20% benefit to special tiles: Attack gives +120, Defense/Magic Defense gives +24%, Assault gives +360 crystal damage, and Speed gives +3 move.',
    units: [
      {
        name: 'Paladin',
        count: 3,
        role: 'Aura Tank & Healer',
        hp: 900,
        attack: 200,
        attackType: 'Physical',
        range: 1,
        move: 2,
        physicalResist: 10,
        magicalResist: 10,
        special: 'Heals for 200% attack (400), revives for 50% attack (100) range 2. Self-heals for 50% of any healing done (not including overheal). Aura: All friendly units and crystals in AoE range gain +5% attack power, +5% physical resist, and +5% magical resist (stacks from multiple Paladins!). Move 2.',
        image: `${CDN_BASE}/images/aboutImages/Paladin_tile.webp`,
        localFallback: '/paladin.webp',
        tacticalTip: 'Stack Paladins near crystals for enormous defensive and offensive auras.'
      },
      {
        name: 'Grenadier',
        count: 3,
        role: 'Artillery Bombardier',
        hp: 800,
        attack: 200,
        attackType: 'Magical',
        range: 3,
        move: 2,
        physicalResist: 0,
        magicalResist: 0,
        special: 'IGNORES Line of Sight! At range: 100% to target (200), AoE for 50% (100). In melee: 50% damage (100), no AoE. Move 2.',
        image: `${CDN_BASE}/images/aboutImages/Grenadier_tile.webp`,
        tacticalTip: 'Bombard enemies hiding behind walls, crystals, or bodyguards!'
      },
      {
        name: 'Gunner',
        count: 3,
        role: 'Cone Shotgunner',
        hp: 800,
        attack: 300,
        attackType: 'Physical',
        range: 2,
        move: 2,
        physicalResist: 0,
        magicalResist: 0,
        special: 'In melee: 100% damage (300), no splash. At range: cone attack deals 66% damage (198) to main target and up to two nearby targets. Move 2.',
        image: `${CDN_BASE}/images/aboutImages/Gunner_tile.webp`,
        localFallback: '/gunner.webp',
        tacticalTip: 'Shatters enemy formations and crystals with wide cone blasts.'
      },
      {
        name: 'Engineer',
        count: 3,
        role: 'Forcefield Architect',
        hp: 800,
        attack: 200,
        attackType: 'Physical',
        range: 1,
        move: 2,
        physicalResist: 0,
        magicalResist: 0,
        special: 'Can shield a friendly target in range 3, canceling next damaging attack against that unit/crystal and any associated debuffs (expires on damage, KO, or new shield). Gets twice the increased benefit from special tiles as other Dwarves: 140 attack, 28% resist, 420 assault damage, and +4 movement when standing on speed tile! Move 2.',
        image: `${CDN_BASE}/images/aboutImages/Engineer_tile.webp`,
        tacticalTip: 'Park Engineer on an Assault or Defense tile for astonishing double-multiplier values!'
      },
      {
        name: 'Annihilator',
        count: 1,
        role: 'Heavy Siege Walker',
        hp: 650,
        attack: 300,
        attackType: 'Magical',
        range: 3,
        move: 2,
        physicalResist: 0,
        magicalResist: 0,
        special: '100% to target (300), AoE for 20% (60). Target unit/crystal gets -50% Physical Resist on the next physical attack that hits it. AoE targets are knocked one square directly away from main target. Move 2.',
        image: `${CDN_BASE}/images/aboutImages/Annihilator_tile.webp`,
        tacticalTip: 'Shreds physical armor, enabling Gunners and Paladins to finish off targets.'
      }
    ],
    items: [
      {
        name: 'Runemetal',
        count: 3,
        type: 'Upgrade',
        target: 'Friendly Hero',
        effect: '+50% Attack power permanently.',
        tacticalTip: 'Magnifies Grenadier mortar damage or Gunner cone spread.'
      },
      {
        name: 'Dragonscale',
        count: 3,
        type: 'Upgrade',
        target: 'Friendly Hero',
        effect: '+20% Physical Resistance and +10% Maximum HP.',
        tacticalTip: 'Stacks with Paladin auras to build impenetrable defense.'
      },
      {
        name: 'Shining Helm',
        count: 3,
        type: 'Upgrade',
        target: 'Friendly Hero',
        effect: '+20% Magical Resistance and +10% Maximum HP.',
        tacticalTip: 'Fortifies vulnerable artillery pieces.'
      },
      {
        name: 'Supercharge',
        count: 2,
        type: 'Consumable',
        target: '1 Friendly Hero',
        effect: 'Unit has 300% attack power for one attack or heal.',
        tacticalTip: 'Unleash colossal 900+ damage cone shots or siege rounds.'
      },
      {
        name: 'Dwarven Brew',
        count: 2,
        type: 'Consumable',
        target: '1 Friendly Hero',
        effect: 'Heals for 1,000 HP and adds 50% Magical and Physical resistance lasting for one hit. Stacks with other resist bonuses. If target is also shielded, buff remains when shield is broken.',
        tacticalTip: 'Virtually guarantees survival for a key hero holding the assault tile.'
      },
      {
        name: 'Pulverizer',
        count: 2,
        type: 'Consumable',
        target: '1 Enemy Unit or Crystal',
        effect: 'Deals 600 Physical damage. If target is a crystal: 33% AoE splash (including added damage from Assault tiles!). If target is a unit: its Armour or Soulstone (but not Helm) is destroyed!',
        tacticalTip: 'Shatters enemy tanks by permanently destroying their upgraded armor.'
      }
    ]
  }
];

export const advancedTactics = [
  {
    title: 'Orthogonal Measurement',
    icon: 'icon-[material-symbols--straighten]',
    badge: 'Spatial Rules',
    summary: 'Range and movement are strictly counted orthogonally (up, down, left, right). Diagonal steps do not exist.',
    details: 'A unit located one square diagonally away is considered Range 2, not Range 1. Always calculate movement paths along the grid axes.'
  },
  {
    title: 'Damage Types & Resistances',
    icon: 'icon-[material-symbols--security]',
    badge: 'Combat Formulas',
    summary: 'Attacks deal either Physical (P) or Magical (M) damage, countered by corresponding resistances.',
    details: 'Physical attacks (Knights, Archers, Gunners, Impalers) are reduced by Physical Resist. Magical attacks (Wizards, Clerics, Grenadiers, Necromancers) are reduced by Magic Resist. Base attack hits for Attack Power, multiplied by bonuses. Assault bonus damage to crystals is untyped and ignores all resistances.'
  },
  {
    title: 'Line of Sight (LoS) Rules',
    icon: 'icon-[material-symbols--visibility-outline]',
    badge: 'Cover & Targeting',
    summary: 'Ranged attacks require an unblocked straight line of sight to the target.',
    details: 'Enemy units and crystals block Line of Sight. Friendly units do NOT block line of sight. Attacks to an immediately diagonal square cannot be blocked. Note: Dwarven Grenadiers fire mortar shells that ignore Line of Sight completely!'
  },
  {
    title: 'Corpse Targeting vs. Stomping',
    icon: 'icon-[material-symbols--skull-outline]',
    badge: 'Priority Logic',
    summary: 'Clicking a corpse automatically triggers unit corpse abilities (revive/consume) rather than walking onto it.',
    details: 'A unit that can act on a corpse (healer reviving a friendly corpse, or Necromancer/Wraith destroying an enemy one) cannot choose to move and stomp instead by default. Clicking on the corpse causes the unit to act on it. However, if the unit lacks Line of Sight to the enemy corpse, it will move and stomp instead.'
  },
  {
    title: 'Knockback Physics',
    icon: 'icon-[material-symbols--open-in-new]',
    badge: 'Displacement',
    summary: 'Knockbacks only occur if the destination square is open; otherwise the unit does not move.',
    details: 'If a unit is knocked out by the knockback attack, it still moves. A unit cannot be knocked onto an enemy start tile, unless it is also KO’d on that strike (in which case an enemy spawning there will automatically stomp it).'
  },
  {
    title: 'Deploy Square Infiltration & Denial',
    icon: 'icon-[material-symbols--block]',
    badge: 'Spawn Denial',
    summary: 'Occupying an enemy deploy square disables their ability to deploy new units onto the board.',
    details: 'A unit can wind up on an enemy deploy square if it is KO’d onto it and then revived, or if it is a Wraith that spawned from a corpse on that square. It will block the enemy from deploying units there so long as it remains. Conversely, a corpse on its own deploy square will be stomped automatically if a friendly unit deploys there.'
  },
  {
    title: 'Targeting Restrictions',
    icon: 'icon-[material-symbols--favorite-outline]',
    badge: 'Buff Limits',
    summary: 'Units cannot target themselves with heals or external buffs.',
    details: 'All heals, force fields, and buffs must be cast by one unit onto another friendly unit (except innate passive self-healing like the Paladin’s 50% drain).'
  }
];
