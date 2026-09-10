import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { TrafficProvider } from "./context/TrafficContext";

import { Navbar } from "./components/layout/Navbar";
import { AdminHeader } from "./components/layout/AdminHeader";
import { Footer } from "./components/layout/Footer";
import { Breadcrumbs, BreadcrumbItem } from "./components/layout/Breadcrumbs";
import { FloatingNavHub } from "./components/layout/FloatingNavHub";
import { MobileBottomNav } from "./components/layout/MobileBottomNav";
import { CartDrawer } from "./components/cart/CartDrawer";
import { SmartGiftPopup } from "./components/cart/SmartGiftPopup";
import { LuckyWheelModal } from "./components/rewards/LuckyWheelModal";

import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { RewardsPage } from "./pages/RewardsPage";
import { WishlistPage } from "./pages/WishlistPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { AccountPage } from "./pages/AccountPage";
import { AboutPage } from "./pages/AboutPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminPage } from "./pages/AdminPage";
import { GoldRatesPage } from "./pages/GoldRatesPage";
import { GiftCelebrationPage } from "./pages/GiftCelebrationPage";
import { OffersPage } from "./pages/OffersPage";

import { Product, Order } from "./types";

interface NavigationState {
  view: string;
  params?: Record<string, string>;
  selectedProduct?: Product | null;
}

const MainLayout: React.FC = () => {
  const { isAdmin, isLoading: authLoading } = useAuth();

  const getInitialView = (): string => {
    const path = window.location.pathname.replace(/^\//, "").toLowerCase();
    if (path === "gift-celebration" || path === "gifts" || path === "celebration") return "gift-celebration";
    if (path === "offers" || path === "promotions") return "offers";
    if (path === "gold-rates" || path === "gold-rate" || path === "goldrates") return "gold-rates";
    if (path === "shop" || path === "collections") return "shop";
    if (path === "appointments" || path === "book") return "appointments";
    if (path === "rewards") return "rewards";
    if (path === "about") return "about";
    if (path === "admin") return "admin";
    if (path === "account") return "account";
    if (path === "wishlist") return "wishlist";
    if (path === "checkout") return "checkout";
    return "home";
  };

  const [navState, setNavState] = useState<NavigationState>({
    view: getInitialView(),
    params: {},
    selectedProduct: null,
  });

  const [isLuckyWheelOpen, setIsLuckyWheelOpen] = useState(false);
  const [redeemedPointsForCheckout, setRedeemedPointsForCheckout] = useState<number>(0);

  // Sync browser history state
  const handleNavigate = (view: string, params: Record<string, string> = {}) => {
    try {
      const url = view === "home" ? "/" : `/${view}`;
      window.history.pushState({ view, params }, "", url);
    } catch {
      // ignore
    }
    setNavState({
      view,
      params,
      selectedProduct: null,
    });
  };

  // Listen to popstate for back/forward browser buttons
  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname.replace(/^\//, "").toLowerCase();
      let matchedView = "home";
      if (path === "gift-celebration" || path === "gifts") matchedView = "gift-celebration";
      else if (path === "offers") matchedView = "offers";
      else if (path === "gold-rates") matchedView = "gold-rates";
      else matchedView = path || "home";

      setNavState({
        view: matchedView,
        params: {},
        selectedProduct: null,
      });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navState.view, navState.selectedProduct?.id]);

  // Route guard: block non-admins from ever reaching the admin view,
  // including via direct URL entry (e.g. typing /admin in the address bar).
  useEffect(() => {
    if (navState.view === "admin" && !authLoading && !isAdmin) {
      handleNavigate("home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navState.view, authLoading, isAdmin]);

  const handleSelectProduct = (product: Product) => {
    setNavState({
      view: "product-detail",
      params: { productId: product.id },
      selectedProduct: product,
    });
  };

  const handleCheckout = (redeemedPoints: number) => {
    setRedeemedPointsForCheckout(redeemedPoints);
    setNavState({
      view: "checkout",
      params: {},
      selectedProduct: null,
    });
  };

  const handleOrderCompleted = (order: Order) => {
    setNavState({
      view: "account",
      params: { tab: "orders" },
      selectedProduct: null,
    });
  };

  // Derive breadcrumb trail
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    switch (navState.view) {
      case "gift-celebration":
        return [{ label: "Gift & Celebration Pack" }];
      case "offers":
        return [{ label: "Exclusive Offers & Promotions" }];
      case "gold-rates":
        return [{ label: "Gold Rates & History" }];
      case "shop":
        return navState.params?.category
            ? [{ label: "Collections", view: "shop" }, { label: navState.params.category }]
            : [{ label: "Boutique Collections" }];
      case "product-detail":
        return [
          { label: "Collections", view: "shop" },
          { label: navState.selectedProduct?.name || "Masterpiece Detail" },
        ];
      case "appointments":
        return [{ label: "VIP Consultations" }];
      case "rewards":
        return [{ label: "Royal Tier Rewards & Lucky Wheel" }];
      case "wishlist":
        return [{ label: "Saved Wishlist" }];
      case "checkout":
        return [{ label: "Collections", view: "shop" }, { label: "Royal Checkout" }];
      case "account":
        return [{ label: "Patron Account" }];
      case "about":
        return [{ label: "Heritage & Craftsmanship" }];
      case "admin":
        return [{ label: "Executive Admin Portal" }];
      case "login":
        return [{ label: "Patron Sign In" }];
      default:
        return [];
    }
  };

  const breadcrumbItems = getBreadcrumbs();

  return (
      <div
          className={`min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 font-sans antialiased selection:bg-[#B54E0E] selection:text-white ${
              isAdmin ? "" : "pb-14 md:pb-0"
          }`}
      >
        {/* 1. Global Navigation — admins get a minimal console header instead of the storefront nav */}
        {isAdmin ? (
            <AdminHeader onNavigate={handleNavigate} />
        ) : (
            <Navbar
                currentView={navState.view}
                onNavigate={handleNavigate}
                onOpenLuckyWheel={() => setIsLuckyWheelOpen(true)}
            />
        )}

        {/* Main Content Area (padding-top accounts for the fixed storefront navbar; the admin header is static) */}
        <main className={`flex-1 ${isAdmin ? "" : "pt-24 sm:pt-28"}`}>
          {/* Contextual Breadcrumbs for Sub-pages — storefront only */}
          {!isAdmin && navState.view !== "home" && breadcrumbItems.length > 0 && (
              <div className="border-b border-[#E8E1D5]/60 bg-white/70 backdrop-blur-xs">
                <Breadcrumbs items={breadcrumbItems} onNavigate={handleNavigate} />
              </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
                key={navState.view + (navState.selectedProduct?.id || "")}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {navState.view === "home" && (
                  <HomePage
                      onNavigate={handleNavigate}
                      onSelectProduct={handleSelectProduct}
                      onOpenLuckyWheel={() => setIsLuckyWheelOpen(true)}
                  />
              )}

              {navState.view === "gift-celebration" && <GiftCelebrationPage />}

              {navState.view === "offers" && (
                  <OffersPage
                      onNavigateToShop={() => handleNavigate("shop")}
                      onNavigateToGifts={() => handleNavigate("gift-celebration")}
                  />
              )}

              {navState.view === "shop" && (
                  <ShopPage
                      initialCategory={navState.params?.category}
                      initialSearch={navState.params?.search}
                      onSelectProduct={handleSelectProduct}
                  />
              )}

              {navState.view === "product-detail" && (
                  <ProductDetailPage
                      productId={navState.params?.productId || navState.selectedProduct?.id || ""}
                      onBack={() => handleNavigate("shop")}
                      onSelectProduct={handleSelectProduct}
                  />
              )}

              {navState.view === "appointments" && <AppointmentsPage />}

              {navState.view === "rewards" && (
                  <RewardsPage
                      onOpenLuckyWheel={() => setIsLuckyWheelOpen(true)}
                      onNavigateToShop={() => handleNavigate("shop")}
                  />
              )}

              {navState.view === "wishlist" && (
                  <WishlistPage
                      onSelectProduct={handleSelectProduct}
                      onNavigateToShop={() => handleNavigate("shop")}
                  />
              )}

              {navState.view === "checkout" && (
                  <CheckoutPage
                      initialRedeemedPoints={redeemedPointsForCheckout}
                      onOrderCompleted={handleOrderCompleted}
                      onNavigateToShop={() => handleNavigate("shop")}
                  />
              )}

              {navState.view === "account" && (
                  <AccountPage
                      initialTab={navState.params?.tab || "profile"}
                      onNavigateToRewards={() => handleNavigate("rewards")}
                      onNavigateToAppointments={() => handleNavigate("appointments")}
                      onNavigateToShop={() => handleNavigate("shop")}
                  />
              )}

              {navState.view === "gold-rates" && (
                  <GoldRatesPage
                      onNavigateToShop={() => handleNavigate("shop")}
                      onNavigateToAppointments={() => handleNavigate("appointments")}
                  />
              )}

              {navState.view === "about" && <AboutPage />}

              {navState.view === "login" && (
                  <LoginPage
                      onSuccess={(destination) =>
                          handleNavigate(destination || navState.params?.redirect || "account")
                      }
                  />
              )}

              {navState.view === "admin" && !authLoading && isAdmin && (
                  <AdminPage
                      onNavigateToShop={() => handleNavigate("shop")}
                  />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* 2. Global Floating Navigation & Action Hub — storefront only, no admin equivalent needed */}
        {!isAdmin && (
            <FloatingNavHub
                currentView={navState.view}
                onNavigate={handleNavigate}
                onOpenLuckyWheel={() => setIsLuckyWheelOpen(true)}
            />
        )}

        {/* 3. Mobile Bottom Sticky Navigation — storefront only */}
        {!isAdmin && (
            <MobileBottomNav
                currentView={navState.view}
                onNavigate={handleNavigate}
            />
        )}

        {/* 4-6. Customer-only shopping overlays: cart, gift popup, lucky wheel — hidden for admins */}
        {!isAdmin && (
            <>
              <CartDrawer
                  onCheckout={handleCheckout}
                  onNavigateToShop={() => handleNavigate("shop")}
              />

              <SmartGiftPopup onNavigateToGifts={() => handleNavigate("gift-celebration")} />

              <LuckyWheelModal
                  isOpen={isLuckyWheelOpen}
                  onClose={() => setIsLuckyWheelOpen(false)}
                  onNavigateToLogin={() => {
                    setIsLuckyWheelOpen(false);
                    handleNavigate("login");
                  }}
              />
            </>
        )}

        {/* 7. Global Royal Boutique Footer — entirely customer-facing (newsletter, collections,
          wishlist, lucky wheel, order tracking), so it's skipped for the admin console */}
        {!isAdmin && (
            <Footer
                onNavigate={handleNavigate}
                onOpenLuckyWheel={() => setIsLuckyWheelOpen(true)}
            />
        )}
      </div>
  );
};

export default function App() {
  return (
      <AuthProvider>
        <TrafficProvider>
          <CartProvider>
            <WishlistProvider>
              <MainLayout />
            </WishlistProvider>
          </CartProvider>
        </TrafficProvider>
      </AuthProvider>
  );
}