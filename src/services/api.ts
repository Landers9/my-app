// services/api.ts

import { ApiError } from '@/types/models';

// NEXT_PUBLIC_API_URL contient déjà /api/v1
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcommands-staging.milleniumtechs.com/api/v1';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: ApiError = {
        message: errorData.message || `HTTP Error ${response.status}`,
        status: response.status,
        errors: errorData.errors || {}
      };
      throw error;
    }

    const data = await response.json();
    return data;
  }

  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data: unknown, options?: { headers?: Record<string, string> }): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options?.headers || {})
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    return this.handleResponse<T>(response);
  }
}

export const apiService = new ApiService();