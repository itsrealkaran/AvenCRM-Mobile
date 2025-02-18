import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8000';
const AUTH_TOKEN_KEY = 'auth_token';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'AGENT' | 'TEAM_LEADER';
    companyId: string | null;
  };
}

interface DashboardData {
  totalLeads: number;
  totalDeals: number;
  pendingTasks: number;
  revenue: number;
  performanceData: Array<{
    month: string;
    deals: number;
  }>;
}

class ApiClient {
  private token: string | null = null;

  async initialize() {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        this.token = token;
      }
    } catch (error) {
      console.error('Error initializing API client:', error);
    }
  }

  async getStoredToken() {
    if (!this.token) {
      this.token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    }
    return this.token;
  }

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  async clearToken() {
    this.token = null;
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const token = await this.getStoredToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      await this.clearToken();
      throw new Error('Authentication expired');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.fetch('/auth/sign-in/agents', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      await this.setToken(response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.fetch('/auth/me');
  }

  async getAgentDashboard(): Promise<DashboardData> {
    return this.fetch('/api/dashboard/agent');      
  }

  // Add more API methods as needed for other endpoints
}

export const api = new ApiClient();

// Initialize the API client when the app starts
api.initialize().catch(console.error); 