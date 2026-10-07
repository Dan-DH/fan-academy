import type { IUser } from '$lib/interfaces/User';
import { getBaseUrl } from './auth';

export class UserApiError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.name = 'UserApiError';
		this.statusCode = statusCode;
	}
}

export async function getUserProfileApi(token: string): Promise<IUser> {
	const baseUrl = getBaseUrl();
	const url = `${baseUrl}/users/profile`;

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		const data = await response.json().catch(() => null);

		if (!response.ok) {
			const message =
				data?.message ||
				(response.status === 401
					? 'Session expired or unauthorized'
					: `Failed to fetch user profile (${response.status})`);
			throw new UserApiError(message, response.status);
		}

		return data as IUser;
	} catch (err) {
		if (err instanceof UserApiError) {
			throw err;
		}
		throw new UserApiError(
			'Unable to connect to the game server. Please ensure the backend is running.',
			0
		);
	}
}
