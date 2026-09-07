import React from "react";
import { Hero } from "../components/home/Hero";
import { LiveTrafficBanner } from "../components/home/LiveTrafficBanner";
import { GoldRatesSection } from "../components/home/GoldRatesSection";
import { FeaturedCollections } from "../components/home/FeaturedCollections";
import { FeaturedProducts } from "../components/home/FeaturedProducts";
import { HomeGiftsAndOffers } from "../components/home/HomeGiftsAndOffers";
import { BespokeAppointmentSection } from "../components/home/BespokeAppointmentSection";
import { RewardsPromoSection } from "../components/home/RewardsPromoSection";
import { Product } from "../types";

interface HomePageProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onSelectProduct: (product: Product) => void;
  onOpenLuckyWheel: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProduct,
  onOpenLuckyWheel,
}) => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* 1. Royal Hero Showcase */}
      <Hero
        onExploreCollections={() => onNavigate("shop")}
        onBookAppointment={() => onNavigate("appointments")}
        onOpenLuckyWheel={onOpenLuckyWheel}
      />

      {/* 2. Real-Time Store Traffic & Wait Times */}
      <LiveTrafficBanner onBookAppointment={() => onNavigate("appointments")} />

      {/* 3. Daily Gold Rates */}
      <GoldRatesSection
        onViewGoldRates={() => onNavigate("gold-rates")}
      />

      {/* 4. Heritage Collections Showcase */}
      <FeaturedCollections
        onSelectCategory={(categorySlug) => onNavigate("shop", { category: categorySlug })}
        onViewAll={() => onNavigate("shop")}
      />

      {/* 5. Mastercrafted Featured Products */}
      <FeaturedProducts
        onSelectProduct={onSelectProduct}
        onViewAll={() => onNavigate("shop")}
      />

      {/* 6. Dynamic Gifts & Exclusive Offers */}
      <HomeGiftsAndOffers onNavigate={onNavigate} />

      {/* 7. VIP Salon & Private Consultation Booking */}
      <BespokeAppointmentSection onBookAppointment={() => onNavigate("appointments")} />

      {/* 8. Loyalty Privileges & Wheel of Fortune Promo */}
      <RewardsPromoSection
        onOpenLuckyWheel={onOpenLuckyWheel}
        onExploreRewards={() => onNavigate("rewards")}
      />
    </div>
  );
};
