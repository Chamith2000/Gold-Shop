import React, { useState, useEffect } from "react";
import {
  Gift,
  Tag,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Check,
  Sparkles,
  Layers,
  Percent,
  Clock,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { GiftCategory, GiftProduct, GiftComboPack, GiftRecommendation, Offer, HomepageSection } from "../../types";
import { api } from "../../services/api";

export const GiftsOffersManagement: React.FC = () => {
  const [subTab, setSubTab] = useState<"CATEGORIES" | "PRODUCTS" | "COMBOS" | "RECOMMENDATIONS" | "OFFERS" | "HOMEPAGE">("PRODUCTS");

  const [categories, setCategories] = useState<GiftCategory[]>([]);
  const [products, setProducts] = useState<GiftProduct[]>([]);
  const [combos, setCombos] = useState<GiftComboPack[]>([]);
  const [recommendations, setRecommendations] = useState<GiftRecommendation[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [homepageSections, setHomepageSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Modal / Form states
  const [editingCategory, setEditingCategory] = useState<Partial<GiftCategory> | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<GiftProduct> | null>(null);
  const [editingCombo, setEditingCombo] = useState<Partial<GiftComboPack> | null>(null);
  const [editingRec, setEditingRec] = useState<Partial<GiftRecommendation> | null>(null);
  const [editingOffer, setEditingOffer] = useState<Partial<Offer> | null>(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.admin.getGiftCategories(),
      api.admin.getGiftProducts(),
      api.admin.getGiftCombos(),
      api.admin.getGiftRecommendations(),
      api.admin.getOffers(),
      api.admin.getHomepageSections(),
    ])
      .then(([cats, prods, cmbs, recs, ffrs, secs]) => {
        setCategories(cats || []);
        setProducts(prods || []);
        setCombos(cmbs || []);
        setRecommendations(recs || []);
        setOffers(ffrs || []);
        setHomepageSections(secs || []);
      })
      .catch((err) => console.error("Error loading admin gifts & offers", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const showSuccess = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3500);
  };

  // CATEGORIES CRUD
  const handleSaveCategory = async () => {
    if (!editingCategory?.name) return;
    try {
      if (editingCategory.id) {
        await api.admin.updateGiftCategory(editingCategory.id, editingCategory);
        showSuccess(`Category "${editingCategory.name}" updated!`);
      } else {
        await api.admin.createGiftCategory(editingCategory);
        showSuccess(`New gift category created!`);
      }
      setEditingCategory(null);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this gift category?")) return;
    try {
      await api.admin.deleteGiftCategory(id);
      showSuccess("Gift category deleted!");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete category");
    }
  };

  // PRODUCTS CRUD
  const handleSaveProduct = async () => {
    if (!editingProduct?.name || !editingProduct?.price || !editingProduct?.giftCategoryId) {
      return alert("Name, price, and category are required");
    }
    try {
      if (editingProduct.id) {
        await api.admin.updateGiftProduct(editingProduct.id, editingProduct);
        showSuccess(`Gift product "${editingProduct.name}" updated!`);
      } else {
        await api.admin.createGiftProduct(editingProduct);
        showSuccess("New gift product added!");
      }
      setEditingProduct(null);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save gift product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this gift product?")) return;
    try {
      await api.admin.deleteGiftProduct(id);
      showSuccess("Gift product deleted!");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    }
  };

  // COMBOS CRUD
  const handleSaveCombo = async () => {
    if (!editingCombo?.name || !editingCombo?.comboPrice) {
      return alert("Name and combo price are required");
    }
    try {
      if (editingCombo.id) {
        await api.admin.updateGiftCombo(editingCombo.id, editingCombo);
        showSuccess(`Combo pack "${editingCombo.name}" updated!`);
      } else {
        await api.admin.createGiftCombo(editingCombo);
        showSuccess("New gift combo pack created!");
      }
      setEditingCombo(null);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save combo pack");
    }
  };

  const handleDeleteCombo = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this combo pack?")) return;
    try {
      await api.admin.deleteGiftCombo(id);
      showSuccess("Combo pack deleted!");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete combo");
    }
  };

  // RECOMMENDATIONS CRUD
  const handleSaveRec = async () => {
    if (!editingRec?.targetType || !editingRec?.targetId) {
      return alert("Target Type and Target ID are required");
    }
    try {
      if (editingRec.id) {
        await api.admin.updateGiftRecommendation(editingRec.id, editingRec);
        showSuccess("Gift recommendation rule updated!");
      } else {
        await api.admin.createGiftRecommendation(editingRec);
        showSuccess("New recommendation rule created!");
      }
      setEditingRec(null);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save recommendation rule");
    }
  };

  const handleDeleteRec = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this recommendation rule?")) return;
    try {
      await api.admin.deleteGiftRecommendation(id);
      showSuccess("Recommendation rule deleted!");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete recommendation rule");
    }
  };

  // OFFERS CRUD
  const handleSaveOffer = async () => {
    if (!editingOffer?.title || !editingOffer?.startDate) {
      return alert("Title and start date are required");
    }
    try {
      if (editingOffer.id) {
        await api.admin.updateOffer(editingOffer.id, editingOffer);
        showSuccess(`Offer "${editingOffer.title}" updated!`);
      } else {
        await api.admin.createOffer(editingOffer);
        showSuccess("New exclusive offer created!");
      }
      setEditingOffer(null);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save offer");
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await api.admin.deleteOffer(id);
      showSuccess("Offer deleted!");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete offer");
    }
  };

  // HOMEPAGE SECTIONS TOGGLE
  const handleToggleHomepageSection = async (index: number) => {
    const copy = [...homepageSections];
    copy[index].active = !copy[index].active;
    setHomepageSections(copy);
    try {
      await api.admin.updateHomepageSections(copy);
      showSuccess("Homepage sections updated!");
    } catch (err: any) {
      alert(err.message || "Failed to update homepage sections");
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-between">
          <span>{message}</span>
          <Check className="w-4 h-4 text-emerald-600" />
        </div>
      )}

      {/* Sub-Tab Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSubTab("PRODUCTS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              subTab === "PRODUCTS" ? "bg-[#5A0F1B] text-white" : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-[#D4AF37]" /> Products ({products.length})
          </button>

          <button
            onClick={() => setSubTab("CATEGORIES")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              subTab === "CATEGORIES" ? "bg-[#5A0F1B] text-white" : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Categories ({categories.length})
          </button>

          <button
            onClick={() => setSubTab("COMBOS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              subTab === "COMBOS" ? "bg-[#5A0F1B] text-white" : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Combo Packs ({combos.length})
          </button>

          <button
            onClick={() => setSubTab("RECOMMENDATIONS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              subTab === "RECOMMENDATIONS" ? "bg-[#5A0F1B] text-white" : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Recommendation Rules ({recommendations.length})
          </button>

          <button
            onClick={() => setSubTab("OFFERS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              subTab === "OFFERS" ? "bg-[#5A0F1B] text-white" : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-[#D4AF37]" /> Offers ({offers.length})
          </button>

          <button
            onClick={() => setSubTab("HOMEPAGE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              subTab === "HOMEPAGE" ? "bg-[#5A0F1B] text-white" : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Homepage Content
          </button>
        </div>

        <div>
          {subTab === "PRODUCTS" && (
            <button
              onClick={() => setEditingProduct({ name: "", price: 1000, stockQuantity: 10, inStock: true, occasion: "Birthday", giftCategoryId: categories[0]?.id || "gcat-combos" })}
              className="px-3 py-1.5 bg-[#5A0F1B] text-white text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" /> Add Gift Product
            </button>
          )}
          {subTab === "CATEGORIES" && (
            <button
              onClick={() => setEditingCategory({ name: "", description: "", active: true })}
              className="px-3 py-1.5 bg-[#5A0F1B] text-white text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" /> Add Gift Category
            </button>
          )}
          {subTab === "COMBOS" && (
            <button
              onClick={() => setEditingCombo({ name: "", comboPrice: 5000, individualValue: 6500, items: ["Item 1", "Item 2"], active: true })}
              className="px-3 py-1.5 bg-[#5A0F1B] text-white text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" /> Add Combo Pack
            </button>
          )}
          {subTab === "RECOMMENDATIONS" && (
            <button
              onClick={() => setEditingRec({ targetType: "CATEGORY", targetId: "cat-bridal", recommendedGiftIds: [], active: true })}
              className="px-3 py-1.5 bg-[#5A0F1B] text-white text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" /> Add Recommendation Rule
            </button>
          )}
          {subTab === "OFFERS" && (
            <button
              onClick={() => setEditingOffer({ title: "", startDate: new Date().toISOString(), offerType: "TODAY", active: true })}
              className="px-3 py-1.5 bg-[#5A0F1B] text-white text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" /> Add Exclusive Offer
            </button>
          )}
        </div>
      </div>

      {/* 1. GIFT PRODUCTS MANAGEMENT */}
      {subTab === "PRODUCTS" && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#5A0F1B] text-white font-cinzel text-[11px] uppercase">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Occasion</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="p-3 flex items-center gap-2.5">
                    <img src={p.mainImage} alt="" className="w-9 h-9 rounded object-cover border border-stone-200 shrink-0" />
                    <div>
                      <span className="font-bold text-stone-900 line-clamp-1">{p.name}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{p.id}</span>
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-stone-700">{p.giftCategoryName}</td>
                  <td className="p-3 font-bold text-[#5A0F1B]">Rs. {p.price.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.inStock ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                      {p.stockQuantity} in stock
                    </span>
                  </td>
                  <td className="p-3 text-stone-600">{p.occasion || "General"}</td>
                  <td className="p-3 text-right space-x-1">
                    <button onClick={() => setEditingProduct(p)} className="p-1 text-stone-600 hover:text-[#5A0F1B]">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-1 text-stone-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. GIFT CATEGORIES MANAGEMENT */}
      {subTab === "CATEGORIES" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-2xl border border-stone-200 flex gap-3 items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <img src={c.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-stone-200" />
                <div>
                  <h4 className="font-cinzel text-xs font-bold text-stone-900">{c.name}</h4>
                  <span className="text-[10px] text-stone-500">{c.productCount || 0} products</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setEditingCategory(c)} className="p-1.5 text-stone-600 hover:text-[#5A0F1B]">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteCategory(c.id)} className="p-1.5 text-stone-400 hover:text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. GIFT COMBOS MANAGEMENT */}
      {subTab === "COMBOS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {combos.map((cmb) => (
            <div key={cmb.id} className="bg-white p-4 rounded-2xl border border-stone-200 flex gap-4 justify-between shadow-2xs">
              <img src={cmb.image} alt="" className="w-24 h-24 rounded-xl object-cover border border-stone-200 shrink-0" />
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="font-cinzel text-sm font-bold text-stone-900">{cmb.name}</h4>
                <p className="text-xs text-stone-500 line-clamp-1">{cmb.description}</p>
                <div className="text-xs">
                  <span className="font-bold text-[#5A0F1B]">Combo: Rs. {cmb.comboPrice.toLocaleString()}</span>
                  <span className="text-[11px] text-emerald-600 ml-2 font-semibold">(You save Rs. {cmb.youSave.toLocaleString()})</span>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <button onClick={() => setEditingCombo(cmb)} className="p-1 text-stone-600 hover:text-[#5A0F1B]">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteCombo(cmb.id)} className="p-1 text-stone-400 hover:text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. RECOMMENDATIONS MANAGEMENT */}
      {subTab === "RECOMMENDATIONS" && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#5A0F1B] text-white font-cinzel text-[11px]">
              <tr>
                <th className="p-3">Target Type</th>
                <th className="p-3">Target ID</th>
                <th className="p-3">Recommended Gifts</th>
                <th className="p-3">Priority</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recommendations.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50">
                  <td className="p-3 font-bold text-stone-900">{r.targetType}</td>
                  <td className="p-3 font-mono text-stone-700">{r.targetId}</td>
                  <td className="p-3 text-stone-600">{r.recommendedGiftIds?.join(", ") || "Default"}</td>
                  <td className="p-3">{r.priority}</td>
                  <td className="p-3 text-right space-x-1">
                    <button onClick={() => setEditingRec(r)} className="p-1 text-stone-600 hover:text-[#5A0F1B]">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteRec(r.id)} className="p-1 text-stone-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. EXCLUSIVE OFFERS MANAGEMENT */}
      {subTab === "OFFERS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((o) => (
            <div key={o.id} className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#5A0F1B] uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                  {o.offerType} OFFER
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${o.active ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}>
                  {o.active ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
              <h4 className="font-cinzel text-sm font-bold text-stone-900">{o.title}</h4>
              <p className="text-xs text-stone-600 line-clamp-2">{o.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                <span className="text-stone-500">Discount: {o.discountPercent}%</span>
                <div className="space-x-2">
                  <button onClick={() => setEditingOffer(o)} className="text-stone-600 hover:text-[#5A0F1B] font-semibold">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteOffer(o.id)} className="text-stone-400 hover:text-rose-600 font-semibold">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. HOMEPAGE CONTENT MANAGEMENT */}
      {subTab === "HOMEPAGE" && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
          <h3 className="font-cinzel text-sm font-bold text-[#5A0F1B] uppercase tracking-wider">
            Homepage Content Sections Visibility &amp; Ordering
          </h3>
          <p className="text-xs text-stone-500">
            Control which promotional and gift sections appear on the homepage and their relative priority.
          </p>

          <div className="space-y-2">
            {homepageSections.map((sec, idx) => (
              <div key={sec.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#5A0F1B]/10 text-[#5A0F1B] text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-cinzel text-xs font-bold text-stone-900">{sec.title}</h4>
                    <p className="text-[11px] text-stone-500">{sec.subtitle}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleHomepageSection(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    sec.active ? "bg-emerald-600 text-white" : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {sec.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {sec.active ? "VISIBLE" : "HIDDEN"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT/CREATE PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-cinzel font-bold text-sm text-[#5A0F1B]">
                {editingProduct.id ? "Edit Gift Product" : "Create New Gift Product"}
              </h3>
              <button onClick={() => setEditingProduct(null)}><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Original Price (Rs.)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Gift Category</label>
                <select
                  value={editingProduct.giftCategoryId || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, giftCategoryId: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Main Image URL</label>
                <input
                  type="text"
                  value={editingProduct.mainImage || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, mainImage: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct.stockQuantity || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Occasion</label>
                  <input
                    type="text"
                    value={editingProduct.occasion || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, occasion: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setEditingProduct(null)} className="px-4 py-2 border rounded-lg text-xs">Cancel</button>
              <button onClick={handleSaveProduct} className="px-4 py-2 bg-[#5A0F1B] text-white text-xs font-bold rounded-lg">Save Gift Product</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT/CREATE CATEGORY MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-cinzel font-bold text-sm text-[#5A0F1B]">
                {editingCategory.id ? "Edit Gift Category" : "Create Gift Category"}
              </h3>
              <button onClick={() => setEditingCategory(null)}><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Category Name</label>
                <input
                  type="text"
                  value={editingCategory.name || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingCategory.imageUrl || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, imageUrl: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setEditingCategory(null)} className="px-4 py-2 border rounded-lg text-xs">Cancel</button>
              <button onClick={handleSaveCategory} className="px-4 py-2 bg-[#5A0F1B] text-white text-xs font-bold rounded-lg">Save Category</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT/CREATE COMBO MODAL */}
      {editingCombo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-cinzel font-bold text-sm text-[#5A0F1B]">
                {editingCombo.id ? "Edit Gift Combo" : "Create Gift Combo Pack"}
              </h3>
              <button onClick={() => setEditingCombo(null)}><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Combo Pack Name</label>
                <input
                  type="text"
                  value={editingCombo.name || ""}
                  onChange={(e) => setEditingCombo({ ...editingCombo, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Combo Price (Rs.)</label>
                  <input
                    type="number"
                    value={editingCombo.comboPrice || 0}
                    onChange={(e) => setEditingCombo({ ...editingCombo, comboPrice: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Individual Value (Rs.)</label>
                  <input
                    type="number"
                    value={editingCombo.individualValue || 0}
                    onChange={(e) => setEditingCombo({ ...editingCombo, individualValue: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingCombo.image || ""}
                  onChange={(e) => setEditingCombo({ ...editingCombo, image: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Included Items (Comma separated)</label>
                <input
                  type="text"
                  value={editingCombo.items?.join(", ") || ""}
                  onChange={(e) => setEditingCombo({ ...editingCombo, items: e.target.value.split(",").map((s) => s.trim()) })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setEditingCombo(null)} className="px-4 py-2 border rounded-lg text-xs">Cancel</button>
              <button onClick={handleSaveCombo} className="px-4 py-2 bg-[#5A0F1B] text-white text-xs font-bold rounded-lg">Save Combo Pack</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT/CREATE OFFER MODAL */}
      {editingOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-cinzel font-bold text-sm text-[#5A0F1B]">
                {editingOffer.id ? "Edit Exclusive Offer" : "Create Exclusive Offer"}
              </h3>
              <button onClick={() => setEditingOffer(null)}><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Offer Title</label>
                <input
                  type="text"
                  value={editingOffer.title || ""}
                  onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Offer Type</label>
                <select
                  value={editingOffer.offerType || "TODAY"}
                  onChange={(e) => setEditingOffer({ ...editingOffer, offerType: e.target.value as any })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="TODAY">TODAY</option>
                  <option value="JEWELLERY">JEWELLERY</option>
                  <option value="GIFT">GIFT</option>
                  <option value="COUPLE">COUPLE</option>
                  <option value="WEDDING">WEDDING</option>
                  <option value="BIRTHDAY">BIRTHDAY</option>
                  <option value="ANNIVERSARY">ANNIVERSARY</option>
                  <option value="SEASONAL">SEASONAL</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Discount %</label>
                  <input
                    type="number"
                    value={editingOffer.discountPercent || 0}
                    onChange={(e) => setEditingOffer({ ...editingOffer, discountPercent: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editingOffer.startDate ? editingOffer.startDate.split("T")[0] : ""}
                    onChange={(e) => setEditingOffer({ ...editingOffer, startDate: new Date(e.target.value).toISOString() })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Banner Image URL</label>
                <input
                  type="text"
                  value={editingOffer.bannerImage || ""}
                  onChange={(e) => setEditingOffer({ ...editingOffer, bannerImage: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingOffer.description || ""}
                  onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setEditingOffer(null)} className="px-4 py-2 border rounded-lg text-xs">Cancel</button>
              <button onClick={handleSaveOffer} className="px-4 py-2 bg-[#5A0F1B] text-white text-xs font-bold rounded-lg">Save Offer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
