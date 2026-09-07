import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Gift,
  Sparkles,
  ShoppingBag,
  Heart,
  Search,
  Filter,
  Check,
  Plus,
  Star,
  Clock,
  ShieldCheck,
  X,
  ChevronRight,
  Tag,
  Truck,
  MessageSquare,
} from "lucide-react";
import { GiftCategory, GiftProduct, GiftComboPack } from "../types";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";

export const GiftCelebrationPage: React.FC = () => {
  const { addGiftToCart, addComboToCart, setIsCartOpen } = useCart();

  const [categories, setCategories] = useState<GiftCategory[]>([]);
  const [combos, setCombos] = useState<GiftComboPack[]>([]);
  const [products, setProducts] = useState<GiftProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  // Modal / Selected Gift state
  const [selectedGift, setSelectedGift] = useState<GiftProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [customGiftMessage, setCustomGiftMessage] = useState("");
  const [addedComboIds, setAddedComboIds] = useState<string[]>([]);
  const [addedProductIds, setAddedProductIds] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      api.gifts.getCategories(),
      api.gifts.getCombos(),
      api.gifts.getProducts(),
    ])
      .then(([catsRes, combosRes, prodsRes]) => {
        if (isMounted) {
          setCategories(catsRes || []);
          setCombos(combosRes || []);
          setProducts(prodsRes || []);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch gifts data", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectGift = (gift: GiftProduct) => {
    setSelectedGift(gift);
    setSelectedImage(gift.mainImage || (gift.images && gift.images[0]) || "");
    setCustomGiftMessage("");
  };

  const handleAddCombo = (combo: GiftComboPack) => {
    addComboToCart(combo, 1);
    setAddedComboIds((prev) => [...prev, combo.id]);
  };

  const handleAddGiftProduct = (gift: GiftProduct, message?: string) => {
    addGiftToCart(gift, 1, message || customGiftMessage);
    setAddedProductIds((prev) => [...prev, gift.id]);
  };

  const handleBuyNowGift = (gift: GiftProduct) => {
    addGiftToCart(gift, 1, customGiftMessage);
    setSelectedGift(null);
    setIsCartOpen(true);
  };

  const filteredProducts = products
    .filter((p) => {
      if (selectedCategory !== "all" && p.giftCategoryId !== selectedCategory) {
        return false;
      }
      if (selectedOccasion !== "all" && p.occasion?.toLowerCase() !== selectedOccasion.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.occasion || "").toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });

  const occasions = ["All", "Birthday", "Wedding", "Couple", "Anniversary"];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16">
      {/* 1. LUXURY HERO BANNER */}
      <section className="relative bg-gradient-to-b from-[#420A13] via-[#5A0F1B] to-[#420A13] text-white py-16 sm:py-24 px-4 overflow-hidden border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 opacity-10 bg-[radial-[#D4AF37]_1px,transparent_1px] [background-size:16px_16px]" />

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-semibold uppercase tracking-widest"
          >
            <Gift className="w-4 h-4 text-[#D4AF37]" />
            Gift &amp; Celebration Pack
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF8F5]"
          >
            Make Every Celebration <span className="italic text-[#D4AF37]">More Special</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-sm sm:text-base text-stone-200 font-sans leading-relaxed"
          >
            Beautiful gifts for birthdays, weddings, anniversaries, couples and every special moment.
            Enhance your luxury gold &amp; jewellery gifts with handcrafted flowers, chocolates, cakes, and personalized cards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#explore-gifts"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B54E0E] text-white font-cinzel font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              Explore Gifts <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* 2. GIFT CATEGORIES GRID */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#B54E0E] uppercase tracking-widest">
              Curated Collections
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#5A0F1B]">
              Browse Gift Categories
            </h2>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -4 }}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const el = document.getElementById("explore-gifts");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={`group cursor-pointer rounded-2xl overflow-hidden bg-white border transition-all shadow-sm hover:shadow-md ${
                  selectedCategory === cat.id
                    ? "border-[#5A0F1B] ring-2 ring-[#5A0F1B]/20"
                    : "border-[#E8E1D5] hover:border-[#D4AF37]"
                }`}
              >
                <div className="relative h-36 sm:h-44 overflow-hidden bg-stone-100">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {cat.productCount !== undefined && (
                    <span className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">
                      {cat.productCount} Items
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-cinzel text-sm sm:text-base font-bold leading-tight group-hover:text-[#F3E5AB] transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                <div className="p-3 bg-white flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 line-clamp-1">
                    {cat.description || "Luxury celebration gifts"}
                  </span>
                  <span className="text-xs font-bold text-[#5A0F1B] group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. FEATURED GIFT COMBO PACKS */}
        {combos.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/30 shadow-md space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E8E1D5] pb-5">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#5A0F1B] uppercase tracking-widest bg-[#5A0F1B]/10 px-3 py-1 rounded-full mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Best Value Bundles
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#5A0F1B]">
                  Featured Gift Combo Packs
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Save big on handpicked luxury celebration hampers with flowers, cakes, chocolates, &amp; greeting cards.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {combos.map((combo) => {
                const isAdded = addedComboIds.includes(combo.id);
                return (
                  <div
                    key={combo.id}
                    className="bg-[#FAF8F5] rounded-2xl border border-[#E8E1D5] hover:border-[#D4AF37] transition-all overflow-hidden flex flex-col justify-between shadow-xs group"
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden bg-stone-200">
                        <img
                          src={combo.image}
                          alt={combo.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 bg-[#5A0F1B] text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md">
                          SAVE RS. {combo.youSave.toLocaleString()}
                        </div>
                        {combo.occasion && (
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-stone-200">
                            {combo.occasion}
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-3">
                        <h3 className="font-cinzel text-lg font-bold text-stone-900 leading-snug group-hover:text-[#5A0F1B] transition-colors">
                          {combo.name}
                        </h3>

                        <p className="text-xs text-stone-600 line-clamp-2">
                          {combo.description}
                        </p>

                        <div className="pt-2 border-t border-stone-200/80">
                          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                            Included in this pack:
                          </span>
                          <ul className="space-y-1">
                            {combo.items.map((item, idx) => (
                              <li key={idx} className="text-xs text-stone-700 flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="line-clamp-1">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 space-y-3">
                      <div className="flex items-baseline justify-between pt-3 border-t border-stone-200">
                        <div>
                          <span className="text-[11px] text-stone-400 line-through block">
                            Valued at Rs. {combo.individualValue.toLocaleString()}
                          </span>
                          <span className="font-cinzel font-extrabold text-xl text-[#5A0F1B]">
                            Rs. {combo.comboPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddCombo(combo)}
                        disabled={isAdded}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                          isAdded
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-[#5A0F1B] hover:bg-[#420A13] text-white shadow-md"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" /> Combo Added to Cart
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 text-[#D4AF37]" /> Add Combo Pack
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

        {/* 4. GIFT PRODUCTS CATALOG */}
        <section id="explore-gifts" className="space-y-6 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E1D5] pb-4">
            <div>
              <h2 className="font-cinzel text-2xl font-bold text-[#5A0F1B]">
                All Gift Products
              </h2>
              <p className="text-xs text-stone-500">
                Showing {filteredProducts.length} curated luxury items
              </p>
            </div>

            {/* Occasion Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <span className="text-xs font-bold text-stone-400 mr-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Occasion:
              </span>
              {occasions.map((occ) => (
                <button
                  key={occ}
                  onClick={() => setSelectedOccasion(occ === "All" ? "all" : occ.toLowerCase())}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    (occ === "All" && selectedOccasion === "all") ||
                    selectedOccasion === occ.toLowerCase()
                      ? "bg-[#5A0F1B] text-white"
                      : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Sub-category Filter Toolbar */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8E1D5] shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search gifts by name, occasion, chocolates, flowers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#5A0F1B]"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 border-2 border-[#5A0F1B] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="mt-3 text-xs text-stone-500 font-cinzel">Loading luxury gifts...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
              <Gift className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-cinzel text-lg font-bold text-stone-800">No Gift Items Found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try selecting a different category or clear search filters to view more gifts.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedOccasion("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-[#5A0F1B] text-white text-xs font-bold rounded-lg"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((gift) => {
                const isAdded = addedProductIds.includes(gift.id);
                return (
                  <div
                    key={gift.id}
                    className="bg-white rounded-2xl border border-[#E8E1D5] hover:border-[#D4AF37] transition-all shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      <div
                        onClick={() => handleSelectGift(gift)}
                        className="relative h-56 overflow-hidden bg-stone-100 cursor-pointer"
                      >
                        <img
                          src={gift.mainImage}
                          alt={gift.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {gift.discountPercent && gift.discountPercent > 0 ? (
                          <span className="absolute top-2.5 left-2.5 bg-[#5A0F1B] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                            {gift.discountPercent}% OFF
                          </span>
                        ) : null}

                        {gift.occasion && (
                          <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-stone-200">
                            {gift.occasion}
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <span className="text-[10px] font-semibold text-[#5A0F1B] uppercase tracking-wider bg-[#5A0F1B]/5 px-2 py-0.5 rounded-full">
                          {gift.giftCategoryName}
                        </span>

                        <h3
                          onClick={() => handleSelectGift(gift)}
                          className="font-cinzel text-sm font-bold text-stone-900 line-clamp-2 leading-snug cursor-pointer group-hover:text-[#5A0F1B] transition-colors"
                        >
                          {gift.name}
                        </h3>

                        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                          {gift.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 space-y-3">
                      <div className="flex items-baseline justify-between pt-2 border-t border-stone-100">
                        <div>
                          <span className="font-cinzel font-bold text-base text-[#5A0F1B]">
                            Rs. {gift.price.toLocaleString()}
                          </span>
                          {gift.originalPrice && gift.originalPrice > gift.price && (
                            <span className="text-[11px] text-stone-400 line-through ml-2">
                              Rs. {gift.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleSelectGift(gift)}
                          className="py-2 px-3 rounded-lg border border-stone-200 hover:border-[#5A0F1B] text-stone-700 hover:text-[#5A0F1B] text-xs font-semibold transition-colors text-center"
                        >
                          Details
                        </button>

                        <button
                          onClick={() => handleAddGiftProduct(gift)}
                          disabled={isAdded}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                            isAdded
                              ? "bg-emerald-600 text-white"
                              : "bg-[#5A0F1B] text-white hover:bg-[#420A13]"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Added
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" /> Add Gift
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* 5. GIFT PRODUCT DETAIL MODAL */}
      <AnimatePresence>
        {selectedGift && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#D4AF37]/40 overflow-hidden my-8"
            >
              <button
                onClick={() => setSelectedGift(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 shadow-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: Gallery */}
                <div className="p-6 bg-white space-y-4">
                  <div className="h-72 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                    <img
                      src={selectedImage}
                      alt={selectedGift.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {selectedGift.images && selectedGift.images.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {selectedGift.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(img)}
                          className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === img ? "border-[#5A0F1B]" : "border-stone-200"
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Info & Personalization */}
                <div className="p-6 md:p-8 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#5A0F1B] uppercase tracking-wider bg-[#5A0F1B]/10 px-2.5 py-0.5 rounded-full">
                        {selectedGift.giftCategoryName}
                      </span>
                      {selectedGift.occasion && (
                        <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full">
                          Perfect For: {selectedGift.occasion}
                        </span>
                      )}
                    </div>

                    <h2 className="font-cinzel text-xl font-bold text-stone-900 leading-snug">
                      {selectedGift.name}
                    </h2>

                    <div className="flex items-baseline gap-3">
                      <span className="font-cinzel font-bold text-2xl text-[#5A0F1B]">
                        Rs. {selectedGift.price.toLocaleString()}
                      </span>
                      {selectedGift.originalPrice && selectedGift.originalPrice > selectedGift.price && (
                        <span className="text-sm text-stone-400 line-through">
                          Rs. {selectedGift.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {selectedGift.fullDescription || selectedGift.description}
                    </p>

                    {/* Custom Gift Message Input */}
                    <div className="pt-3 border-t border-stone-200 space-y-1.5">
                      <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#5A0F1B]" />
                        Personalized Gift Card Message (Optional):
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Write your custom message to be printed inside the greeting card..."
                        value={customGiftMessage}
                        onChange={(e) => setCustomGiftMessage(e.target.value)}
                        className="w-full p-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-[#5A0F1B]"
                      />
                    </div>

                    {selectedGift.deliveryInfo && (
                      <div className="flex items-center gap-2 text-[11px] text-stone-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200">
                        <Truck className="w-4 h-4 text-[#B54E0E] shrink-0" />
                        <span>{selectedGift.deliveryInfo}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-4 border-t border-stone-200">
                    <button
                      onClick={() => handleBuyNowGift(selectedGift)}
                      className="w-full bg-[#5A0F1B] hover:bg-[#420A13] text-white py-3 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#D4AF37]" /> Buy Now / Checkout
                    </button>
                    <button
                      onClick={() => {
                        handleAddGiftProduct(selectedGift, customGiftMessage);
                        setSelectedGift(null);
                      }}
                      className="w-full bg-white hover:bg-stone-50 border border-[#5A0F1B] text-[#5A0F1B] py-2.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Add Gift to Cart
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
