import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import StoreProvider from "@/store/StoreProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import AuthSync from "@/components/AuthSync";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "jointventureassets.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <StoreProvider>
          <AuthProvider>
            <AuthSync />
              <NavbarWrapper />
              {children}
              <CookieConsentBanner />
              <FooterWrapper />
              <WhatsAppButton />
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
