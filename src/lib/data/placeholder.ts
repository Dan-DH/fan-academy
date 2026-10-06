import type {
  FaqCategory,
  FaqItem,
  HeroAcademyFaction,
  HeroAcademyVideo,
  PatchNote,
  PlayerData,
  PlayerStat,
  VideoCategory
} from "$lib/types/InfoType";

export type { FaqCategory, FaqItem, HeroAcademyFaction, HeroAcademyVideo, VideoCategory };

export const topPlayers: PlayerStat[] = [
        {username: "damsa",elo: 8967,icon: "icon-[at-icons--medal-1st] bg-yellow-300"},
        {username: "dadzbk",elo: 7842,icon: "icon-[at-icons--medal-2nd] bg-slate-400"},
        {username: "ljn",elo: 4559,icon: "icon-[at-icons--medal-3rd] bg-orange-300"},
    ]

export const patchNotes: PatchNote[] = [
  {
    version: "1.2.0",
    date: "04/10/2026",
    title: "Dwarves Expansion & Tactical Overhaul",
    tag: "Major Expansion",
    isLatest: true,
    type: "major",
    summary: "The Dwarves join the battlefield! Featuring heavy firepower, mortar splash, mechanical engineering, and new tactical upgrades.",
    description: [
      "Added Dwarven Faction with 5 unique heroes (Paladin, Gunner, Grenadier, Engineer, Annihilator).",
      "Introduced 6 new Dwarven gear items and consumables including Runemetal, Supercharge, and Dwarven Brew.",
      "Upgraded combat mechanics with mortar trajectory visualization and AoE splash previews.",
      "Added interactive Faction Codex with detailed hero attributes and tactical advice.",
      "Fixed an issue with knockback physics on boundary deployment tiles."
    ],
    groups: [
      {
        category: "New Faction & Heroes",
        badge: "Dwarves",
        icon: "icon-[material-symbols--military-tech]",
        items: [
          "Paladin: Frontline juggernaut with 50% passive damage life-drain and heavy physical armor.",
          "Gunner: Long-range marksman firing a 3-tile wide cone physical blast.",
          "Grenadier: Artillery specialist launching high-arc mortar shells bypassing line-of-sight.",
          "Engineer: Defensive architect deploying automated gun turrets and shield overcharges.",
          "Annihilator: Colossal siege walker dealing massive AoE damage and shredding target armor by -50%."
        ]
      },
      {
        category: "New Items & Equipment",
        badge: "Armory",
        icon: "icon-[material-symbols--shield-with-heart]",
        items: [
          "Runemetal (+50% permanent Attack Power) and Dragonscale (+20% Physical Resist, +10% HP).",
          "Shining Helm (+20% Magical Resist, +10% HP) for fortifying backline artillery.",
          "Supercharge: Boosts next attack or heal to a devastating 300% multiplier.",
          "Dwarven Brew: Emergency 1,000 HP heal with temporary 50% dual resistance barrier.",
          "Pulverizer: 600 Physical damage that permanently shatters enemy armor or soulstones."
        ]
      },
      {
        category: "Combat & Balance Changes",
        badge: "Balance",
        icon: "icon-[material-symbols--balance]",
        items: [
          "Knockback physics reworked: destination tiles are now strictly checked before displacement occurs.",
          "AoE damage multipliers to crystals now properly account for Assault tile bonuses.",
          "Turn clock buffer increased by 5 seconds for complex multi-unit chaining turns."
        ]
      },
      {
        category: "Bug Fixes & Polish",
        badge: "Fixes",
        icon: "icon-[material-symbols--bug-report-outline]",
        items: [
          "Fixed a desync issue when units were revived on contested deployment tiles.",
          "Resolved line-of-sight calculation edge case across diagonal obstacles.",
          "Reduced WebP asset bundle sizes for faster mobile loading times."
        ]
      }
    ]
  },
  {
    version: "1.1.50",
    date: "20/09/2026",
    title: "Dark Elves Incursion & Match History",
    tag: "Faction Release",
    type: "major",
    summary: "The shadows rise with the Dark Elves faction, introducing life leech, phantom summoning, and full turn history replays.",
    description: [
      "New Dark Elves faction added to the roster with 33% life leech passive trait.",
      "Fixed a case where in-game chat messages were not appearing during turn transitions.",
      "Turn replay system enabled: players can now inspect all previous moves in the match log.",
      "Resolved unit corpse collision priority when reviving vs stomping."
    ],
    groups: [
      {
        category: "New Features & Content",
        badge: "Dark Elves",
        icon: "icon-[material-symbols--dark-mode-outline]",
        items: [
          "Dark Elves roster released: Void Monk, Impaler, Necromancer, Priestess, Wraith, and Phantom summons.",
          "Faction Passive 'Life Leech': all Dark Elves recover 33% of damage dealt to enemy heroes.",
          "Interactive match timeline log added to the sidebar allowing review of every move made in the battle."
        ]
      },
      {
        category: "Bug Fixes",
        badge: "Fixes",
        icon: "icon-[material-symbols--bug-report-outline]",
        items: [
          "Fixed a case where in-game chat messages were intermittently lost on reconnection.",
          "Fixed corpse targeting: clicking a corpse triggers revival/consumption instead of unintended stomping.",
          "Corrected Phantom despawn timing when summoning hero is knocked out."
        ]
      }
    ]
  },
  {
    version: "1.1.0",
    date: "15/07/2026",
    title: "Arena Hazard Tiles & Ranked Season 1",
    tag: "Ranked Season",
    type: "minor",
    summary: "Inaugural ranked competitive season begins alongside special battlefield tiles and Elo rating calibration.",
    description: [
      "Introduced Special Board Tiles: Assault Crystals, Defense Buff Tiles, and Inferno Zones.",
      "Launched Ranked Season 1 with Tier divisions (Diamond, Gold, Silver, Bronze, Iron, Wood).",
      "Enhanced matchmaking queue algorithms for fairer Elo rating pairings.",
      "Added player profile inspection and match history statistics."
    ],
    groups: [
      {
        category: "Competitive Ranked Play",
        badge: "Ranked",
        icon: "icon-[material-symbols--trophy-outline]",
        items: [
          "Official Season 1 leaderboard with live Elo ranking pagination and tier badges.",
          "Matchmaking fairness buffer: matches prioritized within +/- 150 MMR.",
          "Win streak bonus Elo points implemented for climbing tiers."
        ]
      },
      {
        category: "Board Hazards & Special Tiles",
        badge: "Arena",
        icon: "icon-[material-symbols--grid-view-rounded]",
        items: [
          "+Attack Bonus Tiles grant +20% damage to all outgoing physical and magical strikes.",
          "+Defense Bonus Tiles reduce all incoming damage by 20%.",
          "Assault Crystals standard health calibrated across all tournament map seeds."
        ]
      }
    ]
  },
  {
    version: "1.0.13",
    date: "14/03/2026",
    title: "The Council Reinforcements & Battlegrounds",
    tag: "Content Update",
    type: "minor",
    summary: "Expanded The Council tactical options with Ninja infiltrators and updated tournament battle arena layouts.",
    description: [
      "Added Ninja unit to The Council with shadow swap and phantom stealth mechanics.",
      "Added 2 new symmetric tournament battle maps.",
      "Adjusted Wizard chain lightning decay from 25% down to 20% per jump.",
      "Added sound effects for unit strikes, critical heals, and crystal damage."
    ],
    groups: [
      {
        category: "New Content",
        badge: "Council",
        icon: "icon-[material-symbols--shield]",
        items: [
          "Added Ninja hero to The Council featuring Shadow Swap teleportation and high single-target burst.",
          "Added 2 tournament map layouts with symmetric cover: Citadel Grounds and Echo Valley.",
          "Added battle sound effects for unit strikes, spell casting, and crystal impact."
        ]
      },
      {
        category: "Balance Changes",
        badge: "Balance",
        icon: "icon-[material-symbols--balance]",
        items: [
          "Wizard: Chain lightning jump damage decay reduced from 25% to 20%, buffing multi-target pressure.",
          "Cleric: Base revive HP pool increased from 200 to 300 HP.",
          "Archer: Long-range armor piercing shot validated across maximum 4-tile distance."
        ]
      }
    ]
  },
  {
    version: "1.0.0",
    date: "01/01/2026",
    title: "Fan Academy Global Launch",
    tag: "Initial Release",
    type: "major",
    summary: "The tactical turn-based battleground opens its gates! Assemble your squad, defend your crystals, and outmaneuver opponents.",
    description: [
      "Initial public release of Fan Academy tactical web arena.",
      "The Council faction fully unlocked with Knight, Archer, Wizard, and Cleric.",
      "Turn-based asynchronous 5-Action Point battle economy.",
      "Interactive Phaser 3 board renderer with cross-platform responsive interface."
    ],
    groups: [
      {
        category: "Core Features",
        badge: "System",
        icon: "icon-[material-symbols--rocket-launch]",
        items: [
          "Complete turn-based tactical combat engine recreating classic Hero Academy gameplay.",
          "5 Action Point turn system with unit deployment, movement, attacks, buffs, and heals.",
          "Dual victory paths: destroy 2 enemy crystals or eliminate all enemy units.",
          "Real-time and asynchronous online matchmaking."
        ]
      }
    ]
  }
];

export const allPlayers: PlayerData[] = [
  {
    username: "ShadowStrike",
    elo: 2150,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=ShadowStrike",
    wins: 142,
    loses: 68,
    total_matches: 210,
    win_rate: 67.6,
    ranked_matches: 180,
    ranked_wins: 125,
    tier: "diamond"
  },
  {
    username: "VortexPulse",
    elo: 2085,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=VortexPulse",
    wins: 190,
    loses: 110,
    total_matches: 300,
    win_rate: 63.3,
    ranked_matches: 250,
    ranked_wins: 160,
    tier: "diamond"
  },
  {
    username: "AeroSniper",
    elo: 2010,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=AeroSniper",
    wins: 115,
    loses: 65,
    total_matches: 180,
    win_rate: 63.9,
    ranked_matches: 150,
    ranked_wins: 98,
    tier: "diamond"
  },
  {
    username: "FrostByte99",
    elo: 1980,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=FrostByte99",
    wins: 130,
    loses: 82,
    total_matches: 212,
    win_rate: 61.3,
    ranked_matches: 175,
    ranked_wins: 110,
    tier: "diamond"
  },
  {
    username: "IronClad_X",
    elo: 1920,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=IronClad_X",
    wins: 88,
    loses: 52,
    total_matches: 140,
    win_rate: 62.9,
    ranked_matches: 110,
    ranked_wins: 72,
    tier: "diamond"
  },
  {
    username: "NovaFlare",
    elo: 1870,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=NovaFlare",
    wins: 104,
    loses: 76,
    total_matches: 180,
    win_rate: 57.8,
    ranked_matches: 140,
    ranked_wins: 84,
    tier: "gold"
  },
  {
    username: "PhantomRider",
    elo: 1845,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=PhantomRider",
    wins: 95,
    loses: 70,
    total_matches: 165,
    win_rate: 57.6,
    ranked_matches: 130,
    ranked_wins: 78,
    tier: "gold"
  },
  {
    username: "BlazeRunner",
    elo: 1810,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=BlazeRunner",
    wins: 110,
    loses: 85,
    total_matches: 195,
    win_rate: 56.4,
    ranked_matches: 160,
    ranked_wins: 92,
    tier: "gold"
  },
  {
    username: "SilentEcho",
    elo: 1780,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=SilentEcho",
    wins: 82,
    loses: 68,
    total_matches: 150,
    win_rate: 54.7,
    ranked_matches: 120,
    ranked_wins: 67,
    tier: "gold"
  },
  {
    username: "CyberMonk",
    elo: 1755,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=CyberMonk",
    wins: 75,
    loses: 60,
    total_matches: 135,
    win_rate: 55.6,
    ranked_matches: 105,
    ranked_wins: 60,
    tier: "gold"
  },
  {
    username: "PixelKnight",
    elo: 1720,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=PixelKnight",
    wins: 89,
    loses: 71,
    total_matches: 160,
    win_rate: 55.6,
    ranked_matches: 125,
    ranked_wins: 70,
    tier: "gold"
  },
  {
    username: "CrimsonFang",
    elo: 1690,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=CrimsonFang",
    wins: 67,
    loses: 58,
    total_matches: 125,
    win_rate: 53.6,
    ranked_matches: 95,
    ranked_wins: 52,
    tier: "gold"
  },
  {
    username: "ThunderHawk",
    elo: 1665,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=ThunderHawk",
    wins: 102,
    loses: 88,
    total_matches: 190,
    win_rate: 53.7,
    ranked_matches: 150,
    ranked_wins: 81,
    tier: "gold"
  },
  {
    username: "LunarWisp",
    elo: 1630,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=LunarWisp",
    wins: 58,
    loses: 52,
    total_matches: 110,
    win_rate: 52.7,
    ranked_matches: 80,
    ranked_wins: 44,
    tier: "gold"
  },
  {
    username: "SolarDrift",
    elo: 1610,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=SolarDrift",
    wins: 70,
    loses: 65,
    total_matches: 135,
    win_rate: 51.9,
    ranked_matches: 100,
    ranked_wins: 53,
    tier: "gold"
  },
  {
    username: "ZenithApex",
    elo: 1590,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=ZenithApex",
    wins: 64,
    loses: 61,
    total_matches: 125,
    win_rate: 51.2,
    ranked_matches: 90,
    ranked_wins: 48,
    tier: "silver"
  },
  {
    username: "NightStalker",
    elo: 1575,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=NightStalker",
    wins: 80,
    loses: 78,
    total_matches: 158,
    win_rate: 50.6,
    ranked_matches: 120,
    ranked_wins: 61,
    tier: "silver"
  },
  {
    username: "DuskBlade",
    elo: 1550,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=DuskBlade",
    wins: 51,
    loses: 49,
    total_matches: 100,
    win_rate: 51.0,
    ranked_matches: 75,
    ranked_wins: 39,
    tier: "silver"
  },
  {
    username: "StaticClash",
    elo: 1530,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=StaticClash",
    wins: 45,
    loses: 45,
    total_matches: 90,
    win_rate: 50.0,
    ranked_matches: 65,
    ranked_wins: 33,
    tier: "silver"
  },
  {
    username: "QuantumShift",
    elo: 1515,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=QuantumShift",
    wins: 72,
    loses: 73,
    total_matches: 145,
    win_rate: 49.7,
    ranked_matches: 110,
    ranked_wins: 55,
    tier: "silver"
  },
  {
    username: "HyperGamer",
    elo: 1490,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=HyperGamer",
    wins: 60,
    loses: 65,
    total_matches: 125,
    win_rate: 48.0,
    ranked_matches: 90,
    ranked_wins: 44,
    tier: "silver"
  },
  {
    username: "RogueTitan",
    elo: 1475,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=RogueTitan",
    wins: 53,
    loses: 57,
    total_matches: 110,
    win_rate: 48.2,
    ranked_matches: 80,
    ranked_wins: 39,
    tier: "silver"
  },
  {
    username: "AlphaProwler",
    elo: 1450,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=AlphaProwler",
    wins: 48,
    loses: 52,
    total_matches: 100,
    win_rate: 48.0,
    ranked_matches: 70,
    ranked_wins: 34,
    tier: "silver"
  },
  {
    username: "OmegaSpark",
    elo: 1430,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=OmegaSpark",
    wins: 40,
    loses: 44,
    total_matches: 84,
    win_rate: 47.6,
    ranked_matches: 60,
    ranked_wins: 29,
    tier: "silver"
  },
  {
    username: "SwiftShadow",
    elo: 1410,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=SwiftShadow",
    wins: 38,
    loses: 42,
    total_matches: 80,
    win_rate: 47.5,
    ranked_matches: 55,
    ranked_wins: 27,
    tier: "silver"
  },
  {
    username: "TitanForge",
    elo: 1390,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=TitanForge",
    wins: 62,
    loses: 70,
    total_matches: 132,
    win_rate: 47.0,
    ranked_matches: 95,
    ranked_wins: 46,
    tier: "bronze"
  },
  {
    username: "MysticArrow",
    elo: 1365,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=MysticArrow",
    wins: 44,
    loses: 51,
    total_matches: 95,
    win_rate: 46.3,
    ranked_matches: 70,
    ranked_wins: 33,
    tier: "bronze"
  },
  {
    username: "IronHeart",
    elo: 1340,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=IronHeart",
    wins: 50,
    loses: 60,
    total_matches: 110,
    win_rate: 45.5,
    ranked_matches: 80,
    ranked_wins: 37,
    tier: "bronze"
  },
  {
    username: "StormBringer",
    elo: 1320,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=StormBringer",
    wins: 35,
    loses: 43,
    total_matches: 78,
    win_rate: 44.9,
    ranked_matches: 55,
    ranked_wins: 25,
    tier: "bronze"
  },
  {
    username: "GildedRaven",
    elo: 1295,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=GildedRaven",
    wins: 42,
    loses: 53,
    total_matches: 95,
    win_rate: 44.2,
    ranked_matches: 70,
    ranked_wins: 31,
    tier: "bronze"
  },
  {
    username: "NeonSpecter",
    elo: 1270,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=NeonSpecter",
    wins: 30,
    loses: 40,
    total_matches: 70,
    win_rate: 42.9,
    ranked_matches: 50,
    ranked_wins: 22,
    tier: "bronze"
  },
  {
    username: "VoidSeeker",
    elo: 1245,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=VoidSeeker",
    wins: 39,
    loses: 51,
    total_matches: 90,
    win_rate: 43.3,
    ranked_matches: 65,
    ranked_wins: 29,
    tier: "bronze"
  },
  {
    username: "BlizzardHowl",
    elo: 1220,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=BlizzardHowl",
    wins: 28,
    loses: 37,
    total_matches: 65,
    win_rate: 43.1,
    ranked_matches: 45,
    ranked_wins: 20,
    tier: "bronze"
  },
  {
    username: "EchoPulse",
    elo: 1190,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=EchoPulse",
    wins: 25,
    loses: 35,
    total_matches: 60,
    win_rate: 41.7,
    ranked_matches: 40,
    ranked_wins: 17,
    tier: "bronze"
  },
  {
    username: "CobaltCrush",
    elo: 1160,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=CobaltCrush",
    wins: 33,
    loses: 47,
    total_matches: 80,
    win_rate: 41.3,
    ranked_matches: 60,
    ranked_wins: 25,
    tier: "bronze"
  },
  {
    username: "RustyBolt",
    elo: 1130,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=RustyBolt",
    wins: 20,
    loses: 30,
    total_matches: 50,
    win_rate: 40.0,
    ranked_matches: 35,
    ranked_wins: 14,
    tier: "iron"
  },
  {
    username: "DriftKing42",
    elo: 1110,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=DriftKing42",
    wins: 22,
    loses: 33,
    total_matches: 55,
    win_rate: 40.0,
    ranked_matches: 40,
    ranked_wins: 16,
    tier: "iron"
  },
  {
    username: "StaticFuzz",
    elo: 1080,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=StaticFuzz",
    wins: 18,
    loses: 28,
    total_matches: 46,
    win_rate: 39.1,
    ranked_matches: 30,
    ranked_wins: 12,
    tier: "iron"
  },
  {
    username: "GravelMuncher",
    elo: 1050,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=GravelMuncher",
    wins: 15,
    loses: 25,
    total_matches: 40,
    win_rate: 37.5,
    ranked_matches: 28,
    ranked_wins: 11,
    tier: "iron"
  },
  {
    username: "ZeroCool7",
    elo: 1025,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=ZeroCool7",
    wins: 14,
    loses: 26,
    total_matches: 40,
    win_rate: 35.0,
    ranked_matches: 25,
    ranked_wins: 9,
    tier: "iron"
  },
  {
    username: "TinCanDan",
    elo: 990,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=TinCanDan",
    wins: 12,
    loses: 23,
    total_matches: 35,
    win_rate: 34.3,
    ranked_matches: 22,
    ranked_wins: 8,
    tier: "iron"
  },
  {
    username: "PatchySignal",
    elo: 960,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=PatchySignal",
    wins: 11,
    loses: 21,
    total_matches: 32,
    win_rate: 34.4,
    ranked_matches: 20,
    ranked_wins: 7,
    tier: "iron"
  },
  {
    username: "BrokenKeyboard",
    elo: 920,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=BrokenKeyboard",
    wins: 10,
    loses: 22,
    total_matches: 32,
    win_rate: 31.3,
    ranked_matches: 18,
    ranked_wins: 6,
    tier: "iron"
  },
  {
    username: "LaggingLarry",
    elo: 880,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=LaggingLarry",
    wins: 8,
    loses: 20,
    total_matches: 28,
    win_rate: 28.6,
    ranked_matches: 16,
    ranked_wins: 5,
    tier: "wood"
  },
  {
    username: "SplinterCellar",
    elo: 850,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=SplinterCellar",
    wins: 7,
    loses: 18,
    total_matches: 25,
    win_rate: 28.0,
    ranked_matches: 15,
    ranked_wins: 4,
    tier: "wood"
  },
  {
    username: "OakBarker",
    elo: 820,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=OakBarker",
    wins: 6,
    loses: 19,
    total_matches: 25,
    win_rate: 24.0,
    ranked_matches: 14,
    ranked_wins: 3,
    tier: "wood"
  },
  {
    username: "TwiggyBoi",
    elo: 790,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=TwiggyBoi",
    wins: 5,
    loses: 17,
    total_matches: 22,
    win_rate: 22.7,
    ranked_matches: 12,
    ranked_wins: 3,
    tier: "wood"
  },
  {
    username: "PlankWalker",
    elo: 740,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=PlankWalker",
    wins: 4,
    loses: 16,
    total_matches: 20,
    win_rate: 20.0,
    ranked_matches: 10,
    ranked_wins: 2,
    tier: "wood"
  },
  {
    username: "PaperShield",
    elo: 690,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=PaperShield",
    wins: 3,
    loses: 15,
    total_matches: 18,
    win_rate: 16.7,
    ranked_matches: 8,
    ranked_wins: 1,
    tier: "wood"
  },
  {
    username: "DustCollector",
    elo: 620,
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=DustCollector",
    wins: 2,
    loses: 18,
    total_matches: 20,
    win_rate: 10.0,
    ranked_matches: 6,
    ranked_wins: 0,
    tier: "wood"
  }
];

export const heroAcademyVideos: HeroAcademyVideo[] = [
  {
    id: "hero-academy-how-to-play-walkthrough",
    youtubeId: "CXJOmOrB7mY",
    title: "Hero Academy - Walkthrough - How to Play",
    channelTitle: "WikiGameGuides",
    youtubeUrl: "https://www.youtube.com/watch?v=CXJOmOrB7mY",
    embedUrl: "https://www.youtube.com/embed/CXJOmOrB7mY",
    thumbnailUrl: "https://img.youtube.com/vi/CXJOmOrB7mY/hqdefault.jpg",
    category: "guide",
    categoryLabel: "Beginner Guide",
    factions: ["council", "general"],
    duration: "13:22",
    publishedDate: "2012-02-08",
    featured: true,
    description:
      "Comprehensive foundational walkthrough detailing core board mechanics, the 5-Action-Point turn budget, unit deployment, movement rules, and crystal destruction win conditions.",
    tacticsSummary:
      "Master the 5 Action Point (AP) economy, preserve unit health with Cleric heals, and control damage-boosting power squares.",
    tacticsCovered: [
      "5 Action Point (AP) management",
      "Crystal offense & defense priority",
      "Special board square bonuses (Attack & Defense boosts)",
      "Cleric revive & healing sequence",
      "Safe unit deployment from hand"
    ]
  },
  {
    id: "hero-academy-council-challenges-tactics",
    youtubeId: "RdoDGX6xza4",
    title: "Hero Academy - Challenges - Council",
    channelTitle: "WikiGameGuides",
    youtubeUrl: "https://www.youtube.com/watch?v=RdoDGX6xza4",
    embedUrl: "https://www.youtube.com/embed/RdoDGX6xza4",
    thumbnailUrl: "https://img.youtube.com/vi/RdoDGX6xza4/hqdefault.jpg",
    category: "tactics",
    categoryLabel: "Tactical Challenges",
    factions: ["council"],
    duration: "10:45",
    publishedDate: "2012-02-09",
    featured: true,
    description:
      "Step-by-step puzzle solutions and tactical walkthrough for the single-player Council challenges, illustrating optimal turn planning and precise action point calculation.",
    tacticsSummary:
      "Execute exact AP damage calculations, chain Knight knockbacks, and position Archers on attack tiles for lethal crystal burst.",
    tacticsCovered: [
      "Knight charge & displacement combos",
      "Wizard chain lightning targeting",
      "Archer line-of-sight & bonus tile positioning",
      "Turn sequencing to avoid counterattacks",
      "Lethal crystal burst calculations"
    ]
  },
  {
    id: "hero-academy-dark-elves-challenges-tactics",
    youtubeId: "1kViYhIxQRw",
    title: "Hero Academy - Challenges - Dark Elves",
    channelTitle: "WikiGameGuides",
    youtubeUrl: "https://www.youtube.com/watch?v=1kViYhIxQRw",
    embedUrl: "https://www.youtube.com/embed/1kViYhIxQRw",
    thumbnailUrl: "https://img.youtube.com/vi/1kViYhIxQRw/hqdefault.jpg",
    category: "tactics",
    categoryLabel: "Tactical Challenges",
    factions: ["dark-elves"],
    duration: "11:18",
    publishedDate: "2012-02-10",
    featured: true,
    description:
      "Advanced tactical puzzle walkthrough for the Dark Elves faction, demonstrating life-drain sustain mechanics, debuff curses, and 3x3 Soul Harvest board swings.",
    tacticsSummary:
      "Leverage Soul Harvest in high-density areas to revive friendly units while eliminating enemies, and exploit physical vs magical resistances.",
    tacticsCovered: [
      "Soul Harvest area-of-effect damage & resurrection",
      "Necromancer life-drain sustain",
      "Void Priest resistance debuffs",
      "Exploiting magical vs physical armor profiles",
      "Ghost phasing and zoning"
    ]
  },
  {
    id: "hero-academy-dwarves-challenges-tactics",
    youtubeId: "5dQ6Cl-2ltk",
    title: "Hero Academy - Challenges - Dwarves",
    channelTitle: "WikiGameGuides",
    youtubeUrl: "https://www.youtube.com/watch?v=5dQ6Cl-2ltk",
    embedUrl: "https://www.youtube.com/embed/5dQ6Cl-2ltk",
    thumbnailUrl: "https://img.youtube.com/vi/5dQ6Cl-2ltk/hqdefault.jpg",
    category: "tactics",
    categoryLabel: "Tactical Challenges",
    factions: ["dwarves"],
    duration: "09:34",
    publishedDate: "2012-05-18",
    featured: false,
    description:
      "Complete challenge solutions for the Dwarves roster, showing how to establish defensive choke points, deploy automated turrets, and utilize knockback artillery.",
    tacticsSummary:
      "Anchor with heavy Paladin armor, deploy Engineer turrets to deny high-value choke points, and use Gunners to push enemies into hazards.",
    tacticsCovered: [
      "Engineer turret choke-point placement",
      "Paladin shield aura & defensive fortification",
      "Gunner long-range knockback shots",
      "Grenadier indirect trajectory attacks",
      "Heavy armor damage reduction stacking"
    ]
  },
  {
    id: "hero-academy-tribe-challenges-tactics",
    youtubeId: "BpZPo05H0cQ",
    title: "Hero Academy - Challenges - The Tribe",
    channelTitle: "WikiGameGuides",
    youtubeUrl: "https://www.youtube.com/watch?v=BpZPo05H0cQ",
    embedUrl: "https://www.youtube.com/embed/BpZPo05H0cQ",
    thumbnailUrl: "https://img.youtube.com/vi/BpZPo05H0cQ/hqdefault.jpg",
    category: "tactics",
    categoryLabel: "Tactical Challenges",
    factions: ["tribe"],
    duration: "12:05",
    publishedDate: "2012-03-24",
    featured: false,
    description:
      "Tactical guide to The Tribe faction challenge puzzles, highlighting high-aggression plays, frenzy chaining, and high-damage melee pressure.",
    tacticsSummary:
      "Chain frenzy activations to double-attack in a single turn, rally units with Chieftain bonuses, and overpower defensive boards.",
    tacticsCovered: [
      "Berserker frenzy stacking & multi-strikes",
      "Axe Thrower ranged softening",
      "Chieftain leadership aura & attack buffs",
      "Aggressive tempo & high-mobility rushes",
      "Sacrificing low-HP units for board breakthroughs"
    ]
  },
  {
    id: "hero-academy-tf2-challenges-tactics",
    youtubeId: "0SIGDufWlk0",
    title: "Hero Academy - Challenges - Team Fortress 2",
    channelTitle: "WikiGameGuides",
    youtubeUrl: "https://www.youtube.com/watch?v=0SIGDufWlk0",
    embedUrl: "https://www.youtube.com/embed/0SIGDufWlk0",
    thumbnailUrl: "https://img.youtube.com/vi/0SIGDufWlk0/hqdefault.jpg",
    category: "tactics",
    categoryLabel: "Tactical Challenges",
    factions: ["tf2"],
    duration: "14:12",
    publishedDate: "2012-08-14",
    featured: true,
    description:
      "Challenge breakdown for the Team Fortress 2 squad, breaking down instant-kill Spy backstabs, Pyro fire spread, and Medic invulnerability buffs.",
    tacticsSummary:
      "Sneak behind fortified tanks using Spy cloak for lethal backstabs and chain Pyro fire patches across closely grouped defenders.",
    tacticsCovered: [
      "Spy cloak positioning & critical backstab execution",
      "Pyro flame cone area-of-effect denial",
      "Heavy minigun suppression against oncoming rushes",
      "Sniper rifle cross-board line-of-sight control",
      "Medic Übercharge timing for invincible assault"
    ]
  },
  {
    id: "hero-academy-tf2-basics-guide",
    youtubeId: "rQoKBAzSjII",
    title: "Hero Academy - Team Fortress 2 Basics",
    channelTitle: "WikiGameGuides",
    youtubeUrl: "https://www.youtube.com/watch?v=rQoKBAzSjII",
    embedUrl: "https://www.youtube.com/embed/rQoKBAzSjII",
    thumbnailUrl: "https://img.youtube.com/vi/rQoKBAzSjII/hqdefault.jpg",
    category: "faction-guide",
    categoryLabel: "Faction Breakdown",
    factions: ["tf2"],
    duration: "08:49",
    publishedDate: "2012-08-10",
    featured: false,
    description:
      "In-depth guide exploring the TF2 team roster in Hero Academy, breaking down each mercenary's stats, active skills, weapon items, and faction strengths.",
    tacticsSummary:
      "Understand each TF2 unit's unique combat role to construct versatile combinations that counter standard fantasy faction strategies.",
    tacticsCovered: [
      "Class synergy between Heavy and Medic",
      "Disguise kit and invisibility mechanics",
      "Burn status damage over time (DoT)",
      "Item deployment & consumable efficiency",
      "Defending friendly crystals from stealth attacks"
    ]
  },
  {
    id: "hero-academy-tribe-update-guide",
    youtubeId: "YO3oHiMsW1I",
    title: "Hero Academy - Tribe Update",
    channelTitle: "WikiGameGuides",
    youtubeUrl: "https://www.youtube.com/watch?v=YO3oHiMsW1I",
    embedUrl: "https://www.youtube.com/embed/YO3oHiMsW1I",
    thumbnailUrl: "https://img.youtube.com/vi/YO3oHiMsW1I/hqdefault.jpg",
    category: "faction-guide",
    categoryLabel: "Faction Breakdown",
    factions: ["tribe"],
    duration: "07:31",
    publishedDate: "2012-03-20",
    featured: false,
    description:
      "Overview of The Tribe expansion, examining unit traits, unique faction items, potion buffs, and tactical adjustments required to defeat heavy armor.",
    tacticsSummary:
      "Maximize damage output by timing Tribe potion buffs and exploiting enemy units that lack physical defense.",
    tacticsCovered: [
      "Tribe unit movement ranges and raw damage stats",
      "Consumable potion boosts & attack scaling",
      "Flanking techniques with fast beast units",
      "Countering magic-heavy enemy teams",
      "Board tempo control"
    ]
  },
  {
    id: "hero-academy-dwarf-update-guide",
    youtubeId: "iI8Cf-IYbKo",
    title: "Hero Academy - Dwarf Update",
    channelTitle: "WikiGameGuides",
    youtubeUrl: "https://www.youtube.com/watch?v=iI8Cf-IYbKo",
    embedUrl: "https://www.youtube.com/embed/iI8Cf-IYbKo",
    thumbnailUrl: "https://img.youtube.com/vi/iI8Cf-IYbKo/hqdefault.jpg",
    category: "faction-guide",
    categoryLabel: "Faction Breakdown",
    factions: ["dwarves"],
    duration: "06:55",
    publishedDate: "2012-05-15",
    featured: false,
    description:
      "Deep dive into the Dwarves faction expansion, examining mechanical constructs, turret placements, high base armor, and slow-paced positional dominance.",
    tacticsSummary:
      "Establish an unbreakable defense using Paladin auras and turret zones, forcing opponents to take unfavorable trades.",
    tacticsCovered: [
      "Dwarven mechanical unit properties",
      "Armor upgrade mechanics and physical resist",
      "Long-range zone control with Gunners",
      "Choke-point defense on narrow board layouts",
      "Late-game crystal attrition warfare"
    ]
  },
  {
    id: "hero-academy-tf2-vs-shaolin-commentary",
    youtubeId: "AubzoRYIS0w",
    title: "Hero Academy Matches - Team Fortress 2 Vs. Shaolin",
    channelTitle: "WhamNinjaMolehill",
    youtubeUrl: "https://www.youtube.com/watch?v=AubzoRYIS0w",
    embedUrl: "https://www.youtube.com/embed/AubzoRYIS0w",
    thumbnailUrl: "https://img.youtube.com/vi/AubzoRYIS0w/hqdefault.jpg",
    category: "match-commentary",
    categoryLabel: "Match Commentary",
    factions: ["tf2", "shaolin"],
    duration: "08:15",
    publishedDate: "2014-01-18",
    featured: true,
    description:
      "Live competitive match commentary analyzing a high-stakes duel between Team Fortress 2 and the Shaolin faction, demonstrating positional counter-play and crystal siege defense.",
    tacticsSummary:
      "Counter agile Shaolin melee rushers with TF2 ranged crossfire and maintain defensive formations around vulnerable crystals.",
    tacticsCovered: [
      "Matchup analysis: High mobility (Shaolin) vs Ranged firepower (TF2)",
      "Defensive perimeter setup around low-health crystals",
      "Punishing martial-arts hit-and-run tactics",
      "Calculated unit sacrifices to protect key damage dealers",
      "End-game crystal race decision-making"
    ]
  },
  {
    id: "hero-academy-tribe-vs-tf2-commentary",
    youtubeId: "I7JJYMFJoSE",
    title: "Hero Academy Matches - The Tribe Vs. Team Fortress 2",
    channelTitle: "WhamNinjaMolehill",
    youtubeUrl: "https://www.youtube.com/watch?v=I7JJYMFJoSE",
    embedUrl: "https://www.youtube.com/embed/I7JJYMFJoSE",
    thumbnailUrl: "https://img.youtube.com/vi/I7JJYMFJoSE/hqdefault.jpg",
    category: "match-commentary",
    categoryLabel: "Match Commentary",
    factions: ["tribe", "tf2"],
    duration: "09:42",
    publishedDate: "2013-12-21",
    featured: false,
    description:
      "Turn-by-turn match breakdown covering The Tribe against Team Fortress 2, focusing on aggressive board pressure against defensive ranged encampments.",
    tacticsSummary:
      "Break through heavy defensive lines using coordinated multi-unit charges, or bait aggressive rushers into sniper kill corridors.",
    tacticsCovered: [
      "Controlling mid-board bonus tiles (sword & shield)",
      "Baiting opponent AP into ineffective attacks",
      "Breaching heavy defensive walls with focused melee strikes",
      "Managing turn tempo under aggressive enemy rushes",
      "Punishing overextended opponent offensive units"
    ]
  },
  {
    id: "hero-academy-play-by-play-commentary",
    youtubeId: "0xTY2F8_P_Y",
    title: "Hero Academy with play by play commentary",
    channelTitle: "raffertyesque",
    youtubeUrl: "https://www.youtube.com/watch?v=0xTY2F8_P_Y",
    embedUrl: "https://www.youtube.com/embed/0xTY2F8_P_Y",
    thumbnailUrl: "https://img.youtube.com/vi/0xTY2F8_P_Y/hqdefault.jpg",
    category: "match-commentary",
    categoryLabel: "Match Commentary",
    factions: ["council", "dark-elves", "general"],
    duration: "15:20",
    publishedDate: "2012-04-23",
    featured: false,
    description:
      "Analytical play-by-play ranked match commentary explaining real-time AP spending logic, board evaluation, and countering opponent turn states.",
    tacticsSummary:
      "Evaluate every turn with a strict cost-benefit mindset: compare trading a piece now versus building momentum for next turn.",
    tacticsCovered: [
      "Turn evaluation and threat prioritization",
      "Action point budgeting across 5 consecutive actions",
      "Zoning fallen opponent units to prevent safe revivals",
      "Anticipating enemy hand draw possibilities",
      "Optimizing damage-to-AP efficiency"
    ]
  },
  {
    id: "hero-academy-pc-gameplay-hd",
    youtubeId: "qsrZLxKRtBE",
    title: "Hero Academy PC Gameplay HD 1080p",
    channelTitle: "PC Gameplay",
    youtubeUrl: "https://www.youtube.com/watch?v=qsrZLxKRtBE",
    embedUrl: "https://www.youtube.com/embed/qsrZLxKRtBE",
    thumbnailUrl: "https://img.youtube.com/vi/qsrZLxKRtBE/hqdefault.jpg",
    category: "gameplay",
    categoryLabel: "Gameplay Showcase",
    factions: ["council", "general"],
    duration: "11:58",
    publishedDate: "2012-08-12",
    featured: false,
    description:
      "High-definition PC gameplay presentation demonstrating visual board feedback, grid mechanics, unit animations, spell effects, and crystal HP bars.",
    tacticsSummary:
      "Observe unit attack animations and range grids to master diagonal vs straight line-of-sight targeting rules.",
    tacticsCovered: [
      "Line-of-sight and diagonal movement rules",
      "Visual indicators for attack ranges and bonus squares",
      "Direct crystal attack sequence execution",
      "Equipment item application on spawned units",
      "End-game turn planning"
    ]
  },
  {
    id: "hero-academy-official-launch-trailer",
    youtubeId: "1RqF__v5rlg",
    title: "Hero Academy Launch Trailer",
    channelTitle: "Robot Entertainment",
    youtubeUrl: "https://www.youtube.com/watch?v=1RqF__v5rlg",
    embedUrl: "https://www.youtube.com/embed/1RqF__v5rlg",
    thumbnailUrl: "https://img.youtube.com/vi/1RqF__v5rlg/hqdefault.jpg",
    category: "showcase",
    categoryLabel: "Official Trailer",
    factions: ["general", "council", "dark-elves"],
    duration: "01:14",
    publishedDate: "2012-01-11",
    featured: false,
    description:
      "The original official release trailer from Robot Entertainment announcing Hero Academy's tactical asynchronous strategy gameplay.",
    tacticsSummary:
      "Get inspired by the classic tactical board warfare premise: heroic characters, diverse teams, and tactical board-based combat.",
    tacticsCovered: [
      "Core turn-based board concept",
      "Hero abilities and distinctive faction aesthetics",
      "Tactical crystal clash premise"
    ]
  }
];

export const tacticsVideos: HeroAcademyVideo[] = heroAcademyVideos;
export const gameplayVideos: HeroAcademyVideo[] = heroAcademyVideos;

export const faqItems: FaqItem[] = [
  {
    id: "what-is-fan-academy",
    question: "What is Fan Academy?",
    category: "general",
    categoryLabel: "General",
    badge: "Basics",
    answer: "Fan Academy is a modern, community-driven web revival of the classic turn-based tactical strategy game Hero Academy, originally developed by Robot Entertainment. It faithfully recreates the beloved 5-Action Point economy, tactical grid battlefield, authentic factions, and dual crystal victory conditions for modern web browsers."
  },
  {
    id: "ap-turn-system",
    question: "How does the Action Point (AP) turn system work?",
    category: "general",
    categoryLabel: "Rules",
    badge: "5 AP",
    answer: "Every turn grants exactly 5 Action Points (AP). You can spend them in any combination: deploy units onto spawn squares (1 AP), move heroes orthogonally (1 AP per move), execute melee or ranged attacks (1 AP), cast spells or heals (1 AP), equip permanent gear, use single-use potions/scrolls (1 AP), or cycle unwanted cards in hand for new ones (1 AP each)."
  },
  {
    id: "win-conditions",
    question: "How do I win a match?",
    category: "general",
    categoryLabel: "Rules",
    badge: "Victory",
    answer: "There are two distinct victory conditions: either shatter both of your opponent's power crystals, or wipe out every enemy unit currently on the board so they have none left standing and cannot deploy replacements."
  },
  {
    id: "line-of-sight",
    question: "How does Line of Sight (LoS) work for ranged attacks?",
    category: "combat",
    categoryLabel: "Combat",
    badge: "Targeting",
    answer: "Most ranged attacks (like Archers and Gunners) require an unblocked straight orthogonal path. Friendly units do NOT block line of sight, but enemy units and crystals DO. Attacks to an immediately diagonal square are never blocked. Notably, Dwarven Grenadiers fire high-arc mortar shells that ignore Line of Sight completely!"
  },
  {
    id: "damage-types",
    question: "What is the difference between Physical and Magical damage?",
    category: "combat",
    categoryLabel: "Combat",
    badge: "Formulas",
    answer: "Attacks are categorized into Physical (Knights, Archers, Gunners, Impalers) or Magical (Wizards, Clerics, Grenadiers, Necromancers). Physical damage is reduced by Physical Resistance, and Magical damage is reduced by Magic Resistance. Bonus assault damage dealt to crystals is untyped and ignores all resistances."
  },
  {
    id: "corpse-mechanics",
    question: "How do corpses work, and what is 'stomping'?",
    category: "combat",
    categoryLabel: "Combat",
    badge: "Corpses",
    answer: "When a unit reaches 0 HP, it leaves a corpse on that tile. Friendly healers (Clerics and Priestesses) can target a corpse to revive them. Dark Elves (Necromancers and Wraiths) can consume enemy corpses or summon Phantoms from them. Any living unit can walk directly onto an enemy corpse to 'stomp' it, permanently removing it from the board."
  },
  {
    id: "special-tiles",
    question: "What are Special Tiles and how do they impact the game?",
    category: "combat",
    categoryLabel: "Combat",
    badge: "Board Hazards",
    answer: "Maps feature strategic bonus squares: Assault Tiles grant massive bonus untyped damage against enemy crystals, Defense Buff Tiles reduce incoming damage by 20%, and Attack Buff Tiles boost outgoing physical and magical damage by 20%. Controlling these squares is key to winning high-level matches."
  },
  {
    id: "playable-factions",
    question: "What factions are available in the game?",
    category: "factions",
    categoryLabel: "Factions",
    badge: "Codex",
    answer: "Currently, three authentic factions are implemented: The Council (balanced martial strength, knockbacks, and lethal chain lightning), Dark Elves (necromancy, life drain, phantom summoning, and 33% life leech passive), and Dwarves (heavy armor, indirect mortar fire, and armor-shredding siege weapons)."
  },
  {
    id: "faction-passives",
    question: "Do all factions have passive traits?",
    category: "factions",
    categoryLabel: "Factions",
    badge: "Passives",
    answer: "Dark Elves have 'Life Leech', which restores 33% of damage dealt back to their heroes as health (excluding crystal strikes). Dwarves rely on heavy base defensive armor and Paladin life-drain. The Council has 'Tactical Balance' with no passive trait, relying instead on solid stat fundamentals, positional knockbacks, and team mobility."
  },
  {
    id: "self-targeting",
    question: "Can units cast heals, shields, or buffs on themselves?",
    category: "factions",
    categoryLabel: "Factions",
    badge: "Targeting",
    answer: "No. All heals, shields, and item buffs must be cast by one unit onto a different friendly hero. Innate self-healing only occurs through passive abilities (such as the Paladin's 50% drain strike or the Dark Elves' Life Leech trait)."
  },
  {
    id: "asynchronous-play",
    question: "Is Fan Academy real-time or asynchronous?",
    category: "matchmaking",
    categoryLabel: "Matchmaking",
    badge: "Play Modes",
    answer: "Fan Academy supports both asynchronous play (players take their 5-action turns at their convenience with multi-hour or multi-day timers) and real-time live games for head-to-head battles. You can manage multiple active ongoing matches simultaneously."
  },
  {
    id: "elo-rating",
    question: "How does the competitive Ranked Elo system work?",
    category: "matchmaking",
    categoryLabel: "Matchmaking",
    badge: "Ranked",
    answer: "Every player begins with an introductory matchmaking rating. Victories earn Elo based on the relative skill of your opponent, while defeats lower your score. Players are ranked across tiers: Wood, Iron, Bronze, Silver, Gold, and Diamond on the global leaderboard."
  },
  {
    id: "free-to-play",
    question: "Is Fan Academy free to play?",
    category: "general",
    categoryLabel: "General",
    badge: "Free",
    answer: "Yes, 100%! Fan Academy is a non-commercial, fan-made community tribute to Hero Academy. All factions, units, tactical guides, and multiplayer features are completely free with zero microtransactions or pay-to-win mechanics."
  },
  {
    id: "community-support",
    question: "Where can I find players, report bugs, or give feedback?",
    category: "matchmaking",
    categoryLabel: "Community",
    badge: "Discord",
    answer: "Join our active Discord community through the Community tab in the top navigation bar! You can arrange custom matches, participate in community tournaments, discuss strategy, and report bugs directly to the team."
  }
];
