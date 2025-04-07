"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@react-email/components";
import { Menu, X, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  //const userId :string = session?.user.id;
  const ownerId = typeof window !== "undefined" ? localStorage.getItem("ownerId") : null;
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("dark");


  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);


  // Toggle dark mode
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center py-4">

        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-2">
          <motion.img
            src="/logo.png"
            alt="Zaiqa Logo"
            className="h-10 w-10 object-contain"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-yellow-400 bg-clip-text text-transparent cursor-pointer"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            ZAIQA EXPRESS
          </motion.div>
        </Link>


        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-gray-700 dark:text-gray-300">
          {session ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Welcome, {user?.name || user.email}</span>
              <Link href="/" className="hover:text-blue-500 transition">Home</Link>
              {user.isAdmin && <Link href="/admin-dashboard" className="hover:text-blue-500 transition">Admin Dashboard</Link>}
              {ownerId && <Link href={`seller-dashboard/${ownerId}`} className="hover:text-blue-500 transition">Seller Dashboard</Link>}
              <Link href={`/dashboard/${user.id}`} className="hover:text-blue-500 transition">Dashboard</Link>
          
            
              <Button
                onClick={() => signOut()}
                className="px-4 py-2 w-20 h-6 text-center hover:cursor-pointer cursor-pointer bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link href="/sign-in" className="hover:text-blue-500 transition">Sign In</Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Sign Up
              </Link>

            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="text-gray-700 dark:text-white  focus:outline-none"
        >
          {theme === "dark" ? (
            <Sun className="h-6 w-6 text-yellow-400" />
          ) : (
            <Moon className="h-6 w-6 text-white-900" />
          )}
        </button>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden block text-gray-700 dark:text-white focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white dark:bg-gray-900 shadow-md"
          >
            <div className="flex flex-col items-center space-y-4 py-4 text-gray-800 dark:text-gray-300">
              {session ? (
                <>
                  <span className="text-sm font-medium">Welcome, {user?.name || user?.email}</span>
                  <Link href="/" className="hover:text-blue-500 transition">Home</Link>
                  {user.isAdmin && <Link href="/admin-dashboard" className="hover:text-blue-500 transition">Admin Dashboard</Link>}
                  {ownerId && <Link href={`seller-dashboard/${ownerId}`} className="hover:text-blue-500 transition">Seller Dashboard</Link>}
                  <Link href={`/dashboard/${user.id}`} className="hover:text-blue-500 transition">Dashboard</Link>
            
                  <Button
                    onClick={() => signOut()}
                    className="px-4 py-2 w-20 h-6 text-center hover:cursor-pointer cursor-pointer bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/sign-in" className="hover:text-blue-500 transition">Sign In</Link>
                  <Link
                    href="/sign-up"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
