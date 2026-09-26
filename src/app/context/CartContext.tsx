"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  priceNumeric: number;
  priceLabel: string;
  quantity: number;
  imageUrl?: string;
  price?: string | number;
  category?: string;
  portion?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (dish: { id: string; name: string; price: string; imageUrl?: string; category?: string }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalCount: number;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "aroma_kitchen_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Restore cart state from localStorage after mount
  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem(CART_STORAGE_KEY) : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Wrap in requestAnimationFrame or microtask to avoid synchronous cascading renders
          queueMicrotask(() => {
            setCart(parsed);
          });
        }
      }
    } catch (e) {
      console.error("Failed to restore cart from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync cart state with localStorage whenever items change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to persist cart to localStorage:", e);
    }
  }, [cart, isHydrated]);

  // Extracts numeric value safely from strings like "360/200", "₹250", or "250"
  const parsePrice = (priceStr: string): number => {
    const cleaned = priceStr.replace(/[^0-9/]/g, "");
    if (cleaned.includes("/")) {
      const parts = cleaned.split("/");
      return parseFloat(parts[0]) || 0;
    }
    return parseFloat(cleaned) || 0;
  };

  const addToCart = (dish: {
    id: string;
    name: string;
    price: string;
    imageUrl?: string;
    category?: string;
  }) => {
    const numeric = parsePrice(dish.price);

    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      const newItem: CartItem = {
        id: dish.id,
        name: dish.name,
        priceNumeric: numeric,
        priceLabel: dish.price,
        quantity: 1,
        imageUrl:
          dish.imageUrl ||
          "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
        category: dish.category,
      };

      return [...prev, newItem];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQuantity = item.quantity + delta;
            return nextQuantity > 0 ? { ...item, quantity: nextQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.priceNumeric || 0) * (item.quantity || 0),
    0
  );

  // Free delivery rule: ₹0 if order > ₹200, otherwise ₹30 (and ₹0 if cart is completely empty)
  const deliveryFee = subtotal === 0 ? 0 : subtotal > 200 ? 0 : 30;

  const grandTotal = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalCount,
        subtotal,
        deliveryFee,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}