import {
  Category,
  Product,
  Order,
  RewardProfile,
  RewardTransaction,
  GoldRate,
  GoldCalculatorResult,
  StoreActivity,
  Appointment,
  AppointmentAvailabilityResponse,
  LuckySpinStatus,
  LuckySpinRecord,
  Review,
  NotificationItem,
  User,
  GiftCategory,
  GiftProduct,
  GiftComboPack,
  GiftRecommendation,
  Offer,
  HomepageSection,
} from "../types";

const TOKEN_KEY = "gayan_gold_token";

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const data = await response.json();
      errorMessage = data.error || data.message || errorMessage;
    } catch {
      errorMessage = `Server Error (${response.status})`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  // Authentication
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<{ token: string; user: User; rewardProfile: RewardProfile }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    register: (data: { fullName: string; email: string; password: string; phone?: string }) =>
      request<{ token: string; user: User; rewardProfile: RewardProfile }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    me: () => request<{ user: User; rewardProfile: RewardProfile }>("/api/auth/me"),
    updateProfile: (data: { fullName?: string; phone?: string }) =>
      request<{ user: User; message: string }>("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    forgotPassword: (email: string) =>
      request<{ message: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
  },

  // Categories
  categories: {
    getAll: () => request<Category[]>("/api/categories"),
    create: (data: Partial<Category>) =>
      request<Category>("/api/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Category>) =>
      request<Category>(`/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/api/categories/${id}`, {
        method: "DELETE",
      }),
  },

  // Products
  products: {
    getAll: (params?: {
      category?: string;
      purity?: string;
      search?: string;
      sort?: string;
      featured?: boolean;
      newArrivals?: boolean;
      bestSellers?: boolean;
      minPrice?: number;
      maxPrice?: number;
    }) => {
      const query = new URLSearchParams();
      if (params) {
        if (params.category) query.append("category", params.category);
        if (params.purity) query.append("purity", params.purity);
        if (params.search) query.append("search", params.search);
        if (params.sort) query.append("sort", params.sort);
        if (params.featured) query.append("featured", "true");
        if (params.newArrivals) query.append("newArrivals", "true");
        if (params.bestSellers) query.append("bestSellers", "true");
        if (params.minPrice) query.append("minPrice", String(params.minPrice));
        if (params.maxPrice) query.append("maxPrice", String(params.maxPrice));
      }
      const qs = query.toString();
      return request<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
    },
    getById: (id: string) => request<Product>(`/api/products/${id}`),
    create: (data: Partial<Product>) =>
      request<Product>("/api/products", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Product>) =>
      request<Product>(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/api/products/${id}`, {
        method: "DELETE",
      }),
    uploadImage: (data: { imageData: string; fileName?: string; mimeType?: string }) =>
      request<{ imageUrl: string; fileName: string; status: string; message: string }>("/api/products/upload-image", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    bulkStockUpdate: (updates: { id: string; stockCount?: number; inStock?: boolean }[]) =>
      request<{ message: string }>("/api/products/bulk-stock", {
        method: "POST",
        body: JSON.stringify({ updates }),
      }),
    addReview: (productId: string, data: { rating: number; title?: string; comment: string }) =>
      request<Review>(`/api/products/${productId}/reviews`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // Gold Rates
  goldRates: {
    getToday: () => request<GoldRate>("/api/gold-rates/today"),
    getHistory: (days: number = 7) => request<GoldRate[]>(`/api/gold-rates/history?days=${days}`),
    updateRate: (data: { rate24k: number; rate22k: number; rate18k?: number }) =>
      request<GoldRate>("/api/gold-rates", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    calculate: (data: {
      weightGrams: number;
      goldPurity?: string;
      craftingFeePercent?: number;
      gemstoneValue?: number;
    }) =>
      request<GoldCalculatorResult>("/api/gold-rates/calculate", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // Rewards & Lucky Wheel
  rewards: {
    getProfile: () => request<RewardProfile>("/api/rewards/profile"),
    getHistory: () => request<RewardTransaction[]>("/api/rewards/history"),
    calculateDiscount: (pointsToRedeem: number, orderTotal?: number) =>
      request<{
        pointsToRedeem: number;
        discountAmount: number;
        availablePointsAfter: number;
        currency: string;
      }>("/api/rewards/calculate-discount", {
        method: "POST",
        body: JSON.stringify({ pointsToRedeem, orderTotal }),
      }),
    adjustPoints: (userId: string, points: number, description?: string) =>
      request<{ message: string; profile: RewardProfile; transaction: RewardTransaction }>(
        "/api/rewards/adjust",
        {
          method: "POST",
          body: JSON.stringify({ userId, points, description }),
        }
      ),
    getSpinStatus: () => request<LuckySpinStatus>("/api/rewards/spin/status"),
    spinWheel: () =>
      request<{
        message: string;
        winningSegment: any;
        rewardPoints: number;
        rewardProfile: RewardProfile;
        nextEligibleAt: string;
        secondsRemaining: number;
      }>("/api/rewards/spin", {
        method: "POST",
      }),
    getSpinHistory: () => request<LuckySpinRecord[]>("/api/rewards/spin/history"),
  },

  // Store Traffic
  storeActivity: {
    getLive: () => request<StoreActivity>("/api/store-activity/live"),
    getTodaySchedule: () =>
      request<{
        activity: StoreActivity;
        schedule: { time: string; traffic: string; wait: string; recommendation: string }[];
      }>("/api/store-activity/today"),
    update: (data: Partial<StoreActivity>) =>
      request<StoreActivity>("/api/store-activity", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  // Appointments
  appointments: {
    getAvailability: (date: string, appointmentType?: string) =>
      request<AppointmentAvailabilityResponse>(
        `/api/appointments/availability?date=${encodeURIComponent(date)}&appointmentType=${encodeURIComponent(
          appointmentType || ""
        )}`
      ),
    book: (data: {
      date: string;
      timeSlot: string;
      appointmentType: string;
      visitorCount?: number;
      notes?: string;
    }) =>
      request<Appointment>("/api/appointments", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getMyAppointments: () => request<Appointment[]>("/api/appointments/my-appointments"),
    getAll: (params?: { status?: string; date?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.append("status", params.status);
      if (params?.date) query.append("date", params.date);
      const qs = query.toString();
      return request<Appointment[]>(`/api/appointments/all${qs ? `?${qs}` : ""}`);
    },
    updateStatus: (id: string, status: string) =>
      request<Appointment>(`/api/appointments/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
  },

  // Orders
  orders: {
    create: (data: {
      items: { productId: string; quantity: number }[];
      shippingAddress: any;
      pointsToRedeem?: number;
      couponCode?: string;
    }) =>
      request<{
        message: string;
        order: Order;
        earnedPoints: number;
        updatedRewardProfile: RewardProfile;
      }>("/api/orders", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getMyOrders: () => request<Order[]>("/api/orders/my-orders"),
    getById: (id: string) => request<Order>(`/api/orders/${id}`),
    updateStatus: (id: string, data: { orderStatus?: string; paymentStatus?: string }) =>
      request<Order>(`/api/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  // Wishlist
  wishlist: {
    getAll: () => request<Product[]>("/api/wishlist"),
    toggle: (productId: string) =>
      request<{ inWishlist: boolean; productId: string }>("/api/wishlist/toggle", {
        method: "POST",
        body: JSON.stringify({ productId }),
      }),
  },

  // Reviews
  reviews: {
    getAll: () => request<Review[]>("/api/reviews"),
    getStatistics: () => request<{ totalReviews: number; avgRating: number }>("/api/reviews/statistics"),
    markHelpful: (id: string) =>
      request<{ helpfulVotes: number }>(`/api/reviews/${id}/helpful`, {
        method: "POST",
      }),
  },

  // Notifications
  notifications: {
    getAll: () => request<NotificationItem[]>("/api/notifications"),
  },

  // Gifts & Celebrations
  gifts: {
    getCategories: () => request<GiftCategory[]>("/api/gifts/categories"),
    getProducts: (params?: {
      category?: string;
      occasion?: string;
      featured?: boolean;
      popular?: boolean;
      newArrival?: boolean;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
    }) => {
      const query = new URLSearchParams();
      if (params) {
        if (params.category) query.append("category", params.category);
        if (params.occasion) query.append("occasion", params.occasion);
        if (params.featured) query.append("featured", "true");
        if (params.popular) query.append("popular", "true");
        if (params.newArrival) query.append("newArrival", "true");
        if (params.search) query.append("search", params.search);
        if (params.minPrice) query.append("minPrice", String(params.minPrice));
        if (params.maxPrice) query.append("maxPrice", String(params.maxPrice));
      }
      const qs = query.toString();
      return request<GiftProduct[]>(`/api/gifts/products${qs ? `?${qs}` : ""}`);
    },
    getProductById: (id: string) => request<GiftProduct>(`/api/gifts/products/${id}`),
    getCombos: () => request<GiftComboPack[]>("/api/gifts/combos"),
    getComboById: (id: string) => request<GiftComboPack>(`/api/gifts/combos/${id}`),
    getRecommendations: (productId: string) =>
      request<{ jewelleryProduct: Product | null; recommendedGifts: GiftProduct[] }>(
        `/api/gifts/recommendations/${productId}`
      ),
  },

  // Exclusive Offers
  offers: {
    getAll: (type?: string) => request<Offer[]>(`/api/offers${type ? `?type=${type}` : ""}`),
    getActive: () => request<Offer[]>("/api/offers/active"),
    getToday: () => request<Offer[]>("/api/offers/today"),
    getById: (id: string) => request<Offer>(`/api/offers/${id}`),
  },

  // Homepage Dynamic Sections
  homepage: {
    getSections: () => request<HomepageSection[]>("/api/homepage/sections"),
    getOffers: () => request<Offer[]>("/api/homepage/offers"),
    getGifts: () => request<GiftProduct[]>("/api/homepage/gifts"),
  },

  // Admin Controls
  admin: {
    getDashboard: () => request<any>("/api/admin/dashboard"),
    getOrders: () => request<Order[]>("/api/admin/orders"),
    getUsers: () => request<any[]>("/api/admin/users"),
    updateUserStatus: (userId: string, data: { status?: string; role?: string }) =>
      request<any>(`/api/admin/users/${userId}/status`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    getSpinStatistics: () => request<any>("/api/admin/spin/statistics"),
    getSpinHistory: () => request<LuckySpinRecord[]>("/api/admin/spin/history"),
    updateSpinSettings: (data: any) =>
      request<any>("/api/admin/spin/settings", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    resetSpinCooldown: (userId: string) =>
      request<{ message: string }>("/api/admin/spin/reset-cooldown", {
        method: "POST",
        body: JSON.stringify({ userId }),
      }),
    getAuditLogs: () => request<any[]>("/api/admin/audit-logs"),

    // Admin Gift Categories CRUD
    getGiftCategories: () => request<GiftCategory[]>("/api/admin/gifts/categories"),
    createGiftCategory: (data: Partial<GiftCategory>) =>
      request<GiftCategory>("/api/admin/gifts/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateGiftCategory: (id: string, data: Partial<GiftCategory>) =>
      request<GiftCategory>(`/api/admin/gifts/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    deleteGiftCategory: (id: string) =>
      request<{ message: string }>(`/api/admin/gifts/categories/${id}`, { method: "DELETE" }),

    // Admin Gift Products CRUD
    getGiftProducts: () => request<GiftProduct[]>("/api/admin/gifts/products"),
    createGiftProduct: (data: Partial<GiftProduct>) =>
      request<GiftProduct>("/api/admin/gifts/products", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateGiftProduct: (id: string, data: Partial<GiftProduct>) =>
      request<GiftProduct>(`/api/admin/gifts/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    deleteGiftProduct: (id: string) =>
      request<{ message: string }>(`/api/admin/gifts/products/${id}`, { method: "DELETE" }),

    // Admin Gift Combos CRUD
    getGiftCombos: () => request<GiftComboPack[]>("/api/admin/gifts/combos"),
    createGiftCombo: (data: Partial<GiftComboPack>) =>
      request<GiftComboPack>("/api/admin/gifts/combos", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateGiftCombo: (id: string, data: Partial<GiftComboPack>) =>
      request<GiftComboPack>(`/api/admin/gifts/combos/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    deleteGiftCombo: (id: string) =>
      request<{ message: string }>(`/api/admin/gifts/combos/${id}`, { method: "DELETE" }),

    // Admin Gift Recommendations CRUD
    getGiftRecommendations: () => request<GiftRecommendation[]>("/api/admin/gifts/recommendations"),
    createGiftRecommendation: (data: Partial<GiftRecommendation>) =>
      request<GiftRecommendation>("/api/admin/gifts/recommendations", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateGiftRecommendation: (id: string, data: Partial<GiftRecommendation>) =>
      request<GiftRecommendation>(`/api/admin/gifts/recommendations/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    deleteGiftRecommendation: (id: string) =>
      request<{ message: string }>(`/api/admin/gifts/recommendations/${id}`, { method: "DELETE" }),

    // Admin Offers CRUD
    getOffers: () => request<Offer[]>("/api/admin/offers"),
    createOffer: (data: Partial<Offer>) =>
      request<Offer>("/api/admin/offers", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateOffer: (id: string, data: Partial<Offer>) =>
      request<Offer>(`/api/admin/offers/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    deleteOffer: (id: string) =>
      request<{ message: string }>(`/api/admin/offers/${id}`, { method: "DELETE" }),

    // Admin Homepage Content Management
    getHomepageSections: () => request<HomepageSection[]>("/api/admin/homepage/sections"),
    updateHomepageSections: (sections: HomepageSection[]) =>
      request<HomepageSection[]>("/api/admin/homepage/sections", {
        method: "PUT",
        body: JSON.stringify({ sections }),
      }),
  },
};
