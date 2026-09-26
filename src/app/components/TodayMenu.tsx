"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";

function getDishImage(dishName: string, category?: string): string {
  const name = dishName.toLowerCase();
  if (name.includes("paneer")) {
    return "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80";
  }
  if (name.includes("butter chicken") || name.includes("chicken")) {
    return "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80";
  }
  if (name.includes("biryani") || name.includes("pulao")) {
    return "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80";
  }
  if (name.includes("dal") || name.includes("makhani")) {
    return "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80";
  }
  if (category && category.toLowerCase().includes("non")) {
    return "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80";
  }
  return "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80";
}

interface ParsedDish {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  available: boolean;
  hasPortions: boolean;
  fullPrice: number;
  halfPrice: number;
  displayPrice: string;
}

export default function TodayMenu() {
  const [dishes, setDishes] = useState<ParsedDish[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [portionSelections, setPortionSelections] = useState<Record<string, "Full" | "Half">>({});

  const { cart, addToCart, updateQuantity, setIsCartOpen, totalCount, subtotal } = useCart();

  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/menu/today", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Failed to load menu (${res.status})`);
        }

        const json = await res.json();

        let rawItems: Record<string, unknown>[] = [];
        if (Array.isArray(json)) {
          rawItems = json as Record<string, unknown>[];
        } else if (json && typeof json === "object") {
          const obj = json as Record<string, unknown>;
          if (Array.isArray(obj.items)) rawItems = obj.items as Record<string, unknown>[];
          else if (Array.isArray(obj.data)) rawItems = obj.data as Record<string, unknown>[];
          else if (Array.isArray(obj.menu)) rawItems = obj.menu as Record<string, unknown>[];
        }

        const parsed: ParsedDish[] = rawItems
          .map((row: Record<string, unknown>, index: number) => {
            const getVal = (...keys: string[]) => {
              for (const k of keys) {
                if (row[k] !== undefined && row[k] !== null) return String(row[k]).trim();
              }
              return "";
            };

            const name = getVal("Item", "item", "dish", "name", "Dish");
            const category = getVal("Category", "category", "Type") || "Main Course";
            const desc = getVal("Description", "description", "desc");
            const rawPrice = getVal("Price", "price") || "0";
            const rawAvail = getVal("Available", "available", "Status", "status").toLowerCase();
            const rawImg = getVal("Image url", "Image URL", "imageUrl", "image", "Image");

            if (!name) return null;

            const parts = rawPrice
              .split("/")
              .map((p: string) => parseInt(p.replace(/\D/g, ""), 10))
              .filter((n: number) => !isNaN(n) && n > 0);

            const hasPortions = parts.length >= 2;
            const fullPrice = parts[0] || 0;
            const halfPrice = hasPortions ? parts[1] : 0;

            const safeId = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`;
            const fallbackImage = getDishImage(name, category);

            const isUnavailable =
              rawAvail === "no" ||
              rawAvail === "false" ||
              rawAvail === "0" ||
              rawAvail === "sold out";

            return {
              id: safeId,
              name,
              category,
              description: desc,
              image: rawImg || fallbackImage,
              available: !isUnavailable,
              hasPortions,
              fullPrice,
              halfPrice,
              displayPrice: rawPrice,
            };
          })
          .filter((dish): dish is ParsedDish => dish !== null);

        setDishes(parsed);
      } catch (err: unknown) {
        console.error("Menu fetch error:", err);
        setError("Unable to load today's menu at the moment. Please order directly on WhatsApp.");
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  const categories = ["all", ...Array.from(new Set(dishes.map((d) => d.category.toLowerCase())))];

  const filteredDishes =
    activeCategory === "all"
      ? dishes
      : dishes.filter((d) => d.category.toLowerCase() === activeCategory);

  const getPortion = (dishId: string): "Full" | "Half" => {
    return portionSelections[dishId] || "Full";
  };

  const setPortion = (dishId: string, portion: "Full" | "Half") => {
    setPortionSelections((prev) => ({ ...prev, [dishId]: portion }));
  };

  const getItemCartQuantity = (dish: ParsedDish) => {
    const cartList = cart || [];
    if (dish.hasPortions) {
      const activePortion = getPortion(dish.id);
      const cartItemId = `${dish.id}-${activePortion.toLowerCase()}`;
      const found = cartList.find((i) => i.id === cartItemId);
      return found ? found.quantity : 0;
    } else {
      const found = cartList.find((i) => i.id === dish.id);
      return found ? found.quantity : 0;
    }
  };

  const handleAdd = (dish: ParsedDish) => {
    if (dish.hasPortions) {
      const activePortion = getPortion(dish.id);
      const price = activePortion === "Half" ? dish.halfPrice : dish.fullPrice;
      addToCart({
        id: `${dish.id}-${activePortion.toLowerCase()}`,
        name: `${dish.name} (${activePortion})`,
        price: String(price),
        imageUrl: dish.image,
      });
    } else {
      addToCart({
        id: dish.id,
        name: dish.name,
        price: String(dish.fullPrice),
        imageUrl: dish.image,
      });
    }
  };

  const handleIncrement = (dish: ParsedDish) => {
    if (dish.hasPortions) {
      const activePortion = getPortion(dish.id);
      const cartItemId = `${dish.id}-${activePortion.toLowerCase()}`;
      updateQuantity(cartItemId, 1);
    } else {
      updateQuantity(dish.id, 1);
    }
  };

  const handleDecrement = (dish: ParsedDish) => {
    if (dish.hasPortions) {
      const activePortion = getPortion(dish.id);
      const cartItemId = `${dish.id}-${activePortion.toLowerCase()}`;
      updateQuantity(cartItemId, -1);
    } else {
      updateQuantity(dish.id, -1);
    }
  };

  return (
    <section id="todays-menu" className="py-12 px-4 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block">
          Fresh From Our Kitchen
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-100">
          Today&apos;s Special Menu
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          Homestyle North Indian delicacies made fresh daily. Select serving sizes and add to cart for seamless WhatsApp checkout.
        </p>
      </div>

      {/* Category Pills */}
      {categories.length > 2 && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition ${
                activeCategory === cat
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Loading & Error States */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-wider text-zinc-400">Loading today&apos;s fresh menu...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-amber-500/30 text-center max-w-md mx-auto space-y-3">
          <p className="text-sm text-zinc-300">{error}</p>
          <a
            href="https://wa.me/917678310566?text=Hi%20Aroma%20Kitchen%2C%20please%20share%20today%27s%20available%20menu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition"
          >
            Chat with Kitchen on WhatsApp
          </a>
        </div>
      )}

      {/* Dish Grid */}
      {!loading && !error && dishes.length === 0 && (
        <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800 p-8 max-w-lg mx-auto">
          <p className="text-zinc-300 font-serif text-lg">Kitchen is resting today!</p>
          <p className="text-xs text-zinc-500 mt-2">
            Fresh daily menus update every morning (Tuesday to Sunday).
          </p>
        </div>
      )}

      {!loading && !error && filteredDishes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => {
            const currentPortion = getPortion(dish.id);
            const qty = getItemCartQuantity(dish);

            const displayAmount = dish.hasPortions
              ? currentPortion === "Half"
                ? dish.halfPrice
                : dish.fullPrice
              : dish.fullPrice;

            return (
              <div
                key={dish.id}
                className="bg-zinc-900/80 rounded-2xl border border-zinc-800/80 overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition duration-300 shadow-lg shadow-black/40 group"
              >
                {/* Dish Image */}
                <div className="relative h-48 w-full overflow-hidden bg-zinc-950">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm ${
                        dish.category.toLowerCase().includes("non")
                          ? "bg-red-950/80 text-red-300 border-red-500/40"
                          : "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                      }`}
                    >
                      {dish.category}
                    </span>
                  </div>

                  {!dish.available && (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="text-xs uppercase tracking-widest font-bold text-zinc-300 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-700">
                        Sold Out For Today
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif font-bold text-lg text-zinc-100 group-hover:text-amber-300 transition">
                        {dish.name}
                      </h3>
                      <span className="text-amber-400 font-bold text-base shrink-0">
                        ₹{displayAmount}
                      </span>
                    </div>

                    {dish.description && (
                      <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>
                    )}
                  </div>

                  {/* Serving Portion Toggle */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/80">
                    {dish.hasPortions ? (
                      <div className="flex items-center gap-2 mb-3 bg-zinc-950/80 p-1 rounded-lg border border-zinc-800">
                        <button
                          type="button"
                          onClick={() => setPortion(dish.id, "Full")}
                          className={`flex-1 py-1 text-xs rounded-md font-medium transition ${
                            currentPortion === "Full"
                              ? "bg-amber-500 text-zinc-950 font-bold shadow"
                              : "text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          Full (₹{dish.fullPrice})
                        </button>
                        <button
                          type="button"
                          onClick={() => setPortion(dish.id, "Half")}
                          className={`flex-1 py-1 text-xs rounded-md font-medium transition ${
                            currentPortion === "Half"
                              ? "bg-amber-500 text-zinc-950 font-bold shadow"
                              : "text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          Half (₹{dish.halfPrice})
                        </button>
                      </div>
                    ) : (
                      <div className="text-[11px] text-zinc-500 mb-3 italic">
                        Standard Portioned Serving
                      </div>
                    )}

                    {/* Add to Cart / Quantity Stepper Button */}
                    {!dish.available ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-zinc-800 text-zinc-500 text-xs font-semibold cursor-not-allowed uppercase tracking-wider"
                      >
                        Unavailable
                      </button>
                    ) : qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => handleAdd(dish)}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold uppercase tracking-wider transition shadow-md shadow-amber-500/20 active:scale-[0.98]"
                      >
                        Add To Cart {dish.hasPortions ? `(${currentPortion})` : ""}
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/40 rounded-xl px-2 py-1.5">
                        <button
                          type="button"
                          onClick={() => handleDecrement(dish)}
                          className="w-8 h-8 rounded-lg bg-zinc-900 border border-amber-500/40 text-amber-400 font-bold hover:bg-amber-500 hover:text-zinc-950 transition flex items-center justify-center text-sm"
                        >
                          −
                        </button>
                        <div className="text-center">
                          <span className="text-xs font-bold text-amber-300">
                            {qty} in cart
                          </span>
                          {dish.hasPortions && (
                            <span className="block text-[10px] text-zinc-400 leading-none">
                              {currentPortion}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleIncrement(dish)}
                          className="w-8 h-8 rounded-lg bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400 transition flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Cart Bar */}
      {totalCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40">
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-amber-500/40 p-3.5 rounded-2xl shadow-2xl flex items-center justify-between backdrop-blur-md">
            <div>
              <div className="text-xs font-semibold text-zinc-200">
                {totalCount} {totalCount === 1 ? "dish" : "dishes"} selected
              </div>
              <div className="text-amber-400 font-bold text-sm">
                ₹{subtotal} <span className="text-[10px] text-zinc-400 font-normal">+ delivery</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen && setIsCartOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold uppercase tracking-wider transition shadow-md shadow-amber-500/30 flex items-center gap-1.5"
            >
              <span>View Cart</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}