<script lang="ts">
  import MainBanner from '$lib/components/MainBanner.svelte';
  import HeroTitle from '$lib/components/HeroTitle.svelte';
  import SecondaryTitle from '$lib/components/SecondaryTitle.svelte';
  import PlayerList from './components/PlayerList.svelte';
</script>

<svelte:head>
  <title>Leaderboard | Fan Academy</title>
  <meta
    name="description"
    content="View top player rankings, win statistics, and challenge rivals to turn-based tactical duels on the Fan Academy leaderboard."
  />
</svelte:head>

<MainBanner>
  <HeroTitle>
    LEADERBOARD
  </HeroTitle>

  <SecondaryTitle>
    Track player rankings, inspect combat records, and challenge opponents to turn-based tactical duels.
  </SecondaryTitle>
</MainBanner>

<div class="max-w-5xl mx-auto w-full px-3 sm:px-6 pb-16">
  <PlayerList />
</div>
