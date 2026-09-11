import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Gift, Tag, Sparkles, Clock, ArrowRight, Plus, Check } from "lucide-react";
import { Offer, GiftProduct, HomepageSection } from "../../types";
import { api } from "../../services/api";
import { useCart } from "../../context/CartContext";

interface HomeGiftsAndOffersProps { onNavigate: (view: string, params?: Record<string, string>) => void; }

const fallbackSections: HomepageSection[] = [
  { id: "home-today", key: "todays_offers", title: "Today's Offers", subtitle: "Limited-time promotions", active: true, displayOrder: 1 },
  { id: "home-gifts", key: "gift_picks", title: "Gift Picks", subtitle: "Curated celebration gifts", active: true, displayOrder: 2 },
  { id: "home-wedding", key: "wedding_specials", title: "Wedding Specials", subtitle: "Special offers for weddings", active: true, displayOrder: 3 },
  { id: "home-birthday", key: "birthday_specials", title: "Birthday Specials", subtitle: "Birthday gift promotions", active: true, displayOrder: 4 },
  { id: "home-couple", key: "couple_collection", title: "Couple Collection", subtitle: "Gifts for two", active: true, displayOrder: 5 },
  { id: "home-anniversary", key: "anniversary_specials", title: "Anniversary Specials", subtitle: "Celebrate together", active: true, displayOrder: 6 },
  { id: "home-limited", key: "limited_time_offers", title: "Limited Time Offers", subtitle: "Offers ending soon", active: true, displayOrder: 7 },
];

export const HomeGiftsAndOffers: React.FC<HomeGiftsAndOffersProps> = ({ onNavigate }) => {
  const { addGiftToCart } = useCart();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [gifts, setGifts] = useState<GiftProduct[]>([]);
  const [sections, setSections] = useState<HomepageSection[]>(fallbackSections);
  const [addedGiftIds, setAddedGiftIds] = useState<string[]>([]);
  const [nowTime, setNowTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNowTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    Promise.all([api.homepage.getOffers(), api.homepage.getGifts(), api.homepage.getSections()])
      .then(([offersRes, giftsRes, sectionsRes]) => {
        if (!mounted) return;
        setOffers(offersRes || []);
        setGifts(giftsRes || []);
        if (sectionsRes?.length) setSections([...sectionsRes].sort((a, b) => a.displayOrder - b.displayOrder));
      })
      .catch((err) => console.error("Failed to load homepage gifts/offers", err));
    return () => { mounted = false; };
  }, []);

  const visibleSections = useMemo(() => sections.filter(s => s.active).sort((a, b) => a.displayOrder - b.displayOrder), [sections]);
  const hasSection = (key: HomepageSection["key"]) => visibleSections.some(s => s.key === key);

  const selectedOffers = useMemo(() => {
    if (hasSection("limited_time_offers")) {
      const limited = offers.filter(o => o.endDate && new Date(o.endDate).getTime() > nowTime);
      if (limited.length) return limited;
    }
    return offers;
  }, [offers, visibleSections, nowTime]);

  const selectedGifts = useMemo(() => gifts, [gifts]);

  if (!selectedOffers.length && !selectedGifts.length) return null;

  const handleAddGift = (gift: GiftProduct) => { addGiftToCart(gift, 1); setAddedGiftIds(prev => [...prev, gift.id]); };
  const formatCountdown = (endDate?: string) => {
    if (!endDate) return null;
    const diff = new Date(endDate).getTime() - nowTime;
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff / 3600000) % 24);
    const minutes = Math.floor((diff / 60000) % 60);
    return `${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
  };

  const renderOffers = () => !hasSection("todays_offers") && !hasSection("limited_time_offers") ? null : (
    <section className="space-y-6">
      <div className="flex items-end justify-between border-b border-[#E8E1D5] pb-4"><div><span className="inline-flex items-center gap-1 text-xs font-bold text-[#5A0F1B] uppercase tracking-widest bg-[#5A0F1B]/10 px-3 py-1 rounded-full mb-1"><Tag className="w-3.5 h-3.5 text-[#D4AF37]" /> Exclusive Savings</span><h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#5A0F1B]">Today's Offers &amp; Promotions</h2></div><button onClick={() => onNavigate("offers")} className="text-xs font-bold text-[#B54E0E] flex items-center gap-1">View All Offers <ArrowRight className="w-4 h-4" /></button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{selectedOffers.slice(0, 2).map(offer => <div key={offer.id} className="bg-white rounded-2xl border border-[#E8E1D5] overflow-hidden shadow-xs"><div className="relative h-48 overflow-hidden bg-stone-900"><img src={offer.bannerImage} alt={offer.title} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" /><div className="absolute bottom-3 left-4 right-4 text-white"><span className="text-[10px] text-[#F3E5AB] font-bold uppercase">{offer.offerType} PROMOTION</span><h3 className="font-cinzel text-lg font-bold">{offer.title}</h3></div></div><div className="p-5 space-y-3"><p className="text-xs text-stone-600 line-clamp-2">{offer.description}</p>{formatCountdown(offer.endDate) && <div className="flex items-center gap-2 text-xs font-semibold text-[#B54E0E] bg-[#FAF3E8] p-2 rounded-lg"><Clock className="w-4 h-4" />Ends in: {formatCountdown(offer.endDate)}</div>}<button onClick={() => onNavigate("offers")} className="w-full py-2 bg-[#5A0F1B] text-white text-xs font-bold rounded-xl">Claim Offer Now</button></div></div>)}</div>
    </section>
  );

  const renderGifts = () => !hasSection("gift_picks") ? null : (
    <section className="space-y-6"><div className="flex items-end justify-between border-b border-[#E8E1D5] pb-4"><div><span className="inline-flex items-center gap-1 text-xs font-bold text-[#5A0F1B] uppercase tracking-widest bg-[#5A0F1B]/10 px-3 py-1 rounded-full mb-1"><Gift className="w-3.5 h-3.5 text-[#D4AF37]" /> Celebrate Life's Moments</span><h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#5A0F1B]">Gift &amp; Celebration Picks</h2></div><button onClick={() => onNavigate("gift-celebration")} className="text-xs font-bold text-[#B54E0E] flex items-center gap-1">View All Gifts <ArrowRight className="w-4 h-4" /></button></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{selectedGifts.slice(0, 4).map(gift => { const added = addedGiftIds.includes(gift.id); return <div key={gift.id} className="bg-white rounded-2xl border border-[#E8E1D5] overflow-hidden shadow-xs"><div onClick={() => onNavigate("gift-celebration")} className="relative h-48 overflow-hidden bg-stone-100 cursor-pointer"><img src={gift.mainImage} alt={gift.name} className="w-full h-full object-cover" /></div><div className="p-4 space-y-2"><span className="text-[10px] font-semibold text-[#5A0F1B]">{gift.giftCategoryName}</span><h3 className="font-cinzel text-xs font-bold">{gift.name}</h3><p className="text-xs text-stone-500 line-clamp-2">{gift.description}</p><span className="font-cinzel font-bold text-sm text-[#5A0F1B]">Rs. {Number(gift.price || 0).toLocaleString()}</span><button onClick={() => handleAddGift(gift)} disabled={added} className={`w-full py-2 rounded-lg text-xs font-semibold ${added ? "bg-emerald-600 text-white" : "bg-[#5A0F1B] text-white"}`}>{added ? <><Check className="inline w-3.5 h-3.5" /> Added to Cart</> : <><Plus className="inline w-3.5 h-3.5" /> Add Gift</>}</button></div></div>; })}</div></section>
  );

  return <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{visibleSections.map(section => <React.Fragment key={section.id}>{(section.key === "todays_offers" || section.key === "limited_time_offers") && renderOffers()}{section.key === "gift_picks" && renderGifts()}{["wedding_specials","birthday_specials","couple_collection","anniversary_specials"].includes(section.key) && renderOffers()}</React.Fragment>)}</div>;
};