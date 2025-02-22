import axios, { AxiosInstance, AxiosError } from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropertyResponse } from '@/types/property';

// const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8000';
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'https://backend.avencrm.com';
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

class ApiClient {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for handling errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await this.clearToken();
        }
        return Promise.reject(error);
      }
    );

    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

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

  private async getStoredToken() {
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

  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.api.post('/auth/sign-in/agents', { email, password });
    console.log('[API] Login response:', response.data);
    if (response.data.token) {
      await this.setToken(response.data.token);
    }
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get('/auth/me');
    console.log('[API] Get current user response:', response.data);
    return response.data;
  }

  // Dashboard endpoints
  async getAgentDashboard() {
    const response = await this.api.get('/api/dashboard/agent');
    console.log('[API] Get agent dashboard response:', response.data);
    return response.data;
  }

  // Property endpoints
  async getProperties(): Promise<PropertyResponse> {
    try {
      const response = await this.api.get('/property');
      console.log('[API] Get properties response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] Error fetching properties:', error);
      throw error;
    }
  }

  // Add more API methods as needed, following the same pattern
}

export const api = new ApiClient();

// Initialize the API client when the app starts
api.initialize().catch(console.error); 