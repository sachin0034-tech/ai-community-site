const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ai-community-site.onrender.com/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  lastLogin?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      // Handle network errors
      if (!response.ok) {
        let errorMessage = 'Request failed';
        try {
          const data = await response.json();
          errorMessage = data.message || `Server error: ${response.status}`;
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('API request failed:', error);
      // Provide more helpful error messages for network failures
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error('Unable to connect to server. Please make sure the server is running on http://localhost:5001');
      }
      throw error;
    }
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/me');
  }

  async verifyToken(token: string): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/verify-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Utility methods
  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  removeAuthToken(): void {
    localStorage.removeItem('authToken');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const apiService = new ApiService(API_BASE_URL);
export type { ApiResponse, LoginCredentials, RegisterData, User, AuthResponse };
