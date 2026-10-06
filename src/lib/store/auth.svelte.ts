import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import type { AuthUserData } from '$lib/types/AuthType';

class AuthStore {
  token = $state<string | null>(
    browser ? (localStorage.getItem('token') || localStorage.getItem('jwt')) : null
  );

  user = $state<AuthUserData | null>(
    browser && localStorage.getItem('userData')
      ? (() => {
          try {
            return JSON.parse(localStorage.getItem('userData') || '');
          } catch {
            return null;
          }
        })()
      : null
  );

  isAuthenticated = $derived(Boolean(this.token));

  login(token: string, userData?: AuthUserData) {
    if (browser) {
      localStorage.setItem('token', token);
      localStorage.setItem('jwt', token);
      if (userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    }
    this.token = token;
    if (userData) {
      this.user = userData;
    }
  }

  logout(redirectUrl = '/') {
    if (browser) {
      localStorage.removeItem('token');
      localStorage.removeItem('jwt');
      localStorage.removeItem('userData');
    }
    this.token = null;
    this.user = null;
    if (redirectUrl) goto(redirectUrl);
  }
}

export const auth = new AuthStore();
