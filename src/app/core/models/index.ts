// ── Product Models ──────────────────────────────────────
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  subCategory: string;
  images: string[];
  badge?: 'New Arrival' | 'Bestseller' | 'Sale' | 'Trending' | 'Hot Pick';
  inStock: boolean;
  stockCount: number;
  sizes?: string[];
  colors?: string[];
  fabric?: string;
  rating: number;
  reviewCount: number;
  createdAt: Date;
}

export type ProductCategory = 'women' | 'men' | 'western' | 'kids';

export interface ProductFilter {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── Auth Models ──────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: Date;
  user: User;
}

// ── Cart Models ───────────────────────────────────────────
export interface CartItem {
  productId: number;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
}

// ── Order Models ──────────────────────────────────────────
export interface Address {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  userId: number;
  items: CartItem[];
  address: Address;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'cod' | 'online';
  subtotal: number;
  discount: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// ── Enquiry Model ─────────────────────────────────────────
export interface EnquiryRequest {
  name: string;
  phone: string;
  email?: string;
  category?: string;
  message: string;
}
