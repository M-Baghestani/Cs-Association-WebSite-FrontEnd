"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { usePathname, useRouter } from 'next/navigation'; 
import { Menu, User, LogOut, LayoutDashboard, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; 

const navLinks = [
    { name: "خانه", href: "/" },
    { name: "رویدادها", href: "/events" },
    { name: "گالری", href: "/gallery" },
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

  // --- تغییر جدید: مخفی کردن نوبار در صفحه نظرسنجی ---
  if (pathname === '/survey') {
    return null;
  }
  // ---------------------------------------------------

  useEffect(() => {
    const checkUser = () => {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    checkUser();

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('auth-change', checkUser);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('auth-change', checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    setIsMobileMenuOpen(false); 
    router.push("/");
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "border-b border-white/10 bg-slate-950/90 py-2 backdrop-blur-md shadow-2xl" 
          : "bg-transparent py-3 sm:py-4"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        
        {/* === LOGO === */}
        <Link href="/" className="group flex items-center gap-2 sm:gap-4 z-20">
          <div className="relative flex h-10 w-10 sm:h-[50px] sm:w-[50px] items-center justify-center rounded-xl bg-white/5 border border-white/10 transition group-hover:bg-white/10">
             <Image 
              src="/icon.png"
              alt="Logo" 
              width={80} 
              height={80} 
              className="object-contain p-1 brightness-0 invert" 
              unoptimized
            />
          </div>
          <div className="flex flex-col">
              <span className="text-sm sm:text-lg font-bold text-white leading-tight">CS Association</span>
              <span className="text-[10px] sm:text-xs text-gray-400">Kharazmi University</span>
          </div>
        </Link>

        {/* === DESKTOP MENU === */}
        <div className="hidden lg:flex items-center gap-1 rounded-full border border-white/5 bg-white/5 p-1 backdrop-blur-md absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/10"
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* === ACTION BUTTONS (DESKTOP) === */}
        <div className="flex items-center gap-3 z-20">
          {user ? (
            <div className="hidden lg:flex items-center gap-3"> 
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition">
                {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="Profile" 
                      className="h-6 w-6 rounded-full object-cover border border-white/20"
                    />
                ) : (
                    <User className="h-4 w-4" />
                )}
                داشبورد
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-xs font-bold text-white border border-slate-700 hover:bg-slate-700 transition">
                   <LayoutDashboard className="h-3 w-3" /> پنل ادمین
                </Link>
              )}
            </div>
          ) : (
            <Link 
              href="/auth/login"
              className="hidden sm:flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg hover:bg-blue-500 hover:scale-105 transition"
            >
              ورود / عضویت
            </Link>
          )}

          {/* دکمه همبرگری موبایل */}
          <button 
            className="lg:hidden p-2 text-white bg-white/5 rounded-lg border border-white/10 active:scale-95 transition" 
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      </motion.nav>

      {/* === MOBILE MENU OVERLAY === */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed inset-0 z-60 bg-slate-950 flex flex-col h-dvh" 
            >
                <div className="flex justify-between items-center p-5 border-b border-white/10">
                    <span className="font-bold text-lg text-white">منوی دسترسی</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-5 space-y-2">
                {navLinks.map((link) => (
                    <Link 
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full p-4 rounded-2xl text-lg font-medium transition ${
                        pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                        : "bg-slate-900 text-gray-300 border border-white/5"
                    }`}
                    >
                    {link.name}
                    </Link>
                ))}
                </div>
                
                {/* فوتر منوی موبایل (دکمه‌های کاربری) */}
                <div className="p-5 border-t border-white/10 space-y-3 bg-slate-900/50">
                    {user ? (
                        <>
                            <div className="flex items-center gap-3 mb-4 bg-slate-800 p-3 rounded-xl border border-white/5">
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md overflow-hidden relative">
                                    {user.profileImage ? (
                                        <img 
                                          src={user.profileImage} 
                                          alt={user.name} 
                                          className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        user.name?.[0] || <User className="h-5 w-5"/>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-bold truncate">{user.name}</p>
                                    <p className="text-xs text-gray-400 truncate dir-ltr">{user.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold border border-white/10 transition">
                                    <User className="h-4 w-4" /> داشبورد
                                </Link>
                                
                                {user.role === 'admin' && (
                                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-900/20 transition">
                                        <LayoutDashboard className="h-4 w-4" /> پنل ادمین
                                    </Link>
                                )}
                            </div>

                            <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-xl font-bold border border-red-500/20 transition">
                                <LogOut className="h-4 w-4" /> خروج از حساب
                            </button>
                        </>
                    ) : (
                        <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="flex w-full items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition">
                            ورود یا ثبت‌نام
                        </Link>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}