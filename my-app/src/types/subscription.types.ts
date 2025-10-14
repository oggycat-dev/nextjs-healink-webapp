// Subscription related types

export interface SubscriptionPlan {
  id: string;
  name: string;
  displayName: string;
  description: string;
  isActive: boolean;
  featureConfig: string; // JSON string of features
  currency: string;
  billingPeriodCount: number;
  billingPeriodUnit: BillingPeriodUnit;
  billingPeriodUnitName: string;
  amount: number;
  trialDays: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface SubscriptionPlanFeatures {
  maxPodcasts?: number;
  offlineDownload?: boolean;
  noAds?: boolean;
  hd?: boolean;
  exclusiveContent?: boolean;
  flashcards?: boolean;
  journal?: boolean;
  personalPodcast?: boolean;
  [key: string]: any;
}

export enum BillingPeriodUnit {
  Month = 1,
  Year = 2,
}

export interface UserSubscription {
  id: string;
  userProfileId: string;
  subscriptionPlanId: string;
  planName: string;
  planDisplayName: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionStatusName: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAt: string | null;
  canceledAt: string | null;
  cancelAtPeriodEnd: boolean;
  renewalBehavior: RenewalBehavior;
  renewalBehaviorName: string;
  createdAt: string;
  updatedAt: string | null;
}

export enum SubscriptionStatus {
  InTrial = 1,
  Active = 2,
  PastDue = 3,
  Canceled = 4,
  Paused = 5,
}

export enum RenewalBehavior {
  AutoRenew = 1,
  Manual = 2,
}

export interface SubscriptionPlanFilter {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  isActive?: boolean;
  billingPeriodUnit?: BillingPeriodUnit;
  minAmount?: number;
  maxAmount?: number;
  hasTrialPeriod?: boolean;
  minTrialDays?: number;
  currency?: string;
}

export interface CreateSubscriptionRequest {
  subscriptionPlanId: string;
  paymentMethodId: string; // Required for backend
}

export interface RegisterSubscriptionResponse {
  subscriptionId: string;
  subscriptionPlanName: string;
  amount: number;
  currency: string;
  // Payment redirect URLs
  paymentUrl: string;
  deepLink?: string;
  paymentTransactionId: string;
  // QR Code for payment
  qrCodeBase64?: string; // Base64-encoded PNG image
  qrCodeDataUrl?: string; // Original MoMo qrCodeUrl (raw data)
}

export interface CancelSubscriptionRequest {
  cancelAtPeriodEnd?: boolean;
  reason?: string;
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  cardLast4?: string;
  cardBrand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export enum PaymentMethodType {
  Card = 'card',
  BankTransfer = 'bank_transfer',
  EWallet = 'e_wallet',
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  clientSecret?: string;
  paymentUrl?: string;
}

export enum PaymentStatus {
  Pending = 'pending',
  Processing = 'processing',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Canceled = 'canceled',
}

export interface SubscriptionInvoice {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
  paidAt: string | null;
  invoiceNumber: string;
  downloadUrl?: string;
}

export enum InvoiceStatus {
  Draft = 'draft',
  Open = 'open',
  Paid = 'paid',
  Void = 'void',
  Uncollectible = 'uncollectible',
}
