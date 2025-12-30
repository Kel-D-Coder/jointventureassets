import HomeClient from "@/components/HomeClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Joint Venture Assets | Real Estate Joint Venture Platform",
  description: "Joint Venture Assets connects landowners, investors, cooperatives, and government entities for profitable real estate joint ventures and property development across Nigeria.",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.jointventureassets.com/",
  },
};

export default function Home() {

  return (
    <>
      <HomeClient />
    </>
  );
}