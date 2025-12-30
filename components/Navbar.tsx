"use client"

import Link from "next/link";
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { logout } from "@/store/authSlice";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { isTokenExpired } from "@/utils/decodeToken";
import { Toaster } from "react-hot-toast"
import { signOut } from "next-auth/react"

import Logo from "@/assets/logo/jva_2-removebg-preview.png"
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ redirect: false })
    dispatch(logout());
    router.push("/");
    setUserMenuOpen(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) return 

      if (isTokenExpired(token)) {
        dispatch(logout());
        await signOut({ redirect: false })
      }
    };
    
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <nav className="w-full bg-white shadow flex items-center px-4 sm:px-8 py-3 relative">
      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Image 
          src={Logo} 
          alt="logo" 
          width={80} 
          // height={20}
          className="h-full w-[100px] object-contain hover:cursor-pointer"  
          onClick={() => router.push("/")}
        />
      </div>
      {/* Centered Navigation Links */}
      <div className="hidden md:flex flex-1 justify-center items-center gap-10">
        <Link 
          href="/" 
          className={`${pathname === '/' ? 'text-yellow-500' : 'text-gray-700'} hover:text-yellow-500 font-medium transition-colors`}
        >
          Home
        </Link>
        <Link 
          href="/how-it-works" 
          className={`${pathname === '/how-it-works' ? 'text-yellow-500' : 'text-gray-700'} hover:text-yellow-500 font-medium transition-colors`}
        >
          How It Works
        </Link>
        {isAuthenticated && (
          <Link 
            href="/browse-requests" 
            className={`${pathname === '/browse-requests' ? 'text-yellow-500' : 'text-gray-700'} hover:text-yellow-500 font-medium transition-colors`}
          >
            Browse Requests
          </Link>
        )}
        <Link 
          href="/contact" 
          className={`${pathname === '/contact' ? 'text-yellow-500' : 'text-gray-700'} hover:text-yellow-500 font-medium transition-colors`}
        >
          Contact
        </Link>
      </div>
      {/* Actions Right */}
      <div className="hidden md:flex items-center gap-3">
        {isAuthenticated && user ? (
          <div className="relative">
            <motion.button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiUser className="text-gray-700" size={20} />
              <span className="text-gray-900 font-medium">{user.fullName.split(" ")[0]}</span>
            </motion.button>
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FiUser size={16} />
                    <span>Dashboard</span>
                  </Link>
                  {
                    user.role === 'Admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FiSettings size={16} />
                        <span>Admin Panel</span>
                      </Link>
                    )
                  }
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors text-red-600 w-full"
                  >
                    <FiLogOut size={16} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
            <Link 
              href="/login" 
              className={`${pathname === '/login' ? 'text-yellow-500' : 'text-gray-700'} hover:text-yellow-500 font-medium transition-colors`}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gray-900 hover:bg-yellow-400 text-white hover:text-gray-900 font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
      {/* Mobile Menu Icon */}
      <button
        className="md:hidden text-gray-900 text-2xl ml-auto"
        aria-label="Open menu"
        onClick={() => setMenuOpen(true)}
      >
        <FiMenu />
      </button>
      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 bg-white shadow-lg flex flex-col px-4 py-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-shrink-0">
        <Image 
          src={Logo} 
          alt="logo" 
          width={80} 
          // height={20}
          className="h-full w-[100px] object-contain hover:cursor-pointer"  
          onClick={() => router.push("/")}
        />
      </div>
              <button
                className="text-gray-900 text-2xl"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <FiX />
              </button>
            </div>
            <Link href="/" className="py-2 text-gray-900 hover:text-yellow-500 font-medium" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/how-it-works" className="py-2 text-gray-900 hover:text-yellow-500 font-medium" onClick={() => setMenuOpen(false)}>
              How It Works
            </Link>
            {isAuthenticated && user ? (
              <>
                <Link href="/dashboard" className="py-2 text-gray-900 hover:text-yellow-500 font-medium" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/browse-requests" className="py-2 text-gray-900 hover:text-yellow-500 font-medium" onClick={() => setMenuOpen(false)}>
                  Browse Requests
                </Link>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 px-2 py-2 mb-2">
                    <FiUser className="text-gray-700" size={20} />
                    <span className="text-gray-900 font-medium">{user.fullName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 py-2 text-red-600 hover:text-red-700 font-medium w-full"
                  >
                    <FiLogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="py-2 text-gray-900 hover:text-yellow-500 font-medium" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link
                  href="/register"
                  className="py-2 mt-2 bg-gray-900 hover:bg-yellow-400 text-white hover:text-gray-900 font-semibold px-5 rounded-lg transition-colors text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster />
    </nav>
  );
}