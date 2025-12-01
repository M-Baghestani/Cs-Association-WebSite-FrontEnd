"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, Sparkles, Calendar, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import Typewriter from 'typewriter-effect';
import Image from "next/image";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    async function fetchEvents() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/events`, {
          cache: 'no-store'
        });
        const json = await res.json();
        if (json.success) {
          setEvents(json.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="relative text-white overflow-x-hidden">
      
      <div className="flex flex-col gap-20 pb-20">
        
        {/* === HERO SECTION (اصلاح شده برای وسط‌چین دقیق) === */}
        <section className="container max-w-7xl mx-auto px-6">
          <div className="relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-160px)]">
            
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 backdrop-blur-md"
            >
              <Sparkles className="h-4 w-4" />
              <span>به وب‌سایت رسمی انجمن علوم کامپیوتر دانشگاه خوارزمی خوش آمدید</span>
            </motion.div>

            {/* Title */}
            <h1 className="text-5xl font-black tracking-tight md:text-7xl lg:text-9xl mb-6 leading-tight">
              <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                انجمن علمی
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
                علوم کامپیوتر
              </span>
            </h1>

            {/* Typewriter */}
            <div className="h-10 text-xl md:text-2xl text-blue-300 font-bold mt-4">
              <Typewriter
                options={{
                  strings: [
                    'پلی میان دانشگاه و صنعت',
                    'جایی برای یادگیری و نوآوری',
                    'حامی ایده‌های خلاقانه شما',
                    'برگزارکننده رویدادهای تخصصی'
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 50,
                  deleteSpeed: 30,
                }}
              />
            </div>
            
            {/* Description */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 max-w-2xl text-lg text-gray-300 md:text-xl leading-relaxed"
            >
              ما در انجمن علمی تلاش می‌کنیم تا با برگزاری کارگاه‌ها، سمینارها و مسابقات، 
              فضایی پویا برای رشد علمی و فنی دانشجویان فراهم کنیم.
            </motion.p>
            
            {/* Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 flex flex-wrap justify-center gap-4"
            >
              <Link href="/events" className="group relative rounded-full bg-blue-600 px-8 py-4 font-bold text-white shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition hover:bg-blue-500 hover:shadow-[0_0_60px_-10px_rgba(37,99,235,0.7)] hover:scale-105">
                مشاهده رویدادها 📅
              </Link>
              
              {!isLoggedIn && (
                <Link href="/auth/register" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-white/10 hover:border-white/20 hover:scale-105">
                  عضویت در سایت <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                </Link>
              )}
            </motion.div>

          </div>
        </section>

        {/* === EVENTS SECTION === */}
        <section className="container max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 flex items-end justify-between border-b border-white/10 pb-6"
          >
            <div>
              <div className="flex items-center gap-3">
                <Cpu className="h-8 w-8 text-purple-500" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">تازه‌ترین رویدادها</h2>
              </div>
              <p className="mt-2 text-gray-400">فرصت‌های یادگیری و ارتقای مهارت</p>
            </div>
            <Link href="/events" className="hidden text-blue-400 hover:text-blue-300 md:block hover:underline">
              مشاهده همه &larr;
            </Link>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
               <div className="col-span-full py-20 text-center text-gray-500">در حال دریافت اطلاعات...</div>
            ) : events.length > 0 ? (
              events.slice(0, 3).map((event: any, index: number) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 transition hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10"
                >
                   <div className="relative h-56 w-full bg-slate-800 overflow-hidden">
                    <Image
                      src={event.thumbnail || "https://placehold.co/600x400/1e293b/ffffff?text=CS+Association"}
                      alt={event.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-3 text-xl font-bold text-white transition group-hover:text-blue-400">
                      {event.title}
                    </h3>
                    <div className="space-y-3 text-sm text-gray-400 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>{new Date(event.date).toLocaleDateString('fa-IR')}</span>
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
                    <div className="mt-auto">
                      <Link href={`/events/${event.slug}`} className="block w-full rounded-lg bg-white/5 py-3 text-center text-sm font-medium text-white transition hover:bg-blue-600">
                        مشاهده جزئیات
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-gray-700 bg-white/5 p-12 text-center text-gray-500">
                در حال حاضر رویدادی تعریف نشده است.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}



