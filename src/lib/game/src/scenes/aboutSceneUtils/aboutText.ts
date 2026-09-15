export const fanAcademyText = `Fan Academy is a fan-made revival of the game Hero Academy, a turn-based tactics game developed by Robot Entertainment. This project aims to bring back the joy of the original game, offering a way for fans to rediscover it.

This is not a reverse engineering of the game. The game logic is being implemented from scratch while using the original assets to try to preserve the game's aesthetic as much as possible.`;

export const heroAcademyText = 'Hero Academy is a player-versus-player turn-based tactics game where players choose a team of heroes and use their units and items to defeat their opponents. Unfortunately, the game is currently deadf, delisted from all stores and its online servers shut down. It is no longer possible for people who purchased the game to play it.';

export const disclaimerText = 'This project includes proprietary assets from Hero Academy, which are the property of Robot Entertainment. These assets are used for educational and non-commercial purposes under the assumption of fair use for a fan project. This license applies only to the code in this repository and not to the assets. All rights to the proprietary assets remain with their respective owners.';

export const playText = `You can create a game by clicking on the icon of the faction you want to play as. Matchmaking happens automatically: if there is already a game looking for players, you will be paired immediately. If not, you will see your game under the "Looking for games" section.

Games in the game list are organized on sections based on their status. Here's the order in which they appear in the game list:

-Your turn: You should probably click on these and play your turn.

-Challenges received: Click on these games to select a faction and start playing against the player who challenged you. You can also decline by clicking the X button on the top-right corner of the game.

-Opponent's turn. Your opponent should probably click on those and play their turn.

-Searching for players: As mentioned earlier, these are open games created by you. When another player looks for a game they will be paired with you. If you don't want to search for a game anymore, you can click the X button on the top-right corner of the game to delete it.

-Challenges sent: These games are waiting for the player you challenged to pick a faction or decline the challenge. You can remove the challenge by, you guessed it, clicking on the X button on the top-right corner of the game.

-Finished: Here you will find your 5 more recent finished games. You can click on a game to see the final game state and challenge your opponent to a rematch.

Please note that one ore more of these categories may not be present in your game if you don't have any games that qualify. E.g., you won't see a "Challenges sent" category if you have not sent any challenges.

You can come back to the main menu by clicking on the "Home" button.`;

export const profileText = `Here you can update your email, password, profile pics and communication preferences. No changes are saved until you click on the "Save changes" button.

-Email preferences: The game sends an email when it's your turn to play, when a game ends and when you receive a challenge. If you don't wish to receive emails, leave the checkbox blank. Note: An email confirmation email was sent to you when you created the account. If you have not confirmed your email, you will not receive email notifications, even if the checkbox is ticked.

-Enable chat: Having this option checked allows people to message you in the in-game chat. Or it will, once I add an in-game chat to the game.

-Delete account: Clicking on this button will open a confirmation popup. Deleting your account is irreversible, I have no way to recover your data.`;

export const leaderboardText = `Shows a list of all players, sorted by number of victories. If two or more players have the same amount of wins, the player with the fewer played games appears above.

You can send a challenge to a player from the leaderboard by clicking the sword icon on the right hand side of the screen. You will be prompted to pick a faction before sending the challenge.`;

export const gameText = `If you are new to Hero Academy, here you will find resources to learn how to play. Fan Academy plays exactly the same than Hero Academy. And if it doesn't, please let me know.

The information below is taken from a guide written by Hamlet on his defunct site, iam.yellingontheinternet.com, thanks to the magic of the Internet Archive. I have edited some parts for clarification.`;

export const mechanicsText = `Basic:

    • 5 action points (AP) per turn (3 AP for the first player on their first turn to balance first player advantage).

    • 1 AP can be used to:
    	- deploy a unit to deploy square
    	- move a unit
    	- attack an enemy unit or crystal
    	- heal or revive a friendly unit
    	- use a unit special ability
    	- equip a unit with an upgrade
    	- use a one-time item
    	- return a unit or item from your hand back into the deck (the door icon) to draw a random one next turn

    • A unit that reaches 0 HP is knocked out, but can be revived by an ally. It vanishes from the board permanently if:
    	- any player moves a unit onto it (“stomps” it)
    	- destroys it with certain spells
    	- its owner takes a full turn without reviving it

    • A player loses upon having all of his crystals destroyed, or by having all of the units in his deck stomped or knocked out (the game will end even if he has an item left that can revive a KO'd unit).

    • Units are drawn in random order throughout the game, except that your starting hand always has at least 3 units.

Map features:

    • Crystals. There are two per faction, each one with 4500 hp. Destroy both of your opponent's crystals to win the game.

    • Deploy square. Enemy units cannot move onto it, even to stomp. An enemy unit adjacent to a deploy square can attack a corpse that's on the square (which destroys it), without moving onto it. A Necromancer or Inferno can also destroy a KO'd unit on a deploy square.

    • Attack square (red sword). A unit on the square has +100 attack power, applied before all %-based bonuses.

    • Defense square (blue shield). A unit on the square has +20% physical resist.

    • Magic Defense square (dark blue helm). A unit on the square has +20% magical resist.

    • Assault square (purple gem). While a friendly unit is standing on this square, all attacks against enemy crystals do an extra 300 damage. Multiple assault bonuses stack. The bonus is reduced accordingly if the crystal takes AoE or chain damage. The bonus damage has no type and is not affected by any resist.

    • Teleport square (light blue dot). A unit on the square can use 1 AP to teleport to the other teleport square, if it is open.

Advanced:

    • Range is counted orthogonally only, not diagonally (e.g. a unit one square diagonally from another is at range 2).

    • Each unit has an attack power, and a damage type (physical or magical). • Ordinary attacks hit for damage equal to the unit's attack power, but some multiply by certain percentage or add other bonuses. The attack power is what's shown in the unit's info window.

    • Each target also has a physical and magical resist, which reduce incoming damage of the appropriate type by a fixed percentage.

    • Ranged attacks (but not ranged friendly actions) require line of sight to the target. Enemy units and crystals block line of sight, but friendly ones do not. An attack to an immediately diagonal square can't be blocked.

    • A unit that can act on a corpse (healer reviving a friendly corpse, or Necromancer/Wraith destroying an enemy one) can't choose to move and stomp the corpse instead. Clicking on the corpse causes the unit to act on it. However, if the unit does not have line of sight to the enemy corpse, it will move and stomp instead.

    • Knockbacks only occur if the target square is open, otherwise the unit simply doesn't move. If a unit is KO'd by the knockback, it still moves. A unit can't be knocked onto an enemy start tile, unless it's also KO'd (in which case an enemy spawning there will stomp it).

    • A unit can wind up on an enemy deploy square if it's KO'd onto it and then revived, or if it's a Wraith that spawned from a corpse on that square. It will block the enemy from deploying units there so long as it remains.
    • A corpse on its own deploy square will be stomped automatically if a friendly unit deploys there.

    • Units cannot target themselves with heals or other buffs.`;

export const countilText = `Knight (3):
1000 HP
20% P resist
200 attack (P), range 1
Attack knocks target back one square.
Move 2

Archer (3):
800 HP
300 attack (P), range 3
50% damage in melee, 100% damage at range.
Move 2

Wizard (3):
800 HP
10% M resist
200 attack (M), range 2
Attack can hit up to 3 enemy units or crystals if they are adjacent. Main target takes 100% damage, first jump does 75%, second jump 56%.
Move 2

Cleric (3):
800 HP
200 attack (M), range 2
Heals for 300% attack, revives for 200% attack, range 2
Move 2

Ninja (1):
800 HP
200 attack (P), range 2.
200% damage in melee, 100% damage at range.
Can use 1 AP to swap places with any friendly unit.
Move 3`;

export const councilItemsText = `Upgrades:
-Runemetal (3): +50% attack
-Dragonscale (3): +20% physical resist, +10% HP
-Shining Helm (3): +20% magical resist, +10% HP

Consumables:
-Supercharge (2): Targets one friendly. Unit has 300% attack power for one attack/heal.

-Inferno (2): Targets a 3×3 area. KO'd enemies are destroyed, and other enemies take 350 M.

-Potion (2): Targets one friendly. Heals for 1000. In addition, can revive a KO'd unit for 100.

Faction passive: None`;

export const elvesText = `Void Monk (3):
800 HP
20% P resist, 20% M resist
200 attack (P), range 1
100% damage to target, splashes for 66% damage to any enemies adjacent (not diagonal) to target.
Move 3

Impaler (3):
800 HP
300 attack (P), range 2
If target is at range 2 in a straight line, pulled one square towards Impaler.
Move 2

Necromancer (3):
800 HP
200 attack (M), range 3
Can use 1 AP to turn any KO'd unit into a Phantom at range 3, including on an enemy start tile.
Move 2

Priestess (3):
800 HP
200 attack (M), range 2
Heals for 200% attack, revives for 50% attack, range 3
An unit damaged by the Priestess has 50% attack power for its next attack/heal (doesn't affect Barbed Crystals).
Move 2

Wraith (1):
800 HP
250 attack (M), range 1.
Can use 1 AP to consume a KO'd unit at range 1. Increases current and max HP by 100 and attack power by 50 (bonus can only be obtained 3 times per game although you can continue to consume).
Can deploy onto any KO'd unit (stomping it) instead of a deploy tile, unless the KO'd unit is on an enemy deploy tile.
Move 3

Phantom:
100 HP
100 attack (M), range 1
Does not leave a corpse when killed.
If spawned on an enemy deploy tile, will be automatically destroyed if an enemy deploys there.
Move 3`;

export const elvesItemsText = `Upgrades:
-Runemetal (3): +50% attack
-Soulstone (3): Passive life leech increased to 66%, +10% HP (bonus applied to base -HP only)
-Shining Helm (3): +20% magical resist, +10% HP

Consumables:
-Supercharge (2): Targets one friendly. Unit has 300% attack power for one attack/heal.

-Soul Harvest (2): Targets a 3×3 area. Enemies take 100 M. All friendly units in play gain D/(N+3) current and max HP (reviving KO'd units in the process), where D is the total damage dealt to non-Crystal units by the spell, and N is the number of friendly units in play.

-Mana Vial (2): Targets one friendly. Heals for 1000 and increases max HP by 50.

Faction passive:
Units are healed for 33% of any damage they deal to enemy units (not crystals).`;

export const dwarvesText = `Paladin (3):
900 HP
10% P, 10% M resist
200 attack (P), range 1
Heals for 200% attack, revives for 50% attack, range 2
Self-heals for 50% of any healing done, not including overheal.
All friendly units and crystals in AoE range of Paladin gain 5% attack power, physical resist, and magical resist. Stacks from multiple Paladins.
Move 2

Grenadier (3):
800 HP
200 attack (M), range 3. Ignores LOS.
At range, 100% to target, AoE for 50%.
In melee, 50% damage, no AoE.
Move 2

Gunner (3):
800 HP
300 attack (P), range 2.
In melee, 100% damage, no splash.
At range, cone attack deals 66% damage to main target and up to two nearby targets.
Move 2

Engineer (3):
800 HP
200 attack (P), range 1.
Can shield a friendly target in range 3, canceling next damaging attack against that unit/crystal and any associated debuffs. Expires when it prevents any damage, when Engineer is knocked down, or when Engineer shields a different target.
Gets twice the increased benefit from special tiles as other Dwarves: 140 attack, 28% resist, 420 assault damage and +4 to movement when standing on speed tile.
Move 2

Annihilator (1):
650 HP
300 attack (M), range 3. 100% to target, AoE for 20%.
Target unit/crystal gets -50% P resist on the next physical attack that hits it.
AoE targets are knocked one square directly away from main target.
Move 2`;

export const dwarvesItemsText = `Upgrades:
-Runemetal (3): +50% attack
-Dragonscale (3): +20% physical resist, +10% HP
-Shining Helm (3): +20% magical resist, +10% HP

Consumables:
-Supercharge (2): Targets one friendly. Unit has 300% attack power for one attack/heal.

-Dwarven Brew (2): Targets one friendly. Heals for 1000 and adds 50% M and P resist lasting for one hit. Stacks with other resist bonuses. If target is also shielded, buff remains when shield is broken.

-Pulverizer (2): Targets one enemy unit or crystal. Target takes 600 P. If target is a crystal, AoE for 33%, including any added damage from Assault tiles (the 200 P AoE is reduced by the target's physical resist, but added splash from Assault tile damage is not). Splash occurs even if crystal was shielded. If target is a unit, its Armour or  Soulstone (but not Helm) is destroyed.

Faction Passive:
+20% benefit to special tiles. Attack gives +120, Defense/Magic Defense gives +24%, Assault gives +360. Speed gives +3 move.`;