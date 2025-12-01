"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { Lock, Mail, User, Loader2, Phone } from "lucide-react"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "", // 🚨 FIX: StudentId به PhoneNumber تغییر کرد
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/auth/register`, formData);
      const data = res.data.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("ثبت‌نام با موفقیت انجام شد. به داشبورد منتقل می‌شوید.");
        window.dispatchEvent(new Event("auth-change"));
        router.push("/dashboard");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "خطا در ثبت‌نام. دوباره تلاش کنید.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 md:pt-32">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">ثبت‌نام کاربر جدید</h1>
        <p className="text-center text-gray-400 mb-8">اطلاعات خود را وارد کنید.</p>

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
              placeholder="ایمیل (Username)"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 border border-gray-700 rounded-xl py-3 pr-12 pl-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
          
          {/* شماره تماس 🚨 FIX */}
          <div className="relative">
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"/>
            <input
              type="tel"
              name="phoneNumber" // 🚨 FIX: نام فیلد
              placeholder="شماره تماس (اختیاری)"
              value={formData.phoneNumber} // 🚨 FIX: مقدار فیلد
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition disabled:bg-blue-400 disabled:cursor-not-allowed mt-6"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5"/> : "ثبت‌نام"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          قبلاً حساب کاربری داشته‌اید؟{" "}
          <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 transition font-medium">
            ورود
          </Link>
        </p>
      </div>
    </div>
  );
}