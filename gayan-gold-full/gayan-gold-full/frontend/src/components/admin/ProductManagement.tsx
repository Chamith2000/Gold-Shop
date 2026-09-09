import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Package,
  Layers,
  Sparkles,
  DollarSign,
  Tag,
  Scale,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Star,
  ShieldCheck,
  Gem,
  ExternalLink,
  Check,
  Flame,
  ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, Category, GoldPurity } from "../../types";
import { api } from "../../services/api";

interface ProductManagementProps {
  onNavigateToShop?: () => void;
}

// Preset luxury jewellery gallery images for quick selection or preview
const PRESET_JEWELRY_IMAGES = [
  {
    title: "22K Traditional Sovereign Necklace",
    category: "Necklaces",
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Ceylon Blue Sapphire Solitaire Ring",
    category: "Rings",
    url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Kandyan Royal Filigree Gold Bangle",
    category: "Bangles",
    url: "https://images.unsplash.com/photo-1611591475836-848074903333?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "22K Floral Jhumka Gold Earrings",
    category: "Earrings",
    url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "24K Sovereign Bullion Coin (8.000g)",
    category: "Coins",
    url: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Padparadscha Sapphire Royal Pendant",
    category: "Gemstones",
    url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Diamond Halo Engagement Ring",
    category: "Rings",
    url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Handcrafted 22K Broad Choker",
    category: "Necklaces",
    url: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
  },
];

interface ProductFormData {
  id?: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number | string;
  originalPrice?: number | string;
  goldPurity: GoldPurity;
  weightGrams: number | string;
  stockCount: number | string;
  inStock: boolean;
  description: string;
  images: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  specifications: {
    gemstoneType?: string;
    gemstoneCarat?: string;
    hallmark?: string;
    certification?: string;
    dimensions?: string;
    claspType?: string;
    origin?: string;
    [key: string]: string | undefined;
  };
}

const DEFAULT_FORM: ProductFormData = {
  name: "",
  categoryId: "cat-necklaces",
  categoryName: "Necklaces & Chains",
  price: "",
  originalPrice: "",
  goldPurity: "22K",
  weightGrams: 8.0,
  stockCount: 5,
  inStock: true,
  description: "",
  images: [],
  isFeatured: false,
  isNewArrival: true,
  isBestSeller: false,
  specifications: {
    hallmark: "Sri Lanka Gem & Jewellery Authority Hallmarked (916 / 22K)",
    certification: "Official Sovereign Certificate of Authenticity Included",
    origin: "Colombo Royal Artisans Studio",
    gemstoneType: "None",
    claspType: "Traditional S-Hook / Box Lock",
  },
};

export const ProductManagement: React.FC<ProductManagementProps> = ({ onNavigateToShop }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");
  const [selectedPurityFilter, setSelectedPurityFilter] = useState("ALL");
  const [selectedStockFilter, setSelectedStockFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "stock-asc" | "name">("newest");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"CREATE" | "EDIT">("CREATE");
  const [formData, setFormData] = useState<ProductFormData>(DEFAULT_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Image Management inside Form Modal
  const [imageInputMethod, setImageInputMethod] = useState<"UPLOAD" | "URL" | "PRESET">("UPLOAD");
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [imageUrlValidationStatus, setImageUrlValidationStatus] = useState<"idle" | "validating" | "valid" | "invalid">("idle");
  const [imageValidationMessage, setImageValidationMessage] = useState("");
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete Confirmation Modal
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Quick Inline Stock Edit State
  const [inlineStockEditingId, setInlineStockEditingId] = useState<string | null>(null);
  const [inlineStockValue, setInlineStockValue] = useState<number>(0);

  // Load Products and Categories
  const fetchProductsAndCategories = async () => {
    setIsLoading(true);
    try {
      const [prodsData, catsData] = await Promise.all([
        api.products.getAll(),
        api.categories.getAll(),
      ]);
      setProducts(prodsData);
      setCategories(catsData);
    } catch (err: any) {
      console.error("Failed to load product catalog:", err);
      setFeedback({ type: "error", message: err.message || "Failed to load product catalog" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  // Clear feedback after 5s
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setModalMode("CREATE");
    setFormData({
      ...DEFAULT_FORM,
      categoryId: categories[0]?.id || "cat-necklaces",
      categoryName: categories[0]?.name || "Necklaces & Chains",
      images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"],
    });
    setFormErrors({});
    setImageInputMethod("UPLOAD");
    setCustomImageUrl("");
    setUploadedFilePreview(null);
    setImageUrlValidationStatus("idle");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (product: Product) => {
    setModalMode("EDIT");
    setFormData({
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      price: product.price,
      originalPrice: product.originalPrice || "",
      goldPurity: product.goldPurity,
      weightGrams: product.weightGrams,
      stockCount: product.stockCount !== undefined ? product.stockCount : 5,
      inStock: product.inStock,
      description: product.description || "",
      images: product.images && product.images.length > 0 ? [...product.images] : [],
      isFeatured: !!product.isFeatured,
      isNewArrival: !!product.isNewArrival,
      isBestSeller: !!product.isBestSeller,
      specifications: {
        hallmark: product.specifications?.hallmark || "Sri Lanka Gem & Jewellery Authority Hallmarked (916 / 22K)",
        certification: product.specifications?.certification || "Official Sovereign Certificate of Authenticity Included",
        origin: product.specifications?.origin || "Colombo Royal Artisans Studio",
        gemstoneType: product.specifications?.gemstoneType || "None",
        gemstoneCarat: product.specifications?.gemstoneCarat || "",
        dimensions: product.specifications?.dimensions || "",
        claspType: product.specifications?.claspType || "Traditional S-Hook / Box Lock",
      },
    });
    setFormErrors({});
    setImageInputMethod("UPLOAD");
    setCustomImageUrl("");
    setUploadedFilePreview(null);
    setImageUrlValidationStatus("idle");
    setIsModalOpen(true);
  };

  // Validate and add image URL
  const validateAndAddImageUrl = () => {
    const url = customImageUrl.trim();
    if (!url) {
      setImageUrlValidationStatus("invalid");
      setImageValidationMessage("Please enter a valid image URL");
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("data:image/")) {
      setImageUrlValidationStatus("invalid");
      setImageValidationMessage("URL must begin with https://, http://, or data:image/");
      return;
    }

    setImageUrlValidationStatus("validating");
    setImageValidationMessage("Verifying image connectivity...");

    // Test load image in memory
    const testImg = new Image();
    testImg.onload = () => {
      setImageUrlValidationStatus("valid");
      setImageValidationMessage("Image successfully verified!");
      // Add to images list
      setFormData((prev) => ({
        ...prev,
        images: prev.images.includes(url) ? prev.images : [...prev.images, url],
      }));
      setCustomImageUrl("");
      setTimeout(() => setImageUrlValidationStatus("idle"), 2500);
    };
    testImg.onerror = () => {
      // Allow user to add anyway with warning if it might be an external CORS protected image
      setImageUrlValidationStatus("valid");
      setImageValidationMessage("Added image URL (External host preview)");
      setFormData((prev) => ({
        ...prev,
        images: prev.images.includes(url) ? prev.images : [...prev.images, url],
      }));
      setCustomImageUrl("");
      setTimeout(() => setImageUrlValidationStatus("idle"), 2500);
    };
    testImg.src = url;
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!validTypes.includes(file.type)) {
      setFeedback({ type: "error", message: "Invalid file format. Please upload JPG, PNG, WebP, GIF, or AVIF." });
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFeedback({ type: "error", message: "File size exceeds 10MB limit. Please choose a smaller file." });
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      setUploadedFilePreview(base64Data);

      try {
        // Verify with server validation endpoint
        const uploadRes = await api.products.uploadImage({
          imageData: base64Data,
          fileName: file.name,
          mimeType: file.type,
        });

        // Add to images array
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, uploadRes.imageUrl],
        }));

        setFeedback({ type: "success", message: `Uploaded and verified image: ${file.name}` });
      } catch (err: any) {
        // Fallback: still keep base64 image locally
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, base64Data],
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Remove an image from gallery
  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Make an image the primary/first image
  const handleMakePrimaryImage = (index: number) => {
    setFormData((prev) => {
      const selected = prev.images[index];
      const rest = prev.images.filter((_, idx) => idx !== index);
      return {
        ...prev,
        images: [selected, ...rest],
      };
    });
  };

  // Form Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    }

    if (!formData.categoryId) {
      errors.categoryId = "Category selection is required";
    }

    const priceNum = Number(formData.price);
    if (!formData.price || isNaN(priceNum) || priceNum <= 0) {
      errors.price = "Enter a valid positive price in LKR";
    }

    const weightNum = Number(formData.weightGrams);
    if (!formData.weightGrams || isNaN(weightNum) || weightNum <= 0) {
      errors.weightGrams = "Enter a valid weight in grams";
    }

    const stockNum = Number(formData.stockCount);
    if (isNaN(stockNum) || stockNum < 0) {
      errors.stockCount = "Stock cannot be negative";
    }

    if (formData.images.length === 0) {
      errors.images = "At least one product image is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Create or Update
  const handleSubmitProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFeedback(null);

    const payload = {
      name: formData.name.trim(),
      categoryId: formData.categoryId,
      categoryName: formData.categoryName,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      goldPurity: formData.goldPurity,
      weightGrams: Number(formData.weightGrams),
      stockCount: Number(formData.stockCount),
      inStock: formData.inStock && Number(formData.stockCount) > 0,
      description: formData.description.trim(),
      images: formData.images,
      isFeatured: formData.isFeatured,
      isNewArrival: formData.isNewArrival,
      isBestSeller: formData.isBestSeller,
      specifications: formData.specifications,
    };

    try {
      if (modalMode === "CREATE") {
        const createdProduct = await api.products.create(payload);
        setProducts((prev) => [createdProduct, ...prev]);
        setFeedback({
          type: "success",
          message: `Successfully created and published "${createdProduct.name}" into inventory!`,
        });
      } else {
        if (!formData.id) throw new Error("Missing product ID for update");
        const updatedProduct = await api.products.update(formData.id, payload);
        setProducts((prev) => prev.map((p) => (p.id === formData.id ? updatedProduct : p)));
        setFeedback({
          type: "success",
          message: `Successfully updated product details for "${updatedProduct.name}"!`,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || `Failed to ${modalMode.toLowerCase()} product. Please verify inputs.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm and Execute Delete
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await api.products.delete(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setFeedback({
        type: "success",
        message: `Product "${productToDelete.name}" was permanently removed from the catalog.`,
      });
      setProductToDelete(null);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to delete product from database.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick Toggle In-Stock
  const handleToggleStockStatus = async (product: Product) => {
    const newStatus = !product.inStock;
    const newStockCount = newStatus ? (product.stockCount > 0 ? product.stockCount : 5) : 0;

    try {
      const updated = await api.products.update(product.id, {
        inStock: newStatus,
        stockCount: newStockCount,
      });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
      setFeedback({
        type: "success",
        message: `Updated "${product.name}" status to ${newStatus ? "In Stock" : "Out of Stock"}`,
      });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Failed to toggle stock status." });
    }
  };

  // Inline Stock Count Save
  const handleSaveInlineStock = async (productId: string) => {
    try {
      const updated = await api.products.update(productId, {
        stockCount: inlineStockValue,
        inStock: inlineStockValue > 0,
      });
      setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
      setInlineStockEditingId(null);
      setFeedback({ type: "success", message: `Stock level updated to ${inlineStockValue} units.` });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Failed to update stock quantity." });
    }
  };

  // Filtered & Sorted Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.goldPurity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategoryFilter === "ALL" ||
      p.categoryId === selectedCategoryFilter ||
      p.categoryName === selectedCategoryFilter;

    const matchesPurity = selectedPurityFilter === "ALL" || p.goldPurity === selectedPurityFilter;

    const matchesStock =
      selectedStockFilter === "ALL" ||
      (selectedStockFilter === "IN_STOCK" && p.inStock) ||
      (selectedStockFilter === "OUT_OF_STOCK" && !p.inStock) ||
      (selectedStockFilter === "LOW_STOCK" && p.inStock && (p.stockCount || 0) <= 3);

    return matchesSearch && matchesCategory && matchesPurity && matchesStock;
  });

  filteredProducts.sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "stock-asc") return (a.stockCount || 0) - (b.stockCount || 0);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  // Calculate Metrics
  const totalCatalogValue = products.reduce((acc, p) => acc + p.price * (p.stockCount || 1), 0);
  const outOfStockCount = products.filter((p) => !p.inStock || (p.stockCount || 0) === 0).length;
  const lowStockCount = products.filter((p) => p.inStock && (p.stockCount || 0) > 0 && (p.stockCount || 0) <= 3).length;

  return (
    <div className="space-y-6">
      {/* Toast Feedback Notification */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl flex items-center justify-between border shadow-lg ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                : "bg-rose-50 text-rose-900 border-rose-300"
            }`}
          >
            <div className="flex items-center gap-3">
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-semibold">{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-sans text-xs font-semibold uppercase tracking-wider">
              Total Catalog
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#5A0F1B]/10 text-[#5A0F1B] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-cinzel text-xl sm:text-2xl font-bold text-stone-900 mt-2">
            {products.length}{" "}
            <span className="text-xs font-sans font-normal text-stone-500">masterpieces</span>
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-sans text-xs font-semibold uppercase tracking-wider">
              Catalog Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 text-[#B54E0E] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-cinzel text-lg sm:text-xl font-bold text-[#5A0F1B] mt-2 truncate">
            Rs. {totalCatalogValue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-sans text-xs font-semibold uppercase tracking-wider">
              In Stock Items
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-cinzel text-xl sm:text-2xl font-bold text-emerald-800 mt-2">
            {products.filter((p) => p.inStock).length}
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-sans text-xs font-semibold uppercase tracking-wider">
              Stock Warnings
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-cinzel text-xl sm:text-2xl font-bold text-rose-700">
              {outOfStockCount}
            </span>
            <span className="text-xs text-stone-500">out of stock ({lowStockCount} low)</span>
          </div>
        </div>
      </div>

      {/* Main Product Management Panel */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        {/* Header & Main Actions */}
        <div className="p-5 sm:p-6 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-stone-50 via-white to-stone-50">
          <div>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              Fine Jewelry Product Catalog Management
            </h3>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              Create, edit, publish, upload imagery, and manage high-value sovereign inventory in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {onNavigateToShop && (
              <button
                onClick={onNavigateToShop}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-cinzel font-semibold hover:bg-stone-100 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-stone-500" />
                Storefront View
              </button>
            )}

            <button
              onClick={fetchProductsAndCategories}
              title="Reload catalog"
              className="p-2.5 rounded-xl border border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5A0F1B] hover:bg-[#400A13] text-white text-xs font-cinzel font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
              id="admin-add-product-btn"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              Add New Product
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50/60 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-4 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, SKU, purity, gemstone..."
                className="w-full bg-white border border-stone-300 rounded-xl pl-10 pr-3.5 py-2 text-xs font-sans focus:outline-none focus:border-[#5A0F1B] shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#5A0F1B] shadow-2xs"
              >
                <option value="ALL">All Categories ({products.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Purity Filter */}
            <div className="sm:col-span-2">
              <select
                value={selectedPurityFilter}
                onChange={(e) => setSelectedPurityFilter(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#5A0F1B] shadow-2xs"
              >
                <option value="ALL">All Purities</option>
                <option value="24K">24K (Pure Gold)</option>
                <option value="22K">22K (Sri Lankan Sovereign)</option>
                <option value="18K">18K (Gemstone Setting)</option>
              </select>
            </div>

            {/* Stock Filter */}
            <div className="sm:col-span-2">
              <select
                value={selectedStockFilter}
                onChange={(e) => setSelectedStockFilter(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#5A0F1B] shadow-2xs"
              >
                <option value="ALL">All Stock</option>
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW_STOCK">Low Stock (≤ 3)</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="sm:col-span-1 flex items-center justify-end gap-1">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-2 py-2 text-xs font-sans focus:outline-none focus:border-[#5A0F1B] shadow-2xs text-stone-700"
                title="Sort inventory"
              >
                <option value="newest">Newest</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="stock-asc">Lowest Stock</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Table / Grid List */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#5A0F1B] animate-spin mx-auto" />
            <p className="text-xs text-stone-500 font-cinzel">Loading sovereign jewellery collection...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-cinzel text-base font-bold text-stone-800">No matching jewellery items found</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Try adjusting your search criteria or create a new luxury product to publish into the catalog.
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5A0F1B] text-white text-xs font-cinzel font-bold uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
              Publish First Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#FAF8F5] text-[#5A0F1B] font-cinzel uppercase text-[11px] border-b border-stone-200 tracking-wider">
                <tr>
                  <th className="p-3.5 sm:p-4">Jewellery Piece</th>
                  <th className="p-3.5 sm:p-4">Category &amp; Specs</th>
                  <th className="p-3.5 sm:p-4">Purity &amp; Weight</th>
                  <th className="p-3.5 sm:p-4">Retail Price (LKR)</th>
                  <th className="p-3.5 sm:p-4 text-center">Stock Level</th>
                  <th className="p-3.5 sm:p-4 text-center">Badges</th>
                  <th className="p-3.5 sm:p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map((product) => {
                  const isInlineEditing = inlineStockEditingId === product.id;
                  const primaryImg =
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80";

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-[#FCFBF8] transition-colors group"
                    >
                      {/* Product Visual & Name */}
                      <td className="p-3.5 sm:p-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0 group-hover:border-[#D4AF37] transition-colors">
                            <img
                              src={primaryImg}
                              alt={product.name}
                              className="w-full h-full object-cover object-center"
                              loading="lazy"
                            />
                            {product.images && product.images.length > 1 && (
                              <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-white text-[8px] font-bold px-1 rounded-sm">
                                +{product.images.length - 1}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <h4 className="font-cinzel text-xs font-bold text-stone-900 group-hover:text-[#5A0F1B] transition-colors line-clamp-1">
                              {product.name}
                            </h4>
                            <span className="font-mono text-[10px] text-stone-400 block mt-0.5">
                              ID: {product.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3.5 sm:p-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold">
                          {product.categoryName || "Jewellery"}
                        </span>
                        {product.specifications?.gemstoneType && product.specifications.gemstoneType !== "None" && (
                          <span className="block text-[10px] text-[#B54E0E] font-medium mt-1">
                            💎 {product.specifications.gemstoneType}
                          </span>
                        )}
                      </td>

                      {/* Purity & Weight */}
                      <td className="p-3.5 sm:p-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              product.goldPurity === "24K"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : product.goldPurity === "22K"
                                ? "bg-yellow-100 text-yellow-900 border border-yellow-300"
                                : "bg-stone-100 text-stone-800"
                            }`}
                          >
                            {product.goldPurity}
                          </span>
                          <span className="font-mono font-semibold text-stone-700">
                            {product.weightGrams.toFixed(2)}g
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          (~{(product.weightGrams / 8).toFixed(2)} Sovereign)
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-3.5 sm:p-4">
                        <div className="font-mono font-bold text-[#5A0F1B] text-xs sm:text-sm">
                          Rs. {product.price.toLocaleString()}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-[10px] text-stone-400 line-through">
                            Rs. {product.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Stock Level & Inline Control */}
                      <td className="p-3.5 sm:p-4 text-center">
                        {isInlineEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              min={0}
                              value={inlineStockValue}
                              onChange={(e) => setInlineStockValue(Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-16 bg-white border border-[#5A0F1B] rounded px-1.5 py-1 text-center font-mono text-xs font-bold"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveInlineStock(product.id)}
                              className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                              title="Save Stock"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setInlineStockEditingId(null)}
                              className="p-1 bg-stone-300 text-stone-700 rounded hover:bg-stone-400"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex flex-col items-center gap-1">
                            <button
                              onClick={() => handleToggleStockStatus(product)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                                product.inStock && (product.stockCount || 0) > 0
                                  ? (product.stockCount || 0) <= 3
                                    ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                                    : "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                                  : "bg-rose-100 text-rose-900 hover:bg-rose-200"
                              }`}
                              title="Click to toggle In-Stock / Out-of-Stock"
                            >
                              {product.inStock && (product.stockCount || 0) > 0
                                ? (product.stockCount || 0) <= 3
                                  ? `Low: ${product.stockCount}`
                                  : `In Stock (${product.stockCount || 5})`
                                : "Out of Stock"}
                            </button>

                            <button
                              onClick={() => {
                                setInlineStockEditingId(product.id);
                                setInlineStockValue(product.stockCount || 0);
                              }}
                              className="text-[9px] text-stone-400 hover:text-stone-700 underline"
                            >
                              Edit Quantity
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Badges */}
                      <td className="p-3.5 sm:p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {product.isFeatured && (
                            <span
                              className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center"
                              title="Featured Piece"
                            >
                              <Star className="w-3 h-3 fill-current" />
                            </span>
                          )}
                          {product.isNewArrival && (
                            <span
                              className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[9px] font-bold"
                              title="New Arrival"
                            >
                              N
                            </span>
                          )}
                          {product.isBestSeller && (
                            <span
                              className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center"
                              title="Best Seller"
                            >
                              <Flame className="w-3 h-3 fill-current" />
                            </span>
                          )}
                          {!product.isFeatured && !product.isNewArrival && !product.isBestSeller && (
                            <span className="text-[10px] text-stone-300">—</span>
                          )}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="p-3.5 sm:p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-[#5A0F1B] text-stone-700 hover:text-white transition-colors text-[11px] font-semibold cursor-pointer"
                          title="Edit Product Details & Images"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setProductToDelete(product)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white transition-colors text-[11px] font-semibold cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE & EDIT PRODUCT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
            >
              {/* Modal Top Header */}
              <div className="p-5 sm:p-6 bg-gradient-to-r from-[#2B040B] via-[#4A0B15] to-[#2B040B] text-white flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                    {modalMode === "CREATE" ? <Plus className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-cinzel text-base sm:text-lg font-bold tracking-wide">
                      {modalMode === "CREATE"
                        ? "Publish New Royal Jewellery Masterpiece"
                        : `Edit Masterpiece Details: ${formData.name}`}
                    </h3>
                    <p className="text-[11px] text-[#F3E5AB] font-sans">
                      {modalMode === "CREATE"
                        ? "Enter complete specifications, upload authentic imagery, and publish into active catalog."
                        : "Update pricing, specifications, gold purity, or gallery media."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body Form (Scrollable) */}
              <form onSubmit={handleSubmitProductForm} className="p-5 sm:p-8 space-y-6 overflow-y-auto flex-1 font-sans text-xs">
                {/* 1. Core Identification */}
                <div className="space-y-4">
                  <h4 className="font-cinzel text-xs font-bold text-[#5A0F1B] uppercase tracking-wider border-b pb-1.5 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                    1. Product Information &amp; Category
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    {/* Product Name */}
                    <div className="sm:col-span-7">
                      <label className="font-bold text-stone-700 block mb-1">
                        Product Title / Creation Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ceylon Royal Blue Sapphire Solitaire Ring (22K Gold)"
                        className={`w-full bg-stone-50 border rounded-xl px-3.5 py-2.5 font-medium text-stone-900 focus:outline-none focus:bg-white ${
                          formErrors.name ? "border-rose-500 bg-rose-50/30" : "border-stone-300 focus:border-[#5A0F1B]"
                        }`}
                      />
                      {formErrors.name && (
                        <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.name}</span>
                      )}
                    </div>

                    {/* Category Selection */}
                    <div className="sm:col-span-5">
                      <label className="font-bold text-stone-700 block mb-1">
                        Jewellery Category *
                      </label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => {
                          const catId = e.target.value;
                          const matchedCat = categories.find((c) => c.id === catId);
                          setFormData({
                            ...formData,
                            categoryId: catId,
                            categoryName: matchedCat ? matchedCat.name : "Jewellery",
                          });
                        }}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 font-medium text-stone-900 focus:outline-none focus:border-[#5A0F1B] focus:bg-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Pricing, Gold Purity & Weight */}
                <div className="space-y-4">
                  <h4 className="font-cinzel text-xs font-bold text-[#5A0F1B] uppercase tracking-wider border-b pb-1.5 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
                    2. Gold Purity, Weight &amp; Pricing (LKR)
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {/* Gold Purity */}
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Gold Purity *</label>
                      <select
                        value={formData.goldPurity}
                        onChange={(e) => setFormData({ ...formData, goldPurity: e.target.value as GoldPurity })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 font-bold text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                      >
                        <option value="24K">24K (Pure Gold)</option>
                        <option value="22K">22K (Sovereign Hallmark)</option>
                        <option value="18K">18K (Fine Gemstone Casting)</option>
                      </select>
                    </div>

                    {/* Weight (grams) */}
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Weight (Grams) *</label>
                      <input
                        type="number"
                        step={0.01}
                        min={0.1}
                        value={formData.weightGrams}
                        onChange={(e) => setFormData({ ...formData, weightGrams: e.target.value })}
                        placeholder="8.00"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 font-mono font-bold text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                      />
                      {formErrors.weightGrams && (
                        <span className="text-[10px] text-rose-600 mt-1 block">{formErrors.weightGrams}</span>
                      )}
                    </div>

                    {/* Price */}
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Retail Price (LKR) *</label>
                      <input
                        type="number"
                        step={100}
                        min={1}
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="245000"
                        className={`w-full bg-stone-50 border rounded-xl px-3 py-2.5 font-mono font-bold text-[#5A0F1B] focus:outline-none ${
                          formErrors.price ? "border-rose-500 bg-rose-50/30" : "border-stone-300 focus:border-[#5A0F1B]"
                        }`}
                      />
                      {formErrors.price && (
                        <span className="text-[10px] text-rose-600 mt-1 block">{formErrors.price}</span>
                      )}
                    </div>

                    {/* Original Price / MSRP */}
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Original Price (MSRP)</label>
                      <input
                        type="number"
                        step={100}
                        min={0}
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                        placeholder="Optional strike-through"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 font-mono text-stone-600 focus:outline-none focus:border-[#5A0F1B]"
                      />
                    </div>
                  </div>

                  {/* Stock Quantity & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Available Stock Units</label>
                      <input
                        type="number"
                        min={0}
                        value={formData.stockCount}
                        onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-mono font-bold text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="form-in-stock"
                        checked={formData.inStock}
                        onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                        className="w-4 h-4 text-[#5A0F1B] rounded border-stone-300 focus:ring-[#5A0F1B]"
                      />
                      <label htmlFor="form-in-stock" className="font-bold text-stone-800 cursor-pointer">
                        Mark Available for Online Purchase
                      </label>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-3 pt-6">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          className="w-3.5 h-3.5 text-amber-600 rounded"
                        />
                        <span className="font-semibold text-stone-700 text-[11px]">Featured</span>
                      </label>

                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isNewArrival}
                          onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                          className="w-3.5 h-3.5 text-blue-600 rounded"
                        />
                        <span className="font-semibold text-stone-700 text-[11px]">New</span>
                      </label>

                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isBestSeller}
                          onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                          className="w-3.5 h-3.5 text-rose-600 rounded"
                        />
                        <span className="font-semibold text-stone-700 text-[11px]">Best Seller</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 3. PRODUCT IMAGES UPLOAD & URL MANAGEMENT */}
                <div className="space-y-4 bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <div>
                      <h4 className="font-cinzel text-xs font-bold text-[#5A0F1B] uppercase tracking-wider flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                        3. Product Imagery &amp; Visual Assets *
                      </h4>
                      <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                        Upload local image files or supply valid external URLs. First image serves as primary hero view.
                      </p>
                    </div>

                    {/* Method Selector Tabs */}
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200">
                      <button
                        type="button"
                        onClick={() => setImageInputMethod("UPLOAD")}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                          imageInputMethod === "UPLOAD"
                            ? "bg-[#5A0F1B] text-white"
                            : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        <Upload className="w-3 h-3" />
                        Upload File
                      </button>

                      <button
                        type="button"
                        onClick={() => setImageInputMethod("URL")}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                          imageInputMethod === "URL"
                            ? "bg-[#5A0F1B] text-white"
                            : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        <LinkIcon className="w-3 h-3" />
                        Image URL
                      </button>

                      <button
                        type="button"
                        onClick={() => setImageInputMethod("PRESET")}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                          imageInputMethod === "PRESET"
                            ? "bg-[#5A0F1B] text-white"
                            : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                        Presets
                      </button>
                    </div>
                  </div>

                  {/* Input Method Content */}
                  {imageInputMethod === "UPLOAD" && (
                    <div className="space-y-3">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-stone-300 hover:border-[#5A0F1B] bg-white rounded-2xl p-6 text-center cursor-pointer transition-all group"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <div className="w-12 h-12 rounded-full bg-[#5A0F1B]/10 text-[#5A0F1B] group-hover:scale-110 transition-transform flex items-center justify-center mx-auto mb-2">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="font-cinzel text-xs font-bold text-stone-800">
                          Click to browse or Drag &amp; Drop image file
                        </p>
                        <p className="text-[10px] text-stone-500 mt-1">
                          Supports high-resolution PNG, JPG, JPEG, WebP, GIF (Max 10MB)
                        </p>
                      </div>
                    </div>
                  )}

                  {imageInputMethod === "URL" && (
                    <div className="space-y-2">
                      <label className="font-bold text-stone-700 block">
                        Provide Direct Image URL (HTTPS / HTTP)
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="url"
                            value={customImageUrl}
                            onChange={(e) => setCustomImageUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-... or cloud image link"
                            className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#5A0F1B]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={validateAndAddImageUrl}
                          disabled={imageUrlValidationStatus === "validating"}
                          className="px-4 py-2.5 bg-[#5A0F1B] hover:bg-[#400A13] text-white rounded-xl font-cinzel font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                        >
                          {imageUrlValidationStatus === "validating" ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                          Validate &amp; Add
                        </button>
                      </div>

                      {/* Validation Status message */}
                      {imageValidationMessage && (
                        <p
                          className={`text-[11px] font-medium flex items-center gap-1.5 ${
                            imageUrlValidationStatus === "valid" ? "text-emerald-700" : "text-rose-600"
                          }`}
                        >
                          {imageUrlValidationStatus === "valid" ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5" />
                          )}
                          {imageValidationMessage}
                        </p>
                      )}
                    </div>
                  )}

                  {imageInputMethod === "PRESET" && (
                    <div className="space-y-2">
                      <p className="text-[11px] text-stone-600">
                        Select authentic royal jewellery sample photography from our curated library:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                        {PRESET_JEWELRY_IMAGES.map((preset, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              if (!formData.images.includes(preset.url)) {
                                setFormData((prev) => ({
                                  ...prev,
                                  images: [...prev.images, preset.url],
                                }));
                              }
                            }}
                            className={`p-2 bg-white rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center gap-1.5 group ${
                              formData.images.includes(preset.url)
                                ? "border-[#5A0F1B] ring-2 ring-[#5A0F1B]/20"
                                : "border-stone-200 hover:border-[#D4AF37]"
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <span className="text-[10px] font-cinzel font-bold text-stone-800 line-clamp-1">
                              {preset.title}
                            </span>
                            <span className="text-[9px] text-[#B54E0E] font-medium">
                              {formData.images.includes(preset.url) ? "✓ Added" : "+ Click to Add"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Active Gallery Preview List */}
                  <div className="pt-2">
                    <label className="font-bold text-stone-700 block mb-2">
                      Current Product Images ({formData.images.length})
                    </label>

                    {formData.images.length === 0 ? (
                      <div className="text-center py-6 bg-white rounded-xl border border-dashed border-stone-300 text-stone-400">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                        <span className="text-[11px]">No images attached. Upload or enter a URL above.</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {formData.images.map((imgUrl, index) => (
                          <div
                            key={index}
                            className={`relative group bg-white rounded-xl p-1.5 border overflow-hidden shadow-2xs ${
                              index === 0 ? "border-[#5A0F1B] ring-2 ring-[#5A0F1B]/20" : "border-stone-200"
                            }`}
                          >
                            <div className="relative aspect-square rounded-lg overflow-hidden bg-stone-100">
                              <img
                                src={imgUrl}
                                alt={`Product thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />

                              {/* Primary Badge */}
                              {index === 0 && (
                                <span className="absolute top-1 left-1 bg-[#5A0F1B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                  Primary Hero
                                </span>
                              )}

                              {/* Action Overlay */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {index !== 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMakePrimaryImage(index)}
                                    className="p-1.5 bg-white text-stone-900 rounded-md text-[10px] font-bold hover:bg-[#5A0F1B] hover:text-white"
                                    title="Make Primary Image"
                                  >
                                    Set Hero
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="p-1.5 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                                  title="Remove Image"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {formErrors.images && (
                      <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.images}</span>
                    )}
                  </div>
                </div>

                {/* 4. Description */}
                <div className="space-y-2">
                  <label className="font-bold text-stone-700 block">
                    Product Description &amp; Heritage Craftsmanship Story
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the royal craftsmanship, purity details, motifs, or special occasion styling..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-900 focus:outline-none focus:border-[#5A0F1B] focus:bg-white leading-relaxed"
                  />
                </div>

                {/* 5. Luxury Specifications */}
                <div className="space-y-4">
                  <h4 className="font-cinzel text-xs font-bold text-[#5A0F1B] uppercase tracking-wider border-b pb-1.5 flex items-center gap-1.5">
                    <Gem className="w-3.5 h-3.5 text-[#D4AF37]" />
                    4. Gemstone &amp; Hallmark Authenticity Specifications
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Gemstone Type</label>
                      <input
                        type="text"
                        value={formData.specifications.gemstoneType || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: { ...formData.specifications, gemstoneType: e.target.value },
                          })
                        }
                        placeholder="e.g. Ceylon Natural Blue Sapphire"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Gemstone Carat / Cut</label>
                      <input
                        type="text"
                        value={formData.specifications.gemstoneCarat || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: { ...formData.specifications, gemstoneCarat: e.target.value },
                          })
                        }
                        placeholder="e.g. 2.45 Carats (Cushion Brilliant)"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Clasp / Closure Type</label>
                      <input
                        type="text"
                        value={formData.specifications.claspType || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: { ...formData.specifications, claspType: e.target.value },
                          })
                        }
                        placeholder="e.g. Traditional Sri Lankan S-Lock"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Official Hallmark Authority</label>
                    <input
                      type="text"
                      value={formData.specifications.hallmark || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, hallmark: e.target.value },
                        })
                      }
                      placeholder="e.g. Sri Lanka Gem & Jewellery Authority Hallmarked (916 / 22K)"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                    />
                  </div>
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-end gap-3 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl border border-stone-300 text-stone-700 font-cinzel font-bold text-xs uppercase hover:bg-stone-100 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#5A0F1B] hover:bg-[#400A13] text-white font-cinzel font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                        Publishing to Database...
                      </>
                    ) : modalMode === "CREATE" ? (
                      <>
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        Publish Masterpiece
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-[#D4AF37]" />
                        Save Product Updates
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="font-cinzel text-base font-bold text-stone-900">
                  Permanently Delete Product?
                </h3>
                <p className="text-xs text-stone-500 font-sans">
                  Are you sure you want to remove{" "}
                  <strong className="text-stone-800">"{productToDelete.name}"</strong> from the catalog?
                  This action will permanently delete it from the backend database.
                </p>

                <div className="p-3 bg-stone-50 rounded-xl flex items-center gap-3 border border-stone-200 text-left mt-3">
                  <img
                    src={productToDelete.images[0]}
                    alt={productToDelete.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-cinzel text-xs font-bold text-stone-900 truncate">
                      {productToDelete.name}
                    </p>
                    <p className="text-[11px] font-mono font-bold text-[#5A0F1B]">
                      Rs. {productToDelete.price.toLocaleString()} ({productToDelete.goldPurity})
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setProductToDelete(null)}
                  disabled={isDeleting}
                  className="py-2.5 rounded-xl border border-stone-300 font-cinzel font-bold text-xs uppercase text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-cinzel font-bold text-xs uppercase transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
