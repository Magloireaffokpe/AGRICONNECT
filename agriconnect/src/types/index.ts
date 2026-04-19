export type UserRole = "FARMER" | "BUYER" | "ADMIN";

export interface FarmerProfile {
  id: number;
  farm_name: string;
  verified: boolean;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  location: string;
  role: UserRole;
  is_active: boolean;
  date_joined: string;
  farmer_profile?: FarmerProfile;
}

export type ProductCategory =
  | "FRUITS"
  | "VEGETABLES"
  | "CEREALS"
  | "MEAT"
  | "DAIRY"
  | "OTHER";

export interface Product {
  id: number;
  name: string;
  description: string;
  category: ProductCategory;
  price: string;
  quantity_available: number;
  farmer: number;
  farmer_name: string;
  farmer_location: string;
  image: string | null;
  is_available: boolean;
  average_rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
export type DeliveryType = "HOME_DELIVERY" | "PICKUP";
export type DeliveryStatus = "PENDING" | "IN_TRANSIT" | "DELIVERED" | "FAILED";

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface Delivery {
  id: number;
  order: number; // ✅ ID de la commande liée — manquait dans l'ancienne version
  delivery_address: string;
  delivery_status: DeliveryStatus;
  delivery_date: string | null;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: number;
  buyer: number;
  buyer_name: string;
  items: OrderItem[];
  total_price: string;
  status: OrderStatus;
  delivery_type: DeliveryType;
  delivery?: Delivery;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  product: number;
  product_name: string;
  buyer: number;
  buyer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AdminStats {
  total_orders: number;
  total_revenue: string;
  total_users: number;
  total_farmers: number;
  total_buyers: number;
  total_products: number;
  top_products: { name: string; total_quantity: number }[];
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface ProductFilters {
  category?: ProductCategory;
  min_price?: number;
  max_price?: number;
  location?: string;
  search?: string;
  ordering?: string;
  is_available?: boolean;
  page?: number;
  page_size?: number;
}
