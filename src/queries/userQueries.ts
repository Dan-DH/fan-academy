import { IUserPreferences, IUserStats } from "../interfaces/userInterface";

export async function loginQuery(username: string, password: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BE_URL}users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password
      }),
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Successful login! :)');
      return {
        success: true,
        user: data.user
      };
    } else {
      console.error('Server responded with an error:', data.message || 'Unknown error');
      return {
        success: false,
        error: data.message || 'Unknown error'
      };
    }
  } catch(error) {
    console.error('Error login in: ', error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
}

export async function signUpQuery(email: string, username: string, password: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BE_URL}users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        username,
        password
      }),
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Successful sign up! :)');
      return {
        success: true,
        user: data.user
      };
    } else {
      console.log('Server responded with an error:', data.message || 'Unknown error');
      return {
        success: false,
        error: data.message || 'Unknown error'
      };
    }
  } catch (error) {
    console.error('Network error signing up:', error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
}

/**
 * Used on MainMenuScene's onCreate() to check if the player is authenticated
 * @returns
 */
export async function authCheck(): Promise<string | undefined> {
  console.log('Checking Authentication Status...');
  const result = await fetch(`${import.meta.env.VITE_BE_URL}auth-check`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });

  if (result.status != 200) {
    console.error('User not authenticated...');
    return undefined;
  }

  const userId = await result.json();

  console.log('User authenticated...', userId);
  return userId;
};

/**
 * Used to populate the leaderboard
 */
export async function getLeaderBoard(page = 1): Promise<{
  players: {
    _id: string,
    username: string,
    picture: string,
    stats: IUserStats,
  }[],
  totalPages: number,
  currentPage: number
} | null> {
  console.log('Fetching leaderboard data...');

  const result = await fetch(`${import.meta.env.VITE_BE_URL}users/leaderboard?page=${encodeURIComponent(page)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });

  const data = await result.json();

  if (result.status !== 200) {
    console.error('Error getting leaderboard data...'); // TODO: throw errors
    return null;
  }

  console.log('Leaderboard data fetched');

  return data;
}

/**
 * Profile page query
 */
export async function getProfile(): Promise<{
  _id: string;
  username: string;
  email: string;
  picture: string;
  preferences: IUserPreferences;
  stats: IUserStats
} | null> {
  console.log('Fetching profile data...');

  const result = await fetch(`${import.meta.env.VITE_BE_URL}users/profile`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });

  const data = await result.json();

  if (result.status !== 200) {
    console.error('Error getting profile data...'); // TODO: throw errors
    return null;
  }

  console.log('Profile data fetched');

  return data;
}

export async function updateProfile(payload: {
  email?: string,
  password?: string,
  picture?: string
  emailNotifications?: boolean
  chat?: boolean
}) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BE_URL}users/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Profile updated! :)');
      return {
        success: true,
        user: data
      };
    } else {
      console.log('Server responded with an error:', data.message || 'Unknown error');
      return {
        success: false,
        error: data.message || 'Unknown error'
      };
    }
  } catch (error) {
    console.error('Network error updating profile:', error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
}

export async function deleteAccount() {
  try {
    const response = await fetch(`${import.meta.env.VITE_BE_URL}users/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Profile deleted :(');
      return {
        success: true,
        result: data
      };
    } else {
      console.log('Server responded with an error:', data.message || 'Unknown error');
      return {
        success: false,
        error: data.message || 'Unknown error'
      };
    }
  } catch (error) {
    console.error('Network error while deleting account:', error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
}

export async function sendLogout() {
  try {
    const response = await fetch(`${import.meta.env.VITE_BE_URL}users/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Logged out');
      return {
        success: true,
        result: data
      };
    } else {
      console.log('Server responded with an error:', data.message || 'Unknown error');
      return {
        success: false,
        error: data.message || 'Unknown error'
      };
    }
  } catch (error) {
    console.error('Network error while logging out account:', error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
}