import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  auth?: boolean;
}

class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, auth = true } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (auth) {
    const token = Cookies.get('access_token');
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (response.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      requestHeaders['Authorization'] = `Bearer ${Cookies.get('access_token')}`;
      const retryResponse = await fetch(`${API_URL}${endpoint}`, {
        ...config,
        headers: requestHeaders,
      });
      if (!retryResponse.ok) {
        throw new ApiError('Request failed after token refresh', retryResponse.status);
      }
      return retryResponse.json();
    }
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    window.location.href = '/auth/login';
    throw new ApiError('Session expired', 401);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `Request failed with status ${response.status}`,
      response.status,
      errorData
    );
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

async function refreshToken(): Promise<boolean> {
  const refreshToken = Cookies.get('refresh_token');
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    Cookies.set('access_token', data.accessToken, { expires: 1 / 24 });
    Cookies.set('refresh_token', data.refreshToken, { expires: 7 });
    return true;
  } catch {
    return false;
  }
}

// ==================== AUTH API ====================
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<any>('/api/v1/auth/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
    }),

  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: string;
  }) =>
    apiRequest<any>('/api/v1/auth/register', {
      method: 'POST',
      body: data,
      auth: false,
    }),

  getProfile: () => apiRequest<any>('/api/v1/auth/profile'),

  updateProfile: (data: any) =>
    apiRequest<any>('/api/v1/auth/profile', { method: 'PUT', body: data }),
};

// ==================== PRODUCTS API ====================
export const productsApi = {
  getAll: (page = 0, size = 12) =>
    apiRequest<any>(`/api/v1/products/public?page=${page}&size=${size}`, { auth: false }),

  getById: (id: string) =>
    apiRequest<any>(`/api/v1/products/public/${id}`, { auth: false }),

  getFeatured: () =>
    apiRequest<any>('/api/v1/products/public/featured', { auth: false }),

  search: (query: string, category?: string, minPrice?: number, maxPrice?: number) =>
    apiRequest<any>('/api/v1/products/search', {
      method: 'POST',
      body: { query, category, minPrice, maxPrice },
      auth: false,
    }),

  create: (data: any) =>
    apiRequest<any>('/api/v1/products', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest<any>(`/api/v1/products/${id}`, { method: 'PUT', body: data }),
};

// ==================== PANDITS API ====================
export const panditsApi = {
  getAll: (page = 0, size = 12) =>
    apiRequest<any>(`/api/v1/pandits/public?page=${page}&size=${size}`, { auth: false }),

  getById: (id: string) =>
    apiRequest<any>(`/api/v1/pandits/public/${id}`, { auth: false }),

  search: (query: string, specialization?: string, city?: string) =>
    apiRequest<any>('/api/v1/pandits/search', {
      method: 'POST',
      body: { query, specialization, city },
      auth: false,
    }),

  getContent: (panditId: string) =>
    apiRequest<any>(`/api/v1/pandits/public/${panditId}/content`, { auth: false }),
};

// ==================== ORDERS API ====================
export const ordersApi = {
  getCart: () => apiRequest<any>('/api/v1/orders/cart'),

  addToCart: (productId: string, quantity: number) =>
    apiRequest<any>('/api/v1/orders/cart', {
      method: 'POST',
      body: { productId, quantity },
    }),

  removeFromCart: (itemId: string) =>
    apiRequest<any>(`/api/v1/orders/cart/${itemId}`, { method: 'DELETE' }),

  createOrder: (data: any) =>
    apiRequest<any>('/api/v1/orders', { method: 'POST', body: data }),

  getOrders: () => apiRequest<any>('/api/v1/orders'),

  getOrderById: (id: string) => apiRequest<any>(`/api/v1/orders/${id}`),

  createBooking: (data: any) =>
    apiRequest<any>('/api/v1/orders/bookings', { method: 'POST', body: data }),

  getBookings: () => apiRequest<any>('/api/v1/orders/bookings'),
};

// ==================== PAYMENTS API ====================
export const paymentsApi = {
  createOrder: (orderId: string, amount: number) =>
    apiRequest<any>('/api/v1/payments/create-order', {
      method: 'POST',
      body: { orderId, amount },
    }),

  verify: (data: any) =>
    apiRequest<any>('/api/v1/payments/verify', { method: 'POST', body: data }),
};

// ==================== AI / RAG API ====================
export const aiApi = {
  chat: (message: string, language = 'en') =>
    apiRequest<any>('/api/v1/ai/chat', {
      method: 'POST',
      body: { message, language },
      auth: false,
    }),

  search: (query: string, type?: string) =>
    apiRequest<any>('/api/v1/ai/search', {
      method: 'POST',
      body: { query, type },
      auth: false,
    }),
};

export { ApiError };
export default apiRequest;
