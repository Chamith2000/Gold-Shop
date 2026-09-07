import React, { useState, useEffect } from "react";
import {
  Filter,
  SlidersHorizontal,
  Search,
  ChevronDown,
  X,
  Sparkles,
  Grid,
  List,
} from "lucide-react";
import { Product, Category } from "../types";
import { api } from "../services/api";
import { useCategories } from "../hooks/useCategories";
import { ProductCard } from "../components/products/ProductCard";

interface ShopPageProps {
  initialCategory?: string;
  initialSearch?: string;
  onSelectProduct: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory,
  initialSearch,
  onSelectProduct,
}) => {
  const { categories } = useCategories();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [selectedPurity, setSelectedPurity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || "");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [priceRange, setPriceRange] = useState<number>(1000000);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (selectedCategory && selectedCategory !== "all") params.category = selectedCategory;
      if (selectedPurity && selectedPurity !== "all") params.purity = selectedPurity;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (sortBy) params.sort = sortBy;
      if (priceRange < 1000000) params.maxPrice = priceRange;

      const data = await api.products.getAll(params);
      setProducts(data);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedPurity, searchQuery, sortBy, priceRange]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedPurity("all");
    setSearchQuery("");
    setSortBy("featured");
    setPriceRange(1000000);
  };

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedPurity !== "all" ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0) +
    (priceRange < 1000000 ? 1 : 0);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb */}
        <div className="text-center sm:text-left mb-8 space-y-2">
          <div className="inline-flex items-center gap-1 text-xs text-stone-500 font-sans">
            <span>Home</span> <span>/</span> <span className="text-[#5A0F1B] font-semibold">Master Collections</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#5A0F1B] uppercase tracking-wide">
            Royal Jewellery Catalog
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-sans max-w-2xl">
            Certified 22K and 24K sovereign gold ornaments and ethically sourced Sri Lankan Ceylon gemstones.
          </p>
        </div>

        {/* Search, Filter Bar & Sorting */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-8 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, gem, weight..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs font-sans focus:outline-none focus:border-[#5A0F1B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="md:hidden inline-flex items-center gap-1.5 bg-[#FAF3E8] border border-[#D4AF37]/60 text-[#5A0F1B] px-4 py-2 rounded-xl text-xs font-bold font-cinzel"
            >
              <Filter className="w-3.5 h-3.5" />
              Filters ({activeFiltersCount})
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-sans hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#5A0F1B] cursor-pointer"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="weight-desc">Weight: Heaviest First</option>
              </select>
            </div>

            <span className="text-xs text-stone-400 font-mono hidden sm:inline">
              Showing <strong>{products.length}</strong> items
            </span>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block md:col-span-3 bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#5A0F1B] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Refine Selection
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-[11px] text-[#B54E0E] hover:underline font-semibold"
                >
                  Reset ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <h4 className="font-cinzel text-xs font-bold text-stone-900 uppercase">
                Category
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === "all"
                      ? "bg-[#5A0F1B] text-white font-bold"
                      : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat.slug
                        ? "bg-[#5A0F1B] text-white font-bold"
                        : "text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Purity Filter */}
            <div className="space-y-2 pt-4 border-t border-stone-100">
              <h4 className="font-cinzel text-xs font-bold text-stone-900 uppercase">
                Gold Purity (Assay)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "All Purity", value: "all" },
                  { label: "24K (99.9%)", value: "24K" },
                  { label: "22K (91.6%)", value: "22K" },
                  { label: "18K (75.0%)", value: "18K" },
                ].map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setSelectedPurity(p.value)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium text-center border transition-all ${
                      selectedPurity === p.value
                        ? "bg-[#FAF3E8] border-[#D4AF37] text-[#5A0F1B] font-bold"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-2 pt-4 border-t border-stone-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-cinzel font-bold text-stone-900 uppercase">Max Budget</span>
                <span className="font-mono font-bold text-[#5A0F1B]">
                  Rs. {priceRange.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={1000000}
                step={25000}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#B54E0E] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>Rs. 50K</span>
                <span>Rs. 1,000,000+</span>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="md:col-span-9">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 rounded-2xl bg-stone-200 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF3E8] border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#B54E0E]">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="font-cinzel text-lg font-bold text-stone-900">
                  No Jewellery Matches Your Filter
                </h3>
                <p className="text-xs text-stone-500 font-sans max-w-sm mx-auto">
                  Try adjusting your gold purity, category selection, or search keywords.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-[#5A0F1B] text-white px-6 py-2.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider hover:bg-[#400A13] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={onSelectProduct}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
