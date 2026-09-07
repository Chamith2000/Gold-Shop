import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Activity,
  TrendingUp,
  Calendar,
  ShoppingBag,
  Users,
  Award,
  Flame,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Edit,
  Save,
  Package,
  Plus,
  Trash2,
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTraffic } from "../context/TrafficContext";
import { Order, Appointment, GoldRate, Product, StoreActivity } from "../types";
import { ProductManagement } from "../components/admin/ProductManagement";
import { GiftsOffersManagement } from "../components/admin/GiftsOffersManagement";
import { Gift } from "lucide-react";

interface AdminPageProps {
  onNavigateToShop: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigateToShop }) => {
  const { user, isAdmin, login } = useAuth();
  const { activity, refreshTraffic } = useTraffic();

  const [activeTab, setActiveTab] = useState<
    "TRAFFIC" | "GOLD_RATES" | "APPOINTMENTS" | "ORDERS" | "PRODUCTS" | "POINTS" | "GIFTS_OFFERS"
  >("TRAFFIC");

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Admin In-Page Login State (for unauthenticated admins)
  const [adminEmailInput, setAdminEmailInput] = useState("admin@gayangoldhouse.lk");
  const [adminPasswordInput, setAdminPasswordInput] = useState("AdminGold2026!");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleAdminDirectLogin = async (emailToUse = adminEmailInput, passwordToUse = adminPasswordInput) => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      await login({ email: emailToUse, password: passwordToUse });
      loadData();
    } catch {
      try {
        await login({ email: emailToUse, password: "admin123" });
        loadData();
      } catch (err: any) {
        setLoginError(err.message || "Failed to authenticate administrator.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Traffic State
  const [trafficLevel, setTrafficLevel] = useState<"LOW" | "MODERATE" | "HIGH">("LOW");
  const [estimatedWait, setEstimatedWait] = useState<number>(5);
  const [activeShoppers, setActiveShoppers] = useState<number>(12);
  const [advisoryNote, setAdvisoryNote] = useState<string>("");

  // Gold Rates State
  const [currentRates, setCurrentRates] = useState<GoldRate | null>(null);
  const [rate24k, setRate24k] = useState<number>(250000);
  const [rate22k, setRate22k] = useState<number>(230000);
  const [rate18k, setRate18k] = useState<number>(190000);

  // Appointments State
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);

  // Products State
  const [products, setProducts] = useState<Product[]>([]);

  // Manual Points Adjustment State
  const [targetUserId, setTargetUserId] = useState<string>("");
  const [pointsToAdjust, setPointsToAdjust] = useState<number>(100);
  const [adjustmentReason, setAdjustmentReason] = useState<string>("VIP Customer Courtesy Bonus");

  useEffect(() => {
    if (activity) {
      setTrafficLevel(activity.trafficLevel || "LOW");
      setEstimatedWait(activity.estimatedWaitMinutes || 5);
      setActiveShoppers(activity.currentVisitorCount || 12);
      setAdvisoryNote(activity.peakHoursNote || "");
    }
  }, [activity]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rateData, apptsData, ordersData, prodsData] = await Promise.all([
        api.goldRates.getToday().catch(() => null),
        api.appointments.getAll().catch(() => []),
        api.admin.getOrders().catch(() => api.orders.getMyOrders().catch(() => [])),
        api.products.getAll().catch(() => []),
      ]);

      if (rateData) {
        setCurrentRates(rateData);
        setRate24k(rateData.rate24k);
        setRate22k(rateData.rate22k);
        setRate18k(rateData.rate18k || 190000);
      }
      setAppointments(apptsData);
      setOrders(ordersData);
      setProducts(prodsData);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateTraffic = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await api.storeActivity.update({
        trafficLevel,
        estimatedWaitMinutes: estimatedWait,
        currentVisitorCount: activeShoppers,
        peakHoursNote: advisoryNote,
      });
      await refreshTraffic();
      setSuccessMessage("Showroom traffic status broadcast updated in real-time!");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update store activity.");
    }
  };

  const handleUpdateGoldRates = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const updated = await api.goldRates.updateRate({
        rate24k: Number(rate24k),
        rate22k: Number(rate22k),
        rate18k: Number(rate18k),
      });
      setCurrentRates(updated);
      setSuccessMessage("Official Sovereign Gold Rates updated for today!");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update gold rates.");
    }
  };

  const handleUpdateAppointmentStatus = async (id: string, newStatus: string) => {
    try {
      await api.appointments.updateStatus(id, newStatus);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus as any } : a))
      );
      setSuccessMessage(`Appointment #${id.slice(-6)} marked as ${newStatus}`);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update appointment status.");
    }
  };

  const handleUpdateOrderStatus = async (id: string, orderStatus: string) => {
    try {
      await api.orders.updateStatus(id, { orderStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, orderStatus: orderStatus as any } : o))
      );
      setSuccessMessage(`Order #${id.slice(-6)} updated to ${orderStatus}`);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update order status.");
    }
  };

  const handleAdjustPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId) {
      setErrorMessage("Please provide a valid User ID or customer email.");
      return;
    }
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await api.rewards.adjustPoints(targetUserId, Number(pointsToAdjust), adjustmentReason);
      setSuccessMessage(`Successfully granted ${pointsToAdjust} points to user ${targetUserId}`);
      setTargetUserId("");
    } catch (err: any) {
      setErrorMessage(err.message || "Points adjustment failed.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border-2 border-[#D4AF37] shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#5A0F1B] text-[#F3E5AB] flex items-center justify-center mx-auto border border-[#D4AF37]/50 shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="font-cinzel text-2xl font-bold text-[#5A0F1B]">
              Executive Admin Control Room
            </h2>
            <p className="text-xs text-stone-500 font-sans">
              Restricted management area for showroom traffic, gold rates, order processing, and appointments.
            </p>
          </div>

          {/* Quick 1-Click Direct Admin Access */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A0F1B] block text-center">
              Quick 1-Click Executive Access
            </span>
            <button
              type="button"
              disabled={isLoggingIn}
              onClick={() => handleAdminDirectLogin("admin@gayangoldhouse.lk", "AdminGold2026!")}
              className="w-full bg-[#5A0F1B] hover:bg-[#400A13] text-[#F3E5AB] py-3 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              id="admin-one-click-login-btn"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>{isLoggingIn ? "Authenticating..." : "1-Click Sign In as Boutique Admin"}</span>
            </button>
          </div>

          {/* Manual Admin Credentials Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdminDirectLogin();
            }}
            className="space-y-4 font-sans text-xs pt-2"
          >
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmailInput}
                onChange={(e) => setAdminEmailInput(e.target.value)}
                placeholder="admin@gayangoldhouse.lk"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-stone-900 hover:bg-black text-white py-2.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isLoggingIn ? "Verifying..." : "Authenticate Admin"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-[#5A0F1B] text-white rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#420A13] border border-[#D4AF37]/50 text-[#F3E5AB] text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              Executive Admin Control Room
            </div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-wide">
              Gayan Gold House Management
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 font-sans mt-1">
              Logged in as <strong className="text-[#F3E5AB]">{user?.fullName}</strong> ({user?.email})
            </p>
          </div>

          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#30050D] font-cinzel text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-md self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Live Records
          </button>
        </div>

        {/* Notices */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {successMessage}
            </span>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-900 font-bold">
              ✕
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {errorMessage}
            </span>
            <button onClick={() => setErrorMessage(null)} className="text-rose-600 hover:text-rose-900 font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-stone-300 pb-2">
          {[
            { id: "TRAFFIC", label: "Store Traffic", icon: Activity },
            { id: "GOLD_RATES", label: "Daily Gold Rates", icon: TrendingUp },
            { id: "APPOINTMENTS", label: `Appointments (${appointments.length})`, icon: Calendar },
            { id: "ORDERS", label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: "PRODUCTS", label: `Catalog (${products.length})`, icon: Package },
            { id: "GIFTS_OFFERS", label: "Gifts & Offers 🎁", icon: Gift },
            { id: "POINTS", label: "Loyalty Points Control", icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-[#5A0F1B] text-[#FAF8F5] shadow-md border border-[#D4AF37]"
                    : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "GIFTS_OFFERS" && <GiftsOffersManagement />}

        {/* 1. Live Showroom Traffic */}
        {activeTab === "TRAFFIC" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5A0F1B] text-[#D4AF37] flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel text-base font-bold text-stone-900 uppercase">
                    Live Showroom Traffic Control
                  </h3>
                  <p className="text-xs text-stone-500 font-sans">
                    Broadcast real-time congestion and wait times directly to website visitors.
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdateTraffic} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1.5">Current Traffic Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["LOW", "MODERATE", "HIGH"] as const).map((lvl) => (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setTrafficLevel(lvl)}
                        className={`py-2.5 rounded-xl font-bold uppercase tracking-wider border text-xs transition-all ${
                          trafficLevel === lvl
                            ? lvl === "LOW"
                              ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                              : lvl === "MODERATE"
                              ? "bg-amber-600 text-white border-amber-700 shadow-sm"
                              : "bg-rose-600 text-white border-rose-700 shadow-sm"
                            : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Estimated Wait (Minutes)</label>
                    <input
                      type="number"
                      min={0}
                      max={120}
                      value={estimatedWait}
                      onChange={(e) => setEstimatedWait(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#5A0F1B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Active Patrons in Salon</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={activeShoppers}
                      onChange={(e) => setActiveShoppers(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#5A0F1B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Public Advisory Notice</label>
                  <input
                    type="text"
                    value={advisoryNote}
                    onChange={(e) => setAdvisoryNote(e.target.value)}
                    placeholder="e.g. Master Goldsmith is available for custom bridal sketching today"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#5A0F1B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#5A0F1B] hover:bg-[#420A13] text-white py-3 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4 text-[#D4AF37]" />
                  Broadcast Live Store Traffic Update
                </button>
              </form>
            </div>

            <div className="lg:col-span-6 bg-[#FAF3E8] p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/40 space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#B54E0E] uppercase tracking-widest block font-cinzel">
                  Customer View Preview
                </span>
                <h4 className="font-cinzel text-base font-bold text-[#5A0F1B] mt-1">
                  Active Traffic Ticker Status
                </h4>
                <p className="text-xs text-stone-600 font-sans mt-1">
                  This card simulates how website visitors currently see your flagship boutique availability.
                </p>

                <div className="mt-6 bg-white p-5 rounded-2xl border border-[#D4AF37]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-800 font-cinzel">Flagship Boutique</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        trafficLevel === "LOW"
                          ? "bg-emerald-100 text-emerald-800"
                          : trafficLevel === "MODERATE"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {trafficLevel} Traffic ({estimatedWait} min wait)
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 font-sans italic">
                    "{advisoryNote || "Private consultation suites open for walk-ins and bookings."}"
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D4AF37]/30 flex items-center gap-2 text-xs text-stone-500 font-sans">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>Simulated automatic polling every 10 seconds for seamless patron synchronization.</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. Daily Gold Rates */}
        {activeTab === "GOLD_RATES" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5A0F1B] text-[#D4AF37] flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-stone-900 uppercase">
                  Daily Sovereign Gold Rates (LKR / Sovereign)
                </h3>
                <p className="text-xs text-stone-500 font-sans">
                  Rates automatically drive live pricing calculations for 24K, 22K, and 18K fine jewelry.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateGoldRates} className="space-y-4 font-sans text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  24K Pure Sovereign Rate (1 Sovereign = 8.000g)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400 font-bold">Rs.</span>
                  <input
                    type="number"
                    step={100}
                    value={rate24k}
                    onChange={(e) => setRate24k(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-3 py-2.5 font-mono text-sm font-bold text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  22K Standard Sovereign Rate (Traditional Sri Lankan Hallmark)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400 font-bold">Rs.</span>
                  <input
                    type="number"
                    step={100}
                    value={rate22k}
                    onChange={(e) => setRate22k(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-3 py-2.5 font-mono text-sm font-bold text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  18K Gemstone Casting Rate
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400 font-bold">Rs.</span>
                  <input
                    type="number"
                    step={100}
                    value={rate18k}
                    onChange={(e) => setRate18k(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-3 py-2.5 font-mono text-sm font-bold text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#5A0F1B] hover:bg-[#420A13] text-white py-3 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4 text-[#D4AF37]" />
                Update &amp; Synchronize Today's Rates
              </button>
            </form>
          </div>
        )}

        {/* 3. Appointments Management */}
        {activeTab === "APPOINTMENTS" && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
            <h3 className="font-cinzel text-base font-bold text-stone-900 uppercase">
              VIP Patron Appointments ({appointments.length})
            </h3>

            {appointments.length === 0 ? (
              <p className="text-xs text-stone-500 py-8 text-center">No appointments booked yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="bg-[#FAF8F5] text-[#5A0F1B] font-cinzel uppercase text-[11px] border-b border-stone-200">
                    <tr>
                      <th className="p-3">Ref ID</th>
                      <th className="p-3">Date &amp; Slot</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Service</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {appointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-stone-50">
                        <td className="p-3 font-mono font-bold">#{appt.id.slice(-6)}</td>
                        <td className="p-3">
                          <span className="font-semibold text-stone-800">{appt.date}</span>
                          <span className="block text-[11px] text-stone-500">{appt.timeSlot}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-stone-900">{appt.customerName}</span>
                          <span className="block text-[11px] text-stone-500">{appt.customerPhone}</span>
                        </td>
                        <td className="p-3 font-medium text-stone-700">{appt.appointmentType}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              appt.status === "CONFIRMED"
                                ? "bg-emerald-100 text-emerald-800"
                                : appt.status === "COMPLETED"
                                ? "bg-blue-100 text-blue-800"
                                : appt.status === "CANCELLED"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1.5">
                          {appt.status !== "CONFIRMED" && appt.status !== "COMPLETED" && (
                            <button
                              onClick={() => handleUpdateAppointmentStatus(appt.id, "CONFIRMED")}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold uppercase"
                            >
                              Confirm
                            </button>
                          )}
                          {appt.status === "CONFIRMED" && (
                            <button
                              onClick={() => handleUpdateAppointmentStatus(appt.id, "COMPLETED")}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold uppercase"
                            >
                              Complete
                            </button>
                          )}
                          {appt.status !== "CANCELLED" && appt.status !== "COMPLETED" && (
                            <button
                              onClick={() => handleUpdateAppointmentStatus(appt.id, "CANCELLED")}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold uppercase"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 4. Orders Management */}
        {activeTab === "ORDERS" && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
            <h3 className="font-cinzel text-base font-bold text-stone-900 uppercase">
              Boutique Orders ({orders.length})
            </h3>

            {orders.length === 0 ? (
              <p className="text-xs text-stone-500 py-8 text-center">No orders registered in system.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="bg-[#FAF8F5] text-[#5A0F1B] font-cinzel uppercase text-[11px] border-b border-stone-200">
                    <tr>
                      <th className="p-3">Order Ref</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Points Used</th>
                      <th className="p-3">Order Status</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50">
                        <td className="p-3 font-mono font-bold text-stone-900">
                          #{order.id.slice(-8)}
                          <span className="block text-[10px] font-sans text-stone-500 font-normal">
                            {order.items?.length || 1} items
                          </span>
                        </td>
                        <td className="p-3 font-bold text-[#5A0F1B]">
                          Rs. {order.totalAmount.toLocaleString()}
                        </td>
                        <td className="p-3 font-medium text-[#B54E0E]">
                          {order.pointsRedeemed ? `${order.pointsRedeemed} Pts` : "None"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              order.orderStatus === "DELIVERED"
                                ? "bg-emerald-100 text-emerald-800"
                                : order.orderStatus === "SHIPPED"
                                ? "bg-blue-100 text-blue-800"
                                : order.orderStatus === "PROCESSING"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-emerald-700 uppercase text-[10px]">
                            {order.paymentStatus || "PAID"}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="bg-stone-50 border border-stone-300 rounded px-2 py-1 text-xs font-semibold focus:outline-none"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 5. Products Catalog Management (Full-Featured Suite) */}
        {activeTab === "PRODUCTS" && (
          <ProductManagement onNavigateToShop={onNavigateToShop} />
        )}

        {/* 6. Loyalty Points Control */}
        {activeTab === "POINTS" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5A0F1B] text-[#D4AF37] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-stone-900 uppercase">
                  Manual Loyalty Points Adjustment
                </h3>
                <p className="text-xs text-stone-500 font-sans">
                  Credit or debit reward points for VIP patrons, anniversary gifts, or goodwill bonuses.
                </p>
              </div>
            </div>

            <form onSubmit={handleAdjustPoints} className="space-y-4 font-sans text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  User ID or Registered Email
                </label>
                <input
                  type="text"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  placeholder="e.g. user_1 or chamari@example.lk"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#5A0F1B]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Points Quantity (Use negative numbers to deduct)
                </label>
                <input
                  type="number"
                  step={10}
                  value={pointsToAdjust}
                  onChange={(e) => setPointsToAdjust(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 font-bold font-mono focus:outline-none focus:border-[#5A0F1B]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Ledger Transaction Reason
                </label>
                <input
                  type="text"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#5A0F1B]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#5A0F1B] hover:bg-[#420A13] text-white py-3 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-[#D4AF37]" />
                Process Points Adjustment
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
