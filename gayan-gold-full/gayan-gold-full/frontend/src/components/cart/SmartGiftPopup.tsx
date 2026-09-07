import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Gift, Sparkles, Plus, Check, ShoppingBag, ArrowRight } from "lucide-react";
import { Product, GiftProduct } from "../../types";
import { useCart } from "../../context/CartContext";
import { api } from "../../services/api";

interface SmartGiftPopupProps {
  onNavigateToGifts?: () => void;
}

export const SmartGiftPopup: React.FC<SmartGiftPopupProps> = ({ onNavigateToGifts }) => {
  const { smartGiftItem, setSmartGiftItem, addGiftToCart, setIsCartOpen } = useCart();
  const [recommendedGifts, setRecommendedGifts] = useState<GiftProduct[]>([]);
  const [addedGiftIds, setAddedGiftIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!smartGiftItem) return;

    let isMounted = true;
    setLoading(true);

    api.gifts
      .getRecommendations(smartGiftItem.id)
      .then((res) => {
        if (isMounted) {
          setRecommendedGifts(res.recommendedGifts || []);
        }
      })
      .catch((err) => {
        console.error("Failed to load smart gift recommendations", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [smartGiftItem]);

  if (!smartGiftItem) return null;

  const handleAddGift = (gift: GiftProduct) => {
    addGiftToCart(gift, 1);
    setAddedGiftIds((prev) => [...prev, gift.id]);
  };

  const handleClose = () => {
    setSmartGiftItem(null);
    setAddedGiftIds([]);
  };

  const handleContinueToCart = () => {
    setSmartGiftItem(null);
    setAddedGiftIds([]);
    setIsCartOpen(true);
  };

  const handleContinueWithoutGift = () => {
    setSmartGiftItem(null);
    setAddedGiftIds([]);
    setIsCartOpen(true);
  };

  const handleExploreAllGifts = () => {
    setSmartGiftItem(null);
    setAddedGiftIds([]);
    if (onNavigateToGifts) {
      onNavigateToGifts();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#D4AF37]/30 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Top Decorative Gold Accent Line */}
          <div className="h-1.5 bg-linear-to-r from-[#5A0F1B] via-[#D4AF37] to-[#5A0F1B]" />

          {/* Header */}
          <div className="px-6 pt-5 pb-4 bg-white border-b border-[#E8E1D5] flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5A0F1B]/10 border border-[#5A0F1B]/20 flex items-center justify-center text-[#5A0F1B]">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel font-bold text-xl text-[#5A0F1B] flex items-center gap-2">
                  Make Your Purchase More Special 🎁
                </h3>
                <p className="text-xs text-stone-600">
                  Complete your special moment with a beautiful gift for <span className="font-semibold text-stone-800">{smartGiftItem.name}</span>.
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body / Recommended Gifts List */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {loading ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 mx-auto border-2 border-[#5A0F1B] border-t-transparent rounded-full animate-spin" />
                <p className="mt-3 text-xs text-stone-500 font-cinzel">Curating perfect gift matches...</p>
              </div>
            ) : recommendedGifts.length === 0 ? (
              <div className="py-8 text-center text-stone-500">
                <Sparkles className="w-8 h-8 mx-auto text-[#D4AF37] mb-2 opacity-70" />
                <p className="text-sm">Explore our curated luxury celebration packs to make this moment unforgettable.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendedGifts.map((gift) => {
                  const isAdded = addedGiftIds.includes(gift.id);
                  return (
                    <div
                      key={gift.id}
                      className="bg-white rounded-xl p-3 border border-[#E8E1D5] hover:border-[#D4AF37] transition-all shadow-sm flex flex-col justify-between group"
                    >
                      <div className="flex gap-3">
                        <img
                          src={gift.mainImage}
                          alt={gift.name}
                          className="w-20 h-20 object-cover rounded-lg border border-stone-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="inline-block text-[10px] font-semibold text-[#5A0F1B] uppercase tracking-wider bg-[#5A0F1B]/5 px-2 py-0.5 rounded-full mb-1">
                            {gift.giftCategoryName}
                          </span>
                          <h4 className="font-medium text-xs text-stone-900 line-clamp-2 leading-snug group-hover:text-[#5A0F1B] transition-colors">
                            {gift.name}
                          </h4>
                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="font-cinzel font-bold text-sm text-[#5A0F1B]">
                              Rs. {gift.price.toLocaleString()}
                            </span>
                            {gift.originalPrice && gift.originalPrice > gift.price && (
                              <span className="text-[11px] text-stone-400 line-through">
                                Rs. {gift.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddGift(gift)}
                        disabled={isAdded}
                        className={`mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
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
                            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" /> Add Gift +
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-white border-t border-[#E8E1D5] flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleExploreAllGifts}
              className="text-xs font-semibold text-[#5A0F1B] hover:underline flex items-center gap-1"
            >
              View All Gifts <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleContinueWithoutGift}
                className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                Continue Without Gift
              </button>
              <button
                onClick={handleContinueToCart}
                className="px-5 py-2 rounded-xl bg-linear-to-r from-[#5A0F1B] to-[#721524] hover:from-[#420A13] hover:to-[#5A0F1B] text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" /> Add Gift & Continue
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
