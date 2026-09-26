"use client";

import { useCart } from "@/app/context/CartContext";
import TodayMenu from "@/app/components/TodayMenu";
import CartModal from "@/app/components/CartModal";
import PartyOrderForm from "@/app/components/PartyOrderForm";

export default function Home() {
  const { totalCount, setIsCartOpen } = useCart();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-zinc-950">
      {/* Sticky Navigation Bar with Cart Trigger */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-zinc-950/85 border-b border-zinc-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo & Tagline */}
          <div className="flex flex-col">
            <span className="font-serif font-extrabold text-lg sm:text-2xl tracking-tight text-zinc-100">
              Aroma Kitchen <span className="text-amber-500 font-sans text-xs sm:text-sm font-semibold tracking-normal">by Isha</span>
            </span>
            <span className="text-[10px] sm:text-xs text-zinc-400 font-medium tracking-wide">
              Fresh Homestyle North Indian Delicacies
            </span>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="#party-orders"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-amber-400 border border-zinc-800 hover:border-amber-500/30 transition"
            >
              Party Bulk Orders
            </a>

            {/* Direct WhatsApp Callout */}
            <a
              href="https://wa.me/917678310566?text=Hi%20Aroma%20Kitchen%2C%20I%20would%20like%20to%20inquire%20about%20today%27s%20menu"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-600/20 transition"
            >
              <span>WhatsApp Us</span>
            </a>

            {/* Header Cart Button (Always visible on mobile & desktop) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-zinc-200 transition flex items-center gap-2 active:scale-95 shadow-md cursor-pointer"
              aria-label="Open Cart"
            >
              <svg
                className="w-5 h-5 text-amber-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>

              <span className="hidden sm:inline text-xs font-bold tracking-wider uppercase text-zinc-200">
                Cart
              </span>

              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-zinc-950 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border border-zinc-950 animate-in zoom-in-50 duration-200">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-20 px-4 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Fresh Ingredients • Authentic Pure Desi Ghee & Spices
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-zinc-100 leading-tight">
            Delicious, Homestyle Meals <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              Cooked Fresh Every Single Day
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Order daily homemade meals with flexible portion choices or pre-schedule your delivery directly to your doorstep with instant WhatsApp confirmation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#todays-menu"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs sm:text-sm font-bold uppercase tracking-wider transition shadow-lg shadow-amber-500/25 active:scale-95"
            >
              Order Today&apos;s Lunch & Dinner
            </a>
            <a
              href="#party-orders"
              className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs sm:text-sm font-semibold border border-zinc-800 transition active:scale-95"
            >
              Party Bulk Catering
            </a>
          </div>
        </section>

        {/* Dynamic Today's Menu Section (Google Sheet Connected) */}
        <TodayMenu />

        {/* Bulk Catering / Party Order Form Section */}
        <PartyOrderForm />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-10 px-4 text-center text-xs text-zinc-500 space-y-2">
        <p className="font-serif text-zinc-400 text-sm">Aroma Kitchen by Isha</p>
        <p>Operational Tuesday through Sunday • Closed Mondays for fresh kitchen prep</p>
        <p>© {new Date().getFullYear()} Aroma Kitchen. All rights reserved.</p>
      </footer>

      {/* Cart Modal Slide-over Component */}
      <CartModal />
    </div>
  );
}