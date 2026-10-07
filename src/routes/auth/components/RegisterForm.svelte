<script lang="ts">
  import { goto } from '$app/navigation';
  import { useSignupMutation } from '$lib/queries/authMutations';

  interface Props {
    onSwitchTab: (tab: 'login') => void;
  }

  let { onSwitchTab }: Props = $props();

  let username = $state('');
  let email = $state('');
  let password = $state('');
  let confirmation = $state('');

  let showPassword = $state(false);
  let showConfirm = $state(false);

  let touched = $state({
    username: false,
    email: false,
    password: false,
    confirmation: false
  });

  let submitted = $state(false);

  // Email regex exactly matching backend Mongoose UserSchema
  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  // Username regex (alphanumeric, dashes, underscores)
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;

  const errors = $derived.by(() => {
    const errs: {
      username?: string;
      email?: string;
      password?: string;
      confirmation?: string;
    } = {};

    const trimmedUser = username.trim();
    if (!trimmedUser) {
      errs.username = 'Callsign username is required';
    } else if (trimmedUser.length < 2) {
      errs.username = 'Username must be at least 2 characters';
    } else if (trimmedUser.length > 20) {
      errs.username = 'Username cannot exceed 20 characters';
    } else if (!usernameRegex.test(trimmedUser)) {
      errs.username = 'Only letters, numbers, hyphens, and underscores allowed';
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(trimmedEmail)) {
      errs.email = 'Please provide a valid email format';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (!confirmation) {
      errs.confirmation = 'Password confirmation is required';
    } else if (confirmation !== password) {
      errs.confirmation = 'Passwords do not match';
    }

    return errs;
  });

  const isValid = $derived(Object.keys(errors).length === 0);

  const signupMutation = useSignupMutation(() => {
    goto('/dashboard');
  });

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    submitted = true;
    touched.username = true;
    touched.email = true;
    touched.password = true;
    touched.confirmation = true;

    if (!isValid) return;

    signupMutation.mutate({
      username: username.trim(),
      email: email.trim(),
      password: password.trim()
    });
  }
</script>

<form onsubmit={handleSubmit} class="space-y-4" novalidate>
  <!-- Server Error Notice -->
  {#if signupMutation.isError}
    <div
      class="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn"
      role="alert"
    >
      <span class="icon-[material-symbols--error-outline] text-lg text-rose-400 shrink-0 mt-0.5"></span>
      <div class="space-y-0.5">
        <p class="font-bold text-rose-200">Enlistment Error</p>
        <p class="text-rose-300/90 leading-relaxed">
          {signupMutation.error?.message || 'Could not create account. Please check your details.'}
        </p>
      </div>
    </div>
  {/if}

  <!-- Success Notice -->
  {#if signupMutation.isSuccess}
    <div
      class="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn"
      role="alert"
    >
      <span class="icon-[material-symbols--check-circle-outline-rounded] text-lg text-emerald-400 shrink-0"></span>
      <p class="font-semibold text-emerald-200">Commission Granted! Welcome to Fan Academy...</p>
    </div>
  {/if}

  <!-- Username Field -->
  <div class="space-y-1.5">
    <div class="flex items-center justify-between">
      <label for="register-username" class="block text-xs font-bold uppercase tracking-wider text-amber-300">
        Commander Callsign
      </label>
      <span class="text-[11px] text-stone-500 font-mono">
        {username.trim().length}/20 chars
      </span>
    </div>
    <div class="relative">
      <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
        <span class="icon-[material-symbols--person-outline] text-lg"></span>
      </span>
      <input
        id="register-username"
        type="text"
        bind:value={username}
        onblur={() => (touched.username = true)}
        placeholder="Choose your battle name"
        autocomplete="username"
        maxlength="20"
        disabled={signupMutation.isPending}
        class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950/80 border text-white text-sm placeholder-stone-500 focus:outline-none transition-colors {
          (touched.username || submitted) && errors.username
            ? 'border-rose-500/80 focus:border-rose-400'
            : 'border-stone-800 focus:border-amber-500/80'
        }"
      />
    </div>
    {#if (touched.username || submitted) && errors.username}
      <p class="text-xs text-rose-400 font-medium pl-1 flex items-center gap-1">
        <span class="icon-[material-symbols--error-outline] text-xs"></span>
        {errors.username}
      </p>
    {/if}
  </div>

  <!-- Email Field -->
  <div class="space-y-1.5">
    <label for="register-email" class="block text-xs font-bold uppercase tracking-wider text-amber-300">
      Email Address
    </label>
    <div class="relative">
      <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
        <span class="icon-[material-symbols--mail-outline] text-lg"></span>
      </span>
      <input
        id="register-email"
        type="email"
        bind:value={email}
        onblur={() => (touched.email = true)}
        placeholder="commander@fan-academy.com"
        autocomplete="email"
        disabled={signupMutation.isPending}
        class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950/80 border text-white text-sm placeholder-stone-500 focus:outline-none transition-colors {
          (touched.email || submitted) && errors.email
            ? 'border-rose-500/80 focus:border-rose-400'
            : 'border-stone-800 focus:border-amber-500/80'
        }"
      />
    </div>
    {#if (touched.email || submitted) && errors.email}
      <p class="text-xs text-rose-400 font-medium pl-1 flex items-center gap-1">
        <span class="icon-[material-symbols--error-outline] text-xs"></span>
        {errors.email}
      </p>
    {/if}
  </div>

  <!-- Password Field -->
  <div class="space-y-1.5">
    <label for="register-password" class="block text-xs font-bold uppercase tracking-wider text-amber-300">
      Password
    </label>
    <div class="relative">
      <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
        <span class="icon-[material-symbols--lock-outline] text-lg"></span>
      </span>
      <input
        id="register-password"
        type={showPassword ? 'text' : 'password'}
        bind:value={password}
        onblur={() => (touched.password = true)}
        placeholder="Min. 6 characters"
        autocomplete="new-password"
        disabled={signupMutation.isPending}
        class="w-full pl-10 pr-11 py-2.5 rounded-xl bg-stone-950/80 border text-white text-sm placeholder-stone-500 focus:outline-none transition-colors {
          (touched.password || submitted) && errors.password
            ? 'border-rose-500/80 focus:border-rose-400'
            : 'border-stone-800 focus:border-amber-500/80'
        }"
      />
      <button
        type="button"
        onclick={() => (showPassword = !showPassword)}
        class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {#if showPassword}
          <span class="icon-[material-symbols--visibility-off-outline] text-lg"></span>
        {:else}
          <span class="icon-[material-symbols--visibility-outline] text-lg"></span>
        {/if}
      </button>
    </div>
    {#if (touched.password || submitted) && errors.password}
      <p class="text-xs text-rose-400 font-medium pl-1 flex items-center gap-1">
        <span class="icon-[material-symbols--error-outline] text-xs"></span>
        {errors.password}
      </p>
    {/if}
  </div>

  <!-- Confirm Password Field -->
  <div class="space-y-1.5">
    <label for="register-confirm" class="block text-xs font-bold uppercase tracking-wider text-amber-300">
      Confirm Password
    </label>
    <div class="relative">
      <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
        <span class="icon-[material-symbols--lock-outline] text-lg"></span>
      </span>
      <input
        id="register-confirm"
        type={showConfirm ? 'text' : 'password'}
        bind:value={confirmation}
        onblur={() => (touched.confirmation = true)}
        placeholder="Repeat password"
        autocomplete="new-password"
        disabled={signupMutation.isPending}
        class="w-full pl-10 pr-11 py-2.5 rounded-xl bg-stone-950/80 border text-white text-sm placeholder-stone-500 focus:outline-none transition-colors {
          (touched.confirmation || submitted) && errors.confirmation
            ? 'border-rose-500/80 focus:border-rose-400'
            : 'border-stone-800 focus:border-amber-500/80'
        }"
      />
      <button
        type="button"
        onclick={() => (showConfirm = !showConfirm)}
        class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
        aria-label={showConfirm ? 'Hide password confirmation' : 'Show password confirmation'}
      >
        {#if showConfirm}
          <span class="icon-[material-symbols--visibility-off-outline] text-lg"></span>
        {:else}
          <span class="icon-[material-symbols--visibility-outline] text-lg"></span>
        {/if}
      </button>
    </div>
    {#if (touched.confirmation || submitted) && errors.confirmation}
      <p class="text-xs text-rose-400 font-medium pl-1 flex items-center gap-1">
        <span class="icon-[material-symbols--error-outline] text-xs"></span>
        {errors.confirmation}
      </p>
    {/if}
  </div>

  <!-- Submit Button -->
  <button
    type="submit"
    disabled={signupMutation.isPending || (submitted && !isValid)}
    class="w-full py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm text-stone-950 bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
  >
    {#if signupMutation.isPending}
      <span class="icon-[material-symbols--sync] text-lg animate-spin"></span>
      <span>Enlisting Commander...</span>
    {:else}
      <span class="icon-[material-symbols--person-add-outline] text-lg"></span>
      <span>Create Free Account</span>
    {/if}
  </button>

  <!-- Switch Tab Link -->
  <div class="text-center pt-2 border-t border-stone-800/80">
    <p class="text-xs text-stone-400">
      Already registered with an academy rank?
      <a
        href="#login"
        onclick={(e) => {
          e.preventDefault();
          onSwitchTab('login');
        }}
        class="text-amber-400 hover:text-amber-300 font-bold ml-1 underline underline-offset-2 transition-colors cursor-pointer"
      >
        Log In Here
      </a>
    </p>
  </div>
</form>
