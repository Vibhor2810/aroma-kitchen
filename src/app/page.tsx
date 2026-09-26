import { BUSINESS_CONFIG } from "@/app/config/business";
import { getGeneralWhatsAppUrl } from "@/app/utils/whatsapp";
import TodayMenu from "@/app/components/TodayMenu";
import PartyOrderForm from "@/app/components/PartyOrderForm";
import CartModal from "@/app/components/CartModal";
import {
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  MessageSquare,
} from "lucide-react";

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Banner */}
      <div className="bg-amber-500 text-stone-950 px-4 py-2 text-center text-xs sm:text-sm font-semibold tracking-wide">
        🎉 {BUSINESS_CONFIG.firstOrderOffer} • {BUSINESS_CONFIG.deliveryPolicy}
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-amber-200 block leading-tight">
              {BUSINESS_CONFIG.name}
            </span>
            <p className="text-xs text-stone-400 italic">
              &quot;{BUSINESS_CONFIG.tagline}&quot;
            </p>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-stone-300">
            <a href="#about" className="hover:text-amber-300 transition">About</a>
            <a href="#specialties" className="hover:text-amber-300 transition">Specialties</a>
            <a href="#todays-menu" className="hover:text-amber-300 transition">Today&apos;s Menu</a>
            <a href="#party-orders" className="hover:text-amber-300 transition">Party Orders</a>
            <a href="#contact" className="hover:text-amber-300 transition">Contact</a>
          </nav>

          <a
            href={getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-md transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Order on WhatsApp</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-stone-900 border border-amber-500/30 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modern Cloud Kitchen • Rajnagar Extension</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-stone-50 leading-tight">
              Har Baar <span className="text-amber-400 italic">Ghar Jaisa</span> Swad
            </h1>
            <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
              {BUSINESS_CONFIG.description}
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-stone-300">
              {BUSINESS_CONFIG.cuisines.map((c) => (
                <span key={c} className="bg-stone-900 border border-stone-700/80 px-3 py-1 rounded-full">
                  {c}
                </span>
              ))}
              <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
                Delivery in Rajnagar Extension
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="#todays-menu"
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-7 py-3.5 rounded-xl text-center shadow-lg transition flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Today&apos;s Menu</span>
              </a>
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-100 font-semibold px-7 py-3.5 rounded-xl text-center transition flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Order on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-amber-500/20 shadow-2xl relative aspect-[4/3] bg-stone-900">
              <img
                src="https://masalaandchai.com/wp-content/uploads/2022/03/Butter-Chicken.jpg"
                alt="Aroma Kitchen freshly prepared food"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 bg-stone-900/90 backdrop-blur p-4 rounded-xl border border-stone-800">
                <p className="text-amber-300 font-bold text-sm">Fresh Ingredients &amp; Generous Portions</p>
                <p className="text-stone-300 text-xs mt-0.5">
                  Delivered straight from our kitchen to your doorstep.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Highlights Bar */}
      <section className="bg-stone-900/60 py-6 border-b border-stone-800 text-stone-300 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center justify-center">
            <span className="font-bold text-amber-300 text-base">Indian • Chinese • South Indian</span>
            <span className="text-xs text-stone-400 mt-1">Authentic regional flavors</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="font-bold text-amber-300 text-base">Freshly Prepared Daily</span>
            <span className="text-xs text-stone-400 mt-1">Homestyle warmth</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="font-bold text-amber-300 text-base">Free Delivery</span>
            <span className="text-xs text-stone-400 mt-1">On orders above ₹200</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="font-bold text-amber-300 text-base">9 AM – 9 PM</span>
            <span className="text-xs text-stone-400 mt-1">Tue – Sun (Mon Off)</span>
          </div>
        </div>
      </section>

      {/* What Makes Us Special */}
      <section id="about" className="py-16 md:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            About Aroma Kitchen
          </span>
          <h2 className="text-3xl font-serif font-bold text-stone-100 mt-2">
            What Makes Aroma Kitchen Special
          </h2>
          <p className="text-stone-300 mt-4 leading-relaxed">
            {BUSINESS_CONFIG.specialNote}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-stone-900/60 border border-stone-800 p-6 rounded-xl">
            <h3 className="font-serif font-bold text-amber-200 text-lg mb-2">Fresh Ingredients</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Every meal is prepared with carefully selected quality ingredients and an authentic homemade touch.
            </p>
          </div>
          <div className="bg-stone-900/60 border border-stone-800 p-6 rounded-xl">
            <h3 className="font-serif font-bold text-amber-200 text-lg mb-2">Generous Portions</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Hearty, satisfying meals designed for genuine homestyle dining with your family and guests.
            </p>
          </div>
          <div className="bg-stone-900/60 border border-stone-800 p-6 rounded-xl">
            <h3 className="font-serif font-bold text-amber-200 text-lg mb-2">Changing Daily Menu</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              A rotating menu throughout the week gives you something fresh and exciting to look forward to every day.
            </p>
          </div>
        </div>
      </section>

      {/* Signature Weekly Highlights */}
      <section id="specialties" className="py-16 bg-stone-900/40 border-t border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Weekly Highlights
            </span>
            <h2 className="text-3xl font-serif font-bold text-stone-100 mt-2">
              Signature Dishes &amp; Special Days
            </h2>
            <p className="text-stone-400 text-sm mt-2">
              Recurring highlights to anticipate during the week. Check Today&apos;s Menu below for active daily availability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BUSINESS_CONFIG.specials.map((spec) => (
              <div
                key={spec.title}
                className="bg-stone-950 border border-stone-800 p-6 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase">
                    {spec.title}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-stone-100 mt-1 mb-2">
                    {spec.dish}
                  </h3>
                  <p className="text-amber-200/90 font-medium text-sm mb-2">{spec.pricing}</p>
                </div>
                <p className="text-stone-500 text-xs italic mt-4">{spec.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE DATE-BASED TODAY'S MENU (Includes Floating Cart Bar) */}
      <TodayMenu />

      {/* PARTY & SPECIAL OCCASION ORDERS */}
      <section id="party-orders" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PartyOrderForm />
        </div>
      </section>

      {/* How to Order */}
      <section className="py-16 bg-stone-900/60 border-t border-stone-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-center text-stone-100 mb-12">
            How Ordering Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
            {[
              { step: "1", title: "Check Today's Menu", desc: "Browse daily prepared dishes" },
              { step: "2", title: "Choose Food", desc: "Select items and portions" },
              { step: "3", title: "Tap WhatsApp", desc: "Contextual pre-filled message" },
              { step: "4", title: "We Confirm", desc: "Direct confirmation & total" },
              { step: "5", title: "Enjoy Fresh Meal", desc: "Doorstep delivery in Rajnagar Ext." },
            ].map((s) => (
              <div key={s.step} className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm mb-2">
                  {s.step}
                </span>
                <h3 className="font-bold text-stone-200 text-sm">{s.title}</h3>
                <p className="text-stone-400 text-xs mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Details */}
      <section id="contact" className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-serif font-bold text-amber-200 mb-4">
              Aroma Kitchen by Isha
            </h2>
            <div className="space-y-3 text-stone-300 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>{BUSINESS_CONFIG.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Phone / WhatsApp: {BUSINESS_CONFIG.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Hours: {BUSINESS_CONFIG.businessHours} (Closed on Mondays)</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>FSSAI License: {BUSINESS_CONFIG.fssaiLicenseNumber}</span>
              </div>
              <div className="flex items-center gap-3">
                <InstagramIcon className="w-5 h-5 text-pink-400 shrink-0" />
                <a
                  href={BUSINESS_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-stone-200"
                >
                  @{BUSINESS_CONFIG.instagram}
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 bg-stone-950 rounded-xl border border-stone-800 flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-200">
              Need fresh meals or party food?
            </h3>
            <p className="text-xs text-stone-400">
              Chat directly with our kitchen for today&apos;s orders and advance enquiries.
            </p>
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-sm shadow transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-stone-950 border-t border-stone-900 py-10 pb-28 md:pb-10 text-stone-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <p className="font-serif font-bold text-stone-200 text-sm">
              {BUSINESS_CONFIG.name}
            </p>
            <p className="text-stone-500 italic mt-0.5">&quot;{BUSINESS_CONFIG.tagline}&quot;</p>
            <p className="mt-1 text-stone-400">FSSAI Licence No. {BUSINESS_CONFIG.fssaiLicenseNumber}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#todays-menu" className="hover:text-amber-300 transition">Today&apos;s Menu</a>
            <a href="#party-orders" className="hover:text-amber-300 transition">Party Orders</a>
            <a href={BUSINESS_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition">Instagram</a>
            <a href={getGeneralWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition">WhatsApp Order</a>
          </div>
        </div>
      </footer>

      {/* Cart Drawer Slide-Over Modal */}
      <CartModal />
    </div>
  );
}