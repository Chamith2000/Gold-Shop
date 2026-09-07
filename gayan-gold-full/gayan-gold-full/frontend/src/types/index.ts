export type UserRole = "CUSTOMER" | "ADMIN";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  status?: string;
  createdAt?: string;
  rewardPoints?: number;
  rewardTier?: "SILVER" | "GOLD" | "PLATINUM";
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  active: boolean;
}

export type GoldPurity = "24K" | "22K" | "18K";

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  price: number;
  originalPrice?: number;
  goldPurity: GoldPurity;
  weightGrams: number;
  description: string;
  specifications?: Record<string, string>;
  inStock: boolean;
  stockCount: number;
  images: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  related?: Product[];
  reviews?: Review[];
}

export interface GiftCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  productCount?: number;
  displayOrder: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GiftProduct {
  id: string;
  name: string;
  slug: string;
  giftCategoryId: string;
  giftCategoryName: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  description: string;
  fullDescription?: string;
  mainImage: string;
  images: string[];
  stockQuantity: number;
  inStock: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNewArrival?: boolean;
  occasion?: string;
  customizationAvailable?: boolean;
  customizationInstructions?: string;
  deliveryInfo?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GiftComboPack {
  id: string;
  name: string;
  slug: string;
  description: string;
  individualValue: number;
  comboPrice: number;
  youSave: number;
  items: string[];
  image: string;
  inStock: boolean;
  stockCount: number;
  occasion?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface GiftRecommendation {
  id: string;
  targetType: "PRODUCT" | "CATEGORY";
  targetId: string;
  recommendedGiftIds: string[];
  recommendedCategoryIds: string[];
  priority: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Offer {
  id: string;
  title: string;
  subtitle?: string;
  bannerImage: string;
  description: string;
  discountPercent?: number;
  discountAmount?: number;
  specialPrice?: number;
  startDate: string;
  endDate?: string;
  applicableProductIds?: string[];
  applicableCategoryIds?: string[];
  offerType: "TODAY" | "JEWELLERY" | "GIFT" | "COUPLE" | "WEDDING" | "BIRTHDAY" | "ANNIVERSARY" | "SEASONAL" | "PROMOTION";
  isFeatured?: boolean;
  active: boolean;
  termsAndConditions?: string;
  calculatedStatus?: "ACTIVE" | "UPCOMING" | "EXPIRED";
  createdAt: string;
  updatedAt?: string;
}

export interface HomepageSection {
  id: string;
  key: "todays_offers" | "gift_picks" | "wedding_specials" | "birthday_specials" | "couple_collection" | "anniversary_specials" | "limited_time_offers";
  title: string;
  subtitle: string;
  active: boolean;
  displayOrder: number;
  itemIds?: string[];
  bannerImage?: string;
}

export interface CartItem {
  product?: Product;
  giftProduct?: GiftProduct;
  giftCombo?: GiftComboPack;
  isGift?: boolean;
  giftMessage?: string;
  quantity: number;
}

export interface ShippingAddress {
  fullName?: string;
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  phone?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  goldPurity: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  pointsRedeemed: number;
  shippingFee: number;
  totalAmount: number;
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  orderStatus: "PENDING" | "PROCESSING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  earnedPoints: number;
  shippingAddress: ShippingAddress;
  createdAt: string;
}

export interface RewardProfile {
  userId: string;
  currentPoints: number;
  lifetimeEarned: number;
  redeemedPoints: number;
  tier: "SILVER" | "GOLD" | "PLATINUM";
  tierMultiplier?: number;
  availableDiscountRupees?: number;
  updatedAt: string;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  type: "PURCHASE" | "REDEMPTION" | "LUCKY_WHEEL" | "ADMIN_ADJUSTMENT" | "REFUND_REVERSAL";
  points: number;
  reference?: string;
  description: string;
  balanceAfter: number;
  createdAt: string;
}

export interface GoldRate {
  id: string;
  date: string;
  rate24k: number;
  rate22k: number;
  rate18k: number;
  sovereign24k: number;
  sovereign22k: number;
  currency: string;
  recordedAt: string;
}

export interface GoldCalculatorResult {
  weightGrams: number;
  weightSovereigns: number;
  goldPurity: string;
  ratePerGram: number;
  baseGoldValue: number;
  craftingFeePercent: number;
  craftingFee: number;
  gemstoneValue: number;
  totalEstimatedPrice: number;
  currency: string;
}

export type TrafficLevel = "LOW" | "MODERATE" | "HIGH";
export type StoreStatus = "OPEN" | "BUSY" | "CLOSING_SOON" | "CLOSED";

export interface StoreActivity {
  id: string;
  currentVisitorCount: number;
  trafficLevel: TrafficLevel;
  estimatedWaitMinutes: number;
  storeStatus: StoreStatus;
  peakHoursNote?: string;
  recordedAt?: string;
  updatedAt: string;
}

export interface AppointmentSlot {
  time: string;
  available: boolean;
  bookedCount: number;
  capacity: number;
  trafficLevel: TrafficLevel;
  isRecommended: boolean;
  status: "RECOMMENDED" | "AVAILABLE" | "FULL";
}

export interface AppointmentAvailabilityResponse {
  date: string;
  appointmentType: string;
  currentStoreTraffic: TrafficLevel;
  currentWaitTime: number;
  slots: AppointmentSlot[];
}

export interface Appointment {
  id: string;
  appointmentNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  appointmentType: string;
  visitorCount: number;
  notes?: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "REJECTED";
  storeTrafficLevel?: TrafficLevel;
  createdAt: string;
}

export interface LuckyWheelSegment {
  id: string;
  name: string;
  rewardType: "POINTS" | "DISCOUNT_VOUCHER" | "GOLD_COIN_TOKEN" | "BETTER_LUCK";
  rewardPoints: number;
  probability: number;
  color?: string;
  active: boolean;
  displayOrder: number;
}

export interface LuckySpinStatus {
  eligible: boolean;
  secondsRemaining: number;
  lastSpunAt: string | null;
  nextEligibleAt: string;
  segments: LuckyWheelSegment[];
}

export interface LuckySpinRecord {
  id: string;
  userId: string;
  segmentId: string;
  segmentName: string;
  rewardPoints: number;
  spunAt: string;
  nextEligibleAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  helpfulVotes: number;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  adminEmail: string;
  ipAddress: string;
  details: string;
  timestamp: string;
}
