import { createMutation } from '@tanstack/svelte-query';
import { loginApi, signupApi } from '$lib/api/auth';
import { auth } from '$lib/store/auth.svelte';
import type { AuthLoginUser, AuthRegisterUser, AuthResponse } from '$lib/types/AuthType';

export function useLoginMutation(onSuccessCallback?: (data: AuthResponse) => void) {
  return createMutation(() => ({
    mutationKey: ['login'],
    mutationFn: (credentials: AuthLoginUser) => loginApi(credentials),
    onSuccess: (data) => {
      auth.login(data.token, data.userData);
      onSuccessCallback?.(data);
    }
  }));
}

export function useSignupMutation(onSuccessCallback?: (data: AuthResponse) => void) {
  return createMutation(() => ({
    mutationKey: ['signup'],
    mutationFn: (payload: Omit<AuthRegisterUser, 'confirmation'>) => signupApi(payload),
    onSuccess: (data) => {
      auth.login(data.token, data.userData);
      onSuccessCallback?.(data);
    }
  }));
}
