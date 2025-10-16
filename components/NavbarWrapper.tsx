"use client"

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"

export default function NavbarWrapper() {
    const pathname = usePathname();
    console.log(pathname)
    const hideNav = pathname === "/login" || pathname === "/register";

    return !hideNav ? <Navbar /> : null;
}