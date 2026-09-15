
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/private';
 * 
 * console.log(ENVIRONMENT); // => "production"
 * console.log(PUBLIC_BASE_URL); // => throws error during build
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/private' {
	export const VITE_BE_URL: string;
	export const VITE_SOCKET: string;
	export const PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS: string;
	export const NODE_ENV: string;
	export const ANTIGRAVITY_LS_VERSION: string;
	export const ANTIGRAVITY_SOURCE_METADATA: string;
	export const ANTIGRAVITY_CSRF_TOKEN: string;
	export const ANTIGRAVITY_CONVERSATION_ID: string;
	export const PATH: string;
	export const ANTIGRAVITY_TRAJECTORY_ID: string;
	export const ANTIGRAVITY_PROJECT_ID: string;
	export const AGY_BROWSER_WS_URL: string;
	export const CHROME_DEVTOOLS_MCP_JS: string;
	export const SVELTEKIT_FORK: string;
	export const _: string;
	export const BUN_INSTALL: string;
	export const PYENV_ROOT: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const _P9K_SSH_TTY: string;
	export const ANTIGRAVITY_LS_ADDRESS: string;
	export const LSCOLORS: string;
	export const DISABLE_AUTO_UPDATE: string;
	export const LESS: string;
	export const FPATH: string;
	export const P9K_SSH: string;
	export const PHP_INI_SCAN_DIR: string;
	export const AGY_BROWSER_ACTIVE_PORT_FILE: string;
	export const PNPM_HOME: string;
	export const PAGER: string;
	export const ZSH: string;
	export const XPC_SERVICE_NAME: string;
	export const HOMEBREW_CELLAR: string;
	export const SHELL: string;
	export const LANG: string;
	export const ANTIGRAVITY_AGENTAPI_EXE: string;
	export const ZSH_TMUX_AUTOSTARTED: string;
	export const OLDPWD: string;
	export const SHLVL: string;
	export const TMPDIR: string;
	export const HOMEBREW_REPOSITORY: string;
	export const HOMEBREW_PREFIX: string;
	export const PWD: string;
	export const SSH_AUTH_SOCK: string;
	export const ANTIGRAVITY_AGENT: string;
	export const INFOPATH: string;
	export const XPC_FLAGS: string;
	export const ZSH_TMUX_AUTOSTART: string;
	export const HOME: string;
	export const OSLogRateLimit: string;
	export const USER: string;
	export const __CFBundleIdentifier: string;
	export const LOGNAME: string;
	export const COMMAND_MODE: string;
}

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/public';
 * 
 * console.log(ENVIRONMENT); // => throws error during build
 * console.log(PUBLIC_BASE_URL); // => "http://site.com"
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * 
 * console.log(env.ENVIRONMENT); // => "production"
 * console.log(env.PUBLIC_BASE_URL); // => undefined
 * ```
 */
declare module '$env/dynamic/private' {
	export const env: {
		VITE_BE_URL: string;
		VITE_SOCKET: string;
		PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS: string;
		NODE_ENV: string;
		ANTIGRAVITY_LS_VERSION: string;
		ANTIGRAVITY_SOURCE_METADATA: string;
		ANTIGRAVITY_CSRF_TOKEN: string;
		ANTIGRAVITY_CONVERSATION_ID: string;
		PATH: string;
		ANTIGRAVITY_TRAJECTORY_ID: string;
		ANTIGRAVITY_PROJECT_ID: string;
		AGY_BROWSER_WS_URL: string;
		CHROME_DEVTOOLS_MCP_JS: string;
		SVELTEKIT_FORK: string;
		_: string;
		BUN_INSTALL: string;
		PYENV_ROOT: string;
		__CF_USER_TEXT_ENCODING: string;
		_P9K_SSH_TTY: string;
		ANTIGRAVITY_LS_ADDRESS: string;
		LSCOLORS: string;
		DISABLE_AUTO_UPDATE: string;
		LESS: string;
		FPATH: string;
		P9K_SSH: string;
		PHP_INI_SCAN_DIR: string;
		AGY_BROWSER_ACTIVE_PORT_FILE: string;
		PNPM_HOME: string;
		PAGER: string;
		ZSH: string;
		XPC_SERVICE_NAME: string;
		HOMEBREW_CELLAR: string;
		SHELL: string;
		LANG: string;
		ANTIGRAVITY_AGENTAPI_EXE: string;
		ZSH_TMUX_AUTOSTARTED: string;
		OLDPWD: string;
		SHLVL: string;
		TMPDIR: string;
		HOMEBREW_REPOSITORY: string;
		HOMEBREW_PREFIX: string;
		PWD: string;
		SSH_AUTH_SOCK: string;
		ANTIGRAVITY_AGENT: string;
		INFOPATH: string;
		XPC_FLAGS: string;
		ZSH_TMUX_AUTOSTART: string;
		HOME: string;
		OSLogRateLimit: string;
		USER: string;
		__CFBundleIdentifier: string;
		LOGNAME: string;
		COMMAND_MODE: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://example.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.ENVIRONMENT); // => undefined, not public
 * console.log(env.PUBLIC_BASE_URL); // => "http://example.com"
 * ```
 * 
 * ```
 * 
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
