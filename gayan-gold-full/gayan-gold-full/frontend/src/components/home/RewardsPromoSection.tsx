import React from "react";
import { Award, Flame, Sparkles, Crown, Gift, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface RewardsPromoSectionProps {
  onOpenLuckyWheel: () => void;
  onExploreRewards: () => void;
}

export const RewardsPromoSection: React.FC<RewardsPromoSectionProps> = ({
  onOpenLuckyWheel,
  onExploreRewards,
}) => {
  const { rewardProfile, isAuthenticated } = useAuth();

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#2B040B] via-[#4A0B15] to-[#1E0207] text-white border-t border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5A0F1B] border border-[#D4AF37]/50 text-[#F3E5AB] text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
            Royal Circle Loyalty Programme
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase tracking-wide">
            Privileges of Sovereign Patronage
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
            Earn royal loyalty points on every acquisition, unlock tier multipliers, and spin the Golden Wheel of Fortune daily for instant checkout cash discounts.
          </p>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {/* Silver Tier */}
          <div className="bg-[#3C0812] border border-stone-600/40 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-stone-300 uppercase tracking-wider">
                  Tier 1
                </span>
                <span className="text-[10px] bg-stone-700/80 text-stone-200 px-2 py-0.5 rounded font-bold">
                  Entry Level
                </span>
              </div>
              <h3 className="font-cinzel text-xl font-bold text-stone-100 mt-2">
                Silver Sovereign
              </h3>
              <p className="text-xs text-stone-300 font-sans mt-1">
                Standard membership upon complimentary registration.
              </p>

              <div className="my-5 py-4 border-y border-stone-700/50 space-y-2 text-xs text-stone-300 font-sans">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span><strong>1 Point</strong> per Rs. 100 spent (1.0x)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Daily Free Lucky Wheel Spin</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Redeem points for instant cash deductions</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-stone-400 font-mono">
              Qualify: Free upon sign-up
            </div>
          </div>

          {/* Gold Tier */}
          <div className="bg-[#420A13] border-2 border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#30050D] text-[9px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-bl-lg">
              Most Celebrated
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#F3E5AB] uppercase tracking-wider">
                  Tier 2
                </span>
                <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded font-bold border border-[#D4AF37]/50">
                  1.25x Multiplier
                </span>
              </div>
              <h3 className="font-cinzel text-xl font-bold text-[#F3E5AB] mt-2">
                Gold Sovereign
              </h3>
              <p className="text-xs text-stone-300 font-sans mt-1">
                For distinguished collectors of fine jewellery.
              </p>

              <div className="my-5 py-4 border-y border-[#D4AF37]/30 space-y-2 text-xs text-stone-200 font-sans">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span><strong>1.25x Points</strong> on all jewellery purchases</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>High-yield daily lucky wheel segments</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Priority showroom queue fast-tracking</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#D4AF37] font-mono">
              Qualify: Rs. 500,000+ lifetime purchases
            </div>
          </div>

          {/* Platinum Tier */}
          <div className="bg-[#30050D] border border-[#B54E0E] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#FFEAA7] uppercase tracking-wider">
                  Tier 3
                </span>
                <span className="text-[10px] bg-[#B54E0E]/30 text-[#FFEAA7] px-2 py-0.5 rounded font-bold border border-[#B54E0E]">
                  1.5x Multiplier
                </span>
              </div>
              <h3 className="font-cinzel text-xl font-bold text-[#FFEAA7] mt-2">
                Platinum Sovereign
              </h3>
              <p className="text-xs text-stone-300 font-sans mt-1">
                The zenith of royal Sri Lankan luxury and prestige.
              </p>

              <div className="my-5 py-4 border-y border-stone-700/50 space-y-2 text-xs text-stone-300 font-sans">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span><strong>1.50x Points</strong> acceleration on every piece</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Dedicated Personal Master Gemologist</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Private VIP viewing lounge with champagne service</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#FFEAA7] font-mono">
              Qualify: Rs. 1,500,000+ lifetime purchases
            </div>
          </div>
        </div>

        {/* Daily Lucky Spin Interactive Action Banner */}
        <div className="bg-gradient-to-r from-[#5A0F1B] via-[#8A1C2C] to-[#B54E0E] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center sm:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#3C0812] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] flex-shrink-0 shadow-lg">
              <Flame className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest font-bold text-[#F3E5AB]">
                Daily Compliment
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                Spin the Golden Sovereign Wheel
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 font-sans max-w-xl">
                Win up to 10,000 bonus points instantly! Redeem points directly at checkout (1 Pt = Rs. 1.00 cash off).
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={onOpenLuckyWheel}
              className="bg-[#D4AF37] hover:bg-[#C59B27] text-[#30050D] font-cinzel text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              id="rewards-promo-spin-btn"
            >
              <Flame className="w-4 h-4" /> Spin Wheel Now
            </button>
            <button
              onClick={onExploreRewards}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-cinzel text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              View Tier Guide <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
