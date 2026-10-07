import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { loginApi, signupApi } from '$lib/api/auth';
import { auth } from '$lib/store/auth.svelte';
import { userStore } from '$lib/store/user.svelte';
import type { AuthLoginUser, AuthRegisterUser, AuthResponse } from '$lib/types/AuthType';

export function useLoginMutation(onSuccessCallback?: (data: AuthResponse) => void) {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationKey: ['login'],
		mutationFn: (credentials: AuthLoginUser) => loginApi(credentials),
		onSuccess: async (data) => {
			auth.login(data.token, data.userData);
			try {
				await userStore.fetchUser(data.token);
			} catch (err) {
				console.error('Failed to fetch user information on login:', err);
			}
			queryClient.invalidateQueries({ queryKey: ['currentUser'] });
			onSuccessCallback?.(data);
		}
	}));
}

export function useSignupMutation(onSuccessCallback?: (data: AuthResponse) => void) {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationKey: ['signup'],
		mutationFn: (payload: Omit<AuthRegisterUser, 'confirmation'>) => signupApi(payload),
		onSuccess: async (data) => {
			auth.login(data.token, data.userData);
			try {
				await userStore.fetchUser(data.token);
			} catch (err) {
				console.error('Failed to fetch user information on signup:', err);
			}
			queryClient.invalidateQueries({ queryKey: ['currentUser'] });
			onSuccessCallback?.(data);
		}
	}));
}
