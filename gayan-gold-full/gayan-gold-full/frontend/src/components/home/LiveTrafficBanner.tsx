import React from "react";
import { Users, Clock, Calendar, Sparkles, Activity, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useTraffic } from "../../context/TrafficContext";

interface LiveTrafficBannerProps {
  onBookAppointment: () => void;
}

export const LiveTrafficBanner: React.FC<LiveTrafficBannerProps> = ({ onBookAppointment }) => {
  const { activity, isLive } = useTraffic();

  const trafficColor =
    activity?.trafficLevel === "LOW"
      ? "text-emerald-700 bg-emerald-50 border-emerald-300"
      : activity?.trafficLevel === "MODERATE"
      ? "text-amber-700 bg-amber-50 border-amber-300"
      : "text-rose-700 bg-rose-50 border-rose-300";

  const trafficBadge =
    activity?.trafficLevel === "LOW"
      ? "bg-emerald-500"
      : activity?.trafficLevel === "MODERATE"
      ? "bg-amber-500"
      : "bg-rose-500";

  return (
    <section className="bg-[#FAF8F5] py-6 sm:py-8 border-b border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#FAF3E8] via-white to-[#FAF3E8] rounded-2xl border border-[#D4AF37]/50 p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Live Indicator & Status */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-[#5A0F1B] text-[#D4AF37] flex items-center justify-center shadow-md">
                  <Activity className="w-6 h-6" />
                </div>
                {isLive && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#5A0F1B]">
                    Flagship Boutique Live Status
                  </span>
                  <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono">
                    Colombo 11
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-bold ${trafficColor}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${trafficBadge}`} />
                    <span>{activity?.trafficLevel || "LOW"} Traffic</span>
                  </div>

                  <div className="inline-flex items-center gap-1 text-xs text-stone-600 font-sans">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <span>
                      <strong className="text-stone-900">{activity?.currentVisitorCount || 6}</strong> patrons browsing
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1 text-xs text-stone-600 font-sans">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>
                      Est. Wait: <strong className="text-stone-900">{activity?.estimatedWaitMinutes || 5} mins</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note & Peak Hour Advice */}
            <div className="text-xs text-stone-600 max-w-md font-sans lg:text-left text-center">
              <p className="flex items-center gap-1.5 font-medium text-stone-800">
                <CheckCircle2 className="w-4 h-4 text-[#B54E0E] flex-shrink-0" />
                {activity?.peakHoursNote ||
                  "Ideal time for private viewing and custom bridal jewellery consultation."}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Reserve your dedicated master gemologist ahead to bypass showroom queues.
              </p>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={onBookAppointment}
              className="w-full sm:w-auto bg-[#5A0F1B] hover:bg-[#400A13] text-white font-cinzel text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 flex-shrink-0"
              id="live-traffic-book-slot-btn"
            >
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              Reserve Fast-Track Slot
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
