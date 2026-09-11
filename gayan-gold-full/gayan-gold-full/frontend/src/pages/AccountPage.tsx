import React, { useState, useEffect } from "react";
import {
  User as UserIcon,
  ShoppingBag,
  Calendar,
  Award,
  LogOut,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Package,
  MapPin,
  ChevronRight,
  Gem,
  CreditCard,
  Truck,
  CircleCheck,
  XCircle,
  Pencil,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Order, Appointment } from "../types";

interface AccountPageProps {
  initialTab?: string;
  onNavigateToRewards: () => void;
  onNavigateToAppointments: () => void;
  onNavigateToShop: () => void;
}

const formatCurrency = (value: number | undefined) =>
  `Rs. ${Number(value || 0).toLocaleString("en-LK")}`;

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-LK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const orderStatusMeta = (status: Order["orderStatus"]) => {
  switch (status) {
    case "DELIVERED":
      return { label: "Delivered", icon: CircleCheck, className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "CONFIRMED":
      return { label: "Confirmed", icon: CircleCheck, className: "bg-blue-50 text-blue-700 border-blue-200" };
    case "SHIPPED":
      return { label: "On the way", icon: Truck, className: "bg-violet-50 text-violet-700 border-violet-200" };
    case "PROCESSING":
      return { label: "Processing", icon: Clock, className: "bg-amber-50 text-amber-700 border-amber-200" };
    case "CANCELLED":
      return { label: "Cancelled", icon: XCircle, className: "bg-red-50 text-red-700 border-red-200" };
    default:
      return { label: "Pending", icon: Clock, className: "bg-stone-50 text-stone-600 border-stone-200" };
  }
};

const appointmentStatusMeta = (status: Appointment["status"]) => {
  switch (status) {
    case "CONFIRMED":
      return { label: "Confirmed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "COMPLETED":
      return { label: "Completed", className: "bg-blue-50 text-blue-700 border-blue-200" };
    case "CANCELLED":
      return { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-200" };
    case "REJECTED":
      return { label: "Rejected", className: "bg-red-50 text-red-700 border-red-200" };
    default:
      return { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" };
  }
};

export const AccountPage: React.FC<AccountPageProps> = ({
  initialTab = "profile",
  onNavigateToRewards,
  onNavigateToAppointments,
  onNavigateToShop,
}) => {
  const { user, rewardProfile, logout, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setFullName(user?.fullName || "");
    setPhone(user?.phone || "");
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [userOrders, userAppointments] = await Promise.all([
          api.orders.getMyOrders().catch(() => []),
          api.appointments.getMyAppointments().catch(() => []),
        ]);
        setOrders(userOrders || []);
        setAppointments(userAppointments || []);
      } catch (e) {
        console.error("Failed to load account data", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await api.auth.updateProfile({ fullName, phone });
      updateUser(res.user);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const tabs = [
    { id: "profile", label: "My Profile & Contact", icon: UserIcon },
    { id: "orders", label: "My Orders", count: orders.length, icon: ShoppingBag },
    { id: "appointments", label: "My Appointments", count: appointments.length, icon: Calendar },
  ];

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const activeOrders = orders.filter((order) => !["DELIVERED", "CANCELLED"].includes(order.orderStatus)).length;
  const upcomingAppointments = appointments.filter((appointment) => appointment.status === "PENDING" || appointment.status === "CONFIRMED").length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Account Hero */}
        <section className="relative overflow-hidden rounded-[2rem] bg-[#3B0710] shadow-[0_20px_60px_rgba(59,7,16,0.16)] border border-[#D4AF37]/40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(212,175,55,0.18),transparent_32%),radial-gradient(circle_at_10%_100%,rgba(181,78,14,0.18),transparent_35%)]" />
          <div className="relative px-5 py-7 sm:px-8 lg:px-10 sm:py-9">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-7">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative shrink-0">
                  <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-full bg-[#FAF8F5] text-[#5A0F1B] flex items-center justify-center font-cinzel text-3xl sm:text-4xl font-bold border-2 border-[#D4AF37] shadow-lg">
                    {user?.fullName ? user.fullName[0].toUpperCase() : "G"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#D4AF37] text-[#3B0710] flex items-center justify-center border-2 border-[#3B0710]">
                    <Gem className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.2em] text-[#D4AF37] font-cinzel">
                      {rewardProfile?.tier || "SILVER"} Patron
                    </span>
                  </div>
                  <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-white leading-tight">
                    Welcome, {user?.fullName?.split(" ")[0] || "Patron"}
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1">Manage your profile, purchases and private consultations.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={onNavigateToRewards}
                  className="flex-1 sm:flex-none rounded-xl border border-[#D4AF37]/40 bg-white/5 px-4 py-2.5 text-left hover:bg-white/10 transition-colors"
                >
                  <span className="block text-[9px] uppercase tracking-widest text-stone-400">Reward balance</span>
                  <span className="font-cinzel text-lg font-bold text-[#FFEAA7]">{rewardProfile?.currentPoints || 0} Pts</span>
                </button>
                <button
                  onClick={logout}
                  className="h-11 w-11 sm:w-auto sm:px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-rose-200 flex items-center justify-center gap-2 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs font-semibold">Sign Out</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
              <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-4">
                <ShoppingBag className="w-4 h-4 text-[#D4AF37] mb-3" />
                <p className="text-[9px] uppercase tracking-widest text-stone-400">Total orders</p>
                <p className="font-cinzel text-xl font-bold text-white mt-0.5">{orders.length}</p>
              </div>
              <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-4">
                <Package className="w-4 h-4 text-[#D4AF37] mb-3" />
                <p className="text-[9px] uppercase tracking-widest text-stone-400">In progress</p>
                <p className="font-cinzel text-xl font-bold text-white mt-0.5">{activeOrders}</p>
              </div>
              <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-4">
                <Calendar className="w-4 h-4 text-[#D4AF37] mb-3" />
                <p className="text-[9px] uppercase tracking-widest text-stone-400">Appointments</p>
                <p className="font-cinzel text-xl font-bold text-white mt-0.5">{upcomingAppointments}</p>
              </div>
              <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-4">
                <Award className="w-4 h-4 text-[#D4AF37] mb-3" />
                <p className="text-[9px] uppercase tracking-widest text-stone-400">Lifetime spend</p>
                <p className="font-cinzel text-lg font-bold text-[#FFEAA7] mt-0.5">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Account Navigation */}
        <div className="mt-7 bg-white rounded-2xl border border-[#E8E1D5] p-1.5 shadow-[0_8px_30px_rgba(70,45,25,0.05)] overflow-x-auto">
          <div className="flex min-w-max gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2.5 px-4 sm:px-6 py-3.5 rounded-xl text-[10px] sm:text-xs font-cinzel font-bold uppercase tracking-[0.08em] transition-all whitespace-nowrap ${
                    active
                      ? "bg-[#5A0F1B] text-white shadow-md"
                      : "text-stone-500 hover:bg-[#FAF8F5] hover:text-[#5A0F1B]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-[#D4AF37]" : ""}`} />
                  <span>{tab.label}</span>
                  {typeof tab.count === "number" && (
                    <span className={`min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-[9px] ${active ? "bg-white/15 text-[#FFEAA7]" : "bg-stone-100 text-stone-500"}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="mt-7">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-36 rounded-3xl bg-white border border-stone-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Profile */}
              {activeTab === "profile" && (
                <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-6 items-start">
                  <section className="bg-white rounded-3xl border border-[#E8E1D5] shadow-[0_12px_40px_rgba(70,45,25,0.05)] overflow-hidden">
                    <div className="px-6 sm:px-8 py-6 border-b border-stone-100 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.22em] text-[#B54E0E] font-bold">Your details</p>
                        <h2 className="font-cinzel text-lg sm:text-xl font-bold text-[#3B0710] mt-1">Profile & Contact</h2>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#5A0F1B]">
                        <UserIcon className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="p-6 sm:p-8">
                      {profileSuccess && (
                        <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold">Your profile has been updated successfully.</span>
                        </div>
                      )}

                      <form onSubmit={handleUpdateProfile} className="space-y-5 font-sans">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-2">Full Name</label>
                          <div className="relative">
                            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#B54E0E] transition-all" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-2">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input type="email" disabled value={user?.email || ""} className="w-full bg-stone-100 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-500 cursor-not-allowed" />
                          </div>
                          <p className="text-[10px] text-stone-400 mt-1.5">Your sign-in email is kept secure and cannot be changed here.</p>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-2">Contact Phone</label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 77 123 4567" className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#B54E0E] transition-all" />
                          </div>
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                          <button type="submit" disabled={isSavingProfile} className="inline-flex items-center justify-center gap-2 bg-[#5A0F1B] hover:bg-[#400A13] text-white px-6 py-3 rounded-xl font-cinzel text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-sm">
                            <Pencil className="w-3.5 h-3.5" />
                            {isSavingProfile ? "Saving..." : "Save Changes"}
                          </button>
                          <span className="text-[10px] text-stone-400 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Your information is protected</span>
                        </div>
                      </form>
                    </div>
                  </section>

                  <div className="space-y-5">
                    <section className="rounded-3xl bg-[#F4EFE6] border border-[#E1D6C4] p-6 sm:p-7">
                      <div className="w-11 h-11 rounded-2xl bg-[#5A0F1B] text-[#D4AF37] flex items-center justify-center mb-5"><Award className="w-5 h-5" /></div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#B54E0E] font-bold">Royal rewards</p>
                      <h3 className="font-cinzel text-xl font-bold text-[#3B0710] mt-1">{rewardProfile?.tier || "SILVER"} Tier</h3>
                      <p className="text-xs text-stone-600 mt-2 leading-5">You currently have <strong>{rewardProfile?.currentPoints || 0} points</strong> available to redeem on eligible purchases.</p>
                      <button onClick={onNavigateToRewards} className="mt-5 text-[#5A0F1B] text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 hover:gap-2.5 transition-all">View rewards <ArrowRight className="w-3.5 h-3.5" /></button>
                    </section>

                    <section className="bg-white rounded-3xl border border-[#E8E1D5] p-6 shadow-[0_10px_30px_rgba(70,45,25,0.04)]">
                      <div className="flex items-center gap-3 mb-5"><div className="w-9 h-9 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#5A0F1B]"><MapPin className="w-4 h-4" /></div><div><p className="font-cinzel text-sm font-bold text-[#3B0710]">Need assistance?</p><p className="text-[10px] text-stone-500">Our boutique team is here to help.</p></div></div>
                      <button onClick={onNavigateToAppointments} className="w-full border border-[#D4AF37]/60 text-[#5A0F1B] hover:bg-[#FAF8F5] rounded-xl py-2.5 text-[10px] font-cinzel font-bold uppercase tracking-wider transition-colors">Book a private consultation</button>
                    </section>
                  </div>
                </div>
              )}

              {/* Orders */}
              {activeTab === "orders" && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 px-1">
                    <div><p className="text-[9px] uppercase tracking-[0.2em] text-[#B54E0E] font-bold">Purchase history</p><h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#3B0710] mt-1">My Orders</h2><p className="text-xs text-stone-500 mt-1">A private record of your jewellery acquisitions.</p></div>
                    <button onClick={onNavigateToShop} className="inline-flex items-center gap-2 text-[#5A0F1B] text-[10px] font-cinzel font-bold uppercase tracking-wider">Continue shopping <ArrowRight className="w-3.5 h-3.5" /></button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-[#E8E1D5] p-10 sm:p-16 text-center shadow-[0_12px_40px_rgba(70,45,25,0.04)]">
                      <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] text-[#5A0F1B] flex items-center justify-center mx-auto mb-5"><ShoppingBag className="w-7 h-7" /></div>
                      <h3 className="font-cinzel text-lg font-bold text-[#3B0710]">Your collection begins here</h3>
                      <p className="text-xs text-stone-500 max-w-md mx-auto mt-2 leading-5">You have not placed an order yet. Discover our curated collection of fine jewellery and gifts.</p>
                      <button onClick={onNavigateToShop} className="mt-6 bg-[#5A0F1B] hover:bg-[#400A13] text-white px-6 py-3 rounded-xl font-cinzel text-[10px] font-bold uppercase tracking-wider">Explore Collection</button>
                    </div>
                  ) : (
                    orders.map((ord) => {
                      const status = orderStatusMeta(ord.orderStatus);
                      const StatusIcon = status.icon;
                      return (
                        <article key={ord.id} className="bg-white rounded-3xl border border-[#E8E1D5] shadow-[0_10px_35px_rgba(70,45,25,0.045)] overflow-hidden">
                          <div className="px-5 sm:px-7 py-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                              <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] text-[#5A0F1B] flex items-center justify-center"><Package className="w-5 h-5" /></div>
                              <div><span className="font-mono text-xs font-bold text-[#5A0F1B] block">#{ord.orderNumber}</span><span className="text-[10px] text-stone-400">Placed {formatDate(ord.createdAt)}</span></div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] uppercase font-bold tracking-wider ${status.className}`}><StatusIcon className="w-3.5 h-3.5" />{status.label}</span>
                              <div className="text-right"><span className="block text-[9px] uppercase tracking-wider text-stone-400">Total</span><span className="font-cinzel text-base font-bold text-[#5A0F1B]">{formatCurrency(ord.totalAmount)}</span></div>
                            </div>
                          </div>

                          <div className="p-5 sm:p-7">
                            <div className="space-y-3">
                              {(ord.items || []).map((item, i) => (
                                <div key={`${ord.id}-${i}`} className="flex items-center gap-3 rounded-2xl bg-[#FAF8F5] border border-stone-100 p-3">
                                  <div className="w-12 h-12 rounded-xl bg-white border border-stone-100 flex items-center justify-center shrink-0 overflow-hidden">
                                    {item.image ? <img src={item.image} alt={item.productName} className="w-full h-full object-cover" /> : <Gem className="w-5 h-5 text-[#B54E0E]" />}
                                  </div>
                                  <div className="min-w-0 flex-1"><p className="text-xs font-semibold text-stone-800 truncate">{item.productName}</p><p className="text-[10px] text-stone-400 mt-0.5">{item.goldPurity} · Qty {item.quantity}</p></div>
                                  <span className="font-mono text-xs font-semibold text-stone-700">{formatCurrency(Number(item.price) * Number(item.quantity))}</span>
                                </div>
                              ))}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-stone-100">
                              <div><p className="text-[9px] uppercase tracking-wider text-stone-400">Subtotal</p><p className="text-xs font-semibold text-stone-700 mt-1">{formatCurrency(ord.subtotal)}</p></div>
                              <div><p className="text-[9px] uppercase tracking-wider text-stone-400">Discount</p><p className="text-xs font-semibold text-emerald-700 mt-1">-{formatCurrency(ord.discountAmount)}</p></div>
                              <div><p className="text-[9px] uppercase tracking-wider text-stone-400">Shipping</p><p className="text-xs font-semibold text-stone-700 mt-1">{formatCurrency(ord.shippingFee)}</p></div>
                              <div><p className="text-[9px] uppercase tracking-wider text-stone-400">Payment</p><p className={`text-xs font-semibold mt-1 ${ord.paymentStatus === "PAID" ? "text-emerald-700" : "text-amber-700"}`}>{ord.paymentStatus}</p></div>
                            </div>

                            {ord.shippingAddress && (
                              <div className="mt-4 rounded-2xl border border-[#E8E1D5] p-4 flex gap-3"><MapPin className="w-4 h-4 text-[#B54E0E] shrink-0 mt-0.5" /><div><p className="text-[9px] uppercase tracking-wider font-bold text-stone-400">Delivery address</p><p className="text-[11px] text-stone-600 mt-1 leading-4">{ord.shippingAddress.street}, {ord.shippingAddress.city}{ord.shippingAddress.postalCode ? `, ${ord.shippingAddress.postalCode}` : ""}</p></div></div>
                            )}
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              )}

              {/* Appointments */}
              {activeTab === "appointments" && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
                    <div><p className="text-[9px] uppercase tracking-[0.2em] text-[#B54E0E] font-bold">Private showroom</p><h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#3B0710] mt-1">My Appointments</h2><p className="text-xs text-stone-500 mt-1">Manage your private consultations and showroom visits.</p></div>
                    <button onClick={onNavigateToAppointments} className="inline-flex items-center justify-center gap-2 bg-[#5A0F1B] hover:bg-[#400A13] text-white px-5 py-3 rounded-xl font-cinzel text-[10px] font-bold uppercase tracking-wider shadow-sm"><Calendar className="w-3.5 h-3.5" /> Book New Appointment</button>
                  </div>

                  {appointments.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-[#E8E1D5] p-10 sm:p-16 text-center shadow-[0_12px_40px_rgba(70,45,25,0.04)]">
                      <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] text-[#5A0F1B] flex items-center justify-center mx-auto mb-5"><Calendar className="w-7 h-7" /></div>
                      <h3 className="font-cinzel text-lg font-bold text-[#3B0710]">A private experience awaits</h3>
                      <p className="text-xs text-stone-500 max-w-md mx-auto mt-2 leading-5">Reserve a dedicated showroom consultation for bridal jewellery, rare Ceylon gemstones, custom designs or personal guidance.</p>
                      <button onClick={onNavigateToAppointments} className="mt-6 bg-[#5A0F1B] hover:bg-[#400A13] text-white px-6 py-3 rounded-xl font-cinzel text-[10px] font-bold uppercase tracking-wider">Schedule Consultation</button>
                    </div>
                  ) : (
                    <div className="grid lg:grid-cols-2 gap-5">
                      {appointments.map((app) => {
                        const status = appointmentStatusMeta(app.status);
                        return (
                          <article key={app.id} className="bg-white rounded-3xl border border-[#E8E1D5] shadow-[0_10px_35px_rgba(70,45,25,0.045)] overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-[#5A0F1B] via-[#D4AF37] to-[#B54E0E]" />
                            <div className="p-5 sm:p-7">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3.5">
                                  <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] text-[#5A0F1B] flex items-center justify-center"><Calendar className="w-5 h-5" /></div>
                                  <div><p className="font-mono text-[9px] font-bold tracking-wider text-[#B54E0E]">REF {app.appointmentNumber}</p><h3 className="font-cinzel text-base font-bold text-[#3B0710] mt-1">{app.appointmentType}</h3></div>
                                </div>
                                <span className={`shrink-0 px-2.5 py-1 rounded-full border text-[9px] uppercase font-bold tracking-wider ${status.className}`}>{status.label}</span>
                              </div>

                              <div className="grid grid-cols-2 gap-3 mt-6">
                                <div className="rounded-2xl bg-[#FAF8F5] border border-stone-100 p-4"><p className="text-[9px] uppercase tracking-wider text-stone-400">Date</p><p className="text-xs font-semibold text-stone-800 mt-1">{formatDate(app.date)}</p></div>
                                <div className="rounded-2xl bg-[#FAF8F5] border border-stone-100 p-4"><p className="text-[9px] uppercase tracking-wider text-stone-400">Time</p><p className="text-xs font-semibold text-stone-800 mt-1">{app.timeSlot}</p></div>
                                <div className="rounded-2xl bg-[#FAF8F5] border border-stone-100 p-4"><p className="text-[9px] uppercase tracking-wider text-stone-400">Guests</p><p className="text-xs font-semibold text-stone-800 mt-1">{app.visitorCount} {app.visitorCount === 1 ? "Guest" : "Guests"}</p></div>
                                <div className="rounded-2xl bg-[#FAF8F5] border border-stone-100 p-4"><p className="text-[9px] uppercase tracking-wider text-stone-400">Booked</p><p className="text-xs font-semibold text-stone-800 mt-1">{formatDate(app.createdAt)}</p></div>
                              </div>

                              {app.notes && <div className="mt-4 p-4 rounded-2xl border border-[#E8E1D5]"><p className="text-[9px] uppercase tracking-wider font-bold text-stone-400">Your notes</p><p className="text-xs text-stone-600 mt-1.5 leading-5">{app.notes}</p></div>}

                              <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-[10px] text-stone-400"><MapPin className="w-3.5 h-3.5" /> Gayan Gold Showroom</div>
                                {app.status === "COMPLETED" && <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Visit completed</span>}
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
