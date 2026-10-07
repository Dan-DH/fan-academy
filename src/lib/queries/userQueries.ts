import { auth } from '$lib/store/auth.svelte';
import { userStore } from '$lib/store/user.svelte';
import { getUserProfileApi } from '$lib/api/user';
import { createQuery } from '@tanstack/svelte-query';
import type { IUser } from '$lib/interfaces/User';

export const useCurrentUser = () => {
	return createQuery<IUser | null>(() => ({
		queryKey: ['currentUser', auth.token],
		queryFn: async () => {
			if (!auth.token) return null;
			try {
				const userData = await getUserProfileApi(auth.token);
				userStore.setUser(userData);
				return userData;
			} catch (err: any) {
				if (err?.statusCode === 401) {
					auth.logout();
				}
				throw err;
			}
		},
		enabled: Boolean(auth.isAuthenticated && auth.token),
		staleTime: 1000 * 60 * 15
	}));
};
