import React, { useState, useEffect } from "react";
import {
  Award,
  Crown,
  Flame,
  Sparkles,
  Gift,
  ArrowRight,
  TrendingUp,
  History,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { RewardTransaction, LuckySpinRecord } from "../types";

interface RewardsPageProps {
  onOpenLuckyWheel: () => void;
  onNavigateToShop: () => void;
}

export const RewardsPage: React.FC<RewardsPageProps> = ({
  onOpenLuckyWheel,
  onNavigateToShop,
}) => {
  const { user, rewardProfile, isAuthenticated } = useAuth();

  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [spinRecords, setSpinRecords] = useState<LuckySpinRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"TIERS" | "LEDGER" | "SPIN_HISTORY">("TIERS");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Points redemption calculator preview
  const [calcPoints, setCalcPoints] = useState<number>(500);

  useEffect(() => {
    const fetchRewardData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const [txs, spins] = await Promise.all([
          api.rewards.getHistory().catch(() => []),
          api.rewards.getSpinHistory().catch(() => []),
        ]);
        setTransactions(txs);
        setSpinRecords(spins);
      } catch (e) {
        console.error("Failed to load reward ledger", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRewardData();
  }, [isAuthenticated]);

  const currentPoints = rewardProfile?.currentPoints || 0;
  const lifetimeEarned = rewardProfile?.lifetimeEarned || 0;
  const currentTier = rewardProfile?.tier || "SILVER";

  // Tier calculation progress
  const goldThreshold = 500000;
  const platinumThreshold = 1500000;
  const progressPercent =
    currentTier === "PLATINUM"
      ? 100
      : currentTier === "GOLD"
      ? Math.min(100, Math.round(((lifetimeEarned * 100) / platinumThreshold) * 100))
      : Math.min(100, Math.round(((lifetimeEarned * 100) / goldThreshold) * 100));

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#5A0F1B] text-[#F3E5AB] text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
            Royal Circle Loyalty Program
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#5A0F1B] uppercase tracking-wide">
            Loyalty Tiers &amp; Gold Multipliers
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
            Gain accelerated sovereign points on fine gold acquisitions, spin daily for instant bonuses, and redeem directly at checkout (1 Point = Rs. 1.00 off).
          </p>
        </div>

        {/* User Balance & Tier Status Card */}
        <div className="bg-gradient-to-br from-[#420A13] via-[#5A0F1B] to-[#2B040B] text-white rounded-3xl p-6 sm:p-10 border-2 border-[#D4AF37] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Points & Tier */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-[#D4AF37] text-[#30050D] font-cinzel text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {currentTier} Sovereign Patron
                </span>
                <span className="text-xs text-[#F3E5AB] font-sans">
                  {currentTier === "PLATINUM" ? "1.50x Multiplier" : currentTier === "GOLD" ? "1.25x Multiplier" : "1.00x Multiplier"}
                </span>
              </div>

              <div>
                <span className="text-xs uppercase font-sans text-stone-300 tracking-wider">
                  Available Redeemable Balance
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="font-cinzel text-4xl sm:text-5xl font-bold text-[#FFEAA7]">
                    {currentPoints.toLocaleString()}
                  </span>
                  <span className="text-sm sm:text-base font-sans text-stone-300">
                    Points (= <strong>Rs. {currentPoints.toLocaleString()}</strong> Cash Deduction)
                  </span>
                </div>
              </div>

              {/* Progress Bar towards Next Tier */}
              {currentTier !== "PLATINUM" && (
                <div className="space-y-1.5 pt-2 max-w-lg">
                  <div className="flex justify-between text-xs text-[#F3E5AB]">
                    <span>Current: {currentTier}</span>
                    <span>Next: {currentTier === "SILVER" ? "GOLD (1.25x)" : "PLATINUM (1.50x)"}</span>
                  </div>
                  <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/20">
                    <div
                      className="bg-gradient-to-r from-[#D4AF37] to-[#FFEAA7] h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(5, progressPercent)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right: Actions */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={onOpenLuckyWheel}
                className="bg-gradient-to-r from-[#D4AF37] to-[#B54E0E] hover:opacity-90 text-[#30050D] font-cinzel text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2"
                id="rewards-page-spin-btn"
              >
                <Flame className="w-4 h-4 text-[#30050D]" />
                Spin Daily Golden Wheel
              </button>

              <button
                onClick={onNavigateToShop}
                className="bg-white/10 hover:bg-white/20 border border-[#D4AF37]/50 text-white font-cinzel text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Acquire Pieces &amp; Earn Points <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3 Detailed Tier Privilege Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-cinzel text-base font-bold text-stone-900">Silver Sovereign</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600">1.0x Rate</span>
            </div>
            <ul className="space-y-2 text-xs text-stone-600 font-sans">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>1 Pt for every Rs. 100 spent</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Daily free Lucky Wheel spin</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Online order tracking &amp; invoices</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#FAF3E8] rounded-2xl p-6 border-2 border-[#D4AF37] shadow-sm space-y-4 relative">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <h3 className="font-cinzel text-base font-bold text-[#5A0F1B]">Gold Sovereign</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#D4AF37] text-[#30050D]">1.25x Rate</span>
            </div>
            <ul className="space-y-2 text-xs text-stone-700 font-sans">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5A0F1B] flex-shrink-0" />
                <span><strong>1.25x Points</strong> on every acquisition</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5A0F1B] flex-shrink-0" />
                <span>Enhanced Lucky Wheel winning sectors</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5A0F1B] flex-shrink-0" />
                <span>VIP fast-track showroom appointments</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-cinzel text-base font-bold text-[#5A0F1B]">Platinum Sovereign</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#5A0F1B] text-white">1.50x Rate</span>
            </div>
            <ul className="space-y-2 text-xs text-stone-600 font-sans">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B54E0E] flex-shrink-0" />
                <span><strong>1.50x Points</strong> acceleration</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B54E0E] flex-shrink-0" />
                <span>Dedicated personal master gemologist</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B54E0E] flex-shrink-0" />
                <span>Private VIP lounge viewing salon</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Activity Ledger & Spin History Tabs */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex border-b border-stone-200 gap-6 text-xs font-cinzel font-bold">
            <button
              onClick={() => setActiveTab("TIERS")}
              className={`pb-3 uppercase tracking-wider transition-colors ${
                activeTab === "TIERS"
                  ? "text-[#5A0F1B] border-b-2 border-[#5A0F1B]"
                  : "text-stone-400 hover:text-stone-800"
              }`}
            >
              Points Calculator
            </button>
            <button
              onClick={() => setActiveTab("LEDGER")}
              className={`pb-3 uppercase tracking-wider transition-colors ${
                activeTab === "LEDGER"
                  ? "text-[#5A0F1B] border-b-2 border-[#5A0F1B]"
                  : "text-stone-400 hover:text-stone-800"
              }`}
            >
              Points Ledger ({transactions.length})
            </button>
            <button
              onClick={() => setActiveTab("SPIN_HISTORY")}
              className={`pb-3 uppercase tracking-wider transition-colors ${
                activeTab === "SPIN_HISTORY"
                  ? "text-[#5A0F1B] border-b-2 border-[#5A0F1B]"
                  : "text-stone-400 hover:text-stone-800"
              }`}
            >
              Spin Records ({spinRecords.length})
            </button>
          </div>

          {activeTab === "TIERS" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h4 className="font-cinzel text-base font-bold text-[#5A0F1B]">
                  Simulate Points Redemption Discount
                </h4>
                <p className="text-xs text-stone-600 font-sans leading-relaxed">
                  Every 1 loyalty point translates directly to 1 Sri Lankan Rupee (LKR) cash deduction at cart checkout.
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-stone-700">
                    <span>Points to Redeem:</span>
                    <span className="text-[#B54E0E]">{calcPoints} Pts</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={5000}
                    step={100}
                    value={calcPoints}
                    onChange={(e) => setCalcPoints(Number(e.target.value))}
                    className="w-full accent-[#B54E0E] cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-[#FAF3E8] border border-[#D4AF37] rounded-2xl p-6 text-center space-y-2">
                <span className="text-xs uppercase font-bold text-stone-500 font-cinzel">
                  Equivalent Cash Savings
                </span>
                <div className="font-cinzel text-3xl sm:text-4xl font-bold text-[#5A0F1B]">
                  Rs. {calcPoints.toLocaleString()}
                </div>
                <p className="text-[11px] text-stone-500 font-sans">
                  Applied directly towards cart subtotal during checkout
                </p>
              </div>
            </div>
          )}

          {activeTab === "LEDGER" && (
            <div className="overflow-x-auto">
              {transactions.length === 0 ? (
                <p className="text-xs text-stone-400 py-6 text-center">No transaction records found yet.</p>
              ) : (
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px]">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Description</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="py-2.5">
                        <td className="py-2.5 text-stone-500">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 font-medium text-stone-900">{tx.description}</td>
                        <td className="py-2.5">
                          <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[10px] font-mono">
                            {tx.type}
                          </span>
                        </td>
                        <td
                          className={`py-2.5 text-right font-bold font-mono ${
                            tx.points >= 0 ? "text-emerald-700" : "text-rose-700"
                          }`}
                        >
                          {tx.points >= 0 ? `+${tx.points}` : tx.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "SPIN_HISTORY" && (
            <div className="overflow-x-auto">
              {spinRecords.length === 0 ? (
                <p className="text-xs text-stone-400 py-6 text-center">No lucky spins recorded yet.</p>
              ) : (
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px]">
                      <th className="pb-2">Spin Time</th>
                      <th className="pb-2">Winning Outcome</th>
                      <th className="pb-2 text-right">Points Awarded</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {spinRecords.map((spin) => (
                      <tr key={spin.id} className="py-2.5">
                        <td className="py-2.5 text-stone-500">
                          {new Date(spin.spunAt).toLocaleString()}
                        </td>
                        <td className="py-2.5 font-cinzel font-bold text-stone-900">{spin.segmentName}</td>
                        <td className="py-2.5 text-right font-bold text-emerald-700 font-mono">
                          +{spin.rewardPoints} Pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
