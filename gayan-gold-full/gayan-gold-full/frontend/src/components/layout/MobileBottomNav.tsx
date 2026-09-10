import React from "react";
import {
    Home,
    ShoppingBag,
    Coins,
    Calendar,
    Award,
    User as UserIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../../context/AuthContext";

interface MobileBottomNavProps {
    currentView: string;
    onNavigate: (view: string, params?: Record<string, string>) => void;
}

// Storefront-only navigation. This component is never rendered for
// signed-in admins — see MainLayout in App.tsx, which uses AdminHeader
// instead of any customer nav for admin sessions.
export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
                                                                    currentView,
                                                                    onNavigate,
                                                                }) => {
    const { isAuthenticated } = useAuth();

    const navItems = [
        { id: "home", label: "Home", icon: Home },
        { id: "shop", label: "Shop", icon: ShoppingBag },
        { id: "gold-rates", label: "Rates", icon: Coins },
        { id: "appointments", label: "Book", icon: Calendar },
        { id: "rewards", label: "Rewards", icon: Award },
        {
            id: isAuthenticated ? "account" : "login",
            label: isAuthenticated ? "Account" : "Sign In",
            icon: UserIcon,
        },
    ];

    return (
        <nav
            aria-label="Mobile Navigation"
            className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E8E1D5] px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
        >
            <div className="flex items-center justify-around max-w-lg mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-nav-pill"
                                    className="absolute inset-0 bg-[#FAF3E8] border border-[#D4AF37]/50 rounded-xl -z-10"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}
                            <Icon
                                className={`w-5 h-5 transition-transform duration-200 ${
                                    isActive
                                        ? "text-[#5A0F1B] scale-110"
                                        : "text-stone-500 hover:text-stone-800"
                                }`}
                            />
                            <span
                                className={`text-[10px] font-cinzel mt-0.5 tracking-tight font-semibold ${
                                    isActive ? "text-[#5A0F1B] font-bold" : "text-stone-500"
                                }`}
                            >
                {item.label}
              </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};