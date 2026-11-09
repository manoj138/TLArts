import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1006';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
});

// Interceptor to attach admin auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tlarts_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Format image URL helper
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:') || imagePath.startsWith('blob:')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}${cleanPath}`;
};

// Auth endpoints
export const authApi = {
  login: async (credentials) => {
    // credentials: { passcode } OR { username, password }
    const response = await apiClient.post('/admin/login', credentials);
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get('/admin/me');
    return response.data;
  }
};

// Artwork endpoints
export const artworkApi = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/artworks', { params });
    return response.data.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/artworks/${id}`);
    return response.data.data;
  },
  create: async (formData) => {
    const response = await apiClient.post('/artworks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },
  update: async (id, formData) => {
    const response = await apiClient.put(`/artworks/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/artworks/${id}`);
    return response.data;
  }
};

// Commission Inquiry endpoints
export const inquiryApi = {
  create: async (formData) => {
    const response = await apiClient.post('/inquiries', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },
  getAll: async () => {
    const response = await apiClient.get('/inquiries');
    return response.data.data;
  },
  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`/inquiries/${id}/status`, { status });
    return response.data.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/inquiries/${id}`);
    return response.data;
  }
};

// Studio Video / Reel endpoints
export const videoApi = {
  getAll: async () => {
    const response = await apiClient.get('/videos');
    return response.data.data;
  },
  create: async (formData) => {
    const response = await apiClient.post('/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },
  update: async (id, formData) => {
    const response = await apiClient.put(`/videos/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/videos/${id}`);
    return response.data;
  }
};

export default apiClient;

