"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send, Loader2, Instagram, Linkedin, Github } from "lucide-react";
import toast from "react-hot-toast"; // استفاده از toast برای پیام‌ها

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // 🚨 FIX: دریافت توکن برای شناسایی کاربر
    const token = localStorage.getItem("token");
    
    const headers: any = { "Content-Type": "application/json" };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/contact`, {
        method: "POST",
        headers: headers, // ارسال هدر حاوی توکن
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("خطا در ارسال");

      toast.success("پیام شما با موفقیت ارسال شد.");
      setSent(true); 
    } catch (error) {
      toast.error("مشکلی پیش آمد. لطفا دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 pt-24 pb-20">
      <div className="container mx-auto max-w-5xl">
        
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-white md:text-5xl">تماس با ما 📞</h1>
          <p className="mt-4 text-lg text-gray-400">
            نظرات، پیشنهادات و انتقادات خود را با ما در میان بگذارید.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          
          {/* ستون راست: اطلاعات تماس */}
          <div className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-md">
              <h3 className="mb-6 text-xl font-bold text-white">راه‌های ارتباطی</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-white">آدرس دفتر انجمن</p>
                    <p className="mt-1 text-sm text-gray-400">دانشکده مهندسی کامپیوتر، طبقه دوم</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-white">ایمیل رسمی</p>
                    <p className="mt-1 text-sm text-gray-400">info@cs-association.ir</p>
                  </div>
                </div>
              </div>

              {/* سوشال مدیا */}
              <div className="mt-8 flex gap-4 border-t border-white/10 pt-8">
                {/* 1. تلگرام */}
                <a href="#" className="rounded-full bg-white/5 p-3 text-gray-400 hover:bg-sky-500/20 hover:text-sky-400 transition"><Send className="h-5 w-5"/></a> 
                {/* 2. گیت‌هاب */}
                <a href="#" className="rounded-full bg-white/5 p-3 text-gray-400 hover:bg-white/10 hover:text-white transition"><Github className="h-5 w-5"/></a>
                {/* 3. لینکدین */}
                <a href="#" className="rounded-full bg-white/5 p-3 text-gray-400 hover:bg-blue-600/20 hover:text-blue-400 transition"><Linkedin className="h-5 w-5"/></a>
                {/* 4. اینستاگرام */}
                <a href="#" className="rounded-full bg-white/5 p-3 text-gray-400 hover:bg-pink-600/20 hover:text-pink-400 transition"><Instagram className="h-5 w-5"/></a>
              </div>
            </div>
          </div>

          {/* ستون چپ: فرم ارسال پیام */}
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                  <Send className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">پیام شما دریافت شد!</h3>
                <p className="mt-2 text-gray-400">همین الان می‌توانید آن را در داشبورد خود پیگیری کنید.</p>
                <button onClick={() => setSent(false)} className="mt-6 text-blue-400 hover:text-blue-300">
                  ارسال پیام جدید
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm text-gray-400">نام شما</label>
                  <input name="name" required className="w-full rounded-xl bg-white/5 py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="نام کامل" />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">ایمیل</label>
                  <input name="email" type="email" required className="w-full rounded-xl bg-white/5 py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="example@email.com" />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">موضوع پیام</label>
                  <input name="subject" required className="w-full rounded-xl bg-white/5 py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="همکاری، پیشنهاد، انتقاد..." />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">متن پیام</label>
                  <textarea name="message" rows={5} required className="w-full rounded-xl bg-white/5 py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="پیام خود را بنویسید..." />
                </div>

                <button disabled={loading} type="submit" className="flex w-full justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin" /> : <>ارسال پیام <Send className="h-5 w-5" /></>}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}