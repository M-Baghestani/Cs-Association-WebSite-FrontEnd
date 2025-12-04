"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Lock, Loader2, Chrome, UserPlus } from "lucide-react"; 
import toast from "react-hot-toast"; 
import { useRouter } from "next/navigation";

// تعریف تایپ گلوبال گوگل برای جلوگیری از خطای TypeScript
declare global {
  interface Window {
    google: any;
  }
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // --- LOGIC FOR REGULAR LOGIN ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "اطلاعات ورود اشتباه است");

      localStorage.setItem("token", json.data.token);
      localStorage.setItem("user", JSON.stringify(json.data.user));
      
      toast.success(`خوش آمدید ${json.data.user.name}`);
      
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC FOR GOOGLE LOGIN ---
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
        if (!res.ok) throw new Error(json.message || "خطا در ورود با گوگل");

        // 3. Handle successful login/registration
        localStorage.setItem("token", json.data.token);
        localStorage.setItem("user", JSON.stringify(json.data.user));
        toast.success(`خوش آمدید ${json.data.user.name}`);
        window.location.href = "/";
      } catch (err: any) {
        toast.error(err.message || "خطا در ورود با گوگل.");
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
        document.getElementById("hiddenGoogleButton"),
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
    <div className="flex min-h-screen items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-white mb-2">ورود به حساب کاربری 🔐</h1>
          <p className="text-gray-400">لطفاً ایمیل و رمز عبور خود را وارد کنید.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input name="email" type="email" placeholder="ایمیل" required 
              className="w-full rounded-xl bg-slate-800 border border-gray-700 py-3 pr-12 pl-4 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
          </div>

          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input name="password" type="password" placeholder="رمز عبور" required 
              className="w-full rounded-xl bg-slate-800 border border-gray-700 py-3 pr-12 pl-4 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
          </div>

          <button disabled={loading} type="submit" className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-500 disabled:opacity-50 flex justify-center gap-2 mt-6 shadow-lg shadow-blue-600/30">
            {loading ? <Loader2 className="animate-spin"/> : "ورود"}
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
          <Link href="/auth/register" className="bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 px-6 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10">
            <UserPlus className="h-5 w-5"/> هنوز حساب کاربری ندارید؟
          </Link>
        </div>
      </div>
    </div>
  );
}