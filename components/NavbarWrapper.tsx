"use client"

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"

export default function NavbarWrapper() {
    const pathname = usePathname();
    const hideNav = pathname === "/login" || pathname === "/register" || pathname === "/complete-profile";

    return !hideNav ? <Navbar /> : null;
}