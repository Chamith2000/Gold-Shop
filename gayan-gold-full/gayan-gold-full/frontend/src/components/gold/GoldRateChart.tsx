import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { GoldRate } from "../../types";
import { TrendingUp, TrendingDown, Minus, Sparkles, Calendar, Layers } from "lucide-react";

interface GoldRateChartProps {
  data: GoldRate[];
  unit?: "GRAM" | "SOVEREIGN";
}

// Formats a date string into readable short label like "Aug 16" or "Today"
function formatChartDate(dateStr: string, index: number, total: number): string {
  if (!dateStr) return "";
  try {
    const todayStr = new Date().toISOString().split("T")[0];
    if (dateStr === todayStr) return "Today";
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateStr === yesterday.toISOString().split("T")[0]) return "Yesterday";

    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

// Custom Luxury Tooltip
const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    const rateItem = payload[0]?.payload as GoldRate;
    const isSovereign = unit === "SOVEREIGN";
    const multiplier = isSovereign ? 8 : 1;
    const unitLabel = isSovereign ? "per 8g Sovereign" : "per gram";

    return (
      <div className="bg-[#1C1917]/95 backdrop-blur-md border border-[#D4AF37]/50 rounded-xl p-4 shadow-2xl text-white min-w-[240px] pointer-events-none animate-fadeIn">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-[#F3E5AB] font-medium tracking-wide">
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{rateItem.date}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5A0F1B] text-[#D4AF37] font-semibold border border-[#D4AF37]/30">
            {unitLabel}
          </span>
        </div>

        <div className="space-y-2">
          {/* 24K */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"></span>
              <span className="text-[#E8E1D5] font-medium">24K Pure Gold:</span>
            </div>
            <span className="font-bold text-[#F3E5AB] font-mono">
              Rs. {((rateItem.rate24k || 0) * multiplier).toLocaleString()}
            </span>
          </div>

          {/* 22K */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B54E0E] shadow-[0_0_8px_#B54E0E]"></span>
              <span className="text-[#E8E1D5] font-medium">22K Crown Gold:</span>
            </div>
            <span className="font-bold text-white font-mono">
              Rs. {((rateItem.rate22k || 0) * multiplier).toLocaleString()}
            </span>
          </div>

          {/* 18K */}
          {rateItem.rate18k && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E59866] shadow-[0_0_8px_#E59866]"></span>
                <span className="text-[#E8E1D5] font-medium">18K Luxury Gold:</span>
              </div>
              <span className="font-bold text-[#E8E1D5] font-mono">
                Rs. {((rateItem.rate18k || 0) * multiplier).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
          <span>Currency</span>
          <span className="text-[#D4AF37] font-semibold">LKR (Sri Lanka)</span>
        </div>
      </div>
    );
  }
  return null;
};

export const GoldRateChart: React.FC<GoldRateChartProps> = ({ data, unit: initialUnit = "GRAM" }) => {
  const [unit, setUnit] = useState<"GRAM" | "SOVEREIGN">(initialUnit);
  const [visiblePurities, setVisiblePurities] = useState({
    p24k: true,
    p22k: true,
    p18k: true,
  });

  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center text-stone-500 bg-[#FAF8F5] rounded-2xl border border-[#E8E1D5] p-6 text-center">
        <Sparkles className="w-8 h-8 text-[#D4AF37] mb-2 animate-pulse" />
        <p className="text-sm font-medium">Loading Gold Rate Historical Graph...</p>
      </div>
    );
  }

  const multiplier = unit === "SOVEREIGN" ? 8 : 1;

  // Process data with calculated multiplier for smooth chart plotting
  const chartData = data.map((item, idx) => ({
    ...item,
    displayDate: formatChartDate(item.date, idx, data.length),
    val24k: (item.rate24k || 0) * multiplier,
    val22k: (item.rate22k || 0) * multiplier,
    val18k: (item.rate18k || 0) * multiplier,
  }));

  // Calculate 7-day stats
  const firstRecord = data[0];
  const lastRecord = data[data.length - 1];
  const diff22k = lastRecord && firstRecord ? (lastRecord.rate22k - firstRecord.rate22k) * multiplier : 0;
  const diffPercent = firstRecord && firstRecord.rate22k ? ((diff22k / (firstRecord.rate22k * multiplier)) * 100).toFixed(2) : "0.00";

  // Min and Max for optimal YAxis range
  const allValues = chartData.flatMap((d) => [
    visiblePurities.p24k ? d.val24k : null,
    visiblePurities.p22k ? d.val22k : null,
    visiblePurities.p18k ? d.val18k : null,
  ]).filter((v): v is number => v !== null && v > 0);

  const minY = allValues.length > 0 ? Math.floor(Math.min(...allValues) * 0.98) : 20000;
  const maxY = allValues.length > 0 ? Math.ceil(Math.max(...allValues) * 1.02) : 35000;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E1D5] shadow-sm overflow-hidden p-4 sm:p-6 transition-all duration-300 hover:shadow-md">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#E8E1D5]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#5A0F1B]">
              Gold Rate — Last 7 Days
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#FAF3E8] text-[#B54E0E] font-semibold border border-[#D4AF37]/30">
              {data.length} Recorded Days
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Official daily closing rate trends from the Colombo Bullion Exchange
          </p>
        </div>

        {/* Unit & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Unit Toggle: Gram vs Sovereign */}
          <div className="inline-flex items-center p-0.5 bg-[#FAF3E8] rounded-xl border border-[#E8E1D5]">
            <button
              type="button"
              onClick={() => setUnit("GRAM")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                unit === "GRAM"
                  ? "bg-[#5A0F1B] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Per Gram (g)
            </button>
            <button
              type="button"
              onClick={() => setUnit("SOVEREIGN")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                unit === "SOVEREIGN"
                  ? "bg-[#5A0F1B] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              8g Sovereign (Pawum)
            </button>
          </div>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-xs">
        <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E8E1D5] flex items-center justify-between">
          <span className="text-stone-500">7-Day Net Shift (22K)</span>
          <div className="flex items-center gap-1 font-bold">
            {diff22k > 0 ? (
              <span className="text-emerald-700 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +Rs. {diff22k.toLocaleString()} (+{diffPercent}%)
              </span>
            ) : diff22k < 0 ? (
              <span className="text-rose-700 flex items-center">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> -Rs. {Math.abs(diff22k).toLocaleString()} ({diffPercent}%)
              </span>
            ) : (
              <span className="text-stone-600 flex items-center">
                <Minus className="w-3.5 h-3.5 mr-0.5" /> Stable
              </span>
            )}
          </div>
        </div>

        {/* Purity Interactive Toggles */}
        <button
          type="button"
          onClick={() => setVisiblePurities((prev) => ({ ...prev, p24k: !prev.p24k }))}
          className={`p-2.5 rounded-xl border transition-all text-left flex items-center justify-between ${
            visiblePurities.p24k
              ? "bg-[#FFFDF5] border-[#D4AF37] text-stone-900 shadow-xs"
              : "bg-stone-50 border-stone-200 text-stone-400 opacity-60"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="font-medium">24K Pure</span>
          </div>
          <span className="font-mono font-bold text-xs text-[#5A0F1B]">
            {visiblePurities.p24k ? "Active" : "Hidden"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setVisiblePurities((prev) => ({ ...prev, p22k: !prev.p22k }))}
          className={`p-2.5 rounded-xl border transition-all text-left flex items-center justify-between ${
            visiblePurities.p22k
              ? "bg-[#FFF9F5] border-[#B54E0E] text-stone-900 shadow-xs"
              : "bg-stone-50 border-stone-200 text-stone-400 opacity-60"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B54E0E]"></span>
            <span className="font-medium">22K Crown</span>
          </div>
          <span className="font-mono font-bold text-xs text-[#B54E0E]">
            {visiblePurities.p22k ? "Active" : "Hidden"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setVisiblePurities((prev) => ({ ...prev, p18k: !prev.p18k }))}
          className={`p-2.5 rounded-xl border transition-all text-left flex items-center justify-between ${
            visiblePurities.p18k
              ? "bg-[#FCF7F7] border-[#E59866] text-stone-900 shadow-xs"
              : "bg-stone-50 border-stone-200 text-stone-400 opacity-60"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E59866]"></span>
            <span className="font-medium">18K Luxury</span>
          </div>
          <span className="font-mono font-bold text-xs text-stone-700">
            {visiblePurities.p18k ? "Active" : "Hidden"}
          </span>
        </button>
      </div>

      {/* Main Responsive Recharts Line Chart */}
      <div className="h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 15, right: 15, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" vertical={false} />
            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={{ stroke: "#E8E1D5" }}
              tick={{ fill: "#78716C", fontSize: 11, fontWeight: 500 }}
              padding={{ left: 15, right: 15 }}
            />
            <YAxis
              domain={[minY, maxY]}
              orientation="right"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#78716C", fontSize: 11, fontFamily: "monospace" }}
              tickFormatter={(val) => `Rs. ${(val / 1000).toFixed(0)}k`}
              width={65}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            
            {visiblePurities.p24k && (
              <Line
                type="monotone"
                dataKey="val24k"
                name="24K Pure Gold (999)"
                stroke="#D4AF37"
                strokeWidth={3}
                dot={{ r: 4, fill: "#D4AF37", stroke: "#FFFFFF", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#D4AF37", stroke: "#5A0F1B", strokeWidth: 2 }}
                animationDuration={900}
              />
            )}

            {visiblePurities.p22k && (
              <Line
                type="monotone"
                dataKey="val22k"
                name="22K Crown Gold (916)"
                stroke="#5A0F1B"
                strokeWidth={3}
                dot={{ r: 4, fill: "#5A0F1B", stroke: "#FFFFFF", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#5A0F1B", stroke: "#D4AF37", strokeWidth: 2 }}
                animationDuration={900}
              />
            )}

            {visiblePurities.p18k && (
              <Line
                type="monotone"
                dataKey="val18k"
                name="18K Luxury Gold (750)"
                stroke="#E59866"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 3.5, fill: "#E59866", stroke: "#FFFFFF", strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: "#E59866", stroke: "#5A0F1B", strokeWidth: 2 }}
                animationDuration={900}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Legend */}
      <div className="mt-4 pt-3 border-t border-[#E8E1D5] flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#D4AF37] rounded-full"></span>
            <span>24K Pure Gold (999 Hallmarked)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#5A0F1B] rounded-full"></span>
            <span>22K Crown Gold (916 Hallmarked)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 border-t-2 border-dashed border-[#E59866]"></span>
            <span>18K Gemstone Gold (750 Hallmarked)</span>
          </div>
        </div>

        <div className="text-[11px] text-[#B54E0E] font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span>Interactive Luxury Analytics</span>
        </div>
      </div>
    </div>
  );
};
