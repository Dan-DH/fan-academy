<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import MainBanner from '$lib/components/MainBanner.svelte';
  import HeroTitle from '$lib/components/HeroTitle.svelte';
  import SecondaryTitle from '$lib/components/SecondaryTitle.svelte';
  import { auth } from '$lib/store/auth.svelte';
  import { AuthCard } from './components';

  $effect(() => {
    if (browser && auth.isAuthenticated) {
      goto('/dashboard', { replaceState: true });
    }
  });

  let activeTab = $state<'login' | 'register'>('login');

  function updateTabFromHash() {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#register' || hash === '#signup') {
        activeTab = 'register';
      } else if (hash === '#login') {
        activeTab = 'login';
      }
    }
  }

  $effect(() => {
    const hash = page.url.hash.toLowerCase();
    if (hash === '#register' || hash === '#signup') {
      activeTab = 'register';
    } else if (hash === '#login') {
      activeTab = 'login';
    } else {
      updateTabFromHash();
    }
  });

  function handleTabChange(tab: 'login' | 'register') {
    activeTab = tab;
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
    }
  }
</script>

<svelte:window onhashchange={updateTabFromHash} />

<svelte:head>
  <title>Commander Authentication & Enlistment | Fan Academy</title>
  <meta
    name="description"
    content="Log in or register for Fan Academy to play live tactical turn-based battles, track your faction ELO rating, and study match replays."
  />
</svelte:head>

{#if !auth.isAuthenticated}
  <MainBanner>
    <HeroTitle>COMMANDER ACCESS</HeroTitle>
    <SecondaryTitle>
      Sign in to deploy squads to the battlefield, track your faction ratings, analyze turn replays, and climb the tactical ranks.
    </SecondaryTitle>

    <AuthCard {activeTab} onTabChange={handleTabChange} />
  </MainBanner>
{/if}

