export type SpicyLevel = 0 | 1 | 2 | 3;

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  offerPrice?: number;
  image: string;
  availability: boolean;
  stock: number;
  isVeg: boolean;
  popularBadge?: boolean;
  spicyLevel: SpicyLevel;
  prepTime: string; // e.g. "20-25 mins"
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Accepted' 
  | 'Preparing' 
  | 'Ready' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled';

export type PaymentMethod = 'COD' | 'ONLINE_RAZORPAY';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  altPhone?: string;
  addressType?: 'Home' | 'Office' | 'Other';
  address: string;
  landmark?: string;
  area: string;
  pincode: string;
  location?: LocationCoordinates;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: CartItem[];
  status: OrderStatus;
  orderTime: string;
  estimatedTime: string;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  discount: number;
  grandTotal: number;
  couponCode?: string;
  paid: boolean;
  driverLocation?: LocationCoordinates;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  active: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  categoryLink?: string;
  active: boolean;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
  reply?: string;
}

export interface RestaurantSettings {
  restaurantName: string;
  phone: string;
  address: string;
  landmark: string;
  pincode: string;
  bookingTime: string;
  foodAvailableTime: string;
  openingHour: number; // 19 (7 PM)
  closingHour: number; // 2 (2 AM)
  deliveryCharge: number;
  minOrderAmount: number;
  taxPercentage: number;
  isClosedForced: boolean;
  holidayMode: boolean;
  allowAnytimeOrdering: boolean;
}

export type ViewMode = 'customer' | 'admin';
export type AdminTab = 'dashboard' | 'orders' | 'kitchen' | 'products' | 'categories' | 'coupons' | 'banners' | 'customers' | 'analytics' | 'reviews' | 'settings';
export type CustomerTab = 
  | 'home' 
  | 'menu' 
  | 'offers' 
  | 'about' 
  | 'contact' 
  | 'orders' 
  | 'wishlist'
  | 'mandi-tirunelveli'
  | 'biryani-tirunelveli'
  | 'midnight-food-tirunelveli'
  | 'food-delivery-melapalayam'
  | 'shawarma-tirunelveli'
  | 'pizza-tirunelveli'
  | 'fried-chicken-tirunelveli'
  | 'faq'
  | 'privacy-policy'
  | 'terms';

