import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Coins,
} from "lucide-react";
import { Logo } from "./Logo";
import { useCategories } from "../../hooks/useCategories";

interface FooterProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onOpenLuckyWheel?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLuckyWheel }) => {
  const { categories } = useCategories();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#30050D] text-stone-300 font-sans border-t-2 border-[#D4AF37]">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" theme="light" />
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-sans max-w-md">
              Established with a legacy of royal prestige, Gayan Gold House is Sri Lanka's premier destination for certified 22K and 24K gold ornaments, rare natural Ceylon gemstones, and bespoke bridal masterworks.
            </p>

            <div className="pt-2">
              <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider block mb-2 font-cinzel">
                Exclusive Royal Circle Newsletter
              </span>
              {subscribed ? (
                <div className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-3 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  Thank you! 200 Welcome Loyalty Points added to your inquiry.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-md gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 bg-[#1F0308] border border-[#5A0F1B] focus:border-[#D4AF37] text-white text-xs px-3.5 py-2.5 rounded-lg focus:outline-none placeholder-stone-500"
                  />
                  <button
                    type="submit"
                    className="bg-[#D4AF37] hover:bg-[#C59B27] text-[#30050D] text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 flex-shrink-0"
                  >
                    Subscribe <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
              Collections
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate("shop", { category: cat.slug })}
                    className="text-stone-400 hover:text-[#F3E5AB] transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate("shop")}
                  className="text-[#D4AF37] hover:underline font-semibold text-[11px]"
                >
                  View All Masterworks →
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Services */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
              Services &amp; Boutique
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate("gold-rates")} className="hover:text-[#F3E5AB] text-[#D4AF37] font-semibold flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5" />
                  Daily Gold Rates &amp; 7-Day History
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("appointments")} className="hover:text-[#F3E5AB]">
                  VIP Private Viewing Appointment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("rewards")} className="hover:text-[#F3E5AB]">
                  Loyalty Tiers &amp; Multipliers
                </button>
              </li>
              {onOpenLuckyWheel && (
                <li>
                  <button onClick={onOpenLuckyWheel} className="hover:text-[#F3E5AB] text-[#D4AF37] font-semibold">
                    Daily Lucky Wheel Spin
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => onNavigate("about")} className="hover:text-[#F3E5AB]">
                  Heritage &amp; Gem Certification
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("wishlist")} className="hover:text-[#F3E5AB]">
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("account")} className="hover:text-[#F3E5AB]">
                  Order Tracking &amp; Invoices
                </button>
              </li>
            </ul>
          </div>

          {/* Flagship Store Details */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
              Flagship Boutique
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>No. 142 Sea Street, Pettah, Colombo 11, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>+94 11 234 5678 / +94 77 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>concierge@gayangoldhouse.lk</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>
                  Mon - Sat: 9:30 AM – 7:30 PM
                  <br />
                  Sunday: 10:00 AM – 4:00 PM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#1F0308] py-5 border-t border-[#420A13] text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[11px] sm:text-xs">
            &copy; {new Date().getFullYear()} Gayan Gold House (Pvt) Ltd. All Rights Reserved. Master Gem &amp; Jewellery Crafters.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-stone-400">Certified by Sri Lanka Gem &amp; Jewellery Authority</span>
            <span className="text-[#D4AF37]">✦</span>
            <span className="text-stone-400">Assay Hallmark Guaranteed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
