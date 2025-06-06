"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { Mail, PhoneCall, MapPin } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const ownerId = mounted ? localStorage.getItem("ownerId") : null

  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-12 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {/* Logo and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Image src="/logo.png" alt="Zaiqa Express Logo" width={40} height={40} className="h-10 w-10" />
              <span className="text-lg font-bold bg-gradient-to-r from-orange-500 via-red-500 to-yellow-400 bg-clip-text text-transparent">
                Zaiqa Express
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">
              Bringing your favorite flavors to your doorstep – fast, fresh & flavorful.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <h3 className="text-md font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/">About Us</Link></li>
              <li><Link href="/">Privacy Policy</Link></li>
              <li><Link href="/">FAQs</Link></li>
              <li><Link href="/">Contact</Link></li>
            </ul>
          </motion.div>

          {/* Get Involved */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h3 className="text-md font-semibold mb-2">Get Involved</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/become-seller">Become a Seller</Link></li>
              <li><Link href={`/seller-dashboard/${ownerId}`}>Seller Dashboard</Link></li>
              <li><Link href="/sign-up">Register</Link></li>
              <li><Link href="/sign-in">Login</Link></li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <h3 className="text-md font-semibold mb-2">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4" />
                +92 321 8971071
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                technologistan0@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Punjab, Pakistan
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      <Separator className="bg-gray-300 dark:bg-gray-700 my-2" />

      <div className="text-center py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Zaiqa Express. All rights reserved.
      </div>
    </footer>
  )
}
