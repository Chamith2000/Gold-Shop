import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Star } from "lucide-react";
import { Product } from "../../types";
import { api } from "../../services/api";
import { ProductCard } from "../products/ProductCard";

interface FeaturedProductsProps {
  onSelectProduct: (product: Product) => void;
  onViewAll: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  onSelectProduct,
  onViewAll,
}) => {
  const [activeTab, setActiveTab] = useState<"FEATURED" | "NEW_ARRIVALS" | "BEST_SELLERS">("FEATURED");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params: any = {};
        if (activeTab === "FEATURED") params.featured = true;
        if (activeTab === "NEW_ARRIVALS") params.newArrivals = true;
        if (activeTab === "BEST_SELLERS") params.bestSellers = true;

        const data = await api.products.getAll(params);
        setProducts(data.slice(0, 8));
      } catch {
        // fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab]);

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3E8] border border-[#D4AF37]/50 text-[#B54E0E] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Curated Masterpieces
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#5A0F1B] uppercase tracking-wide">
              Royal Sovereign Jewelry
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-sans">
              Hand-forged pure gold jewellery with official assay certification stamps
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-white p-1 rounded-xl border border-stone-200 shadow-2xs self-start md:self-auto">
            <button
              onClick={() => setActiveTab("FEATURED")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "FEATURED"
                  ? "bg-[#5A0F1B] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveTab("NEW_ARRIVALS")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "NEW_ARRIVALS"
                  ? "bg-[#5A0F1B] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab("BEST_SELLERS")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "BEST_SELLERS"
                  ? "bg-[#5A0F1B] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Best Sellers
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-stone-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-12">
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 bg-transparent hover:bg-[#FAF3E8] border-2 border-[#5A0F1B] text-[#5A0F1B] font-cinzel text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all group"
          >
            Browse All {products.length}+ Handcrafted Masterworks
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
