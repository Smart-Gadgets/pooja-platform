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
  const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json', ...headers };

  if (auth) {
    const token = Cookies.get('access_token');
    if (token) requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = { method, headers: requestHeaders };
  if (body && method !== 'GET') config.body = JSON.stringify(body);

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (response.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      requestHeaders['Authorization'] = `Bearer ${Cookies.get('access_token')}`;
      const retry = await fetch(`${API_URL}${endpoint}`, { ...config, headers: requestHeaders });
      if (!retry.ok) throw new ApiError('Request failed after refresh', retry.status);
      return retry.json();
    }
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    if (typeof window !== 'undefined') window.location.href = '/auth/login';
    throw new ApiError('Session expired', 401);
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new ApiError(err.message || `Request failed: ${response.status}`, response.status, err);
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

async function refreshToken(): Promise<boolean> {
  const rt = Cookies.get('refresh_token');
  const userId = Cookies.get('user_id');
  if (!rt || !userId) return false;
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    Cookies.set('access_token', data.accessToken, { expires: 1 / 24 });
    Cookies.set('refresh_token', data.refreshToken, { expires: 7 });
    return true;
  } catch { return false; }
}

// ==================== AUTH API ====================
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<any>('/api/v1/auth/login', { method: 'POST', body: { email, password }, auth: false }),

  register: (data: { name: string; email: string; phone: string; password: string; role?: string }) =>
    apiRequest<any>('/api/v1/auth/register', {
      method: 'POST',
      body: { fullName: data.name, email: data.email, phone: data.phone, password: data.password, role: data.role },
      auth: false,
    }),

  getProfile: () => apiRequest<any>('/api/v1/auth/profile'),
  updateProfile: (data: any) => apiRequest<any>('/api/v1/auth/profile', { method: 'PUT', body: data }),

  // Admin endpoints
  listUsers: (page = 0, size = 50, role?: string) =>
    apiRequest<any>(`/api/v1/auth/users?page=${page}&size=${size}${role ? `&role=${role}` : ''}`),
  approveUser: (id: string) => apiRequest<any>(`/api/v1/auth/users/${id}/approve`, { method: 'POST' }),
  suspendUser: (id: string) => apiRequest<any>(`/api/v1/auth/users/${id}/suspend`, { method: 'POST' }),
  activateUser: (id: string) => apiRequest<any>(`/api/v1/auth/users/${id}/activate`, { method: 'POST' }),
  deleteUser: (id: string) => apiRequest<any>(`/api/v1/auth/users/${id}`, { method: 'DELETE' }),
  changeUserRole: (id: string, role: string) =>
    apiRequest<any>(`/api/v1/auth/users/${id}/role?role=${role}`, { method: 'PUT' }),
};

// ==================== PRODUCTS API ====================
export const productsApi = {
  getAll: (page = 0, size = 12) =>
    apiRequest<any>(`/api/v1/products/public?page=${page}&size=${size}`, { auth: false }),
  getById: (id: string) =>
    apiRequest<any>(`/api/v1/products/public/${id}`, { auth: false }),
  getFeatured: () =>
    apiRequest<any>('/api/v1/products/public/featured', { auth: false }),
  search: (query: string, category?: string) =>
    apiRequest<any>('/api/v1/products/public/search', { method: 'POST', body: { query, category }, auth: false }),
  create: (data: any) =>
    apiRequest<any>('/api/v1/products', { method: 'POST', body: data }),
  update: (id: string, data: any) =>
    apiRequest<any>(`/api/v1/products/${id}`, { method: 'PUT', body: data }),
  getMyProducts: (page = 0, size = 20) =>
    apiRequest<any>(`/api/v1/products/seller/my-products?page=${page}&size=${size}`),
  approveProduct: (id: string) =>
    apiRequest<any>(`/api/v1/products/${id}/approve`, { method: 'POST' }),
  rejectProduct: (id: string) =>
    apiRequest<any>(`/api/v1/products/${id}/reject`, { method: 'POST' }),
};

// ==================== PANDITS API ====================
export const panditsApi = {
  getAll: (page = 0, size = 12) =>
    apiRequest<any>(`/api/v1/pandits/public?page=${page}&size=${size}`, { auth: false }),
  getById: (id: string) =>
    apiRequest<any>(`/api/v1/pandits/public/${id}`, { auth: false }),
  search: (query: string, specialization?: string, city?: string) =>
    apiRequest<any>('/api/v1/pandits/search', { method: 'POST', body: { query, specialization, city }, auth: false }),
  getContent: (panditId: string) =>
    apiRequest<any>(`/api/v1/pandits/public/${panditId}/content`, { auth: false }),
  getMyProfile: () => apiRequest<any>('/api/v1/pandits/me'),
  createProfile: (data: any) => apiRequest<any>('/api/v1/pandits', { method: 'POST', body: data }),
  updateProfile: (data: any) => apiRequest<any>('/api/v1/pandits', { method: 'PUT', body: data }),
  verifyPandit: (id: string) => apiRequest<any>(`/api/v1/pandits/${id}/verify`, { method: 'POST' }),
};

// ==================== ORDERS API ====================
export const ordersApi = {
  getCart: () => apiRequest<any>('/api/v1/cart'),
  addToCart: (productId: string, quantity: number, productName?: string, unitPrice?: number) =>
    apiRequest<any>('/api/v1/cart', { method: 'POST', body: { productId, quantity, productName, unitPrice } }),
  removeFromCart: (itemId: string) =>
    apiRequest<any>(`/api/v1/cart/${itemId}`, { method: 'DELETE' }),
  createOrder: (data: any) =>
    apiRequest<any>('/api/v1/orders', { method: 'POST', body: data }),
  getOrders: () => apiRequest<any>('/api/v1/orders'),
  getOrderById: (id: string) => apiRequest<any>(`/api/v1/orders/${id}`),
  updateOrderStatus: (id: string, status: string) =>
    apiRequest<any>(`/api/v1/orders/${id}/status?status=${status}`, { method: 'PATCH' }),
  createBooking: (data: any) =>
    apiRequest<any>('/api/v1/bookings', { method: 'POST', body: data }),
  getBookings: () => apiRequest<any>('/api/v1/bookings'),
  updateBookingStatus: (id: string, status: string) =>
    apiRequest<any>(`/api/v1/bookings/${id}/status?status=${status}`, { method: 'PATCH' }),
  getPanditBookings: (panditId: string) =>
    apiRequest<any>(`/api/v1/bookings/pandit/${panditId}`),
};

// ==================== AI / RAG API ====================
export const aiApi = {
  chat: (message: string, language = 'en') =>
    apiRequest<any>('/api/v1/ai/chat', { method: 'POST', body: { message, language }, auth: false }),
  search: (query: string, type?: string) =>
    apiRequest<any>('/api/v1/ai/search', { method: 'POST', body: { query, type }, auth: false }),
};

// ==================== AI IMAGE GENERATION (Pollinations.ai — FREE) ====================
export const aiImageApi = {
  /**
   * Generate product images using Pollinations.ai (100% free, no API key)
   * Returns array of image URLs
   */
  generateProductImages: (name: string, description: string, count = 4): string[] => {
    const basePrompt = `professional product photo, ${name}, ${description}, white background, studio lighting, ecommerce, high quality, 4k`;
    const variations = [
      `${basePrompt}, front view, clean minimal`,
      `${basePrompt}, lifestyle shot, context, warm lighting`,
      `${basePrompt}, close-up detail shot, macro`,
      `${basePrompt}, packaging mockup, branded, professional`,
      `${basePrompt}, flat lay, top view, aesthetic arrangement`,
    ];
    return variations.slice(0, count).map((prompt, i) =>
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&seed=${Date.now() + i}&nologo=true`
    );
  },

  /** AI-powered product description generator */
  generateDescription: async (name: string, category: string): Promise<string> => {
    try {
      const result = await aiApi.chat(
        `Generate a compelling product description for a pooja/spiritual item called "${name}" in category "${category}". ` +
        `Keep it under 100 words, mention authenticity and traditional significance. Return only the description text.`
      );
      return result?.response || result?.message || '';
    } catch {
      return '';
    }
  },

  /** AI pricing suggestion */
  suggestPrice: async (name: string, category: string): Promise<string> => {
    try {
      const result = await aiApi.chat(
        `Suggest a fair market price in INR for a pooja item called "${name}" in category "${category}". ` +
        `Give just the number like "499" without currency symbol. Consider Indian market pricing.`
      );
      return result?.response || result?.message || '';
    } catch {
      return '';
    }
  },
};

// ==================== PAYMENTS API ====================
export const paymentsApi = {
  createOrder: (orderId: string, amount: number) =>
    apiRequest<any>('/api/v1/payments/create-order', { method: 'POST', body: { orderId, amount } }),
  verify: (data: any) =>
    apiRequest<any>('/api/v1/payments/verify', { method: 'POST', body: data }),
};

export { ApiError };
export default apiRequest;
