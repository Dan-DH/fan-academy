<script lang="ts">
  import MainBanner from '$lib/components/MainBanner.svelte';
  import HeroTitle from '$lib/components/HeroTitle.svelte';
  import SecondaryTitle from '$lib/components/SecondaryTitle.svelte';
  import InfoCard from '$lib/components/InfoCard.svelte';
  import {
    aboutData,
    gameStatusList,
    apActionsList,
    specialTilesList,
    factionsList,
    advancedTactics
  } from '$lib/data/info';
  import type { FactionGuide } from '$lib/types/GuideType';

  import {
    SectionHeader,
    APActionCard,
    SpecialTileCard,
    TacticCard,
    FactionSection,
    GuideNav,
    RuleCallout,
    LegalDisclaimer,
    MatchmakingCard,
    EconomyBanner,
    FactionFilter,
    GuideCta
  } from './components';
  import type { GuideTabId } from './components/GuideNav.svelte';

  let selectedFactionId = $state<string>('all');
  let searchQuery = $state<string>('');
  let activeTab = $state<GuideTabId>('all');
  const isSearching = $derived(searchQuery.trim().length > 0);

  const filteredFactions = $derived(() => {
    let list: FactionGuide[] = factionsList;

    if (selectedFactionId !== 'all') {
      list = list.filter((f) => f.id === selectedFactionId);
    }

    if (!searchQuery.trim()) {
      return list;
    }

    const query = searchQuery.toLowerCase().trim();

    return list
      .map((faction) => {
        const matchingUnits = faction.units.filter(
          (u) =>
            u.name.toLowerCase().includes(query) ||
            u.role.toLowerCase().includes(query) ||
            u.special.toLowerCase().includes(query) ||
            (u.tacticalTip && u.tacticalTip.toLowerCase().includes(query)) ||
            u.attackType.toLowerCase().includes(query)
        );

        const matchingItems = faction.items.filter(
          (i) =>
            i.name.toLowerCase().includes(query) ||
            i.effect.toLowerCase().includes(query) ||
            (i.tacticalTip && i.tacticalTip.toLowerCase().includes(query)) ||
            i.type.toLowerCase().includes(query)
        );

        const factionMatches =
          faction.name.toLowerCase().includes(query) ||
          faction.description.toLowerCase().includes(query) ||
          faction.passiveName.toLowerCase().includes(query) ||
          faction.passiveDescription.toLowerCase().includes(query);

        if (factionMatches || matchingUnits.length > 0 || matchingItems.length > 0) {
          return {
            ...faction,
            units: matchingUnits.length > 0 || !factionMatches ? matchingUnits : faction.units,
            items: matchingItems.length > 0 || !factionMatches ? matchingItems : faction.items
          };
        }

        return null;
      })
      .filter((f): f is FactionGuide => f !== null);
  });

  const filteredTiles = $derived(() => {
    if (!searchQuery.trim()) return specialTilesList;
    const query = searchQuery.toLowerCase().trim();
    return specialTilesList.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.effect.toLowerCase().includes(query) ||
        t.details.toLowerCase().includes(query) ||
        t.tacticalTip.toLowerCase().includes(query)
    );
  });

  const filteredTactics = $derived(() => {
    if (!searchQuery.trim()) return advancedTactics;
    const query = searchQuery.toLowerCase().trim();
    return advancedTactics.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.summary.toLowerCase().includes(query) ||
        t.details.toLowerCase().includes(query)
    );
  });

</script>

<svelte:head>
  <title>Tactical Guide | Fan Academy</title>
  <meta
    name="description"
    content="Comprehensive tactical guide for Fan Academy: learn turn mechanics, 5 AP economy, map features, rules, and complete faction codex."
  />
</svelte:head>

<MainBanner>

  <HeroTitle>
    TACTICAL FIELD GUIDE
  </HeroTitle>

  <SecondaryTitle>
    Master the 5 Action Point economy, conquer strategic grid tiles, protect your power
    crystals, and command the rosters of <strong class="text-amber-300">The Council</strong>,
    <strong class="text-purple-300">Dark Elves</strong>, and
    <strong class="text-orange-300">Dwarves</strong>.
  </SecondaryTitle>

  <!-- Search Bar -->
  <div class="w-full max-w-md mt-2 relative">
    <input
      type="search"
      bind:value={searchQuery}
      placeholder="Search units, abilities, tiles, or items..."
      class="input input-bordered input-warning w-full bg-stone-950/80 text-white placeholder-stone-400 pl-11 pr-4 py-3 rounded-xl border border-amber-500/50 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
    />
    <span
      class="icon-[material-symbols--search] absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 text-xl pointer-events-none"
    ></span>
    {#if searchQuery}
      <button
        onclick={() => (searchQuery = '')}
        class="btn btn-ghost btn-xs btn-circle absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
        aria-label="Clear search"
      >
        ✕
      </button>
    {/if}
  </div>
</MainBanner>

<!-- Section Tabs Navigation -->
<GuideNav {activeTab} onTabChange={(tab) => (activeTab = tab)} />

<!-- SECTION 1: ABOUT & REVIVAL -->
{#if isSearching || activeTab === 'all' || activeTab === 'about'}
  <section id="about" class="scroll-mt-24 flex flex-col gap-6">
    <SectionHeader
      icon="icon-[material-symbols--menu-book-outline]"
      title="About Fan Academy"
      subtitle="Origins, revival vision, and legal disclaimer"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Fan Academy Card -->
      <InfoCard
        title={aboutData.fanAcademy.title}
        icon="icon-[material-symbols--sports-esports-outline]"
        footer="Rebuilt from scratch with modern web standards"
      >
        {#each aboutData.fanAcademy.content as paragraph}
          <p class="text-stone-300 text-sm sm:text-base leading-relaxed">{paragraph}</p>
        {/each}
      </InfoCard>

      <!-- Hero Academy Legacy Card -->
      <InfoCard
        title={aboutData.heroAcademy.title}
        icon="icon-[material-symbols--history-edu]"
        footer="Originally created by Robot Entertainment"
      >
        {#each aboutData.heroAcademy.content as paragraph}
          <p class="text-stone-300 text-sm sm:text-base leading-relaxed">{paragraph}</p>
        {/each}
      </InfoCard>
    </div>

    <!-- Legal Disclaimer Alert -->
    <LegalDisclaimer disclaimer={aboutData.disclaimer} citation={aboutData.citation} />
  </section>
{/if}

<!-- SECTION 2: LOBBY & MENU GUIDE -->
{#if isSearching || activeTab === 'all' || activeTab === 'lobby'}
  <section id="lobby" class="scroll-mt-24 flex flex-col gap-6">
    <SectionHeader
      icon="icon-[material-symbols--dashboard-outline]"
      title="Lobby, Matchmaking & Account"
      subtitle="Managing your matches, profile preferences, and leaderboard challenges"
    />

    <!-- Matchmaking Card -->
    <MatchmakingCard statuses={gameStatusList} />

    <!-- Account & Leaderboard Subsections -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Profile Card -->
      <InfoCard
        title="Profile & Preferences"
        icon="icon-[material-symbols--manage-accounts-outline]"
        footer="Remember to click 'Save changes' after modifying settings"
      >
        <ul class="space-y-3.5 text-sm text-stone-300">
          <li class="flex items-start gap-2.5">
            <span class="icon-[material-symbols--mail-outline] text-amber-400 text-lg shrink-0 mt-0.5"></span>
            <div>
              <strong class="text-white">Email Notifications:</strong> Get alerted when it’s your turn,
              when a game ends, or when you receive a challenge. Requires a confirmed email address.
            </div>
          </li>
          <li class="flex items-start gap-2.5">
            <span class="icon-[akar-icons--chat-question] text-amber-400 text-lg shrink-0 mt-0.5"></span>
            <div>
              <strong class="text-white">Enable Chat:</strong> Opt in to receive messages from opponents
              via the integrated battle chat.
            </div>
          </li>
          <li class="flex items-start gap-2.5">
            <span class="icon-[material-symbols--delete-forever-outline] text-rose-400 text-lg shrink-0 mt-0.5"></span>
            <div>
              <strong class="text-rose-300">Account Deletion:</strong> Clicking "Delete account" opens a
              confirmation dialog. Deleting is completely permanent and cannot be undone.
            </div>
          </li>
        </ul>
      </InfoCard>

      <!-- Leaderboard Card -->
      <InfoCard
        title="Leaderboards & Direct Duels"
        icon="icon-[akar-icons--trophy]"
        footer="Rankings update instantly following every recorded match"
      >
        <div class="space-y-4 text-sm text-stone-300">
          <p class="leading-relaxed">
            The leaderboard ranks every player by their total number of victories. If two or more players
            are tied on wins, the player with fewer total matches played is ranked higher.
          </p>
          <RuleCallout icon="icon-[akar-icons--double-sword]">
            <p class="text-xs text-stone-300 leading-relaxed">
              <strong class="text-white">Challenge Anyone:</strong> Click the sword icon next to any
              player’s row on the leaderboard to send a direct challenge. You will pick your faction
              before issuing the duel.
            </p>
          </RuleCallout>
        </div>
      </InfoCard>
    </div>
  </section>
{/if}

<!-- SECTION 3: CORE GAMEPLAY & 5 AP ENGINE -->
{#if isSearching || activeTab === 'all' || activeTab === 'mechanics'}
  <section id="mechanics" class="scroll-mt-24 flex flex-col gap-6">
    <SectionHeader
      icon="icon-[material-symbols--auto-awesome-outline]"
      title="Core Gameplay & 5 Action Points (AP)"
      subtitle="Action point economy, knockout rules, and victory conditions"
    />

    <!-- AP Overview Banner -->
    <EconomyBanner />

    <!-- 8 AP Actions Grid -->
    <div>
      <h3 class="text-lg font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <span class="icon-[material-symbols--checklist] text-xl"></span>
        What 1 AP Can Be Used For:
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {#each apActionsList as action (action.action)}
          <APActionCard {action} />
        {/each}
      </div>
    </div>

    <!-- Knockout, Stomp & Win Conditions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Knockout & Stomp Rules -->
      <InfoCard
        title='Knockouts & The "Stomp" Rule'
        icon="icon-[material-symbols--skull-outline]"
        footer="Stomped units cannot be revived by any means"
        class="border-rose-500/30"
      >
        <p class="text-stone-300 text-sm leading-relaxed">
          When a hero’s HP reaches 0, they are <strong>Knocked Out (KO’d)</strong> and leave a corpse on
          the grid. An ally can revive them with a healing spell or potion.
        </p>

        <RuleCallout
          icon="icon-[material-symbols--dangerous-outline]"
          title="A KO'd unit is permanently eliminated if:"
          variant="danger"
        >
          <ul class="text-xs text-stone-300 space-y-1.5 list-disc list-inside mt-1">
            <li>Any player moves a unit onto it (called <strong>"Stomping"</strong>).</li>
            <li>Destroyed with spells like Inferno, Necromancer harvest, or Wraith devour.</li>
            <li>Its owner completes an entire full turn without reviving it!</li>
          </ul>
        </RuleCallout>
      </InfoCard>

      <!-- Win / Loss Conditions -->
      <InfoCard
        title="Victory & Defeat Conditions"
        icon="icon-[akar-icons--trophy]"
        footer="Match ends instantly upon either condition being triggered"
      >
        <div class="space-y-3.5 text-sm text-stone-300">
          <RuleCallout
            icon="icon-[material-symbols--diamond-outline]"
            title="1. Destroy Both Enemy Crystals"
            description="Each faction defends two Power Crystals with 4,500 HP each. Smashing both secures an immediate win."
          />

          <RuleCallout
            icon="icon-[material-symbols--group-off-outline]"
            title="2. Total Unit Wipeout"
            description="A player loses if all heroes in their deck are stomped or knocked out (even if an unused revive item remains in hand)."
          />

          <div class="text-xs text-stone-400 flex items-center gap-2 pt-1">
            <span class="icon-[material-symbols--style-outline] text-amber-400 text-base shrink-0"></span>
            <span>Cards are drawn in random order, with your starting hand guaranteed to contain at least 3 units.</span>
          </div>
        </div>
      </InfoCard>
    </div>
  </section>
{/if}

<!-- SECTION 4: BATTLEFIELD & MAP TILES -->
{#if isSearching || activeTab === 'all' || activeTab === 'tiles'}
  <section id="tiles" class="scroll-mt-24 flex flex-col gap-6">
    <SectionHeader
      icon="icon-[material-symbols--grid-view-outline]"
      title="Map Features & Special Tiles"
      subtitle="Strategic power tiles that grant decisive battlefield advantages"
    />

    <!-- Special Tiles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredTiles() as tile (tile.id)}
        <SpecialTileCard {tile} />
      {/each}
    </div>
  </section>
{/if}

<!-- SECTION 5: ADVANCED COMBAT TACTICS -->
{#if isSearching || activeTab === 'all' || activeTab === 'tactics'}
  <section id="tactics" class="scroll-mt-24 flex flex-col gap-6">
    <SectionHeader
      icon="icon-[akar-icons--double-sword]"
      title="Advanced Combat Rules"
      subtitle="Line of sight, spatial geometry, priority clicks, and displacement physics"
    />

    <!-- Tactics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      {#each filteredTactics() as tactic (tactic.title)}
        <TacticCard {tactic} />
      {/each}
    </div>
  </section>
{/if}

<!-- SECTION 6: FACTION CODEX -->
{#if isSearching || activeTab === 'all' || activeTab === 'factions'}
  <section id="factions" class="scroll-mt-24 flex flex-col gap-8">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-amber-500/30 pb-4 gap-4">
      <div class="flex items-center gap-3">
        <span class="icon-[material-symbols--shield] text-3xl text-amber-400"></span>
        <div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-amber-300">Faction Codex</h2>
          <p class="text-stone-400 text-sm">Explore hero rosters, unit statistics, upgrades, and faction passives</p>
        </div>
      </div>

      <!-- Faction Selector Tabs -->
      <FactionFilter
        {selectedFactionId}
        onSelect={(id) => (selectedFactionId = id)}
      />
    </div>

    <!-- Factions Display -->
    {#if filteredFactions().length === 0}
      <div class="card bg-stone-900/80 border border-stone-800 rounded-2xl p-10 text-center space-y-3">
        <span class="icon-[material-symbols--search-off] text-5xl text-stone-500 mx-auto"></span>
        <h3 class="text-xl font-bold text-white">No matching heroes, abilities, or items found</h3>
        <p class="text-stone-400 text-sm">Try clearing your search query or choosing another faction tab.</p>
        <button onclick={() => (searchQuery = '')} class="btn btn-warning btn-sm mx-auto">
          Clear Search
        </button>
      </div>
    {:else}
      {#each filteredFactions() as faction (faction.id)}
        <FactionSection {faction} />
      {/each}
    {/if}
  </section>
{/if}

<!-- CTA Banner: Battle Now -->
<GuideCta />

<!-- Back to Top Floating Button -->
<div class="fixed bottom-6 right-6 z-40">
  <button
    onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    class="btn btn-circle btn-warning shadow-2xl border-2 border-stone-900 hover:scale-110 active:scale-95 transition-transform"
    aria-label="Back to top of guide"
    title="Back to top"
  >
    <span class="icon-[material-symbols--arrow-upward] text-2xl text-stone-950 font-black"></span>
  </button>
</div>
