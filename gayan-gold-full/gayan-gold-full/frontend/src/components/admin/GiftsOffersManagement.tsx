import React, { useEffect, useMemo, useState } from "react";
import { Check, Edit, Gift, Layers, Plus, Save, Sparkles, Tag, Trash2, X } from "lucide-react";
import { GiftCategory, GiftComboPack, GiftProduct, GiftRecommendation, HomepageSection, Offer } from "../../types";
import { api } from "../../services/api";

const inputClass = "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]";
const buttonClass = "px-3 py-2 bg-[#5A0F1B] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-[#420A13] transition-colors";

const defaultHomepageSections: HomepageSection[] = [
  { id: "home-today", key: "todays_offers", title: "Today's Offers", subtitle: "Limited-time promotions", active: true, displayOrder: 1, itemIds: [] },
  { id: "home-gifts", key: "gift_picks", title: "Gift Picks", subtitle: "Curated celebration gifts", active: true, displayOrder: 2, itemIds: [] },
  { id: "home-wedding", key: "wedding_specials", title: "Wedding Specials", subtitle: "Special offers for weddings", active: true, displayOrder: 3, itemIds: [] },
  { id: "home-birthday", key: "birthday_specials", title: "Birthday Specials", subtitle: "Birthday gift promotions", active: true, displayOrder: 4, itemIds: [] },
  { id: "home-couple", key: "couple_collection", title: "Couple Collection", subtitle: "Gifts for two", active: true, displayOrder: 5, itemIds: [] },
  { id: "home-anniversary", key: "anniversary_specials", title: "Anniversary Specials", subtitle: "Celebrate together", active: true, displayOrder: 6, itemIds: [] },
  { id: "home-limited", key: "limited_time_offers", title: "Limited Time Offers", subtitle: "Offers ending soon", active: true, displayOrder: 7, itemIds: [] },
];

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
  const [error, setError] = useState<string | null>(null);

  const [editingCategory, setEditingCategory] = useState<Partial<GiftCategory> | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<GiftProduct> | null>(null);
  const [editingCombo, setEditingCombo] = useState<Partial<GiftComboPack> | null>(null);
  const [editingRec, setEditingRec] = useState<Partial<GiftRecommendation> | null>(null);
  const [editingOffer, setEditingOffer] = useState<Partial<Offer> | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, prods, cmbs, recs, offs, sections] = await Promise.all([
        api.admin.getGiftCategories(),
        api.admin.getGiftProducts(),
        api.admin.getGiftCombos(),
        api.admin.getGiftRecommendations(),
        api.admin.getOffers(),
        api.admin.getHomepageSections(),
      ]);
      setCategories(cats || []);
      setProducts(prods || []);
      setCombos(cmbs || []);
      setRecommendations(recs || []);
      setOffers(offs || []);
      setHomepageSections((sections && sections.length ? sections : defaultHomepageSections).sort((a, b) => a.displayOrder - b.displayOrder));
    } catch (err: any) {
      setError(err?.message || "Failed to load Gift & Offers management data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const success = (text: string) => { setError(null); setMessage(text); window.setTimeout(() => setMessage(null), 3500); };
  const failure = (err: any, fallback: string) => setError(err?.message || fallback);

  const save = async (fn: () => Promise<any>, text: string) => {
    try { await fn(); success(text); await loadData(); }
    catch (err: any) { failure(err, "Operation failed"); }
  };

  const handleDelete = async (id: string, type: "category" | "product" | "combo" | "recommendation" | "offer") => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    const actions: Record<string, () => Promise<any>> = {
      category: () => api.admin.deleteGiftCategory(id),
      product: () => api.admin.deleteGiftProduct(id),
      combo: () => api.admin.deleteGiftCombo(id),
      recommendation: () => api.admin.deleteGiftRecommendation(id),
      offer: () => api.admin.deleteOffer(id),
    };
    await save(actions[type], `${type[0].toUpperCase() + type.slice(1)} deleted successfully.`);
  };

  const normalizedProductIds = useMemo(() => products.map((p) => p.id), [products]);

  const moveHomepage = async (index: number, direction: -1 | 1) => {
    const next = [...homepageSections];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    next.forEach((s, i) => { s.displayOrder = i + 1; });
    setHomepageSections(next);
    await save(() => api.admin.updateHomepageSections(next), "Homepage section order updated.");
  };

  const toggleHomepage = async (index: number) => {
    const next = homepageSections.map((s, i) => i === index ? { ...s, active: !s.active } : s);
    next.forEach((s, i) => { s.displayOrder = i + 1; });
    setHomepageSections(next);
    await save(() => api.admin.updateHomepageSections(next), "Homepage visibility updated.");
  };

  const tabs = [
    ["PRODUCTS", `Products (${products.length})`, Gift],
    ["CATEGORIES", `Categories (${categories.length})`, Layers],
    ["COMBOS", `Combo Packs (${combos.length})`, Sparkles],
    ["RECOMMENDATIONS", `Recommendation Rules (${recommendations.length})`, Tag],
    ["OFFERS", `Offers (${offers.length})`, Tag],
    ["HOMEPAGE", "Homepage Content", Layers],
  ] as const;

  return (
    <div className="space-y-5">
      {message && <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2"><Check className="w-4 h-4" />{message}</div>}
      {error && <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-semibold">{error}</div>}

      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {tabs.map(([id, label, Icon]) => (
            <button key={id} onClick={() => setSubTab(id)} className={`px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 ${subTab === id ? "bg-[#5A0F1B] text-white" : "text-stone-600 hover:bg-stone-100"}`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        {subTab === "PRODUCTS" && <button className={buttonClass} onClick={() => setEditingProduct({ name: "", price: 1000, stockQuantity: 10, inStock: true, occasion: "Birthday", giftCategoryId: categories[0]?.id || "" })}><Plus className="w-4 h-4" /> Add Gift Product</button>}
        {subTab === "CATEGORIES" && <button className={buttonClass} onClick={() => setEditingCategory({ name: "", description: "", imageUrl: "", active: true })}><Plus className="w-4 h-4" /> Add Gift Category</button>}
        {subTab === "COMBOS" && <button className={buttonClass} onClick={() => setEditingCombo({ name: "", comboPrice: 5000, individualValue: 6500, items: [], image: "", inStock: true, stockCount: 10, active: true })}><Plus className="w-4 h-4" /> Add Combo Pack</button>}
        {subTab === "RECOMMENDATIONS" && <button className={buttonClass} onClick={() => setEditingRec({ targetType: "PRODUCT", targetId: products[0]?.id || "", recommendedGiftIds: products.slice(0, 2).map(p => p.id), recommendedCategoryIds: [], priority: 1, active: true })}><Plus className="w-4 h-4" /> Add Recommendation Rule</button>}
        {subTab === "OFFERS" && <button className={buttonClass} onClick={() => setEditingOffer({ title: "", subtitle: "", description: "", bannerImage: "", discountPercent: 0, startDate: new Date().toISOString(), endDate: "", offerType: "GIFT", applicableProductIds: [], applicableCategoryIds: [], isFeatured: true, active: true, termsAndConditions: "" })}><Plus className="w-4 h-4" /> Add Exclusive Offer</button>}
      </div>

      {loading && <div className="py-8 text-center text-xs text-stone-500">Loading Gift & Offers...</div>}

      {!loading && subTab === "PRODUCTS" && <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-[#5A0F1B] text-white"><tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Actions</th></tr></thead><tbody className="divide-y">{products.map(p => <tr key={p.id}><td className="p-3"><div className="font-bold">{p.name}</div><div className="text-[10px] text-stone-400">{p.id}</div></td><td className="p-3">{p.giftCategoryName || p.giftCategoryId}</td><td className="p-3 font-bold">Rs. {Number(p.price || 0).toLocaleString()}</td><td className="p-3">{p.stockQuantity ?? 0}</td><td className="p-3"><button onClick={() => setEditingProduct(p)} className="p-1"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(p.id, "product")} className="p-1 text-rose-600"><Trash2 className="w-4 h-4" /></button></td></tr>)}</tbody></table></div></div>}

      {!loading && subTab === "CATEGORIES" && <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{categories.map(c => <div key={c.id} className="bg-white p-4 rounded-2xl border border-stone-200 flex justify-between gap-3"><div><h4 className="font-bold text-sm">{c.name}</h4><p className="text-xs text-stone-500">{c.description || "No description"}</p></div><div className="flex gap-1"><button onClick={() => setEditingCategory(c)}><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(c.id, "category")} className="text-rose-600"><Trash2 className="w-4 h-4" /></button></div></div>)}</div>}

      {!loading && subTab === "COMBOS" && <div className="grid md:grid-cols-2 gap-4">{combos.map(c => <div key={c.id} className="bg-white p-4 rounded-2xl border border-stone-200"><div className="flex justify-between"><div><h4 className="font-bold">{c.name}</h4><p className="text-xs text-stone-500 mt-1">{c.items?.join(", ") || "No items configured"}</p></div><div className="flex gap-1"><button onClick={() => setEditingCombo(c)}><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(c.id, "combo")} className="text-rose-600"><Trash2 className="w-4 h-4" /></button></div></div><div className="mt-3 text-xs"><b>Combo:</b> Rs. {Number(c.comboPrice || 0).toLocaleString()} <span className="text-emerald-700 ml-2">Save Rs. {Number(c.youSave || 0).toLocaleString()}</span></div></div>)}</div>}

      {!loading && subTab === "RECOMMENDATIONS" && <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden"><table className="w-full text-left text-xs"><thead className="bg-[#5A0F1B] text-white"><tr><th className="p-3">Target</th><th className="p-3">Recommended Gifts</th><th className="p-3">Priority</th><th className="p-3">Actions</th></tr></thead><tbody className="divide-y">{recommendations.map(r => <tr key={r.id}><td className="p-3"><b>{r.targetType}</b><div className="font-mono text-[10px] text-stone-500">{r.targetId}</div></td><td className="p-3">{r.recommendedGiftIds?.length ? r.recommendedGiftIds.map(id => products.find(p => p.id === id)?.name || id).join(", ") : "No gift selected"}</td><td className="p-3">{r.priority ?? 1}</td><td className="p-3"><button onClick={() => setEditingRec(r)} className="p-1"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(r.id, "recommendation")} className="p-1 text-rose-600"><Trash2 className="w-4 h-4" /></button></td></tr>)}</tbody></table></div>}

      {!loading && subTab === "OFFERS" && <div className="grid md:grid-cols-2 gap-4">{offers.map(o => <div key={o.id} className="bg-white rounded-2xl border border-stone-200 p-4 space-y-2"><div className="flex justify-between gap-3"><div><h4 className="font-bold">{o.title}</h4><p className="text-[10px] text-stone-500">{o.offerType} · {o.calculatedStatus || "SCHEDULED"}</p></div><div className="flex gap-1"><button onClick={() => setEditingOffer(o)}><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(o.id, "offer")} className="text-rose-600"><Trash2 className="w-4 h-4" /></button></div></div><p className="text-xs text-stone-600">{o.description || "No description"}</p><div className="text-xs font-semibold">{o.discountPercent ? `${o.discountPercent}% discount` : o.specialPrice ? `Special price Rs. ${o.specialPrice.toLocaleString()}` : "Promotion"}</div><div className="text-[10px] text-stone-500">Products: {o.applicableProductIds?.length ? o.applicableProductIds.map(id => products.find(p => p.id === id)?.name || id).join(", ") : "All eligible products"}</div><div className="text-[10px] text-stone-500">Categories: {o.applicableCategoryIds?.length ? o.applicableCategoryIds.map(id => categories.find(c => c.id === id)?.name || id).join(", ") : "All categories"}</div></div>)}</div>}

      {!loading && subTab === "HOMEPAGE" && <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3"><div><h3 className="font-cinzel text-lg font-bold text-[#5A0F1B]">Homepage Content Sections Visibility & Ordering</h3><p className="text-xs text-stone-500 mt-1">Enable or disable promotional sections and move them up or down to control their priority.</p></div>{homepageSections.map((s, i) => <div key={s.id} className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-stone-200"><button onClick={() => toggleHomepage(i)} className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.active ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-400"}`}>{s.active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}</button><div className="flex-1 min-w-[200px]"><div className="font-bold text-sm">{s.title}</div><div className="text-[10px] text-stone-500">{s.key} · Priority {i + 1}</div><div className="text-xs text-stone-500">{s.subtitle}</div></div><button disabled={i === 0} onClick={() => moveHomepage(i, -1)} className="px-2 py-1 border rounded disabled:opacity-30">↑</button><button disabled={i === homepageSections.length - 1} onClick={() => moveHomepage(i, 1)} className="px-2 py-1 border rounded disabled:opacity-30">↓</button></div>)}</div>}

      {editingProduct && <Modal title={editingProduct.id ? "Edit Gift Product" : "Create Gift Product"} onClose={() => setEditingProduct(null)} onSave={() => save(() => editingProduct.id ? api.admin.updateGiftProduct(editingProduct.id, editingProduct) : api.admin.createGiftProduct(editingProduct), "Gift product saved successfully.").then(() => setEditingProduct(null))}>
        <Field label="Name"><input className={inputClass} value={editingProduct.name || ""} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3"><Field label="Price"><input type="number" className={inputClass} value={editingProduct.price ?? 0} onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} /></Field><Field label="Stock"><input type="number" className={inputClass} value={editingProduct.stockQuantity ?? 0} onChange={e => setEditingProduct({ ...editingProduct, stockQuantity: Number(e.target.value), inStock: Number(e.target.value) > 0 })} /></Field></div>
        <Field label="Gift Category"><select className={inputClass} value={editingProduct.giftCategoryId || ""} onChange={e => setEditingProduct({ ...editingProduct, giftCategoryId: e.target.value })}>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
        <Field label="Occasion"><input className={inputClass} value={editingProduct.occasion || ""} onChange={e => setEditingProduct({ ...editingProduct, occasion: e.target.value })} /></Field>
        <Field label="Main Image URL"><input className={inputClass} placeholder="https://.../image.jpg" value={editingProduct.mainImage || ""} onChange={e => setEditingProduct({ ...editingProduct, mainImage: e.target.value })} /><p className="text-[10px] text-stone-400 mt-1">Use a direct image URL, not a product-page or Google redirect URL.</p></Field>
        <Field label="Description"><textarea className={inputClass} rows={3} value={editingProduct.description || ""} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} /></Field>
      </Modal>}

      {editingCategory && <Modal title={editingCategory.id ? "Edit Gift Category" : "Create Gift Category"} onClose={() => setEditingCategory(null)} onSave={() => save(() => editingCategory.id ? api.admin.updateGiftCategory(editingCategory.id, editingCategory) : api.admin.createGiftCategory(editingCategory), "Gift category saved successfully.").then(() => setEditingCategory(null))}><Field label="Category Name"><input className={inputClass} value={editingCategory.name || ""} onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })} /></Field><Field label="Image URL"><input className={inputClass} value={editingCategory.imageUrl || ""} onChange={e => setEditingCategory({ ...editingCategory, imageUrl: e.target.value })} /></Field><Field label="Description"><textarea className={inputClass} rows={3} value={editingCategory.description || ""} onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })} /></Field></Modal>}

      {editingCombo && <Modal title={editingCombo.id ? "Edit Combo Pack" : "Create Combo Pack"} onClose={() => setEditingCombo(null)} onSave={() => save(() => editingCombo.id ? api.admin.updateGiftCombo(editingCombo.id, editingCombo) : api.admin.createGiftCombo(editingCombo), "Combo pack saved successfully.").then(() => setEditingCombo(null))}><Field label="Combo Name"><input className={inputClass} value={editingCombo.name || ""} onChange={e => setEditingCombo({ ...editingCombo, name: e.target.value })} /></Field><div className="grid grid-cols-2 gap-3"><Field label="Combo Price"><input type="number" className={inputClass} value={editingCombo.comboPrice ?? 0} onChange={e => setEditingCombo({ ...editingCombo, comboPrice: Number(e.target.value) })} /></Field><Field label="Individual Value"><input type="number" className={inputClass} value={editingCombo.individualValue ?? 0} onChange={e => setEditingCombo({ ...editingCombo, individualValue: Number(e.target.value) })} /></Field></div><Field label="Image URL"><input className={inputClass} value={editingCombo.image || ""} onChange={e => setEditingCombo({ ...editingCombo, image: e.target.value })} /></Field><Field label="Included Items"><input className={inputClass} placeholder="Flowers, Chocolate, Card" value={editingCombo.items?.join(", ") || ""} onChange={e => setEditingCombo({ ...editingCombo, items: e.target.value.split(",").map(x => x.trim()).filter(Boolean) })} /></Field><div className="grid grid-cols-2 gap-3"><Field label="Stock Count"><input type="number" className={inputClass} value={editingCombo.stockCount ?? 0} onChange={e => setEditingCombo({ ...editingCombo, stockCount: Number(e.target.value), inStock: Number(e.target.value) > 0 })} /></Field><Field label="Occasion"><input className={inputClass} value={editingCombo.occasion || ""} onChange={e => setEditingCombo({ ...editingCombo, occasion: e.target.value })} /></Field></div></Modal>}

      {editingRec && <Modal title={editingRec.id ? "Edit Recommendation Rule" : "Create Recommendation Rule"} onClose={() => setEditingRec(null)} onSave={() => { if (!editingRec.targetId) { setError("Select a target first."); return Promise.resolve(); } return save(() => editingRec.id ? api.admin.updateGiftRecommendation(editingRec.id, editingRec) : api.admin.createGiftRecommendation(editingRec), "Recommendation rule saved successfully.").then(() => setEditingRec(null)); }}>
        <Field label="When this target is viewed"><select className={inputClass} value={editingRec.targetType || "PRODUCT"} onChange={e => setEditingRec({ ...editingRec, targetType: e.target.value as any, targetId: "" })}><option value="PRODUCT">A Gift Product</option><option value="CATEGORY">A Gift Category</option></select></Field>
        <Field label="Target"><select className={inputClass} value={editingRec.targetId || ""} onChange={e => setEditingRec({ ...editingRec, targetId: e.target.value })}>{editingRec.targetType === "CATEGORY" ? categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>) : products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
        <Field label="Recommended Gifts"><select multiple className={`${inputClass} min-h-28`} value={editingRec.recommendedGiftIds || []} onChange={e => setEditingRec({ ...editingRec, recommendedGiftIds: Array.from(e.target.selectedOptions).map(o => o.value) })}>{products.filter(p => p.id !== editingRec.targetId).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><p className="text-[10px] text-stone-400 mt-1">Hold Ctrl/Cmd to select multiple gifts.</p></Field>
        <Field label="Priority"><input type="number" min={1} className={inputClass} value={editingRec.priority ?? 1} onChange={e => setEditingRec({ ...editingRec, priority: Number(e.target.value) })} /></Field>
      </Modal>}

      {editingOffer && <Modal title={editingOffer.id ? "Edit Exclusive Offer" : "Create Exclusive Offer"} onClose={() => setEditingOffer(null)} onSave={() => save(() => editingOffer.id ? api.admin.updateOffer(editingOffer.id, editingOffer) : api.admin.createOffer(editingOffer), "Offer saved successfully.").then(() => setEditingOffer(null))}>
        <Field label="Offer Title"><input className={inputClass} value={editingOffer.title || ""} onChange={e => setEditingOffer({ ...editingOffer, title: e.target.value })} /></Field>
        <Field label="Description"><textarea className={inputClass} rows={2} value={editingOffer.description || ""} onChange={e => setEditingOffer({ ...editingOffer, description: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3"><Field label="Offer Type"><select className={inputClass} value={editingOffer.offerType || "GIFT"} onChange={e => setEditingOffer({ ...editingOffer, offerType: e.target.value as any })}>{["TODAY","JEWELLERY","GIFT","COUPLE","WEDDING","BIRTHDAY","ANNIVERSARY","SEASONAL","PROMOTION"].map(x => <option key={x}>{x}</option>)}</select></Field><Field label="Discount %"><input type="number" min={0} max={100} className={inputClass} value={editingOffer.discountPercent ?? 0} onChange={e => setEditingOffer({ ...editingOffer, discountPercent: Number(e.target.value) })} /></Field></div>
        <div className="grid grid-cols-2 gap-3"><Field label="Start Date"><input type="datetime-local" className={inputClass} value={editingOffer.startDate ? editingOffer.startDate.slice(0, 16) : ""} onChange={e => setEditingOffer({ ...editingOffer, startDate: new Date(e.target.value).toISOString() })} /></Field><Field label="End Date"><input type="datetime-local" className={inputClass} value={editingOffer.endDate ? editingOffer.endDate.slice(0, 16) : ""} onChange={e => setEditingOffer({ ...editingOffer, endDate: e.target.value ? new Date(e.target.value).toISOString() : "" })} /></Field></div>
        <Field label="Banner Image URL"><input className={inputClass} placeholder="https://.../banner.jpg" value={editingOffer.bannerImage || ""} onChange={e => setEditingOffer({ ...editingOffer, bannerImage: e.target.value })} /></Field>
        <Field label="Apply this offer to Gift Products"><select multiple className={`${inputClass} min-h-28`} value={editingOffer.applicableProductIds || []} onChange={e => setEditingOffer({ ...editingOffer, applicableProductIds: Array.from(e.target.selectedOptions).map(o => o.value) })}>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><p className="text-[10px] text-stone-400 mt-1">Select products. Leave empty if the offer should cover all products of the selected category/type.</p></Field>
        <Field label="OR apply to Gift Categories"><select multiple className={`${inputClass} min-h-24`} value={editingOffer.applicableCategoryIds || []} onChange={e => setEditingOffer({ ...editingOffer, applicableCategoryIds: Array.from(e.target.selectedOptions).map(o => o.value) })}>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
        <Field label="Terms & Conditions"><textarea className={inputClass} rows={2} value={editingOffer.termsAndConditions || ""} onChange={e => setEditingOffer({ ...editingOffer, termsAndConditions: e.target.value })} /></Field>
      </Modal>}
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => <div className="space-y-1"><label className="block font-semibold text-xs text-stone-700">{label}</label>{children}</div>;

const Modal: React.FC<{ title: string; onClose: () => void; onSave: () => Promise<any>; children: React.ReactNode }> = ({ title, onClose, onSave, children }) => {
  const [saving, setSaving] = useState(false);
  const handleSave = async () => { setSaving(true); try { await onSave(); } finally { setSaving(false); } };
  return <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl"><div className="flex justify-between items-center border-b pb-3"><h3 className="font-cinzel font-bold text-base text-[#5A0F1B]">{title}</h3><button onClick={onClose}><X className="w-5 h-5" /></button></div><div className="space-y-3">{children}</div><div className="flex justify-end gap-2 pt-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg text-xs">Cancel</button><button disabled={saving} onClick={handleSave} className="px-4 py-2 bg-[#5A0F1B] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 disabled:opacity-50"><Save className="w-4 h-4" />{saving ? "Saving..." : "Save"}</button></div></div></div>;
};