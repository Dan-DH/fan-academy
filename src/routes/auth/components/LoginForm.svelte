<script lang="ts">
  import { goto } from '$app/navigation';
  import { useLoginMutation } from '$lib/queries/authMutations';

  interface Props {
    onSwitchTab: (tab: 'register') => void;
  }

  let { onSwitchTab }: Props = $props();

  let username = $state('');
  let password = $state('');
  let showPassword = $state(false);

  let touched = $state({
    username: false,
    password: false
  });

  let submitted = $state(false);

  const errors = $derived.by(() => {
    const errs: { username?: string; password?: string } = {};

    const trimmedUser = username.trim();
    if (!trimmedUser) {
      errs.username = 'Username is required';
    } else if (trimmedUser.length < 2) {
      errs.username = 'Username must be at least 2 characters';
    } else if (trimmedUser.length > 20) {
      errs.username = 'Username cannot exceed 20 characters';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    return errs;
  });

  const isValid = $derived(Object.keys(errors).length === 0);

  const loginMutation = useLoginMutation(() => {
    goto('/');
  });

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    submitted = true;
    touched.username = true;
    touched.password = true;

    if (!isValid) return;

    loginMutation.mutate({
      username: username.trim(),
      password: password.trim()
    });
  }
</script>

<form onsubmit={handleSubmit} class="space-y-5" novalidate>
  <!-- Server Error Notice -->
  {#if loginMutation.isError}
    <div
      class="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn"
      role="alert"
    >
      <span class="icon-[material-symbols--error-outline] text-lg text-rose-400 shrink-0 mt-0.5"></span>
      <div class="space-y-0.5">
        <p class="font-bold text-rose-200">Authentication Failed</p>
        <p class="text-rose-300/90 leading-relaxed">
          {loginMutation.error?.message || 'Invalid username or password. Please try again.'}
        </p>
      </div>
    </div>
  {/if}

  <!-- Success Notice -->
  {#if loginMutation.isSuccess}
    <div
      class="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn"
      role="alert"
    >
      <span class="icon-[material-symbols--check-circle-outline-rounded] text-lg text-emerald-400 shrink-0"></span>
      <p class="font-semibold text-emerald-200">Welcome back, Commander! Redirecting...</p>
    </div>
  {/if}

  <!-- Username Field -->
  <div class="space-y-1.5">
    <label for="login-username" class="block text-xs font-bold uppercase tracking-wider text-amber-300">
      Commander Username
    </label>
    <div class="relative">
      <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
        <span class="icon-[material-symbols--person-outline] text-lg"></span>
      </span>
      <input
        id="login-username"
        type="text"
        bind:value={username}
        onblur={() => (touched.username = true)}
        placeholder="Enter your commander callsign"
        autocomplete="username"
        disabled={loginMutation.isPending}
        class="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-950/80 border text-white text-sm placeholder-stone-500 focus:outline-none transition-colors {
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

  <!-- Password Field -->
  <div class="space-y-1.5">
    <div class="flex items-center justify-between">
      <label for="login-password" class="block text-xs font-bold uppercase tracking-wider text-amber-300">
        Password
      </label>
    </div>
    <div class="relative">
      <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
        <span class="icon-[material-symbols--lock-outline] text-lg"></span>
      </span>
      <input
        id="login-password"
        type={showPassword ? 'text' : 'password'}
        bind:value={password}
        onblur={() => (touched.password = true)}
        placeholder="••••••••••••"
        autocomplete="current-password"
        disabled={loginMutation.isPending}
        class="w-full pl-10 pr-11 py-3 rounded-xl bg-stone-950/80 border text-white text-sm placeholder-stone-500 focus:outline-none transition-colors {
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

  <!-- Submit Button -->
  <button
    type="submit"
    disabled={loginMutation.isPending || (submitted && !isValid)}
    class="w-full py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm text-stone-950 bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
  >
    {#if loginMutation.isPending}
      <span class="icon-[material-symbols--sync] text-lg animate-spin"></span>
      <span>Authenticating...</span>
    {:else}
      <span class="icon-[material-symbols--login] text-lg"></span>
      <span>Enter Battle</span>
    {/if}
  </button>

  <!-- Switch Tab Link -->
  <div class="text-center pt-2 border-t border-stone-800/80">
    <p class="text-xs text-stone-400">
      New recruit without an academy rank?
      <a
        href="#register"
        onclick={(e) => {
          e.preventDefault();
          onSwitchTab('register');
        }}
        class="text-amber-400 hover:text-amber-300 font-bold ml-1 underline underline-offset-2 transition-colors cursor-pointer"
      >
        Enlist Now
      </a>
    </p>
  </div>
</form>
