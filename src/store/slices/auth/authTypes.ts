
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  data: {
    jwtTokens: {
      access_token: string;
      refresh_token: string;
    };
    profile: any;
    isOnboarding?: boolean | number;
  };
}

export interface TokenRefreshPayload {
  refresh_token: string;
  userId: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refresh_token: string;
  user: any;
}
