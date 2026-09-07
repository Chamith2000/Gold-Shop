import React from "react";
import { Heart, ShoppingBag, Star, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Product } from "../../types";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorite = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#E8E1D5] hover:border-[#D4AF37] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.images[0] || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          loading="lazy"
        />

        {/* Floating Purity Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="bg-[#5A0F1B]/95 backdrop-blur-xs text-[#F3E5AB] font-cinzel text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-[#D4AF37]/50">
            {product.goldPurity} Pure
          </span>
          {product.isBestSeller && (
            <span className="bg-[#B54E0E] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-emerald-800 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
              New Masterwork
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md z-10 cursor-pointer ${
            isFavorite
              ? "bg-[#5A0F1B] text-rose-300"
              : "bg-white/80 hover:bg-white text-stone-600 hover:text-[#5A0F1B]"
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        </motion.button>

        {/* Hover Quick View Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/90 backdrop-blur-xs text-stone-900 font-cinzel text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-sm">
            Inspect Masterwork
          </span>
        </div>
      </div>

      {/* Info & Purchase */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 font-sans">
            <span className="uppercase tracking-wider font-semibold text-[#B54E0E]">
              {product.categoryName}
            </span>
            <span>{product.weightGrams}g Sovereign</span>
          </div>

          <h3
            onClick={() => onSelect(product)}
            className="font-cinzel text-sm sm:text-base font-bold text-stone-900 hover:text-[#5A0F1B] transition-colors leading-snug line-clamp-2 mt-1 cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 5) ? "fill-current" : "opacity-30"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-stone-400 font-mono">
              ({product.reviewCount || 12})
            </span>
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <span className="font-cinzel text-sm sm:text-base font-bold text-[#5A0F1B] block">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-stone-400 line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => addToCart(product, 1)}
            className="bg-[#5A0F1B] hover:bg-[#400A13] text-white p-2.5 rounded-xl transition-colors shadow-xs flex items-center justify-center group/btn cursor-pointer"
            title="Add to Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
