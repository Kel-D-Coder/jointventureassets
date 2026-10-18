/** The standalone admin dashboard (jointventureassets-dashboard), linked for Admin accounts. */
export const ADMIN_DASHBOARD_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:5175";

export const CONTACT_EMAIL = "info@jointventureassets.com";
export const WHATSAPP_URL = "https://wa.me/23408140431570";

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Listings" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/blog", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

/** Phone lines shown in the homepage hero. `tel` is the international form for tap-to-call. */
export const PHONE_NUMBERS = [
  { display: "0807 303 3354", tel: "+2348073033354" },
  { display: "0906 366 5415", tel: "+2349063665415" },
  { display: "0807 302 2775", tel: "+2348073022775" },
];
