import React, { useState, useEffect } from "react";
import {
  ArrowUp,
  Coins,
  Calendar,
  Sparkles,
  Compass,
  X,
  ShoppingBag,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Storefront-only quick-nav hub. Never rendered for signed-in admins —
// see MainLayout in App.tsx, which uses AdminHeader for admin sessions.
interface FloatingNavHubProps {
  currentView: string;
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onOpenLuckyWheel: () => void;
}

export const FloatingNavHub: React.FC<FloatingNavHubProps> = ({
                                                                currentView,
                                                                onNavigate,
                                                                onOpenLuckyWheel,
                                                              }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
          document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / (windowHeight || 1)}`;
      setScrollProgress(Number(scroll));

      if (totalScroll > 250) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
      <aside aria-label="Floating Navigation Hub" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 font-sans">
        {/* Expanded Quick Action Dial Menu */}
        <AnimatePresence>
          {isOpen && (
              <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 15 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="bg-white/95 backdrop-blur-md border-2 border-[#D4AF37] p-3 rounded-2xl shadow-2xl space-y-2 mb-1 w-56 text-xs text-stone-800"
              >
                <div className="px-2 py-1 border-b border-stone-100 flex items-center justify-between">
              <span className="font-cinzel text-[10px] font-bold text-[#5A0F1B] tracking-wider uppercase">
                Boutique Quick Nav
              </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <button
                    onClick={() => {
                      onNavigate("gold-rates");
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all font-medium ${
                        currentView === "gold-rates"
                            ? "bg-[#FAF3E8] text-[#5A0F1B] font-bold"
                            : "hover:bg-stone-50 text-stone-700"
                    }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                    <Coins className="w-4 h-4 text-[#AA771C]" />
                  </div>
                  <div>
                    <span className="block font-semibold">Live Gold Rates</span>
                    <span className="text-[10px] text-stone-400">22K / 24K Daily Price</span>
                  </div>
                </button>

                <button
                    onClick={() => {
                      onNavigate("appointments");
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all font-medium ${
                        currentView === "appointments"
                            ? "bg-[#FAF3E8] text-[#5A0F1B] font-bold"
                            : "hover:bg-stone-50 text-stone-700"
                    }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-[#5A0F1B]/10 text-[#5A0F1B] flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-semibold">Book Consultation</span>
                    <span className="text-[10px] text-stone-400">Showroom VIP lounge</span>
                  </div>
                </button>

                <button
                    onClick={() => {
                      onNavigate("shop");
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all font-medium ${
                        currentView === "shop"
                            ? "bg-[#FAF3E8] text-[#5A0F1B] font-bold"
                            : "hover:bg-stone-50 text-stone-700"
                    }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-semibold">Browse Catalog</span>
                    <span className="text-[10px] text-stone-400">Royal Collections</span>
                  </div>
                </button>

                <button
                    onClick={() => {
                      onOpenLuckyWheel();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl bg-gradient-to-r from-[#FAF3E8] to-[#F5E6CC] text-[#5A0F1B] flex items-center gap-2.5 hover:brightness-95 transition-all border border-[#D4AF37]/40"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#5A0F1B] text-[#F3E5AB] flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold">Lucky Spin Wheel</span>
                    <span className="text-[10px] text-[#B54E0E] font-semibold">Daily Bonus Points</span>
                  </div>
                </button>
              </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          {/* Scroll-To-Top Button with circular progress border */}
          <AnimatePresence>
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToTop}
                    className="relative w-11 h-11 rounded-full bg-white text-[#5A0F1B] shadow-lg border border-[#D4AF37] flex items-center justify-center hover:bg-[#FAF3E8] transition-colors cursor-pointer"
                    title="Smooth Scroll to Top"
                    aria-label="Scroll to top"
                >
                  {/* Progress Ring SVG */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 36 36">
                    <path
                        className="text-stone-200"
                        strokeWidth="2.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                        className="text-[#D4AF37]"
                        strokeDasharray={`${Math.min(100, Math.max(0, scrollProgress * 100))}, 100`}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <ArrowUp className="w-4 h-4 text-[#5A0F1B]" />
                </motion.button>
            )}
          </AnimatePresence>

          {/* Main Floating Trigger Button */}
          <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`w-13 h-13 rounded-full flex items-center justify-center shadow-xl border-2 transition-all cursor-pointer ${
                  isOpen
                      ? "bg-[#5A0F1B] text-[#F3E5AB] border-[#D4AF37] rotate-90"
                      : "bg-gradient-to-tr from-[#5A0F1B] via-[#4A0C16] to-[#801426] text-[#F3E5AB] border-[#D4AF37]"
              }`}
              title="Quick Navigation & Actions"
              aria-label="Quick Navigation"
          >
            {isOpen ? (
                <X className="w-5 h-5 text-[#F3E5AB]" />
            ) : (
                <div className="relative flex items-center justify-center">
                  <Compass className="w-6 h-6 text-[#F3E5AB] animate-spin-slow" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D4AF37] border-2 border-white" />
                </div>
            )}
          </motion.button>
        </div>
      </aside>
  );
};