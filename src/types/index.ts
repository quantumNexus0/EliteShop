export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory: string;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  tags: string[];
  featured: boolean;
  sizes: string[];
  colors: string[];
  material?: string;
  gender?: 'men' | 'women' | 'kids';
  sku: string;
  discount?: number;
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  phone?: string;
  profilePicture?: string;
  isAdmin: boolean;
  addresses: Address[];
  wishlist: string[];
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  couponCode?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
}

export interface Address {
  id?: string;
  type: 'home' | 'work' | 'other';
  name: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
  isVerifiedPurchase: boolean;
  helpful: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  subcategories?: Category[];
  productCount: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  expiryDate: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: Date;
}

export interface SearchFilters {
  category?: string;
  subcategory?: string;
  priceRange?: [number, number];
  brands?: string[];
  colors?: string[];
  sizes?: string[];
  rating?: number;
  inStock?: boolean;
  sortBy?: 'name' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'popularity';
  search?: string;
}