"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  priceNumeric: number;
  priceLabel: string;
  quantity: number;
  imageUrl: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: { id: string; name: string; price: string; imageUrl?: string }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("aroma_cart");
        if (saved) return JSON.parse(saved);
      } catch {
        // Ignore storage read errors
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to localStorage only when cart updates
  useEffect(() => {
    try {
      localStorage.setItem("aroma_cart", JSON.stringify(cart));
    } catch {
      // Ignore storage write errors
    }
  }, [cart]);

  const parsePrice = (priceStr: string): number => {
    // Extracts the primary or base number from strings like "₹360/200", "₹250", "300"
    const cleaned = priceStr.replace(/[^0-9/]/g, "");
    if (cleaned.includes("/")) {
      const parts = cleaned.split("/");
      return parseFloat(parts[0]) || 0;
    }
    return parseFloat(cleaned) || 0;
  };

  const addToCart = (dish: { id: string; name: string; price: string; imageUrl?: string }) => {
    const numeric = parsePrice(dish.price);
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: dish.id,
          name: dish.name,
          priceNumeric: numeric,
          priceLabel: dish.price,
          quantity: 1,
          imageUrl: dish.imageUrl || "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
        },
      ];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.priceNumeric * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}