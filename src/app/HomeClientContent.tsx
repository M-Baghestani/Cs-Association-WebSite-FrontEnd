"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, Sparkles, Calendar, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios"; 
import CountdownTimer from "../components/Event/CountdownTimer"; // ✅ ایمپورت تایمر
import { toShamsiDate } from "../utils/date"; // ✅ ایمپورت صحیح تابع تاریخ

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function HomeClientContent() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    async function fetchEvents() {
      try {
        // استفاده از ISR یا کش در اینجا سمت کلاینت تاثیری ندارد چون axios است
        // اما چون محدود به 3 آیتم است، بار زیادی ندارد
        const res = await axios.get(`${API_URL}/events`);
        if (res.data.success) {
          // فقط ۳ رویداد آخر را نمایش بده
          setEvents(res.data.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // کامپوننت کارت رویداد اختصاصی صفحه اصلی
  const HomeEventCard = ({ event, index }: { event: any, index: number }) => {
    const isScheduled = event.registrationStatus === 'SCHEDULED';

    return (
      <motion.div
        key={event._id}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 transition hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10"
      >
        
        {/* ✅ بخش جدید: اگر زمان‌بندی شده است، تایمر را روی کارت بنداز */}
        {isScheduled && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 text-center border border-yellow-500/20">
             <CountdownTimer 
                opensAt={event.registrationOpensAt} 
                eventTitle={event.title} 
             />
             <div className="mt-6 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-bold">
                ⏳ ثبت‌نام به زودی آغاز می‌شود
             </div>
          </div>
        )}

        {/* محتوای اصلی کارت (اگر زمان‌بندی شده باشد، زیر لایه بالا قرار می‌گیرد) */}
        <div className={`flex flex-col h-full ${isScheduled ? 'opacity-40 pointer-events-none filter grayscale-50' : ''}`}>
            
            {/* قاب عکس */}
            <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                <Image
                src={event.thumbnail || "https://placehold.co/600x400/1e293b/ffffff?text=CS+Association"}
                alt={event.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-110"
                unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-60" />
            </div>

            {/* بدنه کارت */}
            <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-2 text-xl font-bold text-white transition group-hover:text-blue-400">
                {event.title}
                </h3>
                <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>{toShamsiDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>{event.registeredCount} / {event.capacity} نفر</span>
                </div>
                </div>
                
                <div className="mt-auto pt-4">
                <Link 
                    // ✅ اصلاح لینک: استفاده از ID اگر اسلاگ نبود
                    href={`/events/${event.slug || event._id}`} 
                    className="block w-full rounded-lg bg-white/5 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-600"
                >
                    مشاهده جزئیات
                </Link>
                </div>
            </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative text-white overflow-x-hidden">
      <div className="flex flex-col gap-12 sm:gap-20 pb-20">
        
        {/* HERO SECTION - کاملاً ریسپانسیو شده */}
        <section className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-80px)] pt-20 sm:pt-0">
            
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs sm:text-sm font-medium text-blue-400 backdrop-blur-md"
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>انجمن علمی علوم کامپیوتر دانشگاه خوارزمی</span>
            </motion.div>

            {/* Title - سایز متن برای موبایل بهینه شد */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 sm:mb-6 leading-tight">
              <span className="bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent block">
                انجمن علمی
              </span>
              <span className="bg-linear-to-r from-blue-400 via-indigo-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl mt-2 block">
                علوم کامپیوتر
              </span>
            </h1>

            <div className="h-8 sm:h-10 text-lg sm:text-2xl text-blue-300 font-bold mt-2">
               <p>پیشرو در برگزاری رویدادهای تخصصی</p>
            </div>
            
            {/* Description - جاستفای متن در موبایل */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 max-w-2xl text-base sm:text-lg text-gray-300 md:text-xl leading-relaxed px-2 text-justify sm:text-center"
            >
              ما در انجمن علمی تلاش می‌کنیم تا با برگزاری کارگاه‌ها، سمینارها و مسابقات، 
              فضایی پویا برای رشد علمی و فنی دانشجویان فراهم کنیم.
            </motion.p>
            
            {/* Buttons - چیدمان ستونی در موبایل */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row w-full sm:w-auto gap-4 px-4"
            >
              <Link href="/events" className="w-full sm:w-auto rounded-xl sm:rounded-full bg-blue-600 px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-blue-500 text-center">
                مشاهده رویدادها 📅
              </Link>
              
              {!isLoggedIn && (
                <Link href="/auth/register" className="w-full sm:w-auto flex justify-center items-center gap-2 rounded-xl sm:rounded-full border border-white/10 bg-white/5 px-8 py-3.5 font-bold text-white backdrop-blur-sm transition hover:bg-white/10">
                  عضویت در سایت <ArrowLeft className="h-4 w-4" />
                </Link>
              )}
            </motion.div>

          </div>
        </section>

        {/* EVENTS SECTION - گرید ریسپانسیو */}
        <section className="container max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-4 gap-4"
          >
            <div>
              <div className="flex items-center gap-3">
                <Cpu className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">تازه‌ترین رویدادها</h2>
              </div>
              <p className="mt-2 text-sm sm:text-base text-gray-400">فرصت‌های یادگیری و ارتقای مهارت</p>
            </div>
            <Link href="/events" className="text-blue-400 hover:text-blue-300 text-sm sm:text-base hover:underline self-end sm:self-auto">
              مشاهده همه &larr;
            </Link>
          </motion.div>

          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
             {/* ... (ادامه کد مپ زدن ایونت‌ها مثل قبل) ... */}
          </div>
        </section>
      </div>
    </div>
  );
}