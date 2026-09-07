import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../types";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
  wishlist: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    setIsLoading(true);
    try {
      const items = await api.wishlist.getAll();
      setWishlist(items);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = async (product: Product) => {
    if (!isAuthenticated) {
      // Toggle locally if not authenticated
      setWishlist((prev) => {
        const exists = prev.some((p) => p.id === product.id);
        if (exists) return prev.filter((p) => p.id !== product.id);
        return [...prev, product];
      });
      return;
    }

    try {
      const res = await api.wishlist.toggle(product.id);
      if (res.inWishlist) {
        setWishlist((prev) => (prev.some((p) => p.id === product.id) ? prev : [...prev, product]));
      } else {
        setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      }
    } catch (e) {
      console.error("Failed to toggle wishlist", e);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
