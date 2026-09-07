import React, { useState } from "react";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Gift,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { CartItem } from "../../types";

interface CartDrawerProps {
  onCheckout: (redeemedPoints: number) => void;
  onNavigateToShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onCheckout,
  onNavigateToShop,
}) => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    jewellerySubtotal,
    giftSubtotal,
    subtotal,
  } = useCart();

  const { rewardProfile, isAuthenticated } = useAuth();
  const [redeemPoints, setRedeemPoints] = useState<number>(0);

  const availablePoints = rewardProfile?.currentPoints || 0;
  const maxRedeemable = Math.min(availablePoints, Math.floor(subtotal * 0.3));
  const discountAmount = Math.min(redeemPoints, maxRedeemable);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const tierMultiplier =
    rewardProfile?.tier === "PLATINUM" ? 1.5 : rewardProfile?.tier === "GOLD" ? 1.25 : 1.0;
  const estimatedEarnedPoints = Math.floor((finalTotal / 100) * tierMultiplier);

  if (!isCartOpen) return null;

  const getItemId = (item: CartItem): string => {
    if (item.product?.id) return item.product.id;
    if (item.giftProduct?.id) return item.giftProduct.id;
    if (item.giftCombo?.id) return item.giftCombo.id;
    return "";
  };

  const getItemType = (item: CartItem): 'product' | 'gift' | 'combo' => {
    if (item.product?.id) return 'product';
    if (item.giftProduct?.id) return 'gift';
    return 'combo';
  };

  const getItemTitle = (item: CartItem): string => {
    return item.product?.name || item.giftProduct?.name || item.giftCombo?.name || "Item";
  };

  const getItemImage = (item: CartItem): string => {
    if (item.product) {
      return item.product.images?.[0] || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80";
    }
    if (item.giftProduct) {
      return item.giftProduct.mainImage || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80";
    }
    if (item.giftCombo) {
      return item.giftCombo.image || "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80";
    }
    return "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80";
  };

  const getItemPrice = (item: CartItem): number => {
    if (item.product) return item.product.price;
    if (item.giftProduct) return item.giftProduct.price;
    if (item.giftCombo) return item.giftCombo.comboPrice;
    return 0;
  };

  const getItemBadge = (item: CartItem): string => {
    if (item.product) return `${item.product.goldPurity || "22K"} (${item.product.weightGrams}g)`;
    if (item.giftProduct) return item.giftProduct.giftCategoryName || "Gift";
    if (item.giftCombo) return "Gift Combo Pack";
    return "";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-[#D4AF37]/40 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 bg-[#5A0F1B] text-white flex items-center justify-between border-b border-[#D4AF37]/30">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-cinzel text-lg font-bold uppercase tracking-wider text-[#FAF8F5]">
                Your Royal Cart ({cart.reduce((t, i) => t + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 mx-auto flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-cinzel text-base font-bold text-stone-800">
                    Your Cart is Currently Empty
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Explore our mastercrafted gold jewellery and luxury gifts.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigateToShop();
                  }}
                  className="inline-flex items-center gap-2 bg-[#5A0F1B] text-[#FAF8F5] px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#400A13] transition-colors"
                >
                  Explore Catalog <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {cart.map((item, idx) => {
                  const id = getItemId(item);
                  const itemType = getItemType(item);
                  const title = getItemTitle(item);
                  const image = getItemImage(item);
                  const unitPrice = getItemPrice(item);
                  const badge = getItemBadge(item);
                  const isGift = Boolean(item.giftProduct || item.giftCombo || item.isGift);

                  return (
                    <div
                      key={`item-${id}-${itemType}`}
                      className={`flex gap-4 p-3 rounded-xl border transition-all ${
                        isGift
                          ? "bg-amber-50/40 border-[#D4AF37]/40 shadow-xs"
                          : "bg-white border-stone-200 shadow-2xs hover:border-[#D4AF37]/50"
                      }`}
                    >
                      <img
                        src={image}
                        alt={title}
                        className="w-20 h-20 rounded-lg object-cover bg-stone-50 shrink-0 border border-stone-100"
                      />

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-cinzel text-xs font-bold text-stone-900 leading-snug line-clamp-2">
                              {title}
                            </h4>
                            <button
                              onClick={() => removeFromCart(id, itemType)}
                              className="text-stone-400 hover:text-rose-600 p-0.5 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            {isGift ? (
                              <span className="bg-[#5A0F1B]/10 text-[#5A0F1B] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#5A0F1B]/20 flex items-center gap-1">
                                <Gift className="w-3 h-3 text-[#D4AF37]" /> {badge}
                              </span>
                            ) : (
                              <span className="bg-[#FAF3E8] text-[#B54E0E] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#D4AF37]/30">
                                {badge}
                              </span>
                            )}
                          </div>

                          {item.giftMessage && (
                            <p className="mt-1 text-[10px] italic text-stone-500 line-clamp-1">
                              "{item.giftMessage}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                          <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden">
                            <button
                              onClick={() => updateQuantity(id, item.quantity - 1, itemType)}
                              className="px-2 py-1 text-stone-600 hover:bg-stone-200 text-xs"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-semibold text-stone-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(id, item.quantity + 1, itemType)}
                              className="px-2 py-1 text-stone-600 hover:bg-stone-200 text-xs"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-sans text-xs font-bold text-[#5A0F1B]">
                            Rs. {(unitPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Loyalty Point Redemption in Cart */}
                {isAuthenticated && availablePoints > 0 && (
                  <div className="bg-[#FAF3E8] border border-[#D4AF37]/50 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#5A0F1B] flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-[#D4AF37]" />
                        Redeem Loyalty Points
                      </span>
                      <span className="font-semibold text-stone-700">
                        Available: <strong className="text-[#B54E0E]">{availablePoints}</strong> Pts
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 font-sans">
                      Apply points for an instant cash discount (1 Pt = Rs. 1.00 off, up to 30% of total).
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="range"
                        min={0}
                        max={maxRedeemable}
                        step={50}
                        value={redeemPoints}
                        onChange={(e) => setRedeemPoints(Number(e.target.value))}
                        className="flex-1 accent-[#B54E0E] cursor-pointer"
                      />
                      <span className="text-xs font-bold text-[#B54E0E] min-w-15 text-right">
                        {redeemPoints} Pts
                      </span>
                    </div>

                    {redeemPoints > 0 && (
                      <div className="text-[11px] text-emerald-700 font-semibold flex items-center justify-between">
                        <span>Discount Applied:</span>
                        <span>- Rs. {discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-white border-t border-stone-200 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600 font-sans">
                {jewellerySubtotal > 0 && (
                  <div className="flex justify-between">
                    <span>Jewellery Subtotal:</span>
                    <span className="font-semibold text-stone-900">
                      Rs. {jewellerySubtotal.toLocaleString()}
                    </span>
                  </div>
                )}

                {giftSubtotal > 0 && (
                  <div className="flex justify-between">
                    <span>Gifts & Celebrations Subtotal:</span>
                    <span className="font-semibold text-stone-900">
                      Rs. {giftSubtotal.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-1 border-t border-stone-100">
                  <span className="font-semibold text-stone-700">Combined Subtotal:</span>
                  <span className="font-bold text-stone-900">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Reward Points Discount:</span>
                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-500">
                  <span>Insured Express Delivery:</span>
                  <span className="text-emerald-700 font-medium">Complimentary</span>
                </div>

                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Estimated Total:</span>
                  <span className="text-[#5A0F1B] font-cinzel">
                    Rs. {finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Points Earned Preview */}
              <div className="bg-[#FAF8F5] p-2 rounded-lg text-[11px] text-[#5A0F1B] flex items-center justify-between border border-[#D4AF37]/30">
                <span className="flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Points earned on this order:
                </span>
                <span className="font-bold text-[#B54E0E]">+{estimatedEarnedPoints} Pts</span>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout(discountAmount > 0 ? redeemPoints : 0);
                }}
                className="w-full bg-[#5A0F1B] hover:bg-[#400A13] text-white py-3 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group"
                id="cart-checkout-btn"
              >
                Proceed to Royal Checkout
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>100% Genuine Sri Lankan Assay Hallmark Guaranteed</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
