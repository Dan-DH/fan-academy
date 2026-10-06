import type { AuthLoginUser, AuthRegisterUser, AuthResponse } from '$lib/types/AuthType';

const getBaseUrl = (): string => {
  const beUrl = import.meta.env.VITE_BE_URL;
  if (beUrl) {
    return beUrl.replace(/\/$/, '');
  }
  return 'http://localhost:10000';
};

export class AuthApiError extends Error {
  code?: number;
  statusCode: number;

  constructor(message: string, statusCode: number, code?: number) {
    super(message);
    this.name = 'AuthApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export async function loginApi(credentials: AuthLoginUser): Promise<AuthResponse> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/users/login`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: credentials.username.trim(),
        password: credentials.password.trim()
      })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        data?.message ||
        (response.status === 401
          ? 'Invalid username or password'
          : `Login failed (${response.status})`);
      throw new AuthApiError(message, response.status, data?.code);
    }

    if (!data?.token) {
      throw new AuthApiError('Authentication token missing from server response', 500);
    }

    return data as AuthResponse;
  } catch (err) {
    if (err instanceof AuthApiError) {
      throw err;
    }
    throw new AuthApiError(
      'Unable to connect to the game server. Please ensure the backend is running.',
      0
    );
  }
}

export async function signupApi(
  payload: Omit<AuthRegisterUser, 'confirmation'>
): Promise<AuthResponse> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/users/signup`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: payload.username.trim(),
        email: payload.email.trim(),
        password: payload.password.trim()
      })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        data?.message ||
        (response.status === 409
          ? 'An account for this username or email already exists'
          : `Sign up failed (${response.status})`);
      throw new AuthApiError(message, response.status, data?.code);
    }

    if (!data?.token) {
      throw new AuthApiError('Authentication token missing from server response', 500);
    }

    return data as AuthResponse;
  } catch (err) {
    if (err instanceof AuthApiError) {
      throw err;
    }
    throw new AuthApiError(
      'Unable to connect to the game server. Please ensure the backend is running.',
      0
    );
  }
}
