import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { auth } from '$lib/store/auth.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  if (browser && auth.isAuthenticated) {
    redirect(307, '/dashboard');
  }
};
