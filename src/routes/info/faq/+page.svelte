<script lang="ts">
  import MainBanner from '$lib/components/MainBanner.svelte';
  import HeroTitle from '$lib/components/HeroTitle.svelte';
  import SecondaryTitle from '$lib/components/SecondaryTitle.svelte';
  import { faqItems } from '$lib/data/placeholder';
  import type { FaqCategory } from '$lib/types/InfoType';
  import {
    FaqAccordion,
    FaqCta,
    FaqEmptyState,
    FaqNav
  } from './components';

  let searchQuery = $state('');
  let activeCategory = $state<FaqCategory>('general');

  const filteredFaqs = $derived.by(() => {
    const q = searchQuery.toLowerCase().trim();

    if (!q) {
      return faqItems.filter((faq) => faq.category === activeCategory);
    }

    return faqItems.filter((faq) => {
      const matchQ = faq.question.toLowerCase().includes(q);
      const matchA = faq.answer.toLowerCase().includes(q);

      return matchQ || matchA;
    });
  });

  function resetFilters() {
    searchQuery = '';
    activeCategory = 'general';
  }
</script>

<svelte:head>
  <title>Frequently Asked Questions | Fan Academy</title>
  <meta
    name="description"
    content="Find answers to frequently asked questions about Fan Academy matchmaking, rules, assets, accounts, and cross-platform play."
  />
</svelte:head>

<MainBanner>
  <HeroTitle>FREQUENTLY ASKED QUESTIONS</HeroTitle>
  <SecondaryTitle>
    Everything you need to know about game rules, 5 AP turn mechanics, factions, combat strategies, and matchmaking.
  </SecondaryTitle>

  <!-- Search & Navigation Filter Section inside Main Banner (styled like GuideNav) -->
  <FaqNav
    {searchQuery}
    {activeCategory}
    filteredCount={filteredFaqs.length}
    onSearchChange={(q) => (searchQuery = q)}
    onCategoryChange={(cat) => {
      activeCategory = cat;
      if (searchQuery) searchQuery = '';
    }}
  />
</MainBanner>

<div class="max-w-4xl mx-auto w-full px-4 sm:px-6 pb-24 space-y-8">
  <!-- DaisyUI Accordion Component -->
  {#if filteredFaqs.length > 0}
    <FaqAccordion faqs={filteredFaqs} />
  {:else}
    <FaqEmptyState {searchQuery} onReset={resetFilters} />
  {/if}

  <!-- Still Have Questions CTA Banner -->
  <FaqCta />
</div>
