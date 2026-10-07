<script lang="ts">
	import { auth } from '$lib/store/auth.svelte';
	import { userStore } from '$lib/store/user.svelte';

	function closePopovers(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.closest('a')) {
			document.querySelectorAll<HTMLElement>('[popover]').forEach((popover) => {
				if (popover.matches(':popover-open')) {
					popover.hidePopover();
				}
			});
		}
	}

	function handleDropdownClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.closest('a') || target.closest('button')) {
			(document.activeElement as HTMLElement)?.blur();
		}
	}
</script>

<div class="navbar sticky top-0 right-0 left-0 z-50 bg-base-300 px-5 shadow-sm">
	<div class="navbar-start">
		<a class="btn btn-ghost text-lg" href={auth.isAuthenticated ? '/dashboard' : '/'}>Fan Academy</a
		>
	</div>
	<div class="navbar-center">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="megamenu border border-base-300 p-2 shadow-xl max-sm:megamenu-vertical max-sm:min-w-64 max-sm:p-3"
			id="my-megamenu-4"
			popover
			onclick={closePopovers}
		>
			<a
				class="btn btn-ghost font-semibold max-sm:w-full max-sm:justify-start max-sm:text-left"
				href="/leaderboard"
			>
				Leaderboard
			</a>
			<span class="megamenu-active"></span>
			<button
				popovertarget="d2"
				class="btn btn-ghost font-semibold max-sm:w-full max-sm:justify-start max-sm:text-left"
			>
				Info
			</button>
			<div
				id="d2"
				popover
				class="min-w-48 rounded-xl border border-stone-800 bg-base-200 p-2 shadow-2xl"
			>
				<div class="flex w-full items-start max-sm:flex-col">
					<ul class="menu w-full p-0 md:menu-horizontal">
						<li class="flex w-full flex-col gap-1.5">
							<a
								class="btn btn-wide w-full justify-start gap-3 btn-soft px-3.5 text-left font-medium hover:text-amber-300"
								href="/info/guide"
							>
								<span
									class="icon-[material-symbols--developer-guide-outline] shrink-0 text-lg text-amber-400"
								></span>
								<span>Guide</span>
							</a>
							<a
								class="btn btn-wide w-full justify-start gap-3 btn-soft px-3.5 text-left font-medium hover:text-amber-300"
								href="/info/faq"
							>
								<span class="icon-[akar-icons--chat-question] shrink-0 text-lg text-amber-400"
								></span>
								<span>FAQ</span>
							</a>
							<a
								class="btn btn-wide w-full justify-start gap-3 btn-soft px-3.5 text-left font-medium hover:text-amber-300"
								href="/info/patch-notes"
							>
								<span class="icon-[material-symbols--history-edu] shrink-0 text-lg text-amber-400"
								></span>
								<span>Patch Notes</span>
							</a>
						</li>
					</ul>
				</div>
			</div>

			<button
				popovertarget="d3"
				class="btn btn-ghost font-semibold max-sm:w-full max-sm:justify-start max-sm:text-left"
			>
				Community
			</button>
			<div
				id="d3"
				popover
				class="min-w-48 rounded-xl border border-stone-800 bg-base-200 p-2 shadow-2xl"
			>
				<div class="flex w-full items-start max-sm:flex-col">
					<ul class="menu w-full p-0 md:menu-horizontal">
						<li class="flex w-full flex-col gap-1.5">
							<a
								class="btn btn-wide w-full justify-start gap-3 btn-soft px-3.5 text-left font-medium hover:text-amber-300"
								href="/community/discord"
							>
								<span class="icon-[akar-icons--discord-fill] shrink-0 text-lg text-amber-400"
								></span>
								<span>Discord</span>
							</a>
							<a
								class="btn btn-wide w-full justify-start gap-3 btn-soft px-3.5 text-left font-medium hover:text-amber-300"
								href="/community/videos"
							>
								<span class="icon-[bxs--videos] shrink-0 text-lg text-amber-400"></span>
								<span>Videos</span>
							</a>
						</li>
					</ul>
				</div>
			</div>

			<div class="mt-1 hidden w-full space-y-1 border-t border-base-300 pt-2 max-sm:block">
				{#if auth.isAuthenticated}
					<div
						class="flex items-center gap-2 px-2 py-1.5 text-xs font-bold tracking-wider text-amber-400/80 uppercase"
					>
						{#if userStore.avatar}
							<img
								src={userStore.avatar}
								alt={userStore.user?.username || 'Commander'}
								class="h-4 w-4 rounded-full bg-stone-900 object-cover"
							/>
						{/if}
						<span
							>{userStore.user?.username
								? `${userStore.user.username}'s Menu`
								: 'Commander Menu'}</span
						>
					</div>
					<a
						class="btn btn-wide w-full justify-start gap-3 btn-soft px-3.5 text-left font-medium hover:text-amber-300"
						href="/dashboard"
					>
						<span class="icon-[material-symbols--dashboard-outline] shrink-0 text-lg text-amber-400"
						></span>
						<span>Dashboard</span>
					</a>
					<a
						class="btn btn-wide w-full justify-start gap-3 btn-soft px-3.5 text-left font-medium hover:text-amber-300"
						href="/profile"
					>
						<span class="icon-[material-symbols--person-outline] shrink-0 text-lg text-amber-400"
						></span>
						<span>Profile</span>
					</a>
					<a
						class="btn btn-wide w-full justify-start gap-3 btn-soft px-3.5 text-left font-medium hover:text-amber-300"
						href="/settings"
					>
						<span class="icon-[material-symbols--settings-outline] shrink-0 text-lg text-amber-400"
						></span>
						<span>Settings</span>
					</a>
					<button
						type="button"
						onclick={() => auth.logout()}
						class="btn btn-wide w-full cursor-pointer justify-start gap-3 btn-soft px-3.5 text-left font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
					>
						<span class="icon-[material-symbols--logout] shrink-0 text-lg"></span>
						<span>Logout</span>
					</button>
				{:else}
					<a
						href="/auth"
						class="btn btn-block gap-1.5 rounded-lg border border-amber-300 bg-linear-to-b from-amber-400 to-amber-600 text-xs font-extrabold tracking-wider text-amber-950 uppercase shadow-md hover:from-amber-300 hover:to-amber-500"
					>
						<span class="icon-[akar-icons--double-sword] text-base"></span>
						Battle Now!
					</a>
				{/if}
			</div>
		</div>
	</div>
	<div class="navbar-end gap-2">
		{#if auth.isAuthenticated}
			<div class="dropdown dropdown-end">
				<button
					tabindex="0"
					type="button"
					class="btn cursor-pointer gap-1.5 rounded-lg border border-amber-300 bg-linear-to-b from-amber-400 to-amber-600 text-xs font-bold tracking-wider text-amber-950 uppercase shadow-md transition-all btn-sm hover:scale-105 hover:from-amber-300 hover:to-amber-500 active:scale-95 sm:text-sm sm:btn-md"
				>
					{#if userStore.avatar}
						<img
							src={userStore.avatar}
							alt={userStore.user?.username || 'Profile'}
							class="h-4 w-4 rounded-full border border-amber-300/40 bg-stone-900 object-cover sm:h-5 sm:w-5"
						/>
					{:else}
						<span class="icon-[material-symbols--account-circle] text-base sm:text-lg"></span>
					{/if}
					<span>{userStore.user?.username || 'Profile'}</span>
					<span class="icon-[material-symbols--keyboard-arrow-down] text-base"></span>
				</button>
				<ul
					tabindex="0"
					class="menu dropdown-content z-50 mt-2 w-48 space-y-1 rounded-xl border border-stone-800 bg-base-200 p-2 shadow-2xl"
					onclick={handleDropdownClick}
				>
					<li>
						<a
							href="/dashboard"
							class="flex items-center gap-2.5 py-2 text-xs font-semibold hover:text-amber-300 sm:text-sm"
						>
							<span
								class="icon-[material-symbols--dashboard-outline] shrink-0 text-lg text-amber-400"
							></span>
							<span>Dashboard</span>
						</a>
					</li>
					<li>
						<a
							href="/profile"
							class="flex items-center gap-2.5 py-2 text-xs font-semibold hover:text-amber-300 sm:text-sm"
						>
							<span class="icon-[material-symbols--person-outline] shrink-0 text-lg text-amber-400"
							></span>
							<span>Profile</span>
						</a>
					</li>
					<li>
						<a
							href="/settings"
							class="flex items-center gap-2.5 py-2 text-xs font-semibold hover:text-amber-300 sm:text-sm"
						>
							<span
								class="icon-[material-symbols--settings-outline] shrink-0 text-lg text-amber-400"
							></span>
							<span>Settings</span>
						</a>
					</li>
					<div class="divider my-1 border-stone-800"></div>
					<li>
						<button
							type="button"
							onclick={() => auth.logout()}
							class="flex w-full cursor-pointer items-center gap-2.5 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 sm:text-sm"
						>
							<span class="icon-[material-symbols--logout] shrink-0 text-lg"></span>
							<span>Logout</span>
						</button>
					</li>
				</ul>
			</div>
		{:else}
			<a
				href="/auth"
				class="btn hidden gap-1.5 rounded-lg border border-amber-300 bg-linear-to-b from-amber-400 to-amber-600 text-xs font-extrabold tracking-wider text-amber-950 uppercase shadow-md transition-all btn-sm hover:scale-105 hover:from-amber-300 hover:to-amber-500 active:scale-95 sm:inline-flex sm:text-sm sm:btn-md"
			>
				<span class="icon-[akar-icons--double-sword] text-base sm:text-lg"></span>
				Battle Now!
			</a>
		{/if}
		<button class="btn sm:hidden" popovertarget="my-megamenu-4" aria-label="hamburger-menu">
			<span class="icon-[charm--menu-hamburger]"></span>
		</button>
	</div>
</div>
