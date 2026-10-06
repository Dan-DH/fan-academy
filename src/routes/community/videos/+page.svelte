<script lang="ts">
  import MainBanner from '$lib/components/MainBanner.svelte';
  import HeroTitle from '$lib/components/HeroTitle.svelte';
  import SecondaryTitle from '$lib/components/SecondaryTitle.svelte';
  import {
    heroAcademyVideos,
    type HeroAcademyVideo,
    type VideoCategory
  } from '$lib/data/placeholder';
  import {
    VideoCard,
    VideoFilters,
    VideoModal,
    VideoEmptyState
  } from './components';

  let searchQuery = $state('');
  let selectedCategory = $state<'all' | VideoCategory>('all');
  let activeVideo = $state<HeroAcademyVideo | null>(null);

  const filteredVideos = $derived(() => {
    const q = searchQuery.toLowerCase().trim();

    return heroAcademyVideos.filter((video) => {
      if (selectedCategory !== 'all' && video.category !== selectedCategory) {
        return false;
      }

      if (!q) {
        return true;
      }

      const matchTitle = video.title.toLowerCase().includes(q);
      const matchChannel = video.channelTitle.toLowerCase().includes(q);
      const matchDesc = video.description.toLowerCase().includes(q);
      const matchTactics = video.tacticsCovered.some((t) => t.toLowerCase().includes(q));
      const matchSummary = video.tacticsSummary.toLowerCase().includes(q);

      return matchTitle || matchChannel || matchDesc || matchTactics || matchSummary;
    });
  });

  function openVideoModal(video: HeroAcademyVideo) {
    activeVideo = video;
  }

  function closeVideoModal() {
    activeVideo = null;
  }

  function resetFilters() {
    searchQuery = '';
    selectedCategory = 'all';
  }
</script>

<svelte:head>
  <title>Community Videos & Tactics | Fan Academy</title>
  <meta
    name="description"
    content="Watch curated Hero Academy gameplay videos, tactical challenge walkthroughs, faction guides, and match commentary."
  />
</svelte:head>

<MainBanner>
  <HeroTitle>VIDEOS & TACTICS</HeroTitle>
  <SecondaryTitle>
    Explore curated Hero Academy gameplay videos, puzzle walkthroughs, faction strategy breakdowns, and competitive commentary.
  </SecondaryTitle>

  <!-- Filter & Search Controls inside Main Banner -->
  <VideoFilters
    {searchQuery}
    {selectedCategory}
    onSearchChange={(q) => (searchQuery = q)}
    onCategoryChange={(c) => (selectedCategory = c)}
  />
</MainBanner>

<div class="max-w-6xl mx-auto w-full pb-20 space-y-8">
  <!-- Video Grid or Empty State -->
  {#if filteredVideos().length > 0}
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredVideos() as video (video.id)}
        <VideoCard {video} onSelect={openVideoModal} />
      {/each}
    </section>
  {:else}
    <VideoEmptyState onReset={resetFilters} />
  {/if}

  <!-- Video Modal Component -->
  {#if activeVideo}
    <VideoModal video={activeVideo} onClose={closeVideoModal} />
  {/if}
</div>
