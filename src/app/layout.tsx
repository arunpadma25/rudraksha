import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/Toaster";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getSessionUser } from "@/lib/auth";
import { env } from "@/lib/env";

const title = "Rudraksha Sacred Store | Home-Grown Organic Beads from Karnataka";
const description =
  "Pure organic, home-grown rudraksha beads from our own family farm near Mangalore, Karnataka. 1 Mukhi to 14 Mukhi and rare specials, with multi-currency pricing and worldwide shipping.";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: title,
    template: "%s | Rudraksha Sacred Store",
  },
  description,
  applicationName: "Rudraksha Sacred Store",
  keywords: [
    "rudraksha",
    "organic rudraksha",
    "mukhi rudraksha",
    "rudraksha mala",
    "Mangalore",
    "Karnataka",
  ],
  openGraph: {
    type: "website",
    siteName: "Rudraksha Sacred Store",
    title,
    description,
    url: env.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppButton />
        <Toaster />
      </body>
    </html>
  );
}
