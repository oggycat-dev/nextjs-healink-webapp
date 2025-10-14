// Order and Cart related types

export interface CartItem {
  id: string;
  podcastId: string;
  podcastTitle: string;
  podcastCoverUrl: string;
  creatorName: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  orderDate: string;
  status: OrderStatus;
  statusName: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paymentStatusName: string;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
  createdAt: string;
  updatedAt: string | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  podcastId: string;
  podcastTitle: string;
  podcastCoverUrl: string;
  creatorName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
}

export enum OrderStatus {
  Pending = 0,
  Processing = 1,
  Confirmed = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5,
  Refunded = 6,
}

export enum PaymentStatus {
  Pending = 0,
  Paid = 1,
  Failed = 2,
  Refunded = 3,
}

export interface CreateOrderRequest {
  items: {
    podcastId: string;
    quantity: number;
    price: number;
  }[];
  paymentMethod: string;
  shippingAddress?: ShippingAddress;
}

export interface OrderFilter {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  sortBy?: 'orderDate' | 'totalAmount' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// Subscription Plan types
export interface SubscriptionPlan {
  id: string;
  name: string;
  displayName: string;
  description: string;
  isActive: boolean;
  featureConfig: string; // JSON string
  currency: string;
  billingPeriodCount: number;
  billingPeriodUnit: number; // 1=Month, 2=Year
  billingPeriodUnitName: string;
  amount: number;
  trialDays: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface SubscriptionPlanFilter {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  isActive?: boolean;
  billingPeriodUnit?: number;
  minAmount?: number;
  maxAmount?: number;
  currency?: string;
}
