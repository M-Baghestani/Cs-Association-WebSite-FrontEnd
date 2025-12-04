"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { User, Mail, Lock, Loader2, Phone, GraduationCap, Chrome, LogIn } from "lucide-react"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// تعریف تایپ گلوبال گوگل برای جلوگیری از خطای TypeScript
declare global {
    interface Window {
      google: any;
    }
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "", 
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- LOGIC FOR REGULAR REGISTER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/auth/register`, formData);
      const data = res.data.data;

      if (res.data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        window.dispatchEvent(new Event("auth-change")); 
        
        toast.success("ثبت‌نام موفقیت‌آمیز بود! به داشبورد هدایت می‌شوید.");
        router.push("/dashboard");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "خطا در ثبت‌نام.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  // --- LOGIC FOR GOOGLE REGISTER/LOGIN ---
  useEffect(() => {
    // 1. Load Google Identity Services Script
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = initializeGoogle;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      document.head.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    if (response.credential) {
      setLoading(true);
      try {
        // 2. Send ID Token to our Backend
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: response.credential }),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "خطا در ثبت‌نام با گوگل");

        // 3. Handle successful login/registration
        localStorage.setItem("token", json.data.token);
        localStorage.setItem("user", JSON.stringify(json.data.user));
        toast.success(`خوش آمدید ${json.data.user.name}`);
        router.push("/dashboard");
      } catch (err: any) {
        toast.error(err.message || "خطا در ثبت‌نام با گوگل.");
      } finally { setLoading(false); }
    }
  };

  const initializeGoogle = () => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, // ⚠️ حتماً باید تنظیم شود
        callback: handleCredentialResponse,
        auto_select: false,
      });
      // رندر یک دکمه پنهان (اجباری برای فعال شدن callback)
      window.google.accounts.id.renderButton(
        document.getElementById("hiddenGoogleButtonRegister"),
        { theme: "outline", size: "large", type: "standard", shape: "pill", width: "300" } 
      );
    }
  };

  const handleGoogleLoginClick = () => {
      if (typeof window !== 'undefined' && window.google) {
          // فعال‌سازی prompt گوگل که مسئول نمایش پنجره یا one-tap است
          window.google.accounts.id.prompt(); 
      } else {
           toast.error("سرویس Google بارگذاری نشده است. لطفاً صفحه را مجدداً بارگیری کنید.");
      }
  }


  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 md:pt-32">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl backdrop-blur-sm">
        
        <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">ثبت‌نام کاربر جدید</h1>
            <p className="text-gray-400">یک حساب کاربری جدید بسازید.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            {/* نام */}
            <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"/>
                <input
                    type="text"
                    name="name"
                    placeholder="نام و نام خانوادگی"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-800 border border-gray-700 rounded-xl py-3 pr-12 pl-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
            </div>
            
            {/* ایمیل */}
            <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"/>
                <input
                    type="email"
                    name="email"
                    placeholder="ایمیل دانشگاهی"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-800 border border-gray-700 rounded-xl py-3 pr-12 pl-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
            </div>

            {/* شماره تماس */}
            <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"/>
                <input
                    type="tel"
                    name="phoneNumber" 
                    placeholder="شماره تماس (اختیاری)"
                    value={formData.phoneNumber} 
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-gray-700 rounded-xl py-3 pr-12 pl-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
            </div>

            {/* رمز عبور */}
            <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"/>
                <input
                    type="password"
                    name="password"
                    placeholder="رمز عبور"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-800 border border-gray-700 rounded-xl py-3 pr-12 pl-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition duration-300 flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed mt-6 shadow-lg shadow-blue-600/30"
            >
                {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    'ثبت‌نام'
                )}
            </button>
        </form>

        {/* === SOCIAL LOGIN === */}
        <div className="relative mt-8 mb-4">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="bg-slate-900 px-3 text-gray-500">----------------</span>
            </div>
        </div>
        {/* 🚨 FIX: Stylized Link Button */}
        <div className="mt-8 text-center">
          <Link href="/auth/login" className="bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 px-6 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10">
            <LogIn className="h-5 w-5"/> قبلاً حساب کاربری داشته‌اید؟
          </Link>
        </div>
      </div>
    </div>
  );
}