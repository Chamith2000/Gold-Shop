import React from "react";
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Product } from "../types";

interface WishlistPageProps {
  onSelectProduct: (product: Product) => void;
  onNavigateToShop: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onSelectProduct,
  onNavigateToShop,
}) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5A0F1B] text-[#F3E5AB] text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            Curated Favorites
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#5A0F1B] uppercase tracking-wide">
            My Royal Wishlist ({wishlist.length})
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-sans">
            Saved 22K/24K sovereigns and precious Ceylon gem pieces for your bespoke collection.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#FAF3E8] border border-[#D4AF37]/50 flex items-center justify-center mx-auto text-[#5A0F1B]">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-stone-900">
              Your Wishlist is Empty
            </h3>
            <p className="text-xs text-stone-500 font-sans">
              Tap the heart icon on any jewellery piece in our boutique to save it for later consultation or gifting.
            </p>
            <button
              onClick={onNavigateToShop}
              className="bg-[#5A0F1B] text-white px-6 py-3 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider hover:bg-[#400A13] transition-colors"
            >
              Explore Boutique Collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div
                  className="relative aspect-square overflow-hidden cursor-pointer bg-stone-50"
                  onClick={() => onSelectProduct(item)}
                >
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-[#5A0F1B] text-[#F3E5AB] font-cinzel text-[10px] font-bold px-2 py-0.5 rounded">
                    {item.goldPurity}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-rose-600 hover:bg-rose-50 shadow"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-[#B54E0E] font-bold uppercase tracking-wider block">
                      {item.categoryName} &bull; {item.weightGrams}g
                    </span>
                    <h4
                      onClick={() => onSelectProduct(item)}
                      className="font-cinzel text-sm font-bold text-stone-900 line-clamp-2 mt-1 cursor-pointer hover:text-[#5A0F1B]"
                    >
                      {item.name}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="font-cinzel text-sm font-bold text-[#5A0F1B]">
                      Rs. {item.price.toLocaleString()}
                    </span>

                    <button
                      onClick={() => {
                        addToCart(item, 1);
                      }}
                      className="bg-[#5A0F1B] hover:bg-[#400A13] text-white p-2 rounded-xl text-xs flex items-center gap-1 font-bold"
                      title="Add to Shopping Cart"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
