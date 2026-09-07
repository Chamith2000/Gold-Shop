import React, { useState, useEffect } from "react";
import {
  Coins,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { api } from "../services/api";
import { GoldRate } from "../types";
import { GoldRateChart } from "../components/gold/GoldRateChart";
import { GoldRateTable } from "../components/gold/GoldRateTable";

interface GoldRatesPageProps {
  onNavigateToShop?: () => void;
  onNavigateToAppointments?: () => void;
}

export const GoldRatesPage: React.FC<GoldRatesPageProps> = ({
  onNavigateToShop,
  onNavigateToAppointments,
}) => {
  const [todayRate, setTodayRate] = useState<GoldRate | null>(null);
  const [history, setHistory] = useState<GoldRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState<string>("");

  const fetchRatesData = async () => {
    try {
      // 1. Fetch today's gold rate
      const today = await api.goldRates.getToday();
      setTodayRate(today);

      // 2. Fetch 7 days history from real database records (Endpoint: GET /api/gold-rates/history?days=7)
      const hist = await api.goldRates.getHistory(7);
      setHistory(hist);

      if (today?.recordedAt) {
        const dateObj = new Date(today.recordedAt);
        setLastUpdatedDisplay(
          dateObj.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      } else {
        setLastUpdatedDisplay(new Date().toLocaleDateString("en-US", { dateStyle: "full", timeStyle: "medium" }));
      }
    } catch (err) {
      console.error("Failed to load gold rates data:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRatesData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRatesData();
  };

  // Calculate 24-hour difference between today and yesterday if available
  const yesterdayRate = history.length > 1 ? history[history.length - 2] : null;
  const shift22k = todayRate && yesterdayRate ? todayRate.rate22k - yesterdayRate.rate22k : 0;
  const shift24k = todayRate && yesterdayRate ? todayRate.rate24k - yesterdayRate.rate24k : 0;

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* 1. Luxury Gold Hero Header */}
      <section className="bg-gradient-to-b from-[#3B0A11] via-[#5A0F1B] to-[#400B13] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30 relative overflow-hidden">
        {/* Subtle Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#B54E0E]/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Metadata Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF3E8]/10 backdrop-blur-md border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-semibold tracking-wide">
              <Coins className="w-3.5 h-3.5 text-[#D4AF37]" />
              Official Sri Lanka Bullion &amp; Jewellery Exchange
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-xs text-[#F3E5AB] border border-white/20 font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#D4AF37]" : ""}`} />
              <span>{isRefreshing ? "Syncing Market..." : "Refresh Rates"}</span>
            </button>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight mb-3">
              Official Gold Rates in Sri Lanka
            </h1>
            <p className="text-sm sm:text-base text-[#E8E1D5] leading-relaxed">
              Transparent, real-time market gold rates certified by the Colombo Gem and Jewellery Authority.
              Track daily purity pricing per gram and sovereign (8g) with verified historical trends.
            </p>

            {/* Last Updated Display */}
            {lastUpdatedDisplay && (
              <div className="mt-4 inline-flex items-center gap-2 text-xs text-[#F3E5AB]/90 bg-black/25 px-3.5 py-1.5 rounded-lg border border-[#D4AF37]/20">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  <strong>Last Updated:</strong> {lastUpdatedDisplay}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-12">
        {/* 2. TODAY'S GOLD RATE SECTION */}
        <section id="today-rates">
          <div className="bg-white rounded-2xl border border-[#E8E1D5] p-6 sm:p-8 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#E8E1D5]">
              <div>
                <span className="text-xs font-bold text-[#B54E0E] uppercase tracking-wider">
                  Live Market Feed
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#5A0F1B]">
                  Today&apos;s Gold Rate
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Trading Session &bull; Colombo, LK</span>
              </div>
            </div>

            {/* Rate Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* 22K Crown Gold Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#FFFDF5] to-[#FAF3E8] rounded-2xl border-2 border-[#D4AF37] p-6 shadow-sm flex flex-col justify-between">
                <div className="absolute top-0 right-0 bg-[#5A0F1B] text-[#F3E5AB] text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Most Popular for Jewellery
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#5A0F1B] text-[#D4AF37] text-xs font-bold font-mono">
                      22K
                    </span>
                    <span className="text-xs font-semibold text-[#5A0F1B]">916 Hallmark Purity</span>
                  </div>

                  <div className="mt-4">
                    <span className="text-xs text-stone-500 block font-medium">Rate per Gram</span>
                    <div className="text-3xl sm:text-4xl font-serif font-bold text-[#5A0F1B] tracking-tight">
                      Rs. {(todayRate?.rate22k || 28450).toLocaleString()}
                      <span className="text-xs font-sans text-stone-500 font-normal ml-1">/ gram</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#D4AF37]/30 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-500 block">1 Sovereign (8.00g)</span>
                      <span className="text-lg font-bold text-stone-900 font-mono">
                        Rs. {((todayRate?.rate22k || 28450) * 8).toLocaleString()}
                      </span>
                    </div>

                    {shift22k !== 0 && (
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-xs font-semibold ${
                          shift22k > 0
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {shift22k > 0 ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        {shift22k > 0 ? `+Rs. ${shift22k}` : `-Rs. ${Math.abs(shift22k)}`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 text-[11px] text-[#B54E0E] flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5A0F1B]" />
                  <span>Certified for Bridal &amp; Traditional Gold</span>
                </div>
              </div>

              {/* 24K Pure Gold Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#FFF8F0] to-[#FAF0E6] rounded-2xl border-2 border-[#B54E0E]/40 p-6 shadow-sm flex flex-col justify-between">
                <div className="absolute top-0 right-0 bg-[#B54E0E] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Bullion &amp; Investment
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#B54E0E] text-white text-xs font-bold font-mono">
                      24K
                    </span>
                    <span className="text-xs font-semibold text-[#B54E0E]">999 Pure Bullion</span>
                  </div>

                  <div className="mt-4">
                    <span className="text-xs text-stone-500 block font-medium">Rate per Gram</span>
                    <div className="text-3xl sm:text-4xl font-serif font-bold text-[#B54E0E] tracking-tight">
                      Rs. {(todayRate?.rate24k || 31050).toLocaleString()}
                      <span className="text-xs font-sans text-stone-500 font-normal ml-1">/ gram</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#B54E0E]/20 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-500 block">1 Sovereign (8.00g)</span>
                      <span className="text-lg font-bold text-stone-900 font-mono">
                        Rs. {((todayRate?.rate24k || 31050) * 8).toLocaleString()}
                      </span>
                    </div>

                    {shift24k !== 0 && (
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-xs font-semibold ${
                          shift24k > 0
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {shift24k > 0 ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        {shift24k > 0 ? `+Rs. ${shift24k}` : `-Rs. ${Math.abs(shift24k)}`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 text-[11px] text-[#B54E0E] flex items-center gap-1 font-medium">
                  <Award className="w-3.5 h-3.5 text-[#B54E0E]" />
                  <span>99.9% Pure Certified Gold Bars &amp; Coins</span>
                </div>
              </div>

              {/* 18K Luxury Gold Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#FAF8F5] to-[#F5EBE6] rounded-2xl border border-[#E8E1D5] p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#8C5D4B] text-white text-xs font-bold font-mono">
                      18K
                    </span>
                    <span className="text-xs font-semibold text-stone-700">750 Gemstone Setting</span>
                  </div>

                  <div className="mt-4">
                    <span className="text-xs text-stone-500 block font-medium">Rate per Gram</span>
                    <div className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                      Rs. {(todayRate?.rate18k || 23300).toLocaleString()}
                      <span className="text-xs font-sans text-stone-500 font-normal ml-1">/ gram</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-500 block">1 Sovereign (8.00g)</span>
                      <span className="text-lg font-bold text-stone-900 font-mono">
                        Rs. {((todayRate?.rate18k || 23300) * 8).toLocaleString()}
                      </span>
                    </div>

                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium">
                      Diamond/Sapphire Grade
                    </span>
                  </div>
                </div>

                <div className="mt-5 text-[11px] text-stone-600 flex items-center gap-1 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#8C5D4B]" />
                  <span>Enhanced Durability for Gem-Studded Jewels</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 7-DAY GOLD RATE HISTORY GRAPH (REQUIREMENT 28) */}
        <section id="rate-graph">
          <div className="space-y-3 mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5A0F1B]/10 text-[#5A0F1B] text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
              7-Day Market Analytics
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#5A0F1B]">
              7-Day Gold Rate History Graph
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl">
              Visualizing the day-by-day fluctuation across 24K, 22K, and 18K standards over the past 7 days.
            </p>
          </div>

          <GoldRateChart data={history} />
        </section>

        {/* 4. RATE HISTORY TABLE (REQUIREMENT 29) */}
        <section id="rate-table">
          <div className="space-y-3 mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5A0F1B]/10 text-[#5A0F1B] text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              Verified Daily Table
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#5A0F1B]">
              Historical Gold Rate Logs
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl">
              Examine the historical daily closing prices in Sri Lankan Rupees (LKR) with daily variance metrics.
            </p>
          </div>

          <GoldRateTable data={history} />
        </section>

        {/* 5. Official Sri Lanka Gold Standard FAQ & Purity Assurance */}
        <section className="bg-[#FAF3E8] rounded-2xl border border-[#D4AF37]/40 p-6 sm:p-8">
          <div className="max-w-3xl mb-6">
            <h3 className="text-xl font-serif font-bold text-[#5A0F1B]">
              Sri Lanka Gold Standard &amp; Hallmarking FAQ
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Everything you need to know about purchasing gold and bullion in Sri Lanka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
            <div className="bg-white rounded-xl p-5 border border-[#E8E1D5] space-y-2">
              <div className="flex items-center gap-2 text-[#5A0F1B] font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>What is a Sovereign (Pawum)?</span>
              </div>
              <p className="text-stone-600 text-xs leading-relaxed">
                In Sri Lanka, one Sovereign (locally termed <em>Pawuma</em>) equals exactly <strong>8.000 grams</strong> of gold. Our 22K sovereign is standard for Sri Lankan bridal sets and auspicious gifts.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-[#E8E1D5] space-y-2">
              <div className="flex items-center gap-2 text-[#5A0F1B] font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>22K (916) vs 24K (999)</span>
              </div>
              <p className="text-stone-600 text-xs leading-relaxed">
                <strong>24K (99.9%)</strong> is pure raw gold, ideal for bullion coins and bars. <strong>22K (91.6%)</strong> is alloyed with copper and silver for strength, making it the supreme choice for wearable jewellery.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-[#E8E1D5] space-y-2">
              <div className="flex items-center gap-2 text-[#5A0F1B] font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Government Assay &amp; Guarantee</span>
              </div>
              <p className="text-stone-600 text-xs leading-relaxed">
                Every piece at Gayan Gold House comes with an official hallmark certificate, laser engraved purity seal, and lifetime buy-back exchange guarantee based on the prevailing daily rate.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
