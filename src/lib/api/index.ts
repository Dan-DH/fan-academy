import { getUserProfileApi } from './user';
import { auth } from '$lib/store/auth.svelte';
import type { IUser } from '$lib/interfaces/User';

export * from './auth';
export * from './user';

export const getCurrentUser = async (token?: string): Promise<IUser | null> => {
	const activeToken = token ?? auth.token;
	if (!activeToken) {
		return null;
	}
	return getUserProfileApi(activeToken);
};
