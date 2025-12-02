"use client"

import Link from "next/link";

import logo from "@/assets/logo/jva_1-removebg-preview (1).png"
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter()
  return (
    <footer className="bg-gray-900 text-gray-200 pt-10 pb-4 px-4 sm:px-8 mt-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Logo & Name */}
        <div className="flex items-center gap-3 mb-6 md:mb-0">
          <Image src={logo} alt="Logo" width={100} height={100} onClick={() => router.push("/")} className="hover:cursor-pointer" />
        </div>
        {/* Navigation Links */}
        <div className="flex gap-8 mb-6 md:mb-0">
          <Link href="/" className="hover:text-yellow-400 transition-colors">
            Home
          </Link>
          <Link href="how-it-works" className="hover:text-yellow-400 transition-colors">
            How It Works
          </Link>
          <Link href="contact" className="hover:text-yellow-400 transition-colors">
            Contact
          </Link>
        </div>
        {/* Contact Info */}
        <div className="text-sm text-gray-400 text-center md:text-right">
          <div>Email: <a href="mailto:info@jointventureassets.com" className="text-yellow-400 hover:underline">info@jointventureassets.com</a></div>
          <div>© {new Date().getFullYear()} Joint Venture Assets. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}