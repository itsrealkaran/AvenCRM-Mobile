import axios, { AxiosInstance, AxiosError } from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropertyResponse } from '@/types/property';
import type { Lead, LeadResponse, LeadStatus, LeadTransfer, LeadInputPayload } from '@/types/lead';
import type { Deal, DealInput, DealResponse, DealStatus } from '@/types/deal';
import type { Transaction } from '@/types/transactions';
import type { Notification, NotificationResponse } from '@/types/notification';

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

  // Leads endpoints
  async getLeads(params?: { page?: number; limit?: number; status?: string }): Promise<LeadResponse> {
    try {
      const response = await this.api.get('/leads', { params });
      console.log('[API] Get leads response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] Error fetching leads:', error);
      throw error;
    }
  }

  async getLeadById(id: string): Promise<Lead> {
    try {
      const response = await this.api.get(`/leads/${id}`);
      console.log('[API] Get lead by ID response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] Error fetching lead:', error);
      throw error;
    }
  }

  async createLead(data: LeadInputPayload): Promise<Lead> {
    try {
      const formData = new FormData();
      const cleanData = {
        ...data,
        expectedDate: data.expectedDate ? new Date(data.expectedDate).toISOString() : undefined,
        budget: data.budget ? parseFloat(data.budget.toString()) : undefined,
      };

      formData.append('data', JSON.stringify(cleanData));

      const response = await this.api.post('/leads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('[API] Create lead response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] Error creating lead:', error);
      throw error;
    }
  }

  async updateLead(id: string, data: LeadInputPayload): Promise<Lead> {
    try {
      const formData = new FormData();
      const cleanData = {
        ...data,
        expectedDate: data.expectedDate ? new Date(data.expectedDate).toISOString() : undefined,
        budget: data.budget ? parseFloat(data.budget.toString()) : undefined,
      };

      formData.append('data', JSON.stringify(cleanData));
      console.log('[API] Update lead data:', cleanData);

      const response = await this.api.put(`/leads/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('[API] Update lead response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] Error updating lead:', error);
      throw error;
    }
  }

  async updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
    try {
      const response = await this.api.patch(`/leads/${id}/status`, { status });
      console.log('[API] Update lead status response:', response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 500) {
        console.log('[API] Server error updating lead status:', error);
        return error.response.data;
      }
      console.error('[API] Error updating lead status:', error);
      throw error;
    }
  }

  async deleteLead(id: string): Promise<void> {
    try {
      await this.api.delete(`/leads/${id}`);
      console.log('[API] Delete lead success');
    } catch (error) {
      console.error('[API] Error deleting lead:', error);
      throw error;
    }
  }

  async bulkDeleteLeads(leadIds: string[]): Promise<void> {
    try {
      await this.api.delete('/leads', { data: { leadIds } });
      console.log('[API] Bulk delete leads success');
    } catch (error) {
      console.error('[API] Error bulk deleting leads:', error);
      throw error;
    }
  }

  async bulkAssignLeads(leadIds: string[], agentId: string): Promise<void> {
    try {
      await this.api.post('/leads/bulk-assign', { leadIds, agentId });
      console.log('[API] Bulk assign leads success');
    } catch (error) {
      console.error('[API] Error bulk assigning leads:', error);
      throw error;
    }
  }

  // async convertToDeal(data: LeadTransfer): Promise<{ deal: any; message: string }> {
  //   try {
  //     const response = await this.api.post('/leads/convert', {
  //       ...data,
  //       expectedCloseDate: data.expectedCloseDate 
  //         ? new Date(data.expectedCloseDate).toISOString() 
  //         : undefined,
  //     });
  //     console.log('[API] Convert to deal response:', response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error('[API] Error converting lead to deal:', error);
  //     throw error;
  //   }
  // }

  async addNote(id: string, note: object): Promise<Lead> {
    try {
      const response = await this.api.post(`/leads/${id}/notes`, note);
      console.log('[API] Add note response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] Error adding note:', error);
      throw error;
    }
  }

  // Deals endpoints
  async getDeals(params?: { page?: number; limit?: number; status?: string }): Promise<DealResponse> {
    try {
      const response = await this.api.get('/deals', { params });
      console.log('[API] Get deals response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] Error fetching deals:', error);
      throw error;
    }
  }

  async getDealById(id: string): Promise<Deal> {
    try {
      const response = await this.api.get(`/deals/${id}`);
      console.log('[API] Get deal by ID response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] Error fetching deal:', error);
      throw error;
    }
  }

  async createDeal(data: DealInput): Promise<Deal> {
    try {
      const formData = new FormData();
      const cleanData = {
        ...data,
        expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate).toISOString() : undefined,
        actualCloseDate: data.actualCloseDate ? new Date(data.actualCloseDate).toISOString() : undefined,
      };

      formData.append('data', JSON.stringify(cleanData));

      const response = await this.api.post('/deals', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('[API] Create deal response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] Error creating deal:', error);
      throw error;
    }
  }

  async updateDeal(id: string, data: DealInput): Promise<Deal> {
    try {
      const formData = new FormData();
      const cleanData = {
        ...data,
        expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate).toISOString() : undefined,
        actualCloseDate: data.actualCloseDate ? new Date(data.actualCloseDate).toISOString() : undefined,
      };

      formData.append('data', JSON.stringify(cleanData));

      const response = await this.api.put(`/deals/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('[API] Update deal response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] Error updating deal:', error);
      throw error;
    }
  }

  async updateDealStatus(id: string, status: DealStatus): Promise<Deal> {
    try {
      const response = await this.api.patch(`/deals/${id}/status`, { status });
      console.log('[API] Update deal status response:', response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 500) {
        console.log('[API] Server error updating lead status:', error);
        return error.response.data;
      }
      console.error('[API] Error updating lead status:', error);
      throw error;
    }
  }

  async addDealNote(id: string, note: object): Promise<Deal> {
    try {
      const response = await this.api.post(`/deals/${id}/notes`, note );
      console.log('[API] Add deal note response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] Error adding deal note:', error);
      throw error;
    }
  }

  async deleteDeal(id: string): Promise<void> {
    try {
      await this.api.delete(`/deals/${id}`);
      console.log('[API] Delete deal success');
    } catch (error) {
      console.error('[API] Error deleting deal:', error);
      throw error;
    }
  }

  // Notification endpoints
  async getNotifications(): Promise<NotificationResponse> {
    try {
      const response = await this.api.get('/notification');
      console.log('[API] Get notifications response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] Error fetching notifications:', error);
      throw error;
    }
  }

  async getNotificationCount(): Promise<number> {
    try {
      const response = await this.api.get('/notifications/count');
      console.log('[API] Get notification count response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] Error fetching notification count:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const response = await this.api.post(`/notifications/read/${notificationId}`);
      console.log('[API] Mark notification as read response:', response.data);
    } catch (error) {
      console.error('[API] Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(): Promise<void> {
    try {
      const response = await this.api.put('/notifications/mark-all-read');
      console.log('[API] Mark all notifications as read response:', response.data);
    } catch (error) {
      console.error('[API] Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Transactions endpoints
  async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await this.api.get('/transactions');
      console.log('[API] Get transactions response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] Error fetching transactions:', error);
      throw error;
    }
  }

  // Add this method to the ApiClient class
  async convertToDeal(data: LeadTransfer): Promise<{ deal: Deal; message: string }> {
    try {
      const response = await this.api.post('/leads/convert', {
        leadId: data.leadId,
        dealAmount: data.dealAmount ? parseFloat(data.dealAmount.toString()) : 0,
        expectedCloseDate: data.expectedCloseDate 
          ? new Date(data.expectedCloseDate).toISOString() 
          : new Date().toISOString(),
      });
      console.log('[API] Convert to deal response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] Error converting lead to deal:', error);
      throw error;
    }
  }

  // Add these methods for currency support
  async getCurrency(): Promise<{ currency: string }> {
    try {
      const response = await this.api.get('/auth/currency');
      console.log('[API] Get currency response:', response.data);
      return { currency: response.data.currency || 'USD' };
    } catch (error) {
      console.error('[API] Error getting currency:', error);
      return { currency: 'USD' }; // Default to USD
    }
  }

  async setCurrency(currencyCode: string): Promise<void> {
    try {
      await this.api.post('/user/settings/currency', { currency: currencyCode });
      console.log('[API] Currency updated successfully');
    } catch (error) {
      console.error('[API] Error setting currency:', error);
      throw error;
    }
  }
}


export const api = new ApiClient();

// Initialize the API client when the app starts
api.initialize().catch(console.error); 