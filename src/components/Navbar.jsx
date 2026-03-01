"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X, User, LogOut, LayoutDashboard, Calendar, Search } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const borderRadius = useTransform(scrollY, [0, 50], [0, 32]);
  const width = useTransform(scrollY, [0, 50], ["100%", "90%"]);
  const top = useTransform(scrollY, [0, 50], [0, 16]);
  const shadow = useTransform(scrollY, [0, 50], ["none", "0 10px 30px rgba(0,0,0,0.05)"]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("user");

  return (
    <motion.nav
      style={{
        borderRadius,
        width,
        top,
        boxShadow: shadow,
      }}
      className="fixed left-1/2 -translate-x-1/2 z-50 bg-white/50 backdrop-blur-md flex items-center justify-between px-8 py-4 transition-all duration-300"
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold text-zinc-900 tracking-tighter">
          Medi<span className="text-blue-600">Help</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/doctors" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Find Doctors</Link>
          <Link href="/appointments" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Appointments</Link>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Link 
              href={userRole === "admin" ? "/admin" : "/dashboard"}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="p-2 text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-blue-600 transition-colors">Login</Link>
            <Link 
              href="/register" 
              className="text-sm font-medium px-5 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-white border-b border-zinc-100 p-6 flex flex-col gap-4 md:hidden shadow-xl rounded-b-2xl"
        >
          <Link href="/doctors" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Find Doctors</Link>
          <Link href="/appointments" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Appointments</Link>
          <div className="h-px bg-zinc-100 my-2" />
          <Link href="/login" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Login</Link>
          <Link href="/register" className="text-lg font-medium text-blue-600" onClick={() => setIsOpen(false)}>Sign Up</Link>
        </motion.div>
      )}
    </motion.nav>
  );
}
