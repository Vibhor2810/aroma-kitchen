"use client";

import React, { useState } from "react";
import { getPartyEnquiryWhatsAppUrl, PartyEnquiryData } from "@/app/utils/whatsapp";

export default function PartyOrderForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<PartyEnquiryData>({
    fullName: "",
    phone: "",
    eventType: "Birthday Party",
    eventDate: "",
    guestCount: "",
    foodRequirements: "",
    additionalDetails: "",
    preferredContactTime: "Anytime",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const validateStep1 = () => {
    const err: Record<string, string> = {};
    if (!formData.fullName.trim()) err.fullName = "Full name is required";
    const cleanPhone = formData.phone.replace(/[\s-]/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      err.phone = "Please enter a valid 10-digit Indian phone number";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateStep2 = () => {
    const err: Record<string, string> = {};
    if (!formData.eventType) err.eventType = "Please select an event type";
    if (!formData.eventDate) {
      err.eventDate = "Event date is required";
    } else {
      const selected = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        err.eventDate = "Date cannot be in the past";
      }
    }
    const count = Number(formData.guestCount);
    if (!formData.guestCount || isNaN(count) || count < 1) {
      err.guestCount = "Please enter a valid number of guests";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.foodRequirements.trim()) {
      setErrors({ foodRequirements: "Please specify your preferred food or taste requirements" });
      return;
    }

    const waUrl = getPartyEnquiryWhatsAppUrl(formData);
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto bg-stone-900/90 border border-amber-500/20 rounded-2xl p-6 md:p-8 backdrop-blur shadow-2xl">
      <div className="mb-6">
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-amber-100">
          Planning a Party or Special Occasion?
        </h3>
        <p className="text-stone-300 mt-2 text-sm md:text-base">
          Hosting a birthday, party, family gathering, or special occasion? Tell us what you&apos;re planning and we&apos;ll help you explore the available food options.
        </p>
        <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
          ⚠️ Please enquire 1–2 days in advance.
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-800">
        {[
          { num: 1, label: "Your Details" },
          { num: 2, label: "Event Details" },
          { num: 3, label: "Food & Notes" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step === s.num
                  ? "bg-amber-500 text-stone-950 font-bold ring-4 ring-amber-500/20"
                  : step > s.num
                  ? "bg-emerald-600 text-white"
                  : "bg-stone-800 text-stone-400"
              }`}
            >
              {s.num}
            </span>
            <span className={`text-xs md:text-sm hidden sm:inline ${step === s.num ? "text-amber-300 font-medium" : "text-stone-400"}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {submitted ? (
        <div className="bg-emerald-950/40 border border-emerald-500/40 p-6 rounded-xl text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            ✓
          </div>
          <h4 className="text-xl font-bold text-emerald-300">Enquiry Ready in WhatsApp</h4>
          <p className="text-stone-300 text-sm">
            Your party enquiry is ready in WhatsApp. Please send the message to Aroma Kitchen to complete your enquiry.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setStep(1);
            }}
            className="text-xs text-amber-400 hover:underline pt-2 inline-block"
          >
            Start another enquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Full Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-stone-800/80 border border-stone-700 rounded-lg px-4 py-3 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition"
                />
                {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Phone Number <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-stone-800/80 border border-stone-700 rounded-lg px-4 py-3 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition"
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold py-3 px-6 rounded-lg transition mt-4"
              >
                Continue to Event Details
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Event Type <span className="text-amber-400">*</span>
                </label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full bg-stone-800/80 border border-stone-700 rounded-lg px-4 py-3 text-stone-100 focus:outline-none focus:border-amber-400 transition"
                >
                  <option value="Birthday Party">Birthday Party</option>
                  <option value="Family Gathering">Family Gathering</option>
                  <option value="Get-Together">Get-Together</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="House Party">House Party</option>
                  <option value="Other">Other</option>
                </select>
                {errors.eventType && <p className="text-red-400 text-xs mt-1">{errors.eventType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Event Date <span className="text-amber-400">*</span>
                </label>
                <input
                  type="date"
                  min={getMinDate()}
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full bg-stone-800/80 border border-stone-700 rounded-lg px-4 py-3 text-stone-100 focus:outline-none focus:border-amber-400 transition"
                />
                <p className="text-xs text-stone-400 mt-1">
                  Please place party/special occasion orders at least 1–2 days in advance.
                </p>
                {errors.eventDate && <p className="text-red-400 text-xs mt-1">{errors.eventDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Number of Guests <span className="text-amber-400">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 25"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                  className="w-full bg-stone-800/80 border border-stone-700 rounded-lg px-4 py-3 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition"
                />
                {errors.guestCount && <p className="text-red-400 text-xs mt-1">{errors.guestCount}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium py-3 rounded-lg transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-2/3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold py-3 rounded-lg transition"
                >
                  Continue to Requirements
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Preferred Food / Requirements <span className="text-amber-400">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us what you'd like, dietary preferences, dishes you're interested in, etc."
                  value={formData.foodRequirements}
                  onChange={(e) => setFormData({ ...formData, foodRequirements: e.target.value })}
                  className="w-full bg-stone-800/80 border border-stone-700 rounded-lg px-4 py-3 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition text-sm"
                />
                {errors.foodRequirements && <p className="text-red-400 text-xs mt-1">{errors.foodRequirements}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Additional Details (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Any other requirements or special instructions?"
                  value={formData.additionalDetails}
                  onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
                  className="w-full bg-stone-800/80 border border-stone-700 rounded-lg px-4 py-3 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Preferred Contact Time
                </label>
                <select
                  value={formData.preferredContactTime}
                  onChange={(e) => setFormData({ ...formData, preferredContactTime: e.target.value })}
                  className="w-full bg-stone-800/80 border border-stone-700 rounded-lg px-4 py-3 text-stone-100 focus:outline-none focus:border-amber-400 transition text-sm"
                >
                  <option value="Anytime">Anytime</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium py-3 rounded-lg transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold py-3 rounded-lg shadow-lg shadow-emerald-900/40 transition flex items-center justify-center gap-2"
                >
                  Send Party Enquiry on WhatsApp
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}