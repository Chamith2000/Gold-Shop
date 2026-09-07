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

  // Profile Edit State
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [userOrders, userAppointments] = await Promise.all([
          api.orders.getMyOrders().catch(() => []),
          api.appointments.getMyAppointments().catch(() => []),
        ]);
        setOrders(userOrders);
        setAppointments(userAppointments);
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
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5A0F1B] via-[#400A13] to-[#2B040B] text-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F5] text-[#5A0F1B] flex items-center justify-center font-cinzel text-2xl font-bold border-2 border-[#D4AF37]">
              {user?.fullName ? user.fullName[0].toUpperCase() : "G"}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block font-cinzel">
                {rewardProfile?.tier || "SILVER"} SOVEREIGN PATRON
              </span>
              <h1 className="font-cinzel text-xl sm:text-2xl font-bold">{user?.fullName}</h1>
              <p className="text-xs text-stone-300 font-sans">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-sans">
            <div className="text-right">
              <span className="text-stone-300 block text-[10px] uppercase">Reward Points</span>
              <span className="font-cinzel text-xl font-bold text-[#FFEAA7]">
                {rewardProfile?.currentPoints || 0} Pts
              </span>
            </div>
            <button
              onClick={logout}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors text-rose-300"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 gap-2 sm:gap-6 text-xs font-cinzel font-bold overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-2 uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeTab === "profile"
                ? "text-[#5A0F1B] border-b-2 border-[#5A0F1B]"
                : "text-stone-400 hover:text-stone-800"
            }`}
          >
            My Profile &amp; Contact
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-2 uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeTab === "orders"
                ? "text-[#5A0F1B] border-b-2 border-[#5A0F1B]"
                : "text-stone-400 hover:text-stone-800"
            }`}
          >
            My Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab("appointments")}
            className={`pb-3 px-2 uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeTab === "appointments"
                ? "text-[#5A0F1B] border-b-2 border-[#5A0F1B]"
                : "text-stone-400 hover:text-stone-800"
            }`}
          >
            My Appointments ({appointments.length})
          </button>
        </div>

        {/* Tab 1: Profile Edit */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs max-w-2xl space-y-6">
            <h3 className="font-cinzel text-base font-bold text-[#5A0F1B] uppercase tracking-wider">
              Personal Information
            </h3>

            {profileSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Profile details successfully updated!
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Primary Email</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full bg-stone-100 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">Email address cannot be changed directly.</span>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="bg-[#5A0F1B] hover:bg-[#400A13] text-white px-6 py-2.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {isSavingProfile ? "Saving..." : "Update Profile"}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Orders History */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 shadow-2xs">
                <Package className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-cinzel text-base font-bold text-stone-800">
                  No Acquisitions Yet
                </h3>
                <p className="text-xs text-stone-500 font-sans">
                  Browse our mastercrafted 22K/24K gold pieces and enjoy direct insured delivery.
                </p>
                <button
                  onClick={onNavigateToShop}
                  className="bg-[#5A0F1B] text-white px-6 py-2.5 rounded-xl font-cinzel text-xs font-bold uppercase"
                >
                  Explore Jewellery Catalog
                </button>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#5A0F1B] block">
                        Order #{ord.orderNumber}
                      </span>
                      <span className="text-[11px] text-stone-400 font-sans">
                        Placed on {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                          ord.orderStatus === "CONFIRMED" || ord.orderStatus === "DELIVERED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                      <span className="font-cinzel text-sm font-bold text-[#5A0F1B]">
                        Rs. {ord.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-2">
                    {ord.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs font-sans text-stone-700">
                        <span>{item.productName} ({item.goldPurity}) &times; {item.quantity}</span>
                        <span className="font-mono font-semibold">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Appointments */}
        {activeTab === "appointments" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-cinzel text-base font-bold text-[#5A0F1B]">
                Your Reserved Showroom Consultations
              </h3>
              <button
                onClick={onNavigateToAppointments}
                className="bg-[#5A0F1B] text-white px-4 py-2 rounded-xl font-cinzel text-xs font-bold uppercase"
              >
                + Book New Appointment
              </button>
            </div>

            {appointments.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 shadow-2xs">
                <Calendar className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-cinzel text-base font-bold text-stone-800">
                  No Scheduled Consultations
                </h3>
                <p className="text-xs text-stone-500 font-sans">
                  Book a dedicated master gemologist slot to view rare Ceylon stones or fit custom bridal sets.
                </p>
                <button
                  onClick={onNavigateToAppointments}
                  className="bg-[#5A0F1B] text-white px-6 py-2.5 rounded-xl font-cinzel text-xs font-bold uppercase"
                >
                  Schedule VIP Appointment
                </button>
              </div>
            ) : (
              appointments.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-mono text-[10px] font-bold text-[#B54E0E] block">
                      Ref: {app.appointmentNumber}
                    </span>
                    <h4 className="font-cinzel text-sm font-bold text-stone-900 mt-0.5">
                      {app.appointmentType}
                    </h4>
                    <p className="text-xs text-stone-500 font-sans mt-1">
                      📅 {app.date} &bull; ⏰ {app.timeSlot} &bull; 👥 {app.visitorCount} Guests
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase self-start sm:self-center ${
                      app.status === "CONFIRMED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
