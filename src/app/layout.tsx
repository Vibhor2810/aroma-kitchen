import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import CartModal from "@/app/components/CartModal";

export const metadata: Metadata = {
  title: "Aroma Kitchen by Isha | Freshly Prepared Ghar Ka Swad",
  description:
    "Authentic North Indian Cloud Kitchen in Rajnagar Extension, Ghaziabad. Fresh daily menu, homestyle dishes, and party catering.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#121212] text-zinc-100 antialiased min-h-screen selection:bg-amber-500/30 selection:text-amber-200">
        <CartProvider>
          {children}
          <CartModal />
        </CartProvider>
      </body>
    </html>
  );
}