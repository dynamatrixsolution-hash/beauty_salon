import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AIConcierge from "@/components/layout/AIConcierge";
import PromoPopup from "@/components/layout/PromoPopup";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glow & Grace Studio | Premium Beauty Salon & Spa Nepal",
  description: "Experience the ultimate in luxury beauty, hair styling, bridal makeup, skin treatment, and wellness at Nepal's premier salon, Glow & Grace Studio.",
  keywords: "salon nepal, beauty parlour kathmandu, bridal makeup nepal, hair styling, skin treatment, facial nepal, glow and grace, spa kathmandu",
  authors: [{ name: "Glow & Grace Studio" }],
  openGraph: {
    title: "Glow & Grace Studio | Premium Beauty Salon & Spa",
    description: "Experience the ultimate in luxury beauty, hair styling, bridal makeup, and skin treatment at Glow & Grace Studio Nepal.",
    type: "website",
    locale: "ne_NP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full scroll-smooth antialiased"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-brand-beige text-brand-charcoal selection:bg-brand-pink-accent selection:text-brand-charcoal-dark">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <AIConcierge />
        <PromoPopup />
      </body>
    </html>
  );
}
