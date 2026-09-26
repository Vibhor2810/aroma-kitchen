"use client";

import React, { useState } from "react";
import { useCart } from "@/app/context/CartContext";

export default function CartModal() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    grandTotal,
  } = useCart();

  const [deliveryType, setDeliveryType] = useState<"asap" | "scheduled">("asap");
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [specialNotes, setSpecialNotes] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) {
      setValidationError("Your cart is empty. Please add items to proceed.");
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setValidationError("Please fill in your name, contact phone number, and delivery address.");
      return;
    }

    if (deliveryType === "scheduled" && !scheduledTime.trim()) {
      setValidationError("Please specify your desired delivery time.");
      return;
    }

    setValidationError(null);

    // Format items list
    const itemsFormatted = cart
      .map((item, index) => {
        const itemLineTotal = (item.priceNumeric || 0) * item.quantity;
        return `${index + 1}. *${item.name}* x ${item.quantity} = ₹${itemLineTotal}`;
      })
      .join("\n");

    const deliveryTimeText =
      deliveryType === "asap"
        ? "⚡ As soon as possible (Freshly prepared)"
        : `🕒 Scheduled for: ${scheduledTime}`;

    const deliveryFeeText =
      deliveryFee === 0 ? "FREE (Order above ₹200)" : `₹${deliveryFee}`;

    const notesText = specialNotes.trim() ? `\n*Note:* ${specialNotes.trim()}` : "";

    const message =
`*NEW ORDER - Aroma Kitchen by Isha*
================================
*Customer Details:*
• Name: ${customerName.trim()}
• Phone: ${customerPhone.trim()}
• Address: ${deliveryAddress.trim()}

*Delivery Timing:*
• ${deliveryTimeText}

*Order Summary:*
--------------------------------
${itemsFormatted}
--------------------------------
*Subtotal:* ₹${subtotal}
*Delivery Fee:* ${deliveryFeeText}
*Grand Total:* ₹${grandTotal}${notesText}

Please confirm preparation and delivery availability. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/917678310566?text=${encodedMessage}`;

    // Open WhatsApp in new tab/app
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-over Drawer */}
      <div className="relative z-10 w-full max-w-md bg-zinc-950 border-l border-zinc-800 text-zinc-100 flex flex-col h-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <span className="font-serif font-bold text-lg text-zinc-100">Your Cart</span>
            {cart.length > 0 && (
              <span className="text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* Empty State */}
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-zinc-300 font-serif font-medium text-base">Your cart is empty</p>
              <p className="text-xs text-zinc-500 max-w-xs">
                Browse our fresh homestyle daily menu and add your favorite dishes.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold uppercase tracking-wider transition shadow-md shadow-amber-500/20"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-zinc-400 pb-1 border-b border-zinc-900">
                  <span>Selected Dishes</span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-zinc-500 hover:text-red-400 text-[11px] underline underline-offset-2 transition"
                  >
                    Clear All
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-zinc-100 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-amber-400 font-medium">
                        ₹{(item.priceNumeric || 0) * item.quantity}{" "}
                        <span className="text-zinc-500 text-[10px]">
                          (₹{item.priceNumeric} each)
                        </span>
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded flex items-center justify-center bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs font-bold"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-zinc-200">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded flex items-center justify-center bg-amber-500 text-zinc-950 hover:bg-amber-400 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove cross */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-600 hover:text-red-400 text-xs p-1"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Delivery Timing Options */}
              <div className="space-y-3 pt-3 border-t border-zinc-900">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                  Delivery Timing
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("asap")}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left transition ${
                      deliveryType === "asap"
                        ? "bg-amber-500/10 border-amber-500/60 text-amber-300 shadow-sm"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <div className="font-bold">⚡ ASAP</div>
                    <div className="text-[10px] text-zinc-500">Freshly prepared & sent</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType("scheduled")}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left transition ${
                      deliveryType === "scheduled"
                        ? "bg-amber-500/10 border-amber-500/60 text-amber-300 shadow-sm"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <div className="font-bold">🕒 Schedule</div>
                    <div className="text-[10px] text-zinc-500">Select lunch/dinner time</div>
                  </button>
                </div>

                {deliveryType === "scheduled" && (
                  <input
                    type="text"
                    placeholder="e.g. 1:30 PM Lunch, or 8:30 PM Dinner"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-500 text-zinc-200 outline-none transition"
                  />
                )}
              </div>

              {/* Delivery Address & Contact Details */}
              <div className="space-y-2.5 pt-3 border-t border-zinc-900">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                  Delivery Details
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="text-xs p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-500 text-zinc-200 outline-none transition"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="text-xs p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-500 text-zinc-200 outline-none transition"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Delivery Address (Flat / House No., Society / Tower, Landmark) *"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-500 text-zinc-200 outline-none transition resize-none"
                />
                <input
                  type="text"
                  placeholder="Cooking instruction (e.g. less spicy, extra tissue)"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-500 text-zinc-200 outline-none transition"
                />
              </div>

              {/* Validation Warning */}
              {validationError && (
                <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs text-center font-medium">
                  {validationError}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Price Breakdown & Action */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-zinc-800/80 bg-zinc-900/40 space-y-3">
            <div className="space-y-1.5 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="text-zinc-200 font-medium">₹{subtotal}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Delivery Charge</span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[10px]">
                    FREE (Order above ₹200)
                  </span>
                ) : (
                  <span className="text-zinc-200 font-medium">
                    ₹{deliveryFee}{" "}
                    <span className="text-[10px] text-zinc-500">
                      (Free above ₹200)
                    </span>
                  </span>
                )}
              </div>

              <div className="flex justify-between pt-2 border-t border-zinc-800 text-sm font-bold text-zinc-100">
                <span>Grand Total</span>
                <span className="text-amber-400">₹{grandTotal}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckoutWhatsApp}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Confirm & Order on WhatsApp</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}