"use client"

import { usePathname } from "next/navigation"
import Footer from "./Footer";

export default function FooterWrapper() {
    const pathname = usePathname();
    const hideNav = pathname === "/login" || pathname === "/register" || pathname === "/complete-profile" || pathname === "/forgot-password" || pathname === "/forgot-password/verify-otp" || pathname === "/reset-password" || pathname === "/admin" || pathname === "/admin/users" || pathname === "/admin/requests" || pathname === "/admin/settings";

    return !hideNav ? <Footer /> : null;
}