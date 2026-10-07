<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/store/auth.svelte';

  $effect(() => {
    if (browser && !auth.isAuthenticated) {
      goto('/auth', { replaceState: true });
    }
  });
</script>

<svelte:head>
  <title>Account Settings | Fan Academy</title>
  <meta
    name="description"
    content="Manage your email preferences, notification alerts, in-game chat options, and account security in Fan Academy."
  />
</svelte:head>

{#if auth.isAuthenticated}
  <div class="max-w-4xl mx-auto p-5">
    <h1 class="text-2xl font-bold text-amber-300">Settings</h1>
  </div>
{/if}

