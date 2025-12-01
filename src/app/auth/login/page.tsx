"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast"; // 👈 ایمپورت تست

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

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
      
      // ✅ پیام موفقیت
      toast.success(`خوش آمدید ${json.data.user.name}`);
      
      // رفرش برای آپدیت نوبار
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      
    } catch (err: any) {
      // ❌ پیام خطا
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">ورود به حساب کاربری 🔐</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
            <input name="email" type="email" placeholder="ایمیل" required 
              className="w-full rounded-lg bg-white/5 py-3 pr-10 pl-4 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="relative">
            <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
            <input name="password" type="password" placeholder="رمز عبور" required 
              className="w-full rounded-lg bg-white/5 py-3 pr-10 pl-4 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button disabled={loading} type="submit" className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-500 disabled:opacity-50 flex justify-center gap-2">
            {loading ? <Loader2 className="animate-spin"/> : "ورود"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          حساب کاربری ندارید؟{" "}
          <Link href="/auth/register" className="text-blue-400 hover:text-blue-300">
            ثبت‌نام کنید
          </Link>
        </div>
      </div>
    </div>
  );
}