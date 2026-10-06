<script lang="ts">
  import { page } from '$app/state';
  import MainBanner from '$lib/components/MainBanner.svelte';
  import HeroTitle from '$lib/components/HeroTitle.svelte';
  import SecondaryTitle from '$lib/components/SecondaryTitle.svelte';
  import { auth } from '$lib/store/auth.svelte';
  import { AuthCard } from './components';

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

<MainBanner>
  <HeroTitle>COMMANDER ACCESS</HeroTitle>
  <SecondaryTitle>
    Sign in to deploy squads to the battlefield, track your faction ratings, analyze turn replays, and climb the tactical ranks.
  </SecondaryTitle>

  {#if auth.isAuthenticated}
    <!-- Active Commander Session inside Main Banner -->
    <div
      class="w-full max-w-lg mx-auto p-6 sm:p-8 rounded-2xl bg-stone-950/85 backdrop-blur-md border border-emerald-500/40 shadow-2xl text-center space-y-4"
    >
      <div
        class="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center text-3xl"
      >
        <span class="icon-[material-symbols--shield]"></span>
      </div>

      <div class="space-y-1">
        <h3 class="text-lg font-bold text-white">Commander Authenticated</h3>
        <p class="text-xs text-stone-300">
          You are currently logged into Fan Academy headquarters.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <a
          href="/profile"
          class="py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
        >
          <span class="icon-[material-symbols--person-outline] text-base"></span>
          <span>View Profile</span>
        </a>

        <button
          type="button"
          onclick={() => auth.logout('/auth#login')}
          class="py-3 px-5 rounded-xl bg-stone-900 border border-stone-800 hover:border-rose-500/50 text-stone-300 hover:text-rose-300 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span class="icon-[material-symbols--logout] text-base"></span>
          <span>Log Out</span>
        </button>
      </div>
    </div>
  {:else}
    <!-- Complete Tabview (Tabs & Forms) inside Main Banner -->
    <AuthCard {activeTab} onTabChange={handleTabChange} />
  {/if}
</MainBanner>
