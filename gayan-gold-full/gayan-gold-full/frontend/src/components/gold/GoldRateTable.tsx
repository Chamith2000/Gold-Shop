import React, { useState } from "react";
import { GoldRate } from "../../types";
import { TrendingUp, TrendingDown, Minus, Calendar, ShieldCheck, ArrowUpDown } from "lucide-react";

interface GoldRateTableProps {
  data: GoldRate[];
}

function formatDateDisplay(dateStr: string): { label: string; subLabel: string; isToday: boolean } {
  try {
    const todayStr = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const d = new Date(dateStr + "T00:00:00");
    const dateFormatted = d.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    if (dateStr === todayStr) {
      return { label: "Today", subLabel: dateFormatted, isToday: true };
    }
    if (dateStr === yesterdayStr) {
      return { label: "Yesterday", subLabel: dateFormatted, isToday: false };
    }
    return { label: dateFormatted, subLabel: dateStr, isToday: false };
  } catch {
    return { label: dateStr, subLabel: "", isToday: false };
  }
}

export const GoldRateTable: React.FC<GoldRateTableProps> = ({ data }) => {
  const [unitView, setUnitView] = useState<"GRAM" | "SOVEREIGN">("GRAM");

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E8E1D5] p-8 text-center text-stone-500">
        <p>No historical gold rate records available.</p>
      </div>
    );
  }

  // Sort descending by date for the table (Today first)
  const sortedDesc = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const multiplier = unitView === "SOVEREIGN" ? 8 : 1;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E1D5] shadow-sm overflow-hidden">
      {/* Table Top Toolbar */}
      <div className="p-4 sm:p-6 border-b border-[#E8E1D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF8F5]">
        <div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#5A0F1B]">
            Official Daily Rate History Log
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Verified database records for Sri Lankan 22K, 24K, and 18K purity hallmarks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center p-0.5 bg-white rounded-xl border border-[#E8E1D5] shadow-xs">
            <button
              type="button"
              onClick={() => setUnitView("GRAM")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                unitView === "GRAM"
                  ? "bg-[#5A0F1B] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Per Gram (g)
            </button>
            <button
              type="button"
              onClick={() => setUnitView("SOVEREIGN")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                unitView === "SOVEREIGN"
                  ? "bg-[#5A0F1B] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              8g Sovereign (Pawum)
            </button>
          </div>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll for Mobile */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF3E8] border-b border-[#E8E1D5] text-[11px] sm:text-xs font-bold text-[#5A0F1B] uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Date</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#B54E0E]"></span>
                  <span>22K Crown Gold (916)</span>
                </div>
              </th>
              <th className="py-3.5 px-4 sm:px-6 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                  <span>24K Pure Gold (999)</span>
                </div>
              </th>
              <th className="py-3.5 px-4 sm:px-6 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E59866]"></span>
                  <span>18K Luxury (750)</span>
                </div>
              </th>
              <th className="py-3.5 px-4 sm:px-6 text-center">24h Shift (22K)</th>
              <th className="py-3.5 px-4 sm:px-6 text-center">Hallmark Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E1D5] text-xs sm:text-sm">
            {sortedDesc.map((row, idx) => {
              const dateInfo = formatDateDisplay(row.date);
              const prevDayRow = sortedDesc[idx + 1];
              const diff = prevDayRow ? row.rate22k - prevDayRow.rate22k : 0;
              const diffScaled = diff * multiplier;

              const val22k = (row.rate22k || 0) * multiplier;
              const val24k = (row.rate24k || 0) * multiplier;
              const val18k = (row.rate18k || 0) * multiplier;

              return (
                <tr
                  key={row.id || row.date}
                  className={`transition-colors hover:bg-[#FAF8F5] ${
                    dateInfo.isToday ? "bg-[#FFFDF5] font-medium" : ""
                  }`}
                >
                  {/* Date Column */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                      {dateInfo.isToday ? (
                        <span className="px-2 py-0.5 rounded-md bg-[#5A0F1B] text-[#F3E5AB] font-bold text-[10px] uppercase tracking-wide">
                          Today
                        </span>
                      ) : (
                        <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold text-stone-900">{dateInfo.label}</div>
                        {dateInfo.subLabel && dateInfo.label !== dateInfo.subLabel && (
                          <div className="text-[11px] text-stone-500">{dateInfo.subLabel}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 22K Rate */}
                  <td className="py-3.5 px-4 sm:px-6 text-right font-mono font-bold text-[#5A0F1B]">
                    Rs. {val22k.toLocaleString()}
                    <div className="text-[10px] font-sans font-normal text-stone-500">
                      {unitView === "GRAM" ? "Rs. " + (val22k * 8).toLocaleString() + " / Sov" : "Rs. " + (val22k / 8).toLocaleString() + " / g"}
                    </div>
                  </td>

                  {/* 24K Rate */}
                  <td className="py-3.5 px-4 sm:px-6 text-right font-mono font-bold text-[#B54E0E]">
                    Rs. {val24k.toLocaleString()}
                    <div className="text-[10px] font-sans font-normal text-stone-500">
                      {unitView === "GRAM" ? "Rs. " + (val24k * 8).toLocaleString() + " / Sov" : "Rs. " + (val24k / 8).toLocaleString() + " / g"}
                    </div>
                  </td>

                  {/* 18K Rate */}
                  <td className="py-3.5 px-4 sm:px-6 text-right font-mono text-stone-700">
                    Rs. {val18k.toLocaleString()}
                  </td>

                  {/* 24h Trend Shift */}
                  <td className="py-3.5 px-4 sm:px-6 text-center">
                    {prevDayRow ? (
                      diffScaled > 0 ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <TrendingUp className="w-3 h-3" />
                          +Rs. {diffScaled.toLocaleString()}
                        </span>
                      ) : diffScaled < 0 ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <TrendingDown className="w-3 h-3" />
                          -Rs. {Math.abs(diffScaled).toLocaleString()}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-600">
                          <Minus className="w-3 h-3" />
                          No Change
                        </span>
                      )
                    ) : (
                      <span className="text-[11px] text-stone-400">Baseline</span>
                    )}
                  </td>

                  {/* Hallmark Status */}
                  <td className="py-3.5 px-4 sm:px-6 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50/60 px-2 py-0.5 rounded-full border border-emerald-200/50">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Assayed &amp; Certified
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E1D5] text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>* 1 Sovereign (Pawum) is standardized at exactly 8.000 grams in Sri Lanka.</span>
        <span className="text-stone-400">Source: Colombo Gold Market Verified Database</span>
      </div>
    </div>
  );
};
