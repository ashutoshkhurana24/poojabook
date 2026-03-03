import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { SessionProvider } from "@/components/SessionProvider";
import ChatWidget from "@/components/ChatWidget";
import NotificationPrompt from "@/components/NotificationPrompt";
import TourOverlay from "@/components/TourOverlay";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PoojaBook - Book Divine Poojas",
  description: "Discover and book authentic poojas at temples or at-home. Experienced pandits, transparent pricing, and divine experiences.",
  keywords: "pooja, hindu rituals, temple booking, pandit, divine services",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={`${playfair.variable} ${dmSans.variable} antialiased min-h-screen`}>
        <LanguageProvider>
          <SessionProvider>
            <Header />
            <main className="min-h-[calc(100vh-80px)]">
              {children}
            </main>
            <ChatWidget />
            <NotificationPrompt />
            <TourOverlay />
            <Footer />
          </SessionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
