import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import FooterWrapper from "@/components/layout/FooterWrapper";
import StoreProvider from "@/store/StoreProvider";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CookieConsentBanner from "@/components/layout/CookieConsentBanner";

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap'
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-fraunces',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Joint Venture Assets | Real Estate & Investment Partnerships",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
           dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Joint Venture Assets",
              url: "https://www.jointventureassets.com",
              logo: "https://www.jointventureassets.com/logo.png",
              sameAs: [
                "https://www.linkedin.com/company/jointventureassets",
                "https://www.facebook.com/profile.php?id=61585879203670",
              ],
            })
          }}
        />
      </head>
      <body
        className={`${manrope.variable} ${fraunces.variable} antialiased`}
      >
        <StoreProvider>
          <NavbarWrapper />
          {children}
          <CookieConsentBanner />
          <FooterWrapper />
          <WhatsAppButton />
        </StoreProvider>
      </body>
    </html>
  );
}
