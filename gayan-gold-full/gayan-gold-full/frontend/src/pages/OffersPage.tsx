import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Tag,
  Sparkles,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Percent,
} from "lucide-react";
import { Offer } from "../types";
import { api } from "../services/api";

interface OffersPageProps {
  onNavigateToShop?: () => void;
  onNavigateToGifts?: () => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({
  onNavigateToShop,
  onNavigateToGifts,
}) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedTermsOffer, setSelectedTermsOffer] = useState<Offer | null>(null);

  // Live timer tick for limited time offers
  const [nowTime, setNowTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.offers
      .getAll()
      .then((res) => {
        if (isMounted) {
          setOffers(res || []);
        }
      })
      .catch((err) => {
        console.error("Failed to load offers", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const offerTypes = [
    { label: "All Offers", value: "ALL" },
    { label: "Today's Offers", value: "TODAY" },
    { label: "Jewellery Offers", value: "JEWELLERY" },
    { label: "Gift Offers", value: "GIFT" },
    { label: "Couple Specials", value: "COUPLE" },
    { label: "Wedding Festival", value: "WEDDING" },
    { label: "Birthday Specials", value: "BIRTHDAY" },
    { label: "Anniversary", value: "ANNIVERSARY" },
    { label: "Seasonal Flash", value: "SEASONAL" },
  ];

  const filteredOffers = offers.filter((o) => {
    if (selectedType === "ALL") return true;
    return o.offerType === selectedType;
  });

  const activeCount = offers.filter((o) => o.calculatedStatus === "ACTIVE").length;

  const formatCountdown = (endDate?: string) => {
    if (!endDate) return null;
    const diff = new Date(endDate).getTime() - nowTime;
    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* 1. HERO BANNER */}
      <section className="relative bg-linear-to-r from-[#420A13] via-[#5A0F1B] to-[#721524] text-white py-16 sm:py-24 px-4 overflow-hidden border-b border-[#D4AF37]/30">
        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-semibold uppercase tracking-widest"
          >
            <Tag className="w-4 h-4 text-[#D4AF37]" />
            Exclusive Promotion Hub
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF8F5]"
          >
            Exclusive <span className="italic text-[#D4AF37]">Offers &amp; Promotions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-sm sm:text-base text-stone-200 font-sans leading-relaxed"
          >
            Special moments deserve something special. Discover limited-time promotions on mastercrafted
            22K gold jewellery, luxury bridal hampers, birthday gifts, and couple anniversary bundles.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        {/* 2. CATEGORY FILTER TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E8E1D5] scrollbar-none">
          {offerTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => setSelectedType(t.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedType === t.value
                  ? "bg-[#5A0F1B] text-white shadow-md"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 3. OFFERS GRID */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-2 border-[#5A0F1B] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-3 text-xs text-stone-500 font-cinzel">Loading active offers...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
            <Tag className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-cinzel text-lg font-bold text-stone-800">No Offers Found in this Category</h3>
            <p className="text-xs text-stone-500">Check back soon or explore all current promotions.</p>
            <button
              onClick={() => setSelectedType("ALL")}
              className="px-4 py-2 bg-[#5A0F1B] text-white text-xs font-bold rounded-lg"
            >
              View All Offers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredOffers.map((offer) => {
              const status = offer.calculatedStatus || "ACTIVE";
              const countdown = formatCountdown(offer.endDate);

              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-3xl border border-[#E8E1D5] hover:border-[#D4AF37] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Banner Image Header */}
                    <div className="relative h-56 overflow-hidden bg-stone-900">
                      <img
                        src={offer.bannerImage}
                        alt={offer.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                      {/* Status Badge */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        {status === "ACTIVE" ? (
                          <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                            <CheckCircle className="w-3 h-3" /> ACTIVE OFFER
                          </span>
                        ) : status === "UPCOMING" ? (
                          <span className="bg-amber-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                            <Clock className="w-3 h-3" /> UPCOMING
                          </span>
                        ) : (
                          <span className="bg-stone-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                            EXPIRED
                          </span>
                        )}

                        {offer.discountPercent && (
                          <span className="bg-[#5A0F1B] text-[#F3E5AB] border border-[#D4AF37] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase shadow-md">
                            {offer.discountPercent}% DISCOUNT
                          </span>
                        )}
                      </div>

                      {/* Title Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-[11px] text-[#F3E5AB] font-semibold uppercase tracking-wider block mb-0.5">
                          {offer.offerType} OFFER
                        </span>
                        <h2 className="font-cinzel text-xl sm:text-2xl font-bold leading-tight">
                          {offer.title}
                        </h2>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-4">
                      {offer.subtitle && (
                        <p className="text-xs font-bold text-[#5A0F1B] uppercase tracking-wider">
                          {offer.subtitle}
                        </p>
                      )}

                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {offer.description}
                      </p>

                      {/* Countdown Timer for Limited-Time Offers */}
                      {status === "ACTIVE" && countdown && countdown !== "Expired" && (
                        <div className="bg-[#FAF3E8] border border-[#D4AF37]/40 rounded-2xl p-3 flex items-center justify-between text-xs">
                          <span className="font-bold text-[#5A0F1B] flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#B54E0E] animate-pulse" />
                            Offer Ends In:
                          </span>
                          <span className="font-mono font-bold text-sm text-[#B54E0E] bg-white px-3 py-1 rounded-lg border border-amber-200 shadow-2xs">
                            {countdown}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Terms Footer */}
                  <div className="p-6 pt-0 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-100 text-xs">
                      {offer.termsAndConditions && (
                        <button
                          onClick={() => setSelectedTermsOffer(offer)}
                          className="text-stone-500 hover:text-[#5A0F1B] underline font-medium"
                        >
                          View Terms &amp; Conditions
                        </button>
                      )}

                      <div className="flex items-center gap-2 ml-auto">
                        {offer.offerType === "GIFT" || offer.offerType === "BIRTHDAY" ? (
                          <button
                            onClick={() => onNavigateToGifts && onNavigateToGifts()}
                            className="px-5 py-2.5 bg-[#5A0F1B] hover:bg-[#420A13] text-white font-cinzel text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2"
                          >
                            Explore Gift Packs <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onNavigateToShop && onNavigateToShop()}
                            className="px-5 py-2.5 bg-[#5A0F1B] hover:bg-[#420A13] text-white font-cinzel text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2"
                          >
                            Shop Eligible Products <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* TERMS & CONDITIONS MODAL */}
      {selectedTermsOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#D4AF37]">
            <h3 className="font-cinzel text-lg font-bold text-[#5A0F1B]">
              Terms &amp; Conditions: {selectedTermsOffer.title}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200">
              {selectedTermsOffer.termsAndConditions}
            </p>
            <button
              onClick={() => setSelectedTermsOffer(null)}
              className="w-full py-2 bg-[#5A0F1B] text-white text-xs font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
