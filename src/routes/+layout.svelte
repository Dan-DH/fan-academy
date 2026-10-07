<script lang="ts">
	import { browser } from '$app/environment';
	import { untrack } from 'svelte';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import '../app.css';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import Navbar from '$lib/components/Navbar.svelte';
	import { auth } from '$lib/store/auth.svelte';
	import { userStore } from '$lib/store/user.svelte';

	let { children } = $props();

	const queryClient = new QueryClient({});

	$effect(() => {
		if (browser && auth.isAuthenticated) {
			untrack(() => {
				userStore.fetchUser();
			});
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<div
		class="pointer-events-none fixed inset-0 -z-10 bg-[url('/banner.webp')] bg-cover bg-center bg-no-repeat"
		aria-hidden="true"
	>
		<div class="absolute inset-0 bg-black/40"></div>
	</div>

	<div
		class="relative flex min-h-screen flex-col text-base-content selection:bg-primary selection:text-primary-content"
	>
		<Navbar />
		<main class="w-full flex-1">
			<section class="my-5 min-h-screen w-full p-1 md:mx-auto">
				<div
					class="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 py-6 text-base-content md:py-10"
				>
					{@render children()}
				</div>
			</section>
		</main>
	</div>

	<SvelteQueryDevtools />
</QueryClientProvider>
