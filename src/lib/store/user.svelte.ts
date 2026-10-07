import { browser } from '$app/environment';
import type { IUser } from '$lib/interfaces/User';
import { getUserProfileApi } from '$lib/api/user';
import { auth } from '$lib/store/auth.svelte';
import { generateAvatar } from '$lib/utils/helper';

class UserStore {
	user = $state<IUser | null>(
		browser && localStorage.getItem('user')
			? (() => {
					try {
						return JSON.parse(localStorage.getItem('user') || '');
					} catch {
						return null;
					}
				})()
			: null
	);

	isLoading = $state<boolean>(false);
	error = $state<string | null>(null);

	get profile(): IUser | null {
		return this.user;
	}

	get avatar(): string | null {
		if (
			this.user?.picture &&
			(this.user.picture.startsWith('http') || this.user.picture.startsWith('data:'))
		) {
			return this.user.picture;
		}
		if (this.user?.username) {
			return generateAvatar(this.user.username);
		}
		return null;
	}

	setUser(userData: IUser | null) {
		if (browser) {
			if (userData) {
				localStorage.setItem('user', JSON.stringify(userData));
			} else {
				localStorage.removeItem('user');
			}
		}
		this.user = userData;
	}

	setProfile(userData: IUser | null) {
		this.setUser(userData);
	}

	async fetchUser(token?: string | null): Promise<IUser | null> {
		const activeToken = token ?? auth.token;
		if (!activeToken) {
			this.clear();
			return null;
		}

		this.isLoading = true;
		this.error = null;

		try {
			const data = await getUserProfileApi(activeToken);
			this.setUser(data);
			return data;
		} catch (err: any) {
			const message = err instanceof Error ? err.message : 'Failed to fetch user information';
			this.error = message;
			if (err?.statusCode === 401) {
				this.clear();
				auth.logout();
			}
			return null;
		} finally {
			this.isLoading = false;
		}
	}

	clear() {
		if (browser) {
			localStorage.removeItem('user');
		}
		this.user = null;
		this.error = null;
		this.isLoading = false;
	}
}

export const userStore = new UserStore();
export const user = userStore;

auth.onLogout(() => {
	userStore.clear();
});
