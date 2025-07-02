export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  agencyName: string;
  email: string;
  password: string;
  plan: string;
}

export interface LoginResponse {
  data: {
    jwtTokens: {
      access_token: string;
      refresh_token: string;
    };
    profile: any;
    message: string;
    isOnboarding?: number;
    subscriptionExpired?: boolean;
  };
}

export interface SignupResponse {
  success: boolean;
  sessionUrl?: string;
  sessionId?: string;
  message?: string;
}

export interface TokenRefreshPayload {
  refresh_token: string;
  userId: string;
}

export interface TokenRefreshResponse {
  data: {
    access_token: string;
    refresh_token: string;
    user?: any;
  };
}
