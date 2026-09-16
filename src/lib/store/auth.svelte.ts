import { browser } from '$app/environment';
import { goto } from '$app/navigation';

class AuthStore {
    token = $state<string | null>(browser ? localStorage.getItem('token') : null);
    isAuthenticated = $derived(Boolean(this.token));

    login(token:string) {
        if (browser) localStorage.setItem('token', token);
        this.token = token;
    }

    logout(redirectUrl = '/') {
        if (browser) localStorage.removeItem('token');
        this.token = null;
        //TODO: close all connections WS etc
        if (redirectUrl) goto(redirectUrl);
    }
}

export const auth = new AuthStore();
