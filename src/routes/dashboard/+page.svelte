<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/store/auth.svelte';
	import { userStore } from '$lib/store/user.svelte';

	$effect(() => {
		if (browser && !auth.isAuthenticated) {
			goto('/', { replaceState: true });
		}
	});
</script>

<svelte:head>
	<title>Commander Dashboard | Fan Academy</title>
	<meta
		name="description"
		content="Access active games, matchmaking, faction ratings, turn replays, and battle notifications in your central command hub."
	/>
</svelte:head>

{#if auth.isAuthenticated}
	<div class="space-y-4">
		<h1 class="text-2xl font-black tracking-wide text-amber-400 uppercase sm:text-3xl">
			Commander Dashboard
		</h1>
		{#if userStore.user}
			<div class="flex items-center gap-3">
				{#if userStore.avatar}
					<img
						src={userStore.avatar}
						alt={userStore.user.username}
						class="h-10 w-10 rounded-full border border-amber-400/50 bg-stone-900 object-cover shadow-sm"
					/>
				{/if}
				<p class="text-stone-300">
					Welcome back, <span class="font-bold text-amber-300">{userStore.user.username}</span>!
				</p>
			</div>
		{:else if userStore.isLoading}
			<p class="text-stone-400">Loading commander intelligence...</p>
		{/if}
	</div>
{/if}
