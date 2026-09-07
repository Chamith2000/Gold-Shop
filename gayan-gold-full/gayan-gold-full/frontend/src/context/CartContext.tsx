import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, GiftProduct, GiftComboPack, CartItem } from "../types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  addGiftToCart: (giftProduct: GiftProduct, quantity?: number, giftMessage?: string) => void;
  addComboToCart: (giftCombo: GiftComboPack, quantity?: number) => void;
  removeFromCart: (itemId: string, itemType: 'product' | 'gift' | 'combo') => void;
  updateQuantity: (itemId: string, quantity: number, itemType: 'product' | 'gift' | 'combo') => void;
  clearCart: () => void;
  cartCount: number;
  jewellerySubtotal: number;
  giftSubtotal: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  smartGiftItem: Product | null;
  setSmartGiftItem: (product: Product | null) => void;
}

const CART_STORAGE_KEY = "gayan_gold_cart_v2";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [smartGiftItem, setSmartGiftItem] = useState<Product | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [cart]);

  // Add jewellery item (triggers Smart Gift Popup)
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.product?.id === product.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], quantity: copy[existingIdx].quantity + quantity };
        return copy;
      }
      return [...prev, { product, quantity, isGift: false }];
    });

    // Trigger Smart Gift Popup for jewellery item
    setSmartGiftItem(product);
  };

  // Add gift product directly
  const addGiftToCart = (giftProduct: GiftProduct, quantity: number = 1, giftMessage?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.giftProduct?.id === giftProduct.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          quantity: copy[existingIdx].quantity + quantity,
          giftMessage: giftMessage || copy[existingIdx].giftMessage,
        };
        return copy;
      }
      return [...prev, { giftProduct, quantity, isGift: true, giftMessage }];
    });
  };

  // Add combo pack directly
  const addComboToCart = (giftCombo: GiftComboPack, quantity: number = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.giftCombo?.id === giftCombo.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], quantity: copy[existingIdx].quantity + quantity };
        return copy;
      }
      return [...prev, { giftCombo, quantity, isGift: true }];
    });
  };

  const getItemId = (item: CartItem): string => {
    if (item.product?.id) return `product-${item.product.id}`;
    if (item.giftProduct?.id) return `gift-${item.giftProduct.id}`;
    if (item.giftCombo?.id) return `combo-${item.giftCombo.id}`;
    return "";
  };

  const removeFromCart = (itemId: string, itemType: 'product' | 'gift' | 'combo') => {
    setCart((prev) => {
      const filtered = prev.filter((item) => {
        if (itemType === 'product' && item.product?.id === itemId) return false;
        if (itemType === 'gift' && item.giftProduct?.id === itemId) return false;
        if (itemType === 'combo' && item.giftCombo?.id === itemId) return false;
        return true;
      });
      return filtered;
    });
  };

  const updateQuantity = (itemId: string, quantity: number, itemType: 'product' | 'gift' | 'combo') => {
    if (quantity <= 0) {
      removeFromCart(itemId, itemType);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (itemType === 'product' && item.product?.id === itemId) {
          return { ...item, quantity };
        }
        if (itemType === 'gift' && item.giftProduct?.id === itemId) {
          return { ...item, quantity };
        }
        if (itemType === 'combo' && item.giftCombo?.id === itemId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const jewellerySubtotal = cart.reduce((sum, item) => {
    if (item.product) {
      return sum + item.product.price * item.quantity;
    }
    return sum;
  }, 0);

  const giftSubtotal = cart.reduce((sum, item) => {
    if (item.giftProduct) {
      return sum + item.giftProduct.price * item.quantity;
    }
    if (item.giftCombo) {
      return sum + item.giftCombo.comboPrice * item.quantity;
    }
    return sum;
  }, 0);

  const subtotal = jewellerySubtotal + giftSubtotal;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addGiftToCart,
        addComboToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        jewellerySubtotal,
        giftSubtotal,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        smartGiftItem,
        setSmartGiftItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
