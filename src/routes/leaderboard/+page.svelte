<script lang="ts">
  import MainBanner from '$lib/components/MainBanner.svelte';
  import HeroTitle from '$lib/components/HeroTitle.svelte';
  import SecondaryTitle from '$lib/components/SecondaryTitle.svelte';
  import { allPlayers } from '$lib/data/placeholder';
  import PlayerList from './components/PlayerList.svelte';
  import LeaderboardFilters from './components/LeaderboardFilters.svelte';

  let searchQuery = $state('');
  let selectedTier = $state('all');
  let sortBy = $state<'wins' | 'elo'>('wins');

  const sortedPlayers = $derived.by(() => {
    return [...allPlayers].sort((a, b) => {
      if (sortBy === 'wins') {
        if (b.wins !== a.wins) return b.wins - a.wins;
        return a.total_matches - b.total_matches;
      } else {
        return b.elo - a.elo;
      }
    });
  });

  const filteredPlayers = $derived.by(() => {
    let list = sortedPlayers;

    if (selectedTier !== 'all') {
      list = list.filter((p) => p.tier.toLowerCase() === selectedTier.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => p.username.toLowerCase().includes(q));
    }

    return list;
  });

  function resetFilters() {
    searchQuery = '';
    selectedTier = 'all';
    sortBy = 'wins';
  }
</script>

<svelte:head>
  <title>Leaderboard | Fan Academy</title>
  <meta
    name="description"
    content="View top player rankings, win statistics, and challenge rivals to turn-based tactical duels on the Fan Academy leaderboard."
  />
</svelte:head>

<MainBanner>
  <HeroTitle>LEADERBOARD</HeroTitle>

  <SecondaryTitle>
    Track player rankings, inspect combat records, and challenge opponents to turn-based tactical duels.
  </SecondaryTitle>

  <!-- Search & Filter Sort Section Inside Main Banner -->
  <LeaderboardFilters
    {searchQuery}
    {selectedTier}
    {sortBy}
    onSearchChange={(q) => (searchQuery = q)}
    onTierChange={(t) => (selectedTier = t)}
    onSortChange={(s) => (sortBy = s)}
  />
</MainBanner>

<div class="max-w-6xl mx-auto w-full pb-20">
  <PlayerList
    players={filteredPlayers}
    {searchQuery}
    {selectedTier}
    onResetFilters={resetFilters}
  />
</div>
