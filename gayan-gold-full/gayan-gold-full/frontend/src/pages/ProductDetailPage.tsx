import React, { useState, useEffect } from "react";
import {
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowLeft,
  Truck,
  RotateCcw,
  CheckCircle2,
  Share2,
  Coins,
} from "lucide-react";
import { Product, Review } from "../types";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { ProductCard } from "../components/products/ProductCard";

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onBack,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Review Form state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState<string>("");
  const [reviewComment, setReviewComment] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const data = await api.products.getById(productId);
        setProduct(data);
        setSelectedImage(data.images[0] || "");
        setReviews(data.reviews || []);
      } catch (e) {
        console.error("Failed to load product detail", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const newRev = await api.products.addReview(product.id, {
        rating,
        title: reviewTitle.trim() || "Exquisite Masterwork",
        comment: reviewComment.trim(),
      });
      setReviews((prev) => [newRev, ...prev]);
      setReviewComment("");
      setReviewTitle("");
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (e) {
      console.error("Failed to submit review", e);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-20 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#5A0F1B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-cinzel text-xs font-bold text-[#5A0F1B]">Loading Masterpiece Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-20 text-center space-y-4">
        <h2 className="font-cinzel text-xl font-bold text-[#5A0F1B]">Jewellery Piece Not Found</h2>
        <button
          onClick={onBack}
          className="bg-[#5A0F1B] text-white px-6 py-2 rounded-xl text-xs font-bold uppercase"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const sovereignsEquivalent = (product.weightGrams / 8.0).toFixed(2);
  const earnedLoyaltyPoints = Math.floor(product.price / 100);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button & Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold font-cinzel text-stone-700 hover:text-[#5A0F1B] uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Collections
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#5A0F1B] font-sans transition-colors"
          >
            <Share2 className="w-4 h-4" /> {isCopied ? "Link Copied!" : "Share Piece"}
          </button>
        </div>

        {/* Main Product Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm">
          {/* Left: Images Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Large Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-50 border border-stone-200 shadow-xs">
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-[#5A0F1B] text-[#F3E5AB] font-cinzel text-xs font-bold px-3 py-1 rounded shadow-md border border-[#D4AF37]/50">
                  {product.goldPurity} Pure
                </span>
                <span className="bg-white/90 text-stone-800 text-[11px] font-bold px-2.5 py-0.5 rounded shadow-sm">
                  {product.weightGrams}g ({sovereignsEquivalent} Sov)
                </span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === img
                        ? "border-[#5A0F1B] shadow-md scale-105"
                        : "border-stone-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 font-sans mb-1">
                <span className="text-[#B54E0E] font-bold uppercase tracking-wider">
                  {product.categoryName}
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star className="w-4 h-4 fill-current" />
                  {product.rating || 5.0} ({reviews.length || 8} reviews)
                </span>
              </div>

              <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                {product.name}
              </h1>

              {/* Price & Gold Breakdown */}
              <div className="mt-4 p-4 bg-[#FAF3E8] rounded-2xl border border-[#D4AF37]/50 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">
                    All-Inclusive Boutique Price
                  </span>
                  <span className="font-cinzel text-2xl sm:text-3xl font-bold text-[#5A0F1B]">
                    Rs. {product.price.toLocaleString()}
                  </span>
                </div>

                <div className="text-right text-[11px] text-stone-600 font-sans">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    +{earnedLoyaltyPoints} Royal Points
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
              {product.description}
            </p>

            {/* Specifications Matrix */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-stone-200 text-xs text-stone-700 font-sans">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Gold Purity</span>
                <strong className="text-stone-900 font-cinzel">{product.goldPurity} Certified Gold</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Net Gold Weight</span>
                <strong className="text-stone-900">{product.weightGrams}g ({sovereignsEquivalent} Poun)</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Assay Hallmark</span>
                <strong className="text-stone-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Stamped
                </strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Availability</span>
                <strong className={product.inStock ? "text-emerald-700" : "text-rose-700"}>
                  {product.inStock ? `In Stock (${product.stockCount} available)` : "Made to Order"}
                </strong>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden h-12">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 text-stone-600 hover:bg-stone-200 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 text-stone-600 hover:bg-stone-200 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 bg-[#5A0F1B] hover:bg-[#400A13] text-white h-12 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  Add to Royal Cart
                </button>

                {/* Wishlist Toggle */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-all ${
                    isFavorite
                      ? "bg-rose-50 border-rose-300 text-rose-600"
                      : "bg-stone-50 border-stone-300 text-stone-600 hover:text-[#5A0F1B]"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Assurance Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-4 text-center text-[10px] text-stone-500 font-sans">
                <div className="p-2 bg-stone-50 rounded-lg">
                  <ShieldCheck className="w-4 h-4 mx-auto text-[#D4AF37] mb-1" />
                  <span>Assay Certified</span>
                </div>
                <div className="p-2 bg-stone-50 rounded-lg">
                  <Truck className="w-4 h-4 mx-auto text-[#D4AF37] mb-1" />
                  <span>Insured Express</span>
                </div>
                <div className="p-2 bg-stone-50 rounded-lg">
                  <RotateCcw className="w-4 h-4 mx-auto text-[#D4AF37] mb-1" />
                  <span>Lifetime Buyback</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-12 bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
            <div>
              <h3 className="font-cinzel text-xl font-bold text-[#5A0F1B]">
                Patron Testimonials &amp; Reviews
              </h3>
              <p className="text-xs text-stone-500 font-sans">
                Verified feedback from collectors and bridal couples
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-bold text-stone-900 text-sm">5.0 / 5.0</span>
            </div>
          </div>

          {/* Add Review Form */}
          <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-[#D4AF37]/30">
            <h4 className="font-cinzel text-sm font-bold text-stone-900 mb-3">
              Write a Review for this Piece
            </h4>
            {reviewSuccess && (
              <div className="mb-3 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Thank you! Your verified review has been published.
              </div>
            )}
            <form onSubmit={handleAddReview} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-600 font-sans">Rating:</span>
                <div className="flex text-amber-500 gap-1 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setRating(s)}
                      className="p-0.5 focus:outline-none"
                    >
                      <Star className={`w-5 h-5 ${s <= rating ? "fill-current" : "text-stone-300"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Review Headline (e.g., Unmatched Craftsmanship)"
                className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs font-sans focus:outline-none focus:border-[#5A0F1B]"
              />

              <textarea
                required
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience regarding the gold purity, finish, and bespoke fitting..."
                className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs font-sans focus:outline-none focus:border-[#5A0F1B]"
              />

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="bg-[#5A0F1B] hover:bg-[#400A13] text-white px-6 py-2.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {isSubmittingReview ? "Submitting..." : "Publish Review"}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl border border-stone-100 bg-stone-50/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900">{rev.userName}</span>
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <h5 className="font-cinzel text-xs font-bold text-[#5A0F1B]">{rev.title}</h5>
                <p className="text-xs text-stone-600 font-sans">{rev.comment}</p>
                <span className="text-[10px] text-stone-400 block pt-1">
                  Verified Acquisition &bull; {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products Recommendations */}
        {product.related && product.related.length > 0 && (
          <div className="mt-16 space-y-6">
            <h3 className="font-cinzel text-xl font-bold text-[#5A0F1B]">
              You May Also Admire
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.related.slice(0, 4).map((rel) => (
                <ProductCard key={rel.id} product={rel} onSelect={onSelectProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
