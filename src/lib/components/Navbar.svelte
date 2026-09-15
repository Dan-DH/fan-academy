<script lang="ts">
  import { onMount } from 'svelte';

  export interface UserProfile {
    username: string;
    avatar?: string;
    level?: number;
  }

  interface Props {
    gameTitle?: string;
    serverOnline?: boolean;
    onlinePlayersCount?: number;
    currentUser?: UserProfile | null;
    activeNav?: string;
    onNavClick?: (navItem: string) => void;
    onLoginClick?: () => void;
    onRegisterClick?: () => void;
    onPlayClick?: () => void;
    onLogoutClick?: () => void;
  }

  let {
    gameTitle = 'FAN ACADEMY',
    serverOnline = true,
    onlinePlayersCount = 1420,
    currentUser = null,
    activeNav = 'home',
    onNavClick,
    onLoginClick,
    onRegisterClick,
    onPlayClick,
    onLogoutClick
  }: Props = $props();

  // Local state
  let currentTheme = $state('fantasy');
  let authModal: HTMLDialogElement | null = $state(null);
  let howToPlayModal: HTMLDialogElement | null = $state(null);
  let faqModal: HTMLDialogElement | null = $state(null);

  // Auth modal internal tab: 'login' | 'register'
  let authTab = $state<'login' | 'register'>('login');

  // Form inputs
  let loginUsername = $state('');
  let loginPassword = $state('');
  let regEmail = $state('');
  let regUsername = $state('');
  let regPassword = $state('');
  let regFaction = $state('council');

  const availableThemes = [
    { id: 'fantasy', label: 'Fantasy (Default)' },
    { id: 'dark', label: 'Dark Realm' },
    { id: 'night', label: 'Night Void' },
    { id: 'cyberpunk', label: 'Cyberpunk' },
    { id: 'synthwave', label: 'Synthwave' },
    { id: 'dracula', label: 'Dracula' },
    { id: 'forest', label: 'Elven Forest' },
    { id: 'retro', label: 'Retro' },
    { id: 'dim', label: 'Dim Dungeon' },
    { id: 'luxury', label: 'Luxury Gold' }
  ];

  function handleNav(item: string) {
    if (item === 'how-to-play') {
      howToPlayModal?.showModal();
    } else if (item === 'faq') {
      faqModal?.showModal();
    }
    if (onNavClick) {
      onNavClick(item);
    }
  }

  function openAuth(mode: 'login' | 'register') {
    authTab = mode;
    authModal?.showModal();
    if (mode === 'login' && onLoginClick) onLoginClick();
    if (mode === 'register' && onRegisterClick) onRegisterClick();
  }

  function closeModals() {
    authModal?.close();
    howToPlayModal?.close();
    faqModal?.close();
  }

  function setTheme(theme: string) {
    currentTheme = theme;
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      try {
        localStorage.setItem('fan_academy_theme', theme);
      } catch {
        // ignore
      }
    }
  }

  function handleLoginSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (onLoginClick) onLoginClick();
    authModal?.close();
  }

  function handleRegisterSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (onRegisterClick) onRegisterClick();
    authModal?.close();
  }

  onMount(() => {
    try {
      const saved = localStorage.getItem('fan_academy_theme');
      if (saved) {
        setTheme(saved);
      } else {
        setTheme('fantasy');
      }
    } catch {
      setTheme('fantasy');
    }
  });
</script>

<!-- PORTAL NAVBAR -->
<header class="sticky top-0 z-40 w-full select-none border-b border-base-300/80 bg-base-100/90 backdrop-blur-md transition-colors duration-200">
  <div class="navbar mx-auto max-w-7xl px-3 sm:px-6">
    <!-- NAVBAR START: Mobile Hamburger + Logo / Brand -->
    <div class="navbar-start flex items-center gap-2 lg:gap-4">
      <!-- Mobile Drawer Hamburger -->
      <div class="dropdown lg:hidden">
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost btn-square btn-sm"
          aria-label="Open navigation menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        <ul
          tabindex="0"
          role="menu"
          class="menu menu-sm dropdown-content mt-3 w-64 rounded-2xl border border-base-300 bg-base-100/95 p-3 shadow-2xl backdrop-blur-xl z-50 gap-1 font-medium text-sm"
        >
          <li class="menu-title px-2 py-1 text-xs uppercase tracking-wider opacity-60">Explore Game</li>
          <li>
            <button
              class={activeNav === 'home' ? 'active font-bold text-primary' : ''}
              onclick={() => handleNav('home')}
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </button>
          </li>
          <li>
            <button
              class={activeNav === 'how-to-play' ? 'active font-bold text-primary' : ''}
              onclick={() => handleNav('how-to-play')}
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>How to Play</span>
            </button>
          </li>
          <li>
            <button
              class={activeNav === 'factions' ? 'active font-bold text-primary' : ''}
              onclick={() => handleNav('factions')}
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Factions & Heroes</span>
              <span class="badge badge-xs badge-primary">New</span>
            </button>
          </li>
          <li>
            <button
              class={activeNav === 'players' ? 'active font-bold text-primary' : ''}
              onclick={() => handleNav('players')}
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Players & Ranks</span>
            </button>
          </li>
          <li>
            <button
              class={activeNav === 'faq' ? 'active font-bold text-primary' : ''}
              onclick={() => handleNav('faq')}
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>FAQ</span>
            </button>
          </li>

          <li class="divider my-1"></li>
          <li class="menu-title px-2 py-1 text-xs uppercase tracking-wider opacity-60">Account</li>

          {#if currentUser}
            <li>
              <div class="flex items-center justify-between">
                <span class="font-bold text-primary">{currentUser.username}</span>
                <span class="badge badge-sm badge-outline">Lv. {currentUser.level ?? 1}</span>
              </div>
            </li>
            <li>
              <button onclick={onLogoutClick} class="text-error">Logout</button>
            </li>
          {:else}
            <div class="grid grid-cols-2 gap-2 pt-1">
              <button
                class="btn btn-outline btn-sm w-full"
                onclick={() => openAuth('login')}
              >
                Login
              </button>
              <button
                class="btn btn-primary btn-sm w-full"
                onclick={() => openAuth('register')}
              >
                Register
              </button>
            </div>
          {/if}
          <div class="pt-2">
            <button
              class="btn btn-primary btn-sm w-full shadow-lg shadow-primary/30"
              onclick={onPlayClick}
            >
              ⚔️ Play Free Now
            </button>
          </div>
        </ul>
      </div>

      <!-- Game Logo Crest & Title -->
      <a
        href="/"
        class="group flex items-center gap-2.5 transition-transform hover:scale-[1.02] focus:outline-none"
      >
        <!-- Fantasy Emblem Shield -->
        <div class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-secondary to-accent p-[2px] shadow-lg shadow-primary/20">
          <div class="flex h-full w-full items-center justify-center rounded-[10px] bg-base-300">
            <svg class="h-6 w-6 text-primary drop-shadow transition-transform group-hover:rotate-12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 4.5c1.38 0 2.5 1.12 2.5 2.5 0 1.05-.65 1.95-1.57 2.32L14 16h-4l1.07-4.68A2.493 2.493 0 019.5 9c0-1.38 1.12-2.5 2.5-2.5z" />
            </svg>
          </div>
          <span class="absolute -bottom-1 -right-1 flex h-3 w-3">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
            <span class="relative inline-flex h-3 w-3 rounded-full bg-success"></span>
          </span>
        </div>

        <!-- Title and Status Subline -->
        <div class="flex flex-col">
          <span class="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text font-black tracking-wider text-base sm:text-lg text-transparent">
            {gameTitle}
          </span>
          <div class="flex items-center gap-1.5 text-[10px] text-base-content/60">
            <span class="font-medium text-success">
              {serverOnline ? 'Online' : 'Maintenance'}
            </span>
            <span>•</span>
            <span class="font-mono">{onlinePlayersCount.toLocaleString()} Playing</span>
          </div>
        </div>
      </a>
    </div>

    <!-- NAVBAR CENTER: Desktop Navigation Menu -->
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal gap-1 p-0 text-sm font-semibold tracking-wide">
        <li>
          <button
            class="rounded-lg px-3.5 py-2 transition-colors {activeNav === 'home'
              ? 'bg-primary/10 text-primary font-bold'
              : 'hover:bg-base-200'}"
            onclick={() => handleNav('home')}
          >
            Home
          </button>
        </li>

        <!-- How To Play Modal Trigger -->
        <li>
          <button
            class="rounded-lg px-3.5 py-2 transition-colors {activeNav === 'how-to-play'
              ? 'bg-primary/10 text-primary font-bold'
              : 'hover:bg-base-200'}"
            onclick={() => handleNav('how-to-play')}
          >
            <span>How to Play</span>
          </button>
        </li>

        <!-- Factions Dropdown -->
        <li class="dropdown dropdown-hover">
          <div
            tabindex="0"
            role="button"
            class="rounded-lg px-3.5 py-2 transition-colors flex items-center gap-1 {activeNav === 'factions'
              ? 'bg-primary/10 text-primary font-bold'
              : 'hover:bg-base-200'}"
          >
            <span>Factions</span>
            <svg class="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <ul
            tabindex="0"
            role="menu"
            class="dropdown-content menu menu-sm bg-base-100/95 backdrop-blur-xl rounded-2xl z-50 w-52 p-2 shadow-2xl border border-base-300 gap-1 font-medium"
          >
            <li>
              <button onclick={() => handleNav('factions-council')} class="flex items-center gap-2">
                <span class="text-base">🛡️</span>
                <div>
                  <div class="font-bold">The Council</div>
                  <div class="text-[10px] text-base-content/60">Knights, Clerics & Wizards</div>
                </div>
              </button>
            </li>
            <li>
              <button onclick={() => handleNav('factions-dwarves')} class="flex items-center gap-2">
                <span class="text-base">🔨</span>
                <div>
                  <div class="font-bold">Dwarven Guild</div>
                  <div class="text-[10px] text-base-content/60">Engineers, Gunners & Paladins</div>
                </div>
              </button>
            </li>
            <li>
              <button onclick={() => handleNav('factions-elves')} class="flex items-center gap-2">
                <span class="text-base">🏹</span>
                <div>
                  <div class="font-bold">Elven Enclave</div>
                  <div class="text-[10px] text-base-content/60">Archers, Mystics & Wardens</div>
                </div>
              </button>
            </li>
          </ul>
        </li>

        <!-- Players & Rankings -->
        <li>
          <button
            class="rounded-lg px-3.5 py-2 transition-colors {activeNav === 'players'
              ? 'bg-primary/10 text-primary font-bold'
              : 'hover:bg-base-200'}"
            onclick={() => handleNav('players')}
          >
            Players & Ranks
          </button>
        </li>

        <!-- FAQ Modal Trigger -->
        <li>
          <button
            class="rounded-lg px-3.5 py-2 transition-colors {activeNav === 'faq'
              ? 'bg-primary/10 text-primary font-bold'
              : 'hover:bg-base-200'}"
            onclick={() => handleNav('faq')}
          >
            FAQ
          </button>
        </li>
      </ul>
    </div>

    <!-- NAVBAR END: Theme Controller + Auth Buttons + Play Now CTA -->
    <div class="navbar-end flex items-center gap-1.5 sm:gap-3">
      <!-- Theme Switcher -->
      <div class="dropdown dropdown-end">
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost btn-circle btn-sm"
          title="Change Theme"
          aria-label="Change Theme"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4 4 4 0 014-4h14a4 4 0 014 4 4 4 0 01-4 4H7zM7 13a4 4 0 110-8 4 4 0 010 8zm8-6a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <ul
          tabindex="0"
          role="menu"
          class="dropdown-content menu menu-sm bg-base-100/95 backdrop-blur-xl rounded-2xl z-50 w-44 p-2 shadow-2xl border border-base-300 gap-1 max-h-72 overflow-y-auto"
        >
          <li class="menu-title text-[10px] uppercase font-bold tracking-wider opacity-70 px-2">
            Themes
          </li>
          {#each availableThemes as theme}
            <li>
              <button
                class="flex items-center justify-between text-xs {currentTheme === theme.id
                  ? 'active font-bold text-primary-content bg-primary'
                  : ''}"
                onclick={() => setTheme(theme.id)}
              >
                <span>{theme.label}</span>
                {#if currentTheme === theme.id}
                  <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                {/if}
              </button>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Auth State: Logged In vs Visitor -->
      {#if currentUser}
        <!-- User Avatar & Dropdown -->
        <div class="dropdown dropdown-end">
          <div
            tabindex="0"
            role="button"
            class="flex items-center gap-2 p-1 rounded-full hover:bg-base-200 transition-colors cursor-pointer"
          >
            <div class="avatar">
              <div class="w-8 h-8 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-1 bg-base-300">
                <img
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.username}`}
                  alt={currentUser.username}
                />
              </div>
            </div>
            <span class="hidden sm:inline text-xs font-bold">{currentUser.username}</span>
          </div>
          <ul
            tabindex="0"
            role="menu"
            class="dropdown-content menu menu-sm bg-base-100/95 backdrop-blur-xl rounded-2xl z-50 w-52 p-2 shadow-2xl border border-base-300 mt-2 gap-1"
          >
            <li class="menu-title px-2 py-1 text-xs opacity-60">Signed in as {currentUser.username}</li>
            <li><button onclick={() => handleNav('profile')}>My Profile</button></li>
            <li><button onclick={() => handleNav('deck')}>My Card Decks</button></li>
            <li><button onclick={() => handleNav('settings')}>Settings</button></li>
            <li class="divider my-1"></li>
            <li><button onclick={onLogoutClick} class="text-error">Logout</button></li>
          </ul>
        </div>
      {:else}
        <!-- Login & Register Links -->
        <button
          class="btn btn-ghost btn-sm font-semibold hidden sm:inline-flex"
          onclick={() => openAuth('login')}
        >
          Login
        </button>
        <button
          class="btn btn-outline btn-sm font-semibold hidden sm:inline-flex border-base-content/20 hover:border-primary"
          onclick={() => openAuth('register')}
        >
          Register
        </button>
      {/if}

      <!-- Play Now Primary Button (Always Visible) -->
      <button
        class="btn btn-primary btn-sm font-bold shadow-md shadow-primary/30 transition-all hover:scale-105 active:scale-95 gap-1.5"
        onclick={onPlayClick}
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
        <span>Play Now</span>
      </button>
    </div>
  </div>
</header>

<!-- ================= MODALS (DaisyUI 5 dialogs) ================= -->

<!-- 1. AUTH MODAL (Login / Register Tabs) -->
<dialog bind:this={authModal} class="modal modal-bottom sm:modal-middle">
  <div class="modal-box bg-base-100/95 backdrop-blur-xl border border-base-300 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md">
    <!-- Close button -->
    <button
      class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
      onclick={closeModals}
      aria-label="Close modal"
    >
      ✕
    </button>

    <!-- Modal Header -->
    <div class="text-center mb-6">
      <div class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary text-2xl mb-2">
        ⚔️
      </div>
      <h3 class="text-2xl font-black tracking-tight">{authTab === 'login' ? 'Welcome Back!' : 'Join Fan Academy'}</h3>
      <p class="text-xs text-base-content/60 mt-1">
        {authTab === 'login'
          ? 'Enter your credentials to access your hero decks and ranked stats.'
          : 'Create your account and claim free 500 Gold & Starter Hero Pack!'}
      </p>
    </div>

    <!-- Tab Switcher -->
    <div role="tablist" class="tabs tabs-box bg-base-200/80 p-1 rounded-xl mb-6">
      <button
        type="button"
        role="tab"
        class="tab flex-1 rounded-lg text-xs font-bold transition-all {authTab === 'login' ? 'tab-active bg-primary text-primary-content shadow' : ''}"
        onclick={() => (authTab = 'login')}
      >
        Sign In
      </button>
      <button
        type="button"
        role="tab"
        class="tab flex-1 rounded-lg text-xs font-bold transition-all {authTab === 'register' ? 'tab-active bg-primary text-primary-content shadow' : ''}"
        onclick={() => (authTab = 'register')}
      >
        Create Account
      </button>
    </div>

    {#if authTab === 'login'}
      <!-- LOGIN FORM -->
      <form onsubmit={handleLoginSubmit} class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="login-username" class="text-xs font-bold uppercase tracking-wider text-base-content/70">
            Username or Email
          </label>
          <input
            id="login-username"
            type="text"
            required
            placeholder="e.g. archmage_valerius"
            bind:value={loginUsername}
            class="input input-bordered w-full bg-base-200/50 focus:input-primary text-sm rounded-xl"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <div class="flex items-center justify-between">
            <label for="login-password" class="text-xs font-bold uppercase tracking-wider text-base-content/70">
              Password
            </label>
            <a href="#forgot" class="text-xs text-primary hover:underline" onclick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered email.'); }}>
              Forgot?
            </a>
          </div>
          <input
            id="login-password"
            type="password"
            required
            placeholder="••••••••"
            bind:value={loginPassword}
            class="input input-bordered w-full bg-base-200/50 focus:input-primary text-sm rounded-xl"
          />
        </div>

        <div class="flex items-center gap-2 mt-1">
          <input type="checkbox" id="remember" class="checkbox checkbox-primary checkbox-sm rounded-md" defaultChecked />
          <label for="remember" class="text-xs text-base-content/80 cursor-pointer select-none">
            Stay signed in for 30 days
          </label>
        </div>

        <button type="submit" class="btn btn-primary w-full mt-2 font-bold shadow-lg shadow-primary/20 rounded-xl">
          Enter Game Portal
        </button>
      </form>
    {:else}
      <!-- REGISTER FORM -->
      <form onsubmit={handleRegisterSubmit} class="flex flex-col gap-3.5">
        <div class="flex flex-col gap-1">
          <label for="reg-email" class="text-xs font-bold uppercase tracking-wider text-base-content/70">Email Address</label>
          <input
            id="reg-email"
            type="email"
            required
            placeholder="hero@fanacademy.com"
            bind:value={regEmail}
            class="input input-bordered w-full bg-base-200/50 focus:input-primary text-sm rounded-xl"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="reg-user" class="text-xs font-bold uppercase tracking-wider text-base-content/70">Username</label>
          <input
            id="reg-user"
            type="text"
            required
            placeholder="Choose player tag"
            bind:value={regUsername}
            class="input input-bordered w-full bg-base-200/50 focus:input-primary text-sm rounded-xl"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="reg-pass" class="text-xs font-bold uppercase tracking-wider text-base-content/70">Password</label>
          <input
            id="reg-pass"
            type="password"
            required
            placeholder="At least 8 characters"
            bind:value={regPassword}
            class="input input-bordered w-full bg-base-200/50 focus:input-primary text-sm rounded-xl"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="reg-faction" class="text-xs font-bold uppercase tracking-wider text-base-content/70">Starting Faction</label>
          <select id="reg-faction" bind:value={regFaction} class="select select-bordered w-full bg-base-200/50 text-sm rounded-xl">
            <option value="council">Council (Magic & Balance)</option>
            <option value="dwarves">Dwarven Guild (Artillery & Tech)</option>
            <option value="elves">Elven Enclave (Agility & Nature)</option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary w-full mt-2 font-bold shadow-lg shadow-primary/20 rounded-xl">
          Register & Claim Starter Pack
        </button>
      </form>
    {/if}

    <!-- Quick Guest Play Divider -->
    <div class="divider text-xs text-base-content/40 my-4">OR</div>
    <button
      type="button"
      class="btn btn-outline btn-sm w-full rounded-xl border-base-300 font-semibold"
      onclick={() => {
        closeModals();
        onPlayClick?.();
      }}
    >
      ⚡ Play Anonymously as Guest
    </button>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<!-- 2. HOW TO PLAY MODAL -->
<dialog bind:this={howToPlayModal} class="modal modal-bottom sm:modal-middle">
  <div class="modal-box bg-base-100/95 backdrop-blur-xl border border-base-300 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-2xl">
    <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4" onclick={closeModals} aria-label="Close modal">
      ✕
    </button>

    <div class="flex items-center gap-3 mb-4">
      <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary text-2xl">
        📖
      </div>
      <div>
        <h3 class="text-2xl font-black">How to Play Fan Academy</h3>
        <p class="text-xs text-base-content/60">Turn-based tactical hero card battles in your browser.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
      <div class="card bg-base-200/60 border border-base-300 p-4 rounded-2xl">
        <div class="text-2xl mb-2">🎴</div>
        <h4 class="font-bold text-sm">1. Choose Heroes</h4>
        <p class="text-xs text-base-content/70 mt-1">Assemble 5 heroes from Council, Dwarves, or Elves with unique abilities and battle spells.</p>
      </div>
      <div class="card bg-base-200/60 border border-base-300 p-4 rounded-2xl">
        <div class="text-2xl mb-2">💎</div>
        <h4 class="font-bold text-sm">2. Mana Crystals</h4>
        <p class="text-xs text-base-content/70 mt-1">Capture elemental crystals on the grid to generate mana and unleash game-changing Ultimates.</p>
      </div>
      <div class="card bg-base-200/60 border border-base-300 p-4 rounded-2xl">
        <div class="text-2xl mb-2">🏆</div>
        <h4 class="font-bold text-sm">3. Outwit Rivals</h4>
        <p class="text-xs text-base-content/70 mt-1">Play cards, execute combos in tactical turns, destroy enemy nexus and climb global ranks!</p>
      </div>
    </div>

    <div class="bg-base-200/80 rounded-2xl p-4 border border-base-300 text-xs space-y-2">
      <div class="font-bold text-primary flex items-center gap-1.5">
        <span>💡 Pro Tip:</span>
      </div>
      <p class="text-base-content/80">
        No installation or plugin required! The game runs natively on WebGL via Phaser 3 with ultra-low latency Colyseus matchmaking.
      </p>
    </div>

    <div class="modal-action mt-6">
      <button class="btn btn-primary w-full sm:w-auto font-bold rounded-xl" onclick={() => { closeModals(); onPlayClick?.(); }}>
        Ready! Launch Game
      </button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<!-- 3. FAQ MODAL -->
<dialog bind:this={faqModal} class="modal modal-bottom sm:modal-middle">
  <div class="modal-box bg-base-100/95 backdrop-blur-xl border border-base-300 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-2xl">
    <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4" onclick={closeModals} aria-label="Close modal">
      ✕
    </button>

    <div class="flex items-center gap-3 mb-6">
      <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary text-2xl">
        ❓
      </div>
      <div>
        <h3 class="text-2xl font-black">Frequently Asked Questions</h3>
        <p class="text-xs text-base-content/60">Everything you need to know about Fan Academy.</p>
      </div>
    </div>

    <div class="space-y-3 max-h-96 overflow-y-auto pr-1">
      <div class="collapse collapse-arrow bg-base-200/70 border border-base-300 rounded-2xl">
        <input type="radio" name="faq-accordion" checked />
        <div class="collapse-title text-sm font-bold">
          Is Fan Academy free to play?
        </div>
        <div class="collapse-content text-xs text-base-content/80">
          Yes! Fan Academy is 100% free to play. All heroes, faction cards, and crystals can be earned simply by playing matches and completing daily quests.
        </div>
      </div>

      <div class="collapse collapse-arrow bg-base-200/70 border border-base-300 rounded-2xl">
        <input type="radio" name="faq-accordion" />
        <div class="collapse-title text-sm font-bold">
          Do I need to download or install any software?
        </div>
        <div class="collapse-content text-xs text-base-content/80">
          Not at all! Fan Academy runs directly in any modern desktop or mobile browser (Chrome, Safari, Firefox, Edge).
        </div>
      </div>

      <div class="collapse collapse-arrow bg-base-200/70 border border-base-300 rounded-2xl">
        <input type="radio" name="faq-accordion" />
        <div class="collapse-title text-sm font-bold">
          What are the playable Factions?
        </div>
        <div class="collapse-content text-xs text-base-content/80">
          There are three primary factions:
          <ul class="list-disc list-inside mt-1 space-y-1">
            <li><strong>The Council</strong>: Balanced tactics, holy paladins, and arcane wizards.</li>
            <li><strong>Dwarven Guild</strong>: High armor, artillery siege weapons, and engineers.</li>
            <li><strong>Elven Enclave</strong>: Fast agile archers, nature magic, and stealth ninjas.</li>
          </ul>
        </div>
      </div>

      <div class="collapse collapse-arrow bg-base-200/70 border border-base-300 rounded-2xl">
        <input type="radio" name="faq-accordion" />
        <div class="collapse-title text-sm font-bold">
          Can I play with my friends?
        </div>
        <div class="collapse-content text-xs text-base-content/80">
          Yes! Our Colyseus multiplayer engine allows creating private custom rooms or queueing together for ranked ladder battles.
        </div>
      </div>
    </div>

    <div class="modal-action mt-6">
      <button class="btn btn-ghost rounded-xl text-xs" onclick={closeModals}>Close</button>
      <button class="btn btn-primary font-bold rounded-xl text-xs" onclick={() => { closeModals(); openAuth('register'); }}>
        Sign Up Now
      </button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
