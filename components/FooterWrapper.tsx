"use client"

import { usePathname } from "next/navigation"
import Footer from "./Footer";

export default function FooterWrapper() {
    const pathname = usePathname();
    console.log(pathname)
    const hideNav = pathname === "/login" || pathname === "/register";

    return !hideNav ? <Footer /> : null;
}