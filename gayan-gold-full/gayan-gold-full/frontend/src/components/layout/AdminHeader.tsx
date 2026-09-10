import React from "react";
import { ShieldCheck, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "../../context/AuthContext";

interface AdminHeaderProps {
    onNavigate: (view: string, params?: Record<string, string>) => void;
}

/**
 * Standalone header shown only to signed-in administrators.
 * Deliberately excludes every customer-facing nav item (Home, Collections,
 * Shop, Store Traffic ticker, Cart, Wishlist, Book Appointment, Lucky Spin,
 * etc.) — none of that is relevant to running the boutique's back office.
 * All admin functions (traffic, gold rates, appointments, orders, catalog,
 * gifts & offers, loyalty points) live inside the dashboard's own tabs.
 */
export const AdminHeader: React.FC<AdminHeaderProps> = ({ onNavigate }) => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-[#FAF8F5] border-b border-[#E8E1D5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                <button
                    onClick={() => onNavigate("admin")}
                    className="flex items-center gap-3 cursor-pointer"
                    aria-label="Admin Dashboard Home"
                >
                    <Logo size="sm" theme="dark" />
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#5A0F1B] text-[#F3E5AB] text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
            Admin Console
          </span>
                </button>

                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="hidden md:block text-right">
                        <p className="text-xs font-bold text-stone-900 leading-tight">{user?.fullName}</p>
                        <p className="text-[11px] text-stone-500 leading-tight">{user?.email}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </div>
        </header>
    );
};