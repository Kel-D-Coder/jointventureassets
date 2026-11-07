import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import FooterWrapper from "@/components/layout/FooterWrapper";
import StoreProvider from "@/store/StoreProvider";
import { SessionWatcher } from "@/components/auth/SessionWatcher";
import CookieConsentBanner from "@/components/layout/CookieConsentBanner";
import { SHARE_IMAGE, SITE_URL } from "@/lib/site";

/** Body, forms, buttons and numbers. */
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap'
});

/** Headings only (24px and up): it gets too delicate for small text. */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap'
});

/** Defaults for every page. Each public page sets its own title, description and canonical link. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Joint Venture Assets | Real Estate & Investment Partnerships",
  description:
    "Joint Venture Assets connects landowners, investors and developers for real estate joint ventures, land and property sales across Nigeria.",
  openGraph: {
    siteName: "Joint Venture Assets",
    locale: "en_NG",
    type: "website",
    images: [{ url: SHARE_IMAGE, alt: "Joint Venture Assets" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
           dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Joint Venture Assets",
              url: SITE_URL,
              logo: `${SITE_URL}${SHARE_IMAGE}`,
              sameAs: [
                "https://www.linkedin.com/company/jointventureassets",
                "https://www.facebook.com/profile.php?id=61585879203670",
              ],
            })
          }}
        />
      </head>
      <body
        className="antialiased"
      >
        <StoreProvider>
          <SessionWatcher />
          <NavbarWrapper />
          {children}
          <CookieConsentBanner />
          <FooterWrapper />
        </StoreProvider>
      </body>
    </html>
  );
}
