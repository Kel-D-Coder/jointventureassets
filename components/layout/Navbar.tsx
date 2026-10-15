"use client"

import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiChevronDown, FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { logout } from "@/store/authSlice";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { isTokenExpired } from "@/utils/decodeToken";
import { Toaster } from "react-hot-toast";
import { ADMIN_DASHBOARD_URL, mainNav } from "@/lib/site";
import { cx } from "@/lib/format";

import Logo from "@/assets/logo/jva_2-removebg-preview.png"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  const links = isAuthenticated ? [...mainNav.slice(0, 2), { href: "/browse-requests", label: "Requests" }, ...mainNav.slice(2)] : mainNav;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    setMenuOpen(false);
    router.push("/");
  };

  // Sign out once the session token has expired.
  useEffect(() => {
    if (token && isTokenExpired(token)) dispatch(logout());
  }, [token, dispatch]);

  // While the mobile menu is open: stop the page scrolling behind it, and let Escape close it.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Close the menus whenever the page changes.
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-18 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8" aria-label="Main">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Joint Venture Assets home">
          <Image src={Logo} alt="" width={96} height={96} className="h-14 w-auto object-contain" priority />
        </Link>

        <ul className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cx(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  isActive(link.href) ? "bg-ink text-white" : "text-gray-700 hover:bg-ivory hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                className="flex items-center gap-2.5 rounded-full border border-line py-1.5 pr-3 pl-1.5 text-sm font-semibold text-ink hover:border-gray-400"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gold-soft text-xs font-bold text-gold-deep">
                  {user.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                </span>
                {user.fullName.split(" ")[0]}
                <FiChevronDown aria-hidden="true" />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-white py-1.5 shadow-xl"
                  >
                    <p className="border-b border-line px-4 pt-1.5 pb-2.5 text-xs text-muted">
                      Signed in as <span className="font-semibold text-ink">{user.role}</span>
                    </p>
                    <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-ivory">
                      <FiUser aria-hidden="true" /> My dashboard
                    </Link>
                    <Link href="/dashboard/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-ivory">
                      <FiSettings aria-hidden="true" /> My profile
                    </Link>
                    {user.role === "Admin" && (
                      <a href={ADMIN_DASHBOARD_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-ivory">
                        <FiSettings aria-hidden="true" /> Admin dashboard
                      </a>
                    )}
                    <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-700 hover:bg-red-50">
                      <FiLogOut aria-hidden="true" /> Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-gray-700 hover:text-ink">
                Log in
              </Link>
              <Link href="/register" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold hover:text-ink">
                Get started
              </Link>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1 lg:hidden">
          <Link href="/listings" className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-ivory" aria-label="Search listings">
            <FiSearch aria-hidden="true" className="h-5 w-5" />
          </Link>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-ivory" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <FiMenu aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
      </nav>
      <Toaster />
    </header>

      {/* Outside <header>: its backdrop blur would otherwise trap this full-screen menu inside the header bar. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-white px-5 py-4 lg:hidden"
          >
            <div className="mb-6 flex items-center justify-between">
              <Image src={Logo} alt="Joint Venture Assets" width={96} height={96} className="h-14 w-auto object-contain" />
              <button type="button" className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-ivory" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <FiX aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cx("block rounded-xl px-4 py-3 font-display text-2xl", isActive(link.href) ? "bg-ivory text-ink" : "text-gray-700")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto space-y-2 border-t border-line pt-5">
              {isAuthenticated && user ? (
                <>
                  <Link href="/dashboard" className="block rounded-xl bg-ink px-4 py-3 text-center font-semibold text-white">
                    My dashboard
                  </Link>
                  {user.role === "Admin" && (
                    <a href={ADMIN_DASHBOARD_URL} target="_blank" rel="noreferrer" className="block rounded-xl border border-line px-4 py-3 text-center font-semibold text-ink">
                      Admin dashboard
                    </a>
                  )}
                  <button type="button" onClick={handleLogout} className="block w-full rounded-xl px-4 py-3 text-center font-semibold text-red-700">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/register" className="block rounded-xl bg-ink px-4 py-3 text-center font-semibold text-white">
                    Get started
                  </Link>
                  <Link href="/login" className="block rounded-xl border border-line px-4 py-3 text-center font-semibold text-ink">
                    Log in
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
