"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { BUSINESS_CONFIG } from "../config/business";

export default function CartModal() {
  const { cart, updateQuantity, removeFromCart, subtotal, totalCount, isCartOpen, setIsCartOpen, clearCart } = useCart();
  
  // Steps: 'cart' -> 'time' -> 'details' -> 'summary'
  const [step, setStep] = useState<"cart" | "time" | "details" | "summary">("cart");

  // Order Timing
  const [timingType, setTimingType] = useState<"immediate" | "scheduled">("immediate");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // Customer Details
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Form Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isCartOpen) return null;

  const deliveryCharge = subtotal > 0 ? (subtotal >= 500 ? 0 : 40) : 0;
  const grandTotal = subtotal + deliveryCharge;

  // Helpers for Scheduled Times
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const validateTiming = () => {
    if (timingType === "immediate") return true;
    const errs: Record<string, string> = {};
    if (!scheduledDate) errs.date = "Please pick a date";
    if (!scheduledTime) errs.time = "Please pick a preferred delivery time";

    if (scheduledDate && scheduledTime) {
      const selected = new Date(`${scheduledDate}T${scheduledTime}`);
      if (selected <= new Date()) {
        errs.time = "Please choose a future time";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateDetails = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.name = "Name is required";
    if (!phoneNumber.trim() || phoneNumber.replace(/\D/g, "").length < 10) {
      errs.phone = "Valid 10-digit phone number is required";
    }
    if (!deliveryAddress.trim()) errs.address = "Delivery address is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedFromCart = () => {
    if (cart.length === 0) return;
    setStep("time");
  };

  const handleProceedFromTime = () => {
    if (validateTiming()) setStep("details");
  };

  const handleProceedFromDetails = () => {
    if (validateDetails()) setStep("summary");
  };

  const generateWhatsAppMessage = () => {
    const itemsList = cart
      .map(
        (item) =>
          `• ${item.name} × ${item.quantity} — ₹${item.priceNumeric * item.quantity}`
      )
      .join("\n");

    const orderTimeFormatted =
      timingType === "immediate"
        ? "Order Immediately (ASAP)"
        : `Scheduled: ${scheduledDate} at${scheduledTime}`;

    const message = [
      `*Hello Aroma Kitchen!*`,
      `I would like to place an order.`,
      ``,
      `*Customer:* ${customerName.trim()}`,
      `*WhatsApp:* ${phoneNumber.trim()}`,
      ``,
      `*Order Details:*`,
      itemsList,
      ``,
      `*Subtotal:* ₹${subtotal}`,
      `*Delivery:* ${deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}`,
      `*Total Amount:* ₹${grandTotal}`,
      ``,
      `*Order Time:* ${orderTimeFormatted}`,
      ``,
      `*Delivery Address:*`,
      `${deliveryAddress.trim()}`,
      specialInstructions.trim() ? `\n*Special Instructions:*\n${specialInstructions.trim()}` : "",
      ``,
      `Please confirm my order and share payment details. Thank you!`,
    ]
      .filter(Boolean)
      .join("\n");

    const config = BUSINESS_CONFIG as Record<string, unknown>;
    const phoneSource = 
      (typeof config.phone === "string" && config.phone) ||
      (typeof config.whatsapp === "string" && config.whatsapp) ||
      "7678310566";

    const rawPhone = phoneSource.replace(/\D/g, "");
    const waNumber = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    clearCart();
    setIsCartOpen(false);
    setStep("cart");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#18181b] border-l border-amber-900/30 flex flex-col h-full shadow-2xl text-zinc-100">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-400">
              {step === "cart" && `Your Food Cart (${totalCount})`}
              {step === "time" && "Delivery Time"}
              {step === "details" && "Your Delivery Details"}
              {step === "summary" && "Confirm Order"}
            </h2>
            <p className="text-xs text-zinc-400">Aroma Kitchen by Isha</p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Multi-Step Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* STEP 1: CART LIST */}
          {step === "cart" && (
            <>
              {cart.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <div className="text-4xl">🍲</div>
                  <p className="text-zinc-400">Your cart is empty.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-4 py-2 text-sm bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition"
                  >
                    Browse Today&apos;s Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-zinc-900/80 rounded-xl border border-zinc-800/80"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover border border-zinc-700/50 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-zinc-100 truncate">{item.name}</h4>
                        <p className="text-xs text-amber-400 font-medium">₹{item.priceNumeric} each</p>
                        <p className="text-xs text-zinc-400 mt-0.5">Item subtotal: ₹{item.priceNumeric * item.quantity}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-zinc-800 px-2 py-1 rounded-lg border border-zinc-700">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-amber-400 font-bold hover:text-white px-1"
                        >
                          −
                        </button>
                        <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-amber-400 font-bold hover:text-white px-1"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-500 hover:text-red-400 text-sm p-1"
                        title="Remove"
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* STEP 2: TIME SELECTION */}
          {step === "time" && (
            <div className="space-y-4">
              <label className="text-sm font-medium text-zinc-300">When would you like your order?</label>
              
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setTimingType("immediate")}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition ${
                    timingType === "immediate"
                      ? "border-amber-500 bg-amber-500/10 text-white"
                      : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <span className="text-xl">⚡</span>
                  <div>
                    <div className="font-semibold text-sm">Order Immediately</div>
                    <div className="text-xs text-zinc-400 mt-1">Prepared fresh and delivered ASAP (usually 35-50 mins)</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTimingType("scheduled")}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition ${
                    timingType === "scheduled"
                      ? "border-amber-500 bg-amber-500/10 text-white"
                      : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <span className="text-xl">📅</span>
                  <div>
                    <div className="font-semibold text-sm">Schedule My Order</div>
                    <div className="text-xs text-zinc-400 mt-1">Choose a specific date and time slot in advance</div>
                  </div>
                </button>
              </div>

              {timingType === "scheduled" && (
                <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-3 mt-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Select Delivery Date</label>
                    <input
                      type="date"
                      min={getMinDate()}
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                    {errors.date && <p className="text-xs text-red-400 mt-1">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Select Delivery Time</label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                    {errors.time && <p className="text-xs text-red-400 mt-1">{errors.time}</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: CUSTOMER DETAILS FORM */}
          {step === "details" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Vibhor Verma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  placeholder="e.g. 8650805090"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                />
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Delivery Address *</label>
                <textarea
                  rows={3}
                  placeholder="Flat/Tower number, society name, Rajnagar Extension landmark"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                />
                {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Special Instructions (Optional)</label>
                <input
                  type="text"
                  placeholder="Less spicy, extra green chutney, don't ring bell, etc."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* STEP 4: ORDER SUMMARY */}
          {step === "summary" && (
            <div className="space-y-4">
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Customer & Delivery</div>
                <div className="text-sm font-medium">{customerName} ({phoneNumber})</div>
                <div className="text-xs text-zinc-400">{deliveryAddress}</div>
                <div className="text-xs text-emerald-400 pt-1">
                  ⏱ {timingType === "immediate" ? "Immediate Delivery (ASAP)" : `Scheduled: ${scheduledDate} at ${scheduledTime}`}
                </div>
                {specialInstructions && (
                  <div className="text-xs text-zinc-300 italic pt-1 border-t border-zinc-800 mt-2">
                    Note: &quot;{specialInstructions}&quot;
                  </div>
                )}
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Order Items</div>
                <div className="divide-y divide-zinc-800">
                  {cart.map((item) => (
                    <div key={item.id} className="py-2 flex justify-between text-xs">
                      <div>
                        <span className="font-medium text-zinc-200">{item.name}</span> × {item.quantity}
                      </div>
                      <div className="font-semibold text-zinc-300">₹{item.priceNumeric * item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer with Calculations and Action Buttons */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-950/70 space-y-3">
            <div className="space-y-1.5 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-zinc-200">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{deliveryCharge === 0 ? <span className="text-emerald-400">FREE</span> : `₹${deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-amber-400 pt-2 border-t border-zinc-800">
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            {/* Step Controls */}
            <div className="flex items-center gap-2 pt-1">
              {step !== "cart" && (
                <button
                  type="button"
                  onClick={() => {
                    if (step === "time") setStep("cart");
                    if (step === "details") setStep("time");
                    if (step === "summary") setStep("details");
                  }}
                  className="px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold transition"
                >
                  Back
                </button>
              )}

              {step === "cart" && (
                <button
                  type="button"
                  onClick={handleProceedFromCart}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition flex justify-between items-center"
                >
                  <span>Proceed to Order</span>
                  <span>₹{grandTotal} →</span>
                </button>
              )}

              {step === "time" && (
                <button
                  type="button"
                  onClick={handleProceedFromTime}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition text-center"
                >
                  Next: Enter Delivery Details →
                </button>
              )}

              {step === "details" && (
                <button
                  type="button"
                  onClick={handleProceedFromDetails}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition text-center"
                >
                  Review Order Summary →
                </button>
              )}

              {step === "summary" && (
                <button
                  type="button"
                  onClick={generateWhatsAppMessage}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  <span>Confirm Order on WhatsApp</span>
                  <span>💬</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}