import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8000';

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

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

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
      this.setToken(response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.fetch('/auth/me');
  }

  async getAgentDashboard(): Promise<DashboardData> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    return this.fetch('/api/dashboard/agent');      
  }

  // Add more API methods as needed for other endpoints
}

export const api = new ApiClient(); 