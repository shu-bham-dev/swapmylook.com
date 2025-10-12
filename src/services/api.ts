// API service for communicating with the backend
const API_BASE_URL = 'http://localhost:3001/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface GenerationJob {
  jobId: string;
  status: 'queued' | 'processing' | 'succeeded' | 'failed';
  estimatedTime: number;
  queuePosition?: number;
}

interface JobStatus {
  jobId: string;
  status: 'queued' | 'processing' | 'succeeded' | 'failed';
  attempts: number;
  createdAt: string;
  updatedAt: string;
  estimatedTime: number;
  processingTime?: number;
  queueTime?: number;
  outputImage?: {
    id: string;
    url: string;
    width: number;
    height: number;
    sizeBytes: number;
  };
  error?: string;
  errorDetails?: any;
}

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  plan: string;
  quota: {
    monthlyRequests: number;
    usedThisMonth: number;
    remaining: number;
    resetDate: string;
    hasQuota: boolean;
  };
}

class ApiService {
  private authToken: string | null = null;

  constructor() {
    // Initialize with token from localStorage if available
    this.authToken = localStorage.getItem('authToken');
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.authToken || 'demo-token';
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string) {
    this.authToken = token;
    localStorage.setItem('authToken', token);
  }

  /**
   * Clear authentication token
   */
  clearAuthToken() {
    this.authToken = null;
    localStorage.removeItem('authToken');
  }

  /**
   * Demo authentication for testing
   */
  async demoAuth(email?: string): Promise<{ token: string; user: User }> {
    const response = await this.request<{ token: string; user: User }>('/auth/demo', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    this.setAuthToken(response.token);
    return response;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/me');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.authToken;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Create a new generation job
   */
  async createGenerationJob(modelImageId: string, outfitImageId: string, options?: any): Promise<GenerationJob> {
    const defaultPrompt = "Create a new image by combining the elements from the provided images. Take the cloths and place it with/on the model person. The final image should be a model wearing the cloths.";
    
    const payload = {
      modelImageId,
      outfitImageId,
      prompt: defaultPrompt,
      options: options || {
        strength: 0.9,
        preserveFace: true,
        background: 'transparent',
        style: 'realistic'
      }
    };

    return this.request<GenerationJob>('/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<JobStatus> {
    return this.request<JobStatus>(`/generate/${jobId}/status`);
  }

  /**
   * Cancel a job
   */
  async cancelJob(jobId: string): Promise<{ message: string; jobId: string; status: string }> {
    return this.request(`/generate/${jobId}/cancel`, {
      method: 'POST',
    });
  }

  /**
   * List user's jobs
   */
  async listJobs(params?: {
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{ jobs: any[]; pagination: any; filters: any }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = queryParams.toString() ? `/generate?${queryParams}` : '/generate';
    return this.request(endpoint);
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    averageProcessingTime: number;
    successRate: number;
  }> {
    return this.request('/generate/stats');
  }

  /**
   * Get user's outfits (models, outfits, and AI-generated images)
   */
  async getOutfits(params?: {
    type?: 'model' | 'outfit' | 'output' | 'all';
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    favorite?: boolean;
  }): Promise<{
    outfits: any[];
    pagination: any;
    filters: any;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = queryParams.toString() ? `/outfits?${queryParams}` : '/outfits';
    return this.request(endpoint);
  }

  /**
   * Get user's outfits statistics
   */
  async getOutfitsStats(): Promise<{
    total: number;
    byType: {
      model: number;
      outfit: number;
      output: number;
    };
    storageUsage: {
      totalBytes: number;
      totalFiles: number;
      byType: any;
    };
    favorites: number;
  }> {
    return this.request('/outfits/stats');
  }

  /**
   * Toggle favorite status for an outfit
   */
  async toggleOutfitFavorite(outfitId: string, favorite: boolean): Promise<{
    message: string;
    image: {
      id: string;
      favorite: boolean;
    };
  }> {
    return this.request(`/outfits/${outfitId}/favorite`, {
      method: 'POST',
      body: JSON.stringify({ favorite }),
    });
  }

  /**
   * Delete an outfit (soft delete)
   */
  async deleteOutfit(outfitId: string): Promise<{
    message: string;
    image: {
      id: string;
      isDeleted: boolean;
    };
  }> {
    return this.request(`/outfits/${outfitId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Upload a file directly
   */
  async uploadFile(file: File, purpose: 'model' | 'outfit'): Promise<{
    imageAsset: {
      id: string;
      url: string;
      type: string;
      width?: number;
      height?: number;
      sizeBytes: number;
      mimeType: string;
    };
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);

    const url = `${API_BASE_URL}/uploads/direct`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || 'demo-token'}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  /**
   * Get upload limits and allowed types
   */
  async getUploadLimits(): Promise<{
    maxFileSize: number;
    maxFileSizeHuman: string;
    allowedFileTypes: string[];
    allowedPurposes: string[];
  }> {
    return this.request('/uploads/limits');
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<{ message: string; version: string; status: string }> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api/v1', '')}`);
      return await response.json();
    } catch (error) {
      throw new Error('Backend server is not running');
    }
  }
}

export const apiService = new ApiService();