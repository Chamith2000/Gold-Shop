import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";

interface FeaturedCollectionsProps {
  onSelectCategory: (categorySlug: string) => void;
  onViewAll: () => void;
}

export const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({
  onSelectCategory,
  onViewAll,
}) => {
  const { categories, isLoading } = useCategories();

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3E8] border border-[#D4AF37]/50 text-[#B54E0E] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Royal Sri Lankan Heritage
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#5A0F1B] uppercase tracking-wide">
            Mastercrafted Collections
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
            Every piece is cast in certified 22K and 24K pure sovereign gold, set with hand-selected Ceylon gemstones, and stamped with our lifelong assay seal.
          </p>
        </div>

        {/* Collections Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-stone-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.slice(0, 6).map((category) => (
              <div
                key={category.id}
                onClick={() => onSelectCategory(category.slug)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border border-[#E8E1D5] hover:border-[#D4AF37] bg-white flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  <span className="absolute top-3 right-3 bg-[#5A0F1B]/90 text-[#F3E5AB] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs border border-[#D4AF37]/40">
                    22K &amp; 24K Gold
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-cinzel text-base sm:text-lg font-bold text-stone-900 group-hover:text-[#5A0F1B] transition-colors leading-snug">
                      {category.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-sans mt-1 line-clamp-2 leading-relaxed">
                      {category.description || "Authentic Sri Lankan handcrafted luxury jewelry."}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#B54E0E] uppercase tracking-wider inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explore Collection <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[11px] text-stone-400 font-sans">
                      Hallmarked
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 bg-[#5A0F1B] hover:bg-[#400A13] text-white font-cinzel text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all shadow-md group"
            id="view-all-collections-btn"
          >
            Explore Complete Boutique Catalog
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
