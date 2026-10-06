<script lang="ts">
  import MainBanner from '$lib/components/MainBanner.svelte';
  import HeroTitle from '$lib/components/HeroTitle.svelte';
  import SecondaryTitle from '$lib/components/SecondaryTitle.svelte';
  import {
    DiscordWidget,
    DiscordChannels,
    DiscordGuidelines,
    DiscordBannerActions
  } from './components';

  const inviteUrl = 'https://discord.gg/yp45DkUeX';
  const serverId = '1389533142892675165';
</script>

<svelte:head>
  <title>Community Discord | Fan Academy</title>
  <meta
    name="description"
    content="Join the official Fan Academy Discord server to find opponents, participate in tournaments, discuss strategy, and chat with developers."
  />
</svelte:head>

<MainBanner>
  <HeroTitle>COMMUNITY DISCORD</HeroTitle>
  <SecondaryTitle>
    Join our official Discord guild to connect with tacticians, arrange matches, enter tournaments, and shape the game's balance.
  </SecondaryTitle>

  <DiscordBannerActions {inviteUrl} />
</MainBanner>

<div class="max-w-6xl mx-auto w-full pb-20 space-y-8">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    <!-- Left Column: Community Channels & Server Rules -->
    <section class="lg:col-span-7 space-y-8" aria-label="Community Information">
      <DiscordChannels />
      <DiscordGuidelines />
    </section>

    <!-- Right Column: Embedded Discord Widget -->
    <aside class="lg:col-span-5 lg:sticky lg:top-24 space-y-6" aria-label="Discord Server Widget">
      <DiscordWidget {serverId} {inviteUrl} />
    </aside>
  </div>
</div>
