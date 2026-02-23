export interface Product {
  id: string;
  name: string;
  nameHi?: string;
  description: string;
  descriptionHi?: string;
  category: string;
  price: number;
  originalPrice?: number;
  currency: string;
  imageUrl: string;
  images?: string[];
  tags: string[];
  sellerId: string;
  sellerName?: string;
  stock: number;
  rating?: number;
  reviewCount?: number;
  featured: boolean;
  approved: boolean;
  createdAt: string;
}

export interface Pandit {
  id: string;
  userId: string;
  name: string;
  title?: string;
  bio: string;
  profileImageUrl?: string;
  specializations: string[];
  languages: string[];
  experience: number;
  city: string;
  state: string;
  rating?: number;
  reviewCount?: number;
  pricePerHour?: number;
  pricePerCeremony?: number;
  virtualAvailable: boolean;
  verified: boolean;
  createdAt: string;
}

export interface PanditContent {
  id: string;
  panditId: string;
  type: 'BLOG' | 'VIDEO' | 'GALLERY';
  title: string;
  content: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  publishedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: string;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  panditId: string;
  panditName: string;
  ceremonyType: string;
  date: string;
  time: string;
  mode: 'VIRTUAL' | 'IN_PERSON';
  address?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  amount: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
