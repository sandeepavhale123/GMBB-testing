
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
    message: string;
    isOnboarding?: number; // Add the missing isOnboarding property
    subscriptionExpired?: boolean; // This will be added by our logic, not the API
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
