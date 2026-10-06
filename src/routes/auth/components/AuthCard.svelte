<script lang="ts">
  import LoginForm from './LoginForm.svelte';
  import RegisterForm from './RegisterForm.svelte';

  interface Props {
    activeTab: 'login' | 'register';
    onTabChange: (tab: 'login' | 'register') => void;
  }

  let { activeTab, onTabChange }: Props = $props();
</script>

<div
  class="w-full max-w-xl mx-auto bg-stone-950/90 backdrop-blur-md rounded-2xl border border-amber-500/30 shadow-2xl overflow-hidden text-left"
>
  <!-- Tabview Navigation Header -->
  <div
    role="tablist"
    class="grid grid-cols-2 bg-stone-950 border-b border-amber-500/20"
    aria-label="Authentication Tabview"
  >
    <a
      role="tab"
      id="tab-login"
      href="#login"
      aria-selected={activeTab === 'login'}
      aria-controls="panel-login"
      onclick={() => onTabChange('login')}
      class="py-3.5 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer {
        activeTab === 'login'
          ? 'border-amber-400 text-amber-300 bg-amber-500/10 font-extrabold'
          : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/50 hover:border-stone-700'
      }"
    >
      <span class="icon-[material-symbols--login] text-base"></span>
      <span>Log In</span>
    </a>

    <a
      role="tab"
      id="tab-register"
      href="#register"
      aria-selected={activeTab === 'register'}
      aria-controls="panel-register"
      onclick={() => onTabChange('register')}
      class="py-3.5 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer {
        activeTab === 'register'
          ? 'border-amber-400 text-amber-300 bg-amber-500/10 font-extrabold'
          : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/50 hover:border-stone-700'
      }"
    >
      <span class="icon-[material-symbols--person-add-outline] text-base"></span>
      <span>Register</span>
    </a>
  </div>

  <!-- Tabview Panel Content -->
  <div class="p-6 sm:p-8 space-y-6">
    <div class="text-center space-y-1">
      <h2 class="text-lg sm:text-xl font-black uppercase tracking-wider text-amber-300">
        {activeTab === 'login' ? 'Commander Access' : 'Enlist Commander'}
      </h2>
      <p class="text-xs text-stone-400">
        {activeTab === 'login'
          ? 'Enter your credentials to enter the academy battlefield'
          : 'Create your tactical profile and claim your commander rank'}
      </p>
    </div>

    <!-- Active Form Panel -->
    {#if activeTab === 'login'}
      <div id="panel-login" role="tabpanel" aria-labelledby="tab-login">
        <LoginForm onSwitchTab={onTabChange} />
      </div>
    {:else}
      <div id="panel-register" role="tabpanel" aria-labelledby="tab-register">
        <RegisterForm onSwitchTab={onTabChange} />
      </div>
    {/if}
  </div>
</div>
