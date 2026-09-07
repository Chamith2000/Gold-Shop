import React, { useState, useEffect } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Calendar,
  Award,
  ShieldCheck,
  LogOut,
  Sliders,
  ExternalLink,
  Flame,
  Coins,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "./Logo";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useTraffic } from "../../context/TrafficContext";
import { useCategories } from "../../hooks/useCategories";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onOpenLuckyWheel?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenLuckyWheel,
}) => {
  const { user, rewardProfile, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { activity } = useTraffic();
  const { categories, isLoading: categoriesLoading } = useCategories();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isMobileCollectionsOpen, setIsMobileCollectionsOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate("shop", { search: searchQuery.trim() });
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const trafficColor =
    activity?.trafficLevel === "LOW"
      ? "bg-emerald-500"
      : activity?.trafficLevel === "MODERATE"
      ? "bg-amber-500"
      : "bg-rose-500";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FAF8F5]/95 backdrop-blur-md shadow-md py-2.5 border-b border-[#D4AF37]/30"
          : "bg-[#FAF8F5] py-4 border-b border-[#E8E1D5]"
      }`}
    >
      {/* Top Thin Announcement & Live Store Traffic Indicator */}
      <div className="bg-[#5A0F1B] text-white text-[11px] sm:text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[#F3E5AB] font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Government Certified 22K &amp; 24K Pure Gold Hallmark
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-sans">
            {/* Live Store Traffic Ticker */}
            <div
              onClick={() => onNavigate("appointments")}
              className="cursor-pointer inline-flex items-center gap-1.5 bg-[#420A13] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-colors"
              title="Live Store Traffic"
            >
              <span className={`w-2 h-2 rounded-full ${trafficColor} animate-pulse`} />
              <span className="font-semibold text-stone-200">Store Traffic:</span>
              <span className="text-[#F3E5AB] font-medium">
                {activity?.trafficLevel || "LOW"} ({activity?.estimatedWaitMinutes || 5} min wait)
              </span>
            </div>

            <button
              onClick={() => onNavigate("appointments")}
              className="hidden md:inline-flex items-center gap-1 text-[#F3E5AB] hover:text-white font-medium transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              Book Appointment
            </button>

            {onOpenLuckyWheel && (
              <button
                onClick={onOpenLuckyWheel}
                className="inline-flex items-center gap-1 bg-gradient-to-r from-[#B54E0E] to-[#D4AF37] text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider hover:opacity-90 transition-opacity"
              >
                <Flame className="w-3 h-3 animate-bounce" />
                Lucky Spin
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3 w-full">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate("home")}
            className="cursor-pointer flex-shrink-0 flex items-center transition-transform duration-200 active:scale-95"
            id="nav-brand-logo"
          >
            <Logo size={isScrolled ? "sm" : "md"} theme="dark" />
          </div>

          {/* Desktop Navigation Links (Centered, visible on xl screens and above) */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-1.5 flex-1 justify-center max-w-fit mx-auto">
            <button
              onClick={() => onNavigate("home")}
              className={`px-2.5 xl:px-2.5 2xl:px-3 py-1.5 text-xs 2xl:text-sm font-semibold tracking-wider uppercase transition-colors rounded-md whitespace-nowrap ${
                currentView === "home"
                  ? "text-[#5A0F1B] border-b-2 border-[#5A0F1B]"
                  : "text-stone-700 hover:text-[#5A0F1B] hover:bg-stone-100/60"
              }`}
              id="nav-link-home"
            >
              Home
            </button>

            {/* Dynamic Collections Mega-Menu Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setIsCollectionsOpen(true)}
              onMouseLeave={() => setIsCollectionsOpen(false)}
            >
              <button
                onClick={() => onNavigate("shop")}
                className={`px-2.5 xl:px-2.5 2xl:px-3 py-1.5 text-xs 2xl:text-sm font-semibold tracking-wider uppercase transition-colors rounded-md inline-flex items-center gap-1 whitespace-nowrap ${
                  currentView === "shop" || isCollectionsOpen
                    ? "text-[#5A0F1B]"
                    : "text-stone-700 hover:text-[#5A0F1B] hover:bg-stone-100/60"
                }`}
                id="nav-link-collections"
              >
                Collections
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isCollectionsOpen ? "rotate-180 text-[#B54E0E]" : ""
                  }`}
                />
              </button>

              {/* Collections Mega Dropdown */}
              {isCollectionsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[90vw] max-w-[720px] bg-white border border-[#E8E1D5] rounded-xl shadow-2xl p-6 pt-5 grid grid-cols-3 gap-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="col-span-3 pb-3 mb-1 border-b border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="font-cinzel text-sm font-bold text-[#5A0F1B] uppercase tracking-wider">
                        Mastercrafted Collections
                      </span>
                      <p className="text-xs text-stone-500 font-sans">
                        Dynamic royal catalog certified with 100% assay guarantee
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCollectionsOpen(false);
                        onNavigate("shop");
                      }}
                      className="text-xs font-semibold text-[#B54E0E] hover:text-[#5A0F1B] inline-flex items-center gap-1 group"
                    >
                      Explore All Collections
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </button>
                  </div>

                  {categoriesLoading ? (
                    <div className="col-span-3 py-8 text-center text-xs text-stone-400">
                      Loading luxury categories...
                    </div>
                  ) : (
                    categories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setIsCollectionsOpen(false);
                          onNavigate("shop", { category: cat.slug });
                        }}
                        className="group flex gap-3 p-2.5 rounded-lg hover:bg-stone-50 transition-all cursor-pointer border border-transparent hover:border-[#D4AF37]/30"
                      >
                        <div className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-200">
                          <img
                            src={cat.imageUrl}
                            alt={cat.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="font-cinzel text-xs font-bold text-stone-900 group-hover:text-[#5A0F1B] transition-colors leading-snug">
                            {cat.name}
                          </span>
                          <span className="text-[11px] text-stone-500 line-clamp-1 font-sans mt-0.5">
                            {cat.description || "Fine Gold & Gems"}
                          </span>
                          <span className="text-[10px] font-semibold text-[#B54E0E] tracking-wider uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Collection →
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate("shop")}
              className={`relative px-2.5 xl:px-2.5 2xl:px-3 py-1.5 text-xs 2xl:text-sm font-semibold tracking-wider uppercase transition-colors rounded-md whitespace-nowrap ${
                currentView === "shop"
                  ? "text-[#5A0F1B]"
                  : "text-stone-700 hover:text-[#5A0F1B] hover:bg-stone-100/60"
              }`}
              id="nav-link-shop"
            >
              Shop
            </button>

            {/* NEW NAVBAR ITEM: GIFTS */}
            <button
              onClick={() => onNavigate("gift-celebration")}
              className={`relative px-2.5 xl:px-2.5 2xl:px-3 py-1.5 text-xs 2xl:text-sm font-semibold tracking-wider uppercase transition-colors rounded-md inline-flex items-center gap-1.5 whitespace-nowrap ${
                currentView === "gift-celebration"
                  ? "text-[#5A0F1B] font-bold"
                  : "text-stone-700 hover:text-[#5A0F1B] hover:bg-stone-100/60"
              }`}
              id="nav-link-gifts"
            >
              <span className="text-sm">🎁</span>
              Gifts
              <span className="bg-[#5A0F1B] text-[#FAF8F5] text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                New
              </span>
              {currentView === "gift-celebration" && (
                <motion.div
                  layoutId="desktop-nav-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#5A0F1B]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            {/* NEW NAVBAR ITEM: OFFERS */}
            <button
              onClick={() => onNavigate("offers")}
              className={`relative px-2.5 xl:px-2.5 2xl:px-3 py-1.5 text-xs 2xl:text-sm font-semibold tracking-wider uppercase transition-colors rounded-md inline-flex items-center gap-1.5 whitespace-nowrap ${
                currentView === "offers"
                  ? "text-[#5A0F1B] font-bold"
                  : "text-stone-700 hover:text-[#5A0F1B] hover:bg-stone-100/60"
              }`}
              id="nav-link-offers"
            >
              <span className="text-sm">🏷️</span>
              Offers
              {currentView === "offers" && (
                <motion.div
                  layoutId="desktop-nav-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#5A0F1B]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            {/* MORE DROPDOWN FOR SECONDARY NAV ITEMS */}
            <div
              className="relative"
              onMouseEnter={() => setIsMoreOpen(true)}
              onMouseLeave={() => setIsMoreOpen(false)}
            >
              <button
                className={`px-2.5 xl:px-2.5 2xl:px-3 py-1.5 text-xs 2xl:text-sm font-semibold tracking-wider uppercase transition-colors rounded-md inline-flex items-center gap-1 whitespace-nowrap ${
                  ["gold-rates", "appointments", "rewards", "about"].includes(currentView) || isMoreOpen
                    ? "text-[#5A0F1B]"
                    : "text-stone-700 hover:text-[#5A0F1B] hover:bg-stone-100/60"
                }`}
                id="nav-link-more"
              >
                More
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isMoreOpen ? "rotate-180 text-[#B54E0E]" : ""
                  }`}
                />
              </button>

              {isMoreOpen && (
                <div className="absolute top-full right-0 w-52 bg-white border border-[#E8E1D5] rounded-xl shadow-xl p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => {
                      setIsMoreOpen(false);
                      onNavigate("gold-rates");
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between ${
                      currentView === "gold-rates" ? "bg-amber-50 text-[#5A0F1B]" : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Coins className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Gold Rates
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMoreOpen(false);
                      onNavigate("appointments");
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between ${
                      currentView === "appointments" ? "bg-amber-50 text-[#5A0F1B]" : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#5A0F1B]" />
                      Appointments
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMoreOpen(false);
                      onNavigate("rewards");
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between ${
                      currentView === "rewards" ? "bg-amber-50 text-[#5A0F1B]" : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Royal Rewards
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMoreOpen(false);
                      onNavigate("about");
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between ${
                      currentView === "about" ? "bg-amber-50 text-[#5A0F1B]" : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    <span>About Heritage</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setIsMoreOpen(false);
                        onNavigate("admin");
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-[#5A0F1B] bg-amber-100/60 hover:bg-amber-100 rounded-lg flex items-center gap-2 mt-1 border border-[#D4AF37]/40"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#5A0F1B]" />
                      Admin Portal
                    </button>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Icons (Search, Wishlist, Cart, Account) - Locked to Right Edge */}
          <div className="flex items-center space-x-1 sm:space-x-2.5 flex-shrink-0 ml-auto">
            {/* Search Input Button */}
            <div className="relative">
              {isSearchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center bg-white border border-[#D4AF37] rounded-full px-3 py-1 shadow-sm w-36 sm:w-48 md:w-60 max-w-[calc(100vw-180px)]"
                >
                  <Search className="w-4 h-4 text-[#B54E0E] mr-1.5 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search rings, necklaces..."
                    className="w-full text-xs bg-transparent focus:outline-none text-stone-800 placeholder-stone-400 font-sans"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="text-stone-400 hover:text-stone-600 p-0.5 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-full text-stone-700 hover:text-[#5A0F1B] hover:bg-stone-100 transition-colors"
                  aria-label="Search Jewellery"
                  id="nav-search-btn"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>

            {/* Wishlist Link with counter */}
            <button
              onClick={() => onNavigate("wishlist")}
              className="p-2 rounded-full text-stone-700 hover:text-[#5A0F1B] hover:bg-stone-100 transition-colors relative"
              aria-label="View Wishlist"
              id="nav-wishlist-btn"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#5A0F1B] text-[#F3E5AB] text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full text-stone-700 hover:text-[#5A0F1B] hover:bg-stone-100 transition-colors relative"
              aria-label="Shopping Cart"
              id="nav-cart-btn"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#B54E0E] text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account / User Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border border-[#D4AF37]/50 text-stone-800 hover:bg-[#FAF3E8] transition-all"
                id="nav-account-btn"
              >
                <div className="w-6 h-6 rounded-full bg-[#5A0F1B] text-[#F3E5AB] flex items-center justify-center text-[10px] font-bold">
                  {isAuthenticated && user?.fullName ? user.fullName[0].toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
                </div>
                {isAuthenticated && (
                  <span className="hidden 2xl:inline text-xs font-semibold text-stone-800 max-w-[100px] truncate">
                    {user?.fullName?.split(" ")[0]}
                  </span>
                )}
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {isAccountMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white border border-[#E8E1D5] rounded-xl shadow-xl p-3 z-50 animate-in fade-in duration-150 font-sans"
                  onMouseLeave={() => setIsAccountMenuOpen(false)}
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-3 py-2 border-b border-stone-100">
                        <p className="text-xs font-bold text-stone-900 truncate">{user?.fullName}</p>
                        <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                        <div className="mt-2 flex items-center justify-between text-[11px] bg-stone-50 px-2 py-1 rounded">
                          <span className="text-stone-600 font-medium">Tier: {rewardProfile?.tier || "SILVER"}</span>
                          <span className="text-[#B54E0E] font-bold">{rewardProfile?.currentPoints || 0} Pts</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            onNavigate("account");
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-md font-medium flex items-center gap-2"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-[#5A0F1B]" />
                          My Account Dashboard
                        </button>

                        <button
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            onNavigate("account", { tab: "orders" });
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-md font-medium flex items-center gap-2"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#5A0F1B]" />
                          My Orders
                        </button>

                        <button
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            onNavigate("rewards");
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-md font-medium flex items-center gap-2"
                        >
                          <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                          My Rewards &amp; Tiers
                        </button>

                        <button
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            onNavigate("account", { tab: "appointments" });
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-md font-medium flex items-center gap-2"
                        >
                          <Calendar className="w-3.5 h-3.5 text-[#5A0F1B]" />
                          My Appointments
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => {
                              setIsAccountMenuOpen(false);
                              onNavigate("admin");
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-[#5A0F1B] bg-amber-50 hover:bg-amber-100 rounded-md font-bold flex items-center gap-2 my-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-[#5A0F1B]" />
                            Admin Management Portal
                          </button>
                        )}
                      </div>

                      <div className="pt-1 border-t border-stone-100">
                        <button
                          onClick={() => {
                            logout();
                            setIsAccountMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-md font-medium flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-2 space-y-2 text-center">
                      <p className="text-xs text-stone-600">Access your luxury boutique rewards &amp; orders</p>
                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          onNavigate("login");
                        }}
                        className="w-full bg-[#5A0F1B] text-white py-2 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#420A13] transition-colors"
                      >
                        Sign In / Register
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-stone-700 hover:text-[#5A0F1B] transition-colors"
              aria-label="Toggle Navigation Menu"
              id="nav-mobile-toggle"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-[#E8E1D5] shadow-xl px-4 py-5 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top duration-200">
          <nav className="space-y-1">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate("home");
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider ${
                currentView === "home" ? "bg-[#5A0F1B] text-white" : "text-stone-800 hover:bg-stone-50"
              }`}
            >
              Home
            </button>

            {/* Mobile Collections Accordion */}
            <div>
              <button
                onClick={() => setIsMobileCollectionsOpen(!isMobileCollectionsOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider text-stone-800 hover:bg-stone-50"
              >
                <span>Collections</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isMobileCollectionsOpen ? "rotate-180 text-[#B54E0E]" : ""
                  }`}
                />
              </button>

              {isMobileCollectionsOpen && (
                <div className="pl-4 pr-2 py-2 space-y-2 bg-stone-50 rounded-lg my-1">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onNavigate("shop", { category: cat.slug });
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white transition-colors cursor-pointer"
                    >
                      <img src={cat.imageUrl} alt={cat.name} className="w-8 h-8 rounded object-cover" />
                      <span className="text-xs font-semibold text-stone-800">{cat.name}</span>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavigate("shop");
                    }}
                    className="text-xs font-bold text-[#B54E0E] px-2 py-1 block"
                  >
                    Explore All Collections →
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate("shop");
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider ${
                currentView === "shop" ? "bg-[#5A0F1B] text-white" : "text-stone-800 hover:bg-stone-50"
              }`}
            >
              Shop
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate("gift-celebration");
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider flex items-center justify-between ${
                currentView === "gift-celebration" ? "bg-[#5A0F1B] text-white" : "text-stone-800 hover:bg-stone-50"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🎁</span> Gift &amp; Celebration Pack
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#FAF3E8] text-[#5A0F1B] font-bold">
                NEW
              </span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate("offers");
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${
                currentView === "offers" ? "bg-[#5A0F1B] text-white" : "text-stone-800 hover:bg-stone-50"
              }`}
            >
              <span>🏷️</span> Exclusive Offers
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate("gold-rates");
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider flex items-center justify-between ${
                currentView === "gold-rates" ? "bg-[#5A0F1B] text-white" : "text-stone-800 hover:bg-stone-50"
              }`}
            >
              <span className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#D4AF37]" />
                Daily Gold Rates &amp; Chart
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#FAF3E8] text-[#5A0F1B] font-bold">
                Live LKR
              </span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate("about");
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider ${
                currentView === "about" ? "bg-[#5A0F1B] text-white" : "text-stone-800 hover:bg-stone-50"
              }`}
            >
              About
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate("appointments");
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider ${
                currentView === "appointments" ? "bg-[#5A0F1B] text-white" : "text-stone-800 hover:bg-stone-50"
              }`}
            >
              Book Appointment
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate("rewards");
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider ${
                currentView === "rewards" ? "bg-[#5A0F1B] text-white" : "text-stone-800 hover:bg-stone-50"
              }`}
            >
              Rewards &amp; Tier Multipliers
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate("wishlist");
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider text-stone-800 hover:bg-stone-50"
            >
              Wishlist ({wishlist.length})
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate("admin");
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider text-[#5A0F1B] bg-amber-50"
              >
                Admin Management Portal
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
