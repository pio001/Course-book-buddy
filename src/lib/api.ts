import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Use env; ensure it's set in Vercel

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers ['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  getMe: () => api.get('/users/me')
};

// Users API (profile and admin lists)
export const usersAPI = {
  getAll: () => api.get('/users'),
  updateMe: (payload: any) => api.put('/users/me', payload),
};

// Books API
export const booksAPI = {
  getAll: () => api.get('/books'),
  getById: (id: string) => api.get(`/books/${id}`),
  create: (bookData: any) => api.post('/books', bookData),
  update: (id: string, bookData: any) => api.put(`/books/${id}`, bookData),
  delete: (id: string) => api.delete(`/books/${id}`)
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getMyOrders: () => api.get('/orders/me'),
  create: (orderData: any) => api.post('/orders', orderData),
  getById: (id: string) => api.get(`/orders/${id}`)
};

// Upload API
export const uploadAPI = {
  image: (file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    return api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
};

// Courses API
export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getById: (id: string) => api.get(`/courses/${id}`)
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (bookId: string, quantity: number = 1) => api.post('/cart', { book_id: bookId, quantity }),
  update: (bookId: string, quantity: number) => api.put(`/cart/${bookId}`, { quantity }),
  remove: (bookId: string) => api.delete(`/cart/${bookId}`),
  clear: () => api.delete('/cart'),
};

// Wishlist API
export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  add: (bookId: string, notify_when_available: boolean = false) => api.post('/wishlist', { book_id: bookId, notify_when_available }),
  remove: (bookId: string) => api.delete(`/wishlist/${bookId}`),
};

// Reviews API
export const reviewsAPI = {
  getByBook: (bookId: string) => api.get(`/reviews/book/${bookId}`),
  create: (payload: { book_id: string; rating: number; comment?: string }) => api.post('/reviews', payload),
};

// Departments API
export const departmentsAPI = {
  getAll: () => api.get('/departments'),
  getById: (id: string) => api.get(`/departments/${id}`)
};

export default api;