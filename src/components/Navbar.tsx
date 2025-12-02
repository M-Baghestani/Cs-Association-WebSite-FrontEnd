"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { usePathname } from 'next/navigation'; 
import { Menu, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion'; 

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname(); 

  const checkUser = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    checkUser();

    const handleAuthChange = () => {
        checkUser();
    };

    window.addEventListener('auth-change', handleAuthChange);
    
    checkUser();

    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('auth-change', handleAuthChange);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    window.location.href = "/";
  };

  const navLinks = [
    { name: "خانه", href: "/" },
    { name: "رویدادها", href: "/events" },
    { name: "وبلاگ", href: "/blog" },
    { name: "نشریه", href: "/journals" }, // 👈 اضافه شد
    { name: "اعضا", href: "/team" },
    { name: "تماس", href: "/contact" },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 flex justify-center ${
        scrolled 
          ? "border-b border-white/10 bg-slate-950/90 py-2 backdrop-blur-xl shadow-2xl" 
          : "border-b border-transparent bg-transparent py-4"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* === LOGO === */}
        <Link href="/" className="group flex items-center gap-4 text-2xl font-bold text-white transition z-20">
          <div className="relative flex h-[60px] w-[60px] items-center justify-center rounded-2xl transition group-hover:scale-110 group-hover:bg-white/10">
             <Image 
              src="/icon.png"
              alt="CS Logo" 
              width={100} 
              height={100} 
              className="object-contain brightness-0 invert" 
              unoptimized 
            />
          </div>
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:to-white hidden sm:block">
            CS Association
          </span>
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:to-white sm:hidden">
            CSA
          </span>
        </Link>

        {/* === DESKTOP MENU === */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 rounded-full border border-white/5 bg-white/5 p-1 backdrop-blur-md z-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`relative px-5 py-2 text-base font-medium transition-colors ${
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* === BUTTONS === */}
        <div className="flex items-center gap-4 z-20">
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'admin' && (
                <Link href="/admin" className="hidden xl:flex items-center gap-2 rounded-full bg-slate-800 px-5 py-2.5 text-sm font-bold text-white border border-slate-700 hover:bg-slate-700 transition">
                   <LayoutDashboard className="h-4 w-4" /> پنل
                </Link>
              )}

              <Link href="/dashboard" className="hidden md:flex items-center gap-2 text-base font-medium text-gray-300 hover:text-white transition">
                <span className="text-blue-400">داشبورد</span>
              </Link>
              
              <button onClick={handleLogout} className="rounded-full bg-red-500/10 p-3 text-red-400 hover:bg-red-500 hover:text-white transition">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link 
              href="/auth/login"
              className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-blue-600 px-6 py-3 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <User className="h-5 w-5" /> ورود
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Link>
          )}

          <button className="text-gray-300 lg:hidden ml-2">
            <Menu className="h-8 w-8" />
          </button>
        </div>

      </div>
    </motion.nav>
  );
}