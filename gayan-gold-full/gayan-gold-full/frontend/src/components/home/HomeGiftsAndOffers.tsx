import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Gift, Tag, Sparkles, Clock, ArrowRight, Plus, Check } from "lucide-react";
import { Offer, GiftProduct } from "../../types";
import { api } from "../../services/api";
import { useCart } from "../../context/CartContext";

interface HomeGiftsAndOffersProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const HomeGiftsAndOffers: React.FC<HomeGiftsAndOffersProps> = ({ onNavigate }) => {
  const { addGiftToCart } = useCart();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [gifts, setGifts] = useState<GiftProduct[]>([]);
  const [addedGiftIds, setAddedGiftIds] = useState<string[]>([]);
  const [nowTime, setNowTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNowTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.all([api.homepage.getOffers(), api.homepage.getGifts()])
      .then(([offersRes, giftsRes]) => {
        if (isMounted) {
          setOffers(offersRes || []);
          setGifts(giftsRes || []);
        }
      })
      .catch((err) => console.error("Failed to load homepage gifts and offers", err));

    return () => {
      isMounted = false;
    };
  }, []);

  if (offers.length === 0 && gifts.length === 0) return null;

  const handleAddGift = (gift: GiftProduct) => {
    addGiftToCart(gift, 1);
    setAddedGiftIds((prev) => [...prev, gift.id]);
  };

  const formatCountdown = (endDate?: string) => {
    if (!endDate) return null;
    const diff = new Date(endDate).getTime() - nowTime;
    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return `${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
  };

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. TODAY'S OFFERS SECTION */}
      {offers.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-[#E8E1D5] pb-4">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#5A0F1B] uppercase tracking-widest bg-[#5A0F1B]/10 px-3 py-1 rounded-full mb-1">
                <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                Exclusive Savings
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#5A0F1B]">
                Today's Offers &amp; Promotions
              </h2>
            </div>
            <button
              onClick={() => onNavigate("offers")}
              className="text-xs font-bold text-[#B54E0E] hover:text-[#5A0F1B] flex items-center gap-1 group"
            >
              View All Offers <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.slice(0, 2).map((offer) => {
              const countdown = formatCountdown(offer.endDate);
              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-2xl border border-[#E8E1D5] hover:border-[#D4AF37] transition-all overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between group"
                >
                  <div className="relative h-48 overflow-hidden bg-stone-900">
                    <img
                      src={offer.bannerImage}
                      alt={offer.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    {offer.discountPercent && (
                      <span className="absolute top-3 left-3 bg-[#5A0F1B] text-[#F3E5AB] border border-[#D4AF37] text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md">
                        {offer.discountPercent}% OFF
                      </span>
                    )}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[10px] text-[#F3E5AB] font-bold uppercase tracking-wider block">
                        {offer.offerType} PROMOTION
                      </span>
                      <h3 className="font-cinzel text-lg font-bold leading-snug">
                        {offer.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-stone-600 line-clamp-2">{offer.description}</p>
                    {countdown && countdown !== "Expired" && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#B54E0E] bg-[#FAF3E8] p-2 rounded-lg">
                        <Clock className="w-4 h-4 text-[#B54E0E] animate-pulse" />
                        <span>Ends in: {countdown}</span>
                      </div>
                    )}
                    <button
                      onClick={() => onNavigate("offers")}
                      className="w-full py-2 bg-[#5A0F1B] hover:bg-[#420A13] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      Claim Offer Now <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 2. GIFT & CELEBRATION PICKS SECTION */}
      {gifts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-[#E8E1D5] pb-4">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#5A0F1B] uppercase tracking-widest bg-[#5A0F1B]/10 px-3 py-1 rounded-full mb-1">
                <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
                Celebrate Life's Moments
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#5A0F1B]">
                Gift &amp; Celebration Picks
              </h2>
            </div>
            <button
              onClick={() => onNavigate("gift-celebration")}
              className="text-xs font-bold text-[#B54E0E] hover:text-[#5A0F1B] flex items-center gap-1 group"
            >
              View All Gifts <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gifts.slice(0, 4).map((gift) => {
              const isAdded = addedGiftIds.includes(gift.id);
              return (
                <div
                  key={gift.id}
                  className="bg-white rounded-2xl border border-[#E8E1D5] hover:border-[#D4AF37] transition-all shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    <div
                      onClick={() => onNavigate("gift-celebration")}
                      className="relative h-48 overflow-hidden bg-stone-100 cursor-pointer"
                    >
                      <img
                        src={gift.mainImage}
                        alt={gift.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {gift.occasion && (
                        <span className="absolute top-2.5 right-2.5 bg-white/90 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-stone-200">
                          {gift.occasion}
                        </span>
                      )}
                    </div>

                    <div className="p-4 space-y-1.5">
                      <span className="text-[10px] font-semibold text-[#5A0F1B] uppercase tracking-wider bg-[#5A0F1B]/5 px-2 py-0.5 rounded-full">
                        {gift.giftCategoryName}
                      </span>
                      <h3
                        onClick={() => onNavigate("gift-celebration")}
                        className="font-cinzel text-xs font-bold text-stone-900 line-clamp-1 cursor-pointer group-hover:text-[#5A0F1B] transition-colors"
                      >
                        {gift.name}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-2">{gift.description}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 space-y-2">
                    <div className="flex items-baseline justify-between pt-2 border-t border-stone-100">
                      <span className="font-cinzel font-bold text-sm text-[#5A0F1B]">
                        Rs. {gift.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddGift(gift)}
                      disabled={isAdded}
                      className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-[#5A0F1B] text-white hover:bg-[#420A13]"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Added to Cart
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-[#D4AF37]" /> Add Gift
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
