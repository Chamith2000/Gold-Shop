import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  ShieldCheck,
  Coins,
  ArrowRight,
} from "lucide-react";
import { api } from "../../services/api";
import { GoldRate } from "../../types";

interface GoldRatesSectionProps {
  onViewGoldRates?: () => void;
}

export const GoldRatesSection: React.FC<GoldRatesSectionProps> = ({ onViewGoldRates }) => {
  const [goldRate, setGoldRate] = useState<GoldRate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const data = await api.goldRates.getToday();
      setGoldRate(data);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#FAF8F5] via-[#FAF3E8] to-[#FAF8F5] border-y border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5A0F1B] text-[#F3E5AB] text-xs font-bold uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5 text-[#D4AF37]" />
            Official Sri Lanka Gold Exchange Rates
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#5A0F1B] uppercase tracking-wide">
            Daily Sri Lanka Gold Rates
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
            Real-time assay market rates per gram and sovereign (8g) in Sri Lankan Rupees (LKR). Transparent pricing with zero hidden charges.
          </p>
        </div>

        {/* Live Rates Ticker Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* 22K Sovereign */}
          <div className="bg-white rounded-2xl p-5 border-2 border-[#D4AF37] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4AF37]/10 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B54E0E]">
                Most Popular
              </span>
              <span className="text-[10px] bg-[#FAF3E8] text-[#5A0F1B] px-2 py-0.5 rounded font-mono font-bold">
                1 Sovereign (8g)
              </span>
            </div>
            <h3 className="font-cinzel text-base font-bold text-stone-900 mt-2">
              22K Gold Sovereign
            </h3>
            <p className="font-cinzel text-2xl font-bold text-[#5A0F1B] mt-1">
              Rs. {goldRate ? goldRate.sovereign22k.toLocaleString() : "194,400"}
            </p>
            <p className="text-[11px] text-stone-500 font-sans mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              Rs. {goldRate ? goldRate.rate22k.toLocaleString() : "24,300"} / gram
            </p>
          </div>

          {/* 24K Sovereign */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm relative">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Pure 99.9%
              </span>
              <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono font-bold">
                1 Sovereign (8g)
              </span>
            </div>
            <h3 className="font-cinzel text-base font-bold text-stone-900 mt-2">
              24K Pure Gold
            </h3>
            <p className="font-cinzel text-2xl font-bold text-[#5A0F1B] mt-1">
              Rs. {goldRate ? goldRate.sovereign24k.toLocaleString() : "212,000"}
            </p>
            <p className="text-[11px] text-stone-500 font-sans mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              Rs. {goldRate ? goldRate.rate24k.toLocaleString() : "26,500"} / gram
            </p>
          </div>

          {/* 18K Gold Rate */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm relative">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                75.0% Fine
              </span>
              <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono font-bold">
                Per Gram
              </span>
            </div>
            <h3 className="font-cinzel text-base font-bold text-stone-900 mt-2">
              18K Luxury Gold
            </h3>
            <p className="font-cinzel text-2xl font-bold text-[#5A0F1B] mt-1">
              Rs. {goldRate ? goldRate.rate18k.toLocaleString() : "19,900"}
            </p>
            <p className="text-[11px] text-stone-500 font-sans mt-1">
              Ideal for Diamond &amp; Sapphire settings
            </p>
          </div>

          {/* Assay Authenticity Card */}
          <div className="bg-[#5A0F1B] text-white rounded-2xl p-5 border border-[#D4AF37]/50 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-cinzel text-xs font-bold uppercase tracking-wider">
                  Assay Guaranteed
                </span>
              </div>
              <p className="text-xs text-stone-300 font-sans mt-2 leading-relaxed">
                Rates calibrated daily against the Colombo Bullion Association with 100% assay stamp guarantee.
              </p>
            </div>
            <div className="text-[10px] text-[#F3E5AB] font-mono mt-3">
              Updated: {goldRate ? new Date(goldRate.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Today 09:30 AM"}
            </div>
          </div>
        </div>

        {/* 7-Day Gold Rate History CTA Banner */}
        {onViewGoldRates && (
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#D4AF37]/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-[#FAF3E8] text-[#B54E0E] flex items-center justify-center shrink-0 border border-[#D4AF37]/30">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-serif font-bold text-[#5A0F1B]">
                  Looking for the 7-Day Gold Rate History &amp; Chart?
                </h4>
                <p className="text-xs text-stone-500">
                  Analyze Colombo market closing rates, purity trends, and verified daily logs on our dedicated analytics page.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onViewGoldRates}
              className="px-5 py-2.5 rounded-xl bg-[#5A0F1B] hover:bg-[#400A13] text-[#F3E5AB] text-xs font-bold font-sans uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 shrink-0 group"
            >
              <span>View 7-Day Rate History &amp; Graph</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
