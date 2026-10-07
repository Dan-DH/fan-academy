<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/store/auth.svelte';
	import { userStore } from '$lib/store/user.svelte';

	$effect(() => {
		if (browser && !auth.isAuthenticated) {
			goto('/auth', { replaceState: true });
		}
	});
</script>

<svelte:head>
	<title>Commander Profile | Fan Academy</title>
	<meta
		name="description"
		content="View and customize your Fan Academy commander profile, avatar, battle statistics, and match history."
	/>
</svelte:head>

{#if auth.isAuthenticated}
	<div class="mx-auto max-w-4xl space-y-6">
		<div class="border-b border-stone-800 pb-4">
			<h1 class="text-2xl font-black tracking-wide text-amber-400 uppercase sm:text-3xl">
				Commander Profile
			</h1>
			<p class="mt-1 text-sm text-stone-400">
				Your commander dossier, faction records, and tactical ratings.
			</p>
		</div>

		{#if userStore.isLoading && !userStore.user}
			<div class="flex items-center justify-center p-12">
				<span class="loading loading-spinner text-amber-400"></span>
				<span class="ml-3 text-stone-300">Loading commander profile...</span>
			</div>
		{:else if userStore.user}
			<div class="space-y-6 rounded-2xl border border-stone-800 bg-base-200 p-6 shadow-xl">
				<div class="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
					{#if userStore.avatar}
						<img
							src={userStore.avatar}
							alt={userStore.user.username}
							class="h-24 w-24 rounded-2xl border-2 border-amber-400/50 bg-stone-900 object-cover shadow-md"
						/>
					{:else}
						<div
							class="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-amber-400/50 bg-amber-500/20 text-4xl text-amber-400"
						>
							<span class="icon-[material-symbols--shield]"></span>
						</div>
					{/if}

					<div class="space-y-1 text-center sm:text-left">
						<h2 class="text-2xl font-bold text-white">{userStore.user.username}</h2>
						<p class="text-sm text-stone-400">{userStore.user.email}</p>
						{#if userStore.user._id}
							<p class="font-mono text-xs text-stone-500">ID: {userStore.user._id}</p>
						{/if}
					</div>
				</div>

				{#if userStore.user.stats}
					<div class="grid grid-cols-2 gap-3 border-t border-stone-800 pt-4 sm:grid-cols-4">
						<div class="rounded-xl bg-base-300 p-3 text-center">
							<div class="text-xs tracking-wider text-stone-400 uppercase">Total Games</div>
							<div class="text-xl font-bold text-amber-300">
								{userStore.user.stats.totalGames ?? 0}
							</div>
						</div>
						<div class="rounded-xl bg-base-300 p-3 text-center">
							<div class="text-xs tracking-wider text-stone-400 uppercase">Total Wins</div>
							<div class="text-xl font-bold text-emerald-400">
								{userStore.user.stats.totalWins ?? 0}
							</div>
						</div>
						<div class="rounded-xl bg-base-300 p-3 text-center">
							<div class="text-xs tracking-wider text-stone-400 uppercase">Win Rate</div>
							<div class="text-xl font-bold text-amber-300">
								{userStore.user.stats.totalGames
									? `${Math.round(((userStore.user.stats.totalWins ?? 0) / userStore.user.stats.totalGames) * 100)}%`
									: '0%'}
							</div>
						</div>
						<div class="rounded-xl bg-base-300 p-3 text-center">
							<div class="text-xs tracking-wider text-stone-400 uppercase">Council Rating</div>
							<div class="text-xl font-bold text-sky-400">
								{userStore.user.stats.factions?.council?.rating ?? 1200}
							</div>
						</div>
					</div>
				{/if}
			</div>
		{:else if userStore.error}
			<div class="alert border border-rose-800 bg-rose-950/80 alert-error text-rose-200">
				<span>{userStore.error}</span>
			</div>
		{/if}
	</div>
{/if}
