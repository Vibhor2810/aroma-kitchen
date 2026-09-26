"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

interface MenuItem {
  id: string;
  category: string;
  item: string;
  price: string;
  description: string;
  available: boolean;
  imageUrl?: string;
}

interface MenuResponse {
  dateString: string;
  formattedDate: string;
  isMonday: boolean;
  status: "OPEN" | "MONDAY_CLOSED" | "EMPTY_MENU" | "ERROR";
  categories: string[];
  items: MenuItem[];
  message?: string;
}

export default function TodayMenu() {
  const [data, setData] = useState<MenuResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { cart, addToCart, updateQuantity, totalCount, subtotal, setIsCartOpen } = useCart();

  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await fetch("/api/menu/today");
        const json = await res.json();
        setData(json);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  if (loading) {
    return (
      <section id="todays-menu" className="py-16 px-4 max-w-7xl mx-auto text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-zinc-800 w-48 mx-auto rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-zinc-900 rounded-2xl border border-zinc-800"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (data?.isMonday || data?.status === "MONDAY_CLOSED") {
    return (
      <section id="todays-menu" className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30">
          <h2 className="text-3xl font-serif font-bold text-amber-400">Kitchen Closed on Mondays</h2>
          <p className="text-zinc-400 mt-2">We recharge to serve you fresh home-style meals throughout the week!</p>
        </div>
      </section>
    );
  }

  const items = data?.items || [];
  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((dish) => dish.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="todays-menu" className="py-16 px-4 max-w-7xl mx-auto relative">
      <div className="text-center space-y-2 mb-10">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
          Freshly Prepared For Today
        </span>
        <h2 className="text-4xl font-serif font-bold text-zinc-100">TODAY&apos;S MENU</h2>
        <p className="text-sm text-zinc-400">{data?.formattedDate}</p>
      </div>

      {/* Category Pills */}
      {data?.categories && data.categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {["All", ...data.categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid of Dishes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((dish) => {
          const cartItem = cart.find((i) => i.id === dish.id);

          return (
            <div
              key={dish.id}
              className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl overflow-hidden flex flex-col group hover:border-amber-500/40 transition duration-300 shadow-xl"
            >
              <div className="relative h-48 w-full overflow-hidden bg-zinc-950">
                <img
                  src={dish.imageUrl}
                  alt={dish.item}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider text-amber-400 border border-amber-500/30">
                  {dish.category}
                </span>
                {!dish.available && (
                  <span className="absolute inset-0 bg-black/80 flex items-center justify-center text-sm font-bold text-red-400">
                    Sold Out
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-lg text-zinc-100">{dish.item}</h3>
                    <span className="text-amber-400 font-bold text-base whitespace-nowrap">{dish.price}</span>
                  </div>
                  {dish.description && (
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{dish.description}</p>
                  )}
                </div>

                {/* Add to Cart / Stepper */}
                <div>
                  {!dish.available ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-zinc-800 text-zinc-500 text-xs font-semibold cursor-not-allowed"
                    >
                      Currently Unavailable
                    </button>
                  ) : cartItem ? (
                    <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/40 rounded-xl px-4 py-2">
                      <button
                        onClick={() => updateQuantity(dish.id, -1)}
                        className="text-amber-400 font-bold text-lg hover:text-white px-2"
                      >
                        −
                      </button>
                      <span className="text-sm font-bold text-amber-300">
                        {cartItem.quantity} in cart
                      </span>
                      <button
                        onClick={() => updateQuantity(dish.id, 1)}
                        className="text-amber-400 font-bold text-lg hover:text-white px-2"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        addToCart({
                          id: dish.id,
                          name: dish.item,
                          price: dish.price,
                          imageUrl: dish.imageUrl,
                        })
                      }
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/10 flex items-center justify-center gap-2"
                    >
                      <span>Add to Cart</span>
                      <span>+</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Cart Bar (appears as soon as any item is added) */}
      {totalCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm shadow-2xl shadow-amber-500/30 flex items-center justify-between border border-amber-300/40 transition transform active:scale-95"
          >
            <div className="flex items-center gap-2">
              <span className="bg-zinc-950 text-amber-400 text-xs px-2 py-0.5 rounded-full font-extrabold">
                {totalCount}
              </span>
              <span>View Cart</span>
            </div>
            <span>₹{subtotal} →</span>
          </button>
        </div>
      )}
    </section>
  );
}