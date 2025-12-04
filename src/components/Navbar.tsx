"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { usePathname, useRouter } from 'next/navigation'; 
import { Menu, User, LogOut, LayoutDashboard, X } from 'lucide-react';
import { motion } from 'framer-motion'; 

// لیست لینک‌های اصلی
const navLinks = [
    { name: "خانه", href: "/" },
    { name: "رویدادها", href: "/events" },
    { name: "وبلاگ", href: "/blog" },
    { name: "نشریه", href: "/journals" }, 
    { name: "اعضا", href: "/team" },
    { name: "تماس", href: "/contact" },
];

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const pathname = usePathname(); 
  const router = useRouter();

  const checkUser = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 20); };
    window.addEventListener('scroll', handleScroll);
    
    checkUser();

    const handleAuthChange = () => { checkUser(); };
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('auth-change', handleAuthChange);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
  };
  
  const menuVariants = {
    hidden: { y: "-100%" },
    visible: { y: "0%", transition: { duration: 0.3 } },
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 z-50 w-full transition-all duration-300 flex justify-center ${
        scrolled 
          ? "border-b border-white/10 bg-slate-950/90 py-2 backdrop-blur-md shadow-2xl" 
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
              {/* 🚨 FIX 2: حذف لینک‌های Dashboard/Admin از نوار اصلی */}
              
              <button 
                onClick={handleLogout} 
                // 🚨 FIX: کاهش Padding در موبایل (p-2) و آیکون (h-4 w-4)
                className="rounded-full bg-red-500/10 p-2 sm:p-3 text-red-400 hover:bg-red-500 hover:text-white transition"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          ) : (
            <Link 
              href="/auth/login"
              // 🚨 FIX 1: کاهش شدید اندازه دکمه برای موبایل‌های کوچک (XS)
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-blue-600 px-3 py-1.5 text-xs sm:px-6 sm:py-3 sm:text-base font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <User className="h-4 w-4" /> ورود
              </span>
            </Link>
          )}

          {/* دکمه منوی موبایل */}
          <button 
            className="lg:hidden text-white p-2 sm:p-3 rounded-lg z-20" 
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </div>
      </motion.nav>


      {/* === MOBILE MENU === */}
      <motion.div
        variants={menuVariants}
        initial="hidden"
        animate={isMobileMenuOpen ? "visible" : "hidden"}
        className="fixed inset-0 z-[51] bg-slate-950 lg:hidden flex flex-col" 
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">منوی اصلی</h2>
            <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
                <X className="h-6 w-6" />
            </button>
        </div>
        
        <div className="flex flex-col gap-1 p-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-xl font-medium transition-colors py-3 px-2 rounded-lg ${
                pathname === link.href 
                  ? "text-blue-400 bg-blue-900/20 font-bold" 
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        {/* دکمه‌های اکشن - موبایل (شامل داشبورد و ادمین) */}
        <div className="mt-auto p-6 border-t border-white/10 space-y-3">
            {user && (
                <>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="bg-blue-600 text-white font-bold py-3 w-full rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30">
                        <User className="h-5 w-5" /> داشبورد کاربری
                    </Link>
                    {user.role === 'admin' && (
                        <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="bg-purple-600 text-white font-bold py-3 w-full rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30">
                            <LayoutDashboard className="h-5 w-5" /> پنل مدیریت
                        </Link>
                    )}
                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 w-full rounded-xl flex items-center justify-center gap-2">
                        <LogOut className="h-5 w-5" /> خروج
                    </button>
                </>
            )}
        </div>
      </motion.div>
    </>
  );
}