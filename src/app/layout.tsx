import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { SessionProvider } from "@/components/SessionProvider";
import ChatWidget from "@/components/ChatWidget";
import NotificationPrompt from "@/components/NotificationPrompt";

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
        <SessionProvider>
          <Header />
          <main className="min-h-[calc(100vh-80px)]">
            {children}
          </main>
          <ChatWidget />
          <NotificationPrompt />
          <footer className="bg-secondary text-white py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-heading text-xl mb-4">PoojaBook</h3>
                  <p className="text-sm text-gray-300">Your trusted platform for divine services across India.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li><a href="/poojas" className="hover:text-accent">Browse Poojas</a></li>
                    <li><a href="/about" className="hover:text-accent">About Us</a></li>
                    <li><a href="/contact" className="hover:text-accent">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Services</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li><a href="/poojas?mode=IN_TEMPLE" className="hover:text-accent">Temple Poojas</a></li>
                    <li><a href="/poojas?mode=AT_HOME" className="hover:text-accent">At-Home Poojas</a></li>
                    <li><a href="/poojas?mode=ONLINE" className="hover:text-accent">Online Poojas</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Contact</h4>
                  <p className="text-sm text-gray-300">support@poojabook.com</p>
                  <p className="text-sm text-gray-300">+91 98765 43210</p>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
                © 2026 PoojaBook. All rights reserved.
              </div>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
