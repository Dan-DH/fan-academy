export type AuthLoginUser = {
  username: string;
  password: string;
};

export type AuthRegisterUser = {
  username: string;
  email: string;
  password: string;
  confirmation: string;
};

export interface AuthUserData {
  userId: string;
  preferences?: {
    emailNotifications?: boolean;
    chat?: boolean;
    sound?: boolean;
  };
}

export interface AuthResponse {
  token: string;
  message?: string;
  userData: AuthUserData;
}

export interface ApiAuthError {
  code?: number;
  message: string;
  statusCode?: number;
}
