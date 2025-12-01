// src/app/events/page.tsx

import { Suspense } from 'react';
import Link from 'next/link';
import { Search, AlertCircle } from 'lucide-react';
import EventCard from '../../components/EventCard'; 
import CountdownTimer from '../../components/Event/CountdownTimer';

// تعریف تایپ‌ها
interface EventData {
    _id: string;
    title: string;
    slug: string;
    date: string;
    location: string;
    registeredCount: number;
    capacity: number;
    thumbnail?: string;
    // این فیلدها ممکن است در رویدادهای قدیمی نباشند (optional)
    registrationStatus?: 'SCHEDULED' | 'OPEN' | 'CLOSED'; 
    registrationOpensAt?: string; 
}

async function getAllEvents(): Promise<EventData[]> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
        const res = await fetch(`${API_URL}/events`, {
            cache: 'no-store' 
        });
        if (!res.ok) {
            console.error(`Backend fetch failed with status: ${res.status}`);
            return [];
        }
        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error("Error connecting to backend for events list:", error);
        return [];
    }
}

export default async function EventsPage() {
  const allEvents = await getAllEvents(); 

  // 🚨 FIX: رویدادهای قدیمی که وضعیت ندارند را هم 'OPEN' در نظر می‌گیریم
  const openEvents = allEvents.filter(e => e.registrationStatus === 'OPEN' || !e.registrationStatus);
  const scheduledEvents = allEvents.filter(e => e.registrationStatus === 'SCHEDULED');
  
  const isServerDown = allEvents.length === 0 && (await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/events`).then(r => r.status).catch(() => 500) !== 200);

  return (
    <div className="min-h-screen pt-24 pb-20 container mx-auto px-4 max-w-7xl text-white">
      
      {/* HEADER */}
      <div className="text-center py-10 mb-10 border-b border-white/10">
        <h1 className="text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          رویدادهای انجمن
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          جدیدترین کارگاه‌ها، دوره‌ها و برنامه‌های انجمن علمی را از دست ندهید.
        </p>
      </div>

      {/* SEARCH BOX */}
      <div className="mb-12 max-w-2xl mx-auto relative">
        <input
            type="text"
            placeholder="جستجو در رویدادها..."
            className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder-gray-500 focus:border-blue-500 transition"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"/>
      </div>
      
      {/* ------------------------------------ */}
      {/* ۱. رویدادهای باز برای ثبت نام (OPEN) */}
      {/* ------------------------------------ */}
      <h2 className="text-3xl font-bold text-white mb-8 border-b border-green-500/50 pb-3 flex items-center gap-3">
          رویدادهای فعال <span className="text-green-400 text-base font-medium">({openEvents.length})</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {openEvents.length === 0 ? (
          <div className="col-span-3 text-center py-16 bg-slate-900/50 border border-dashed border-gray-800 rounded-xl flex flex-col items-center justify-center text-gray-500">
            {isServerDown ? (
                 <>
                    <AlertCircle className="h-10 w-10 text-red-500 mb-2"/>
                    <p>ارتباط با سرور قطع است.</p>
                 </>
            ) : (
                <p>در حال حاضر رویداد فعالی وجود ندارد.</p>
            )}
          </div>
        ) : (
          <Suspense fallback={<div>در حال بارگذاری...</div>}>
            {openEvents.map((event) => (
              // 🚨 ما وضعیت را دستی به EventCard پاس می‌دهیم تا اگر نداشت، پیش‌فرض OPEN باشد
              <EventCard 
                key={event._id} 
                {...event} 
                registrationStatus={event.registrationStatus || 'OPEN'}
                registrationOpensAt={event.registrationOpensAt || ''}
              /> 
            ))}
          </Suspense>
        )}
      </div>

      {/* ------------------------------------ */}
      {/* ۲. رویدادهای آینده (SCHEDULED) */}
      {/* ------------------------------------ */}
      {/* فقط اگر رویداد آینده‌ای وجود داشت، این بخش را نشان بده */}
      {scheduledEvents.length > 0 && (
        <>
            <h2 className="text-3xl font-bold text-white mb-8 border-b border-yellow-500/50 pb-3 flex items-center gap-3">
                رویدادهای آینده <span className="text-yellow-400 text-base font-medium">({scheduledEvents.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Suspense fallback={<div>در حال بارگذاری...</div>}>
                    {scheduledEvents.map((event) => (
                    <div key={event._id} className="relative group">
                        {/* نمایش کارت به صورت مات */}
                        <div className="opacity-60 pointer-events-none select-none filter grayscale-[50%]">
                            <EventCard 
                                {...event} 
                                registrationStatus="SCHEDULED"
                            />
                        </div>
                        
                        {/* لایه پوششی و تایمر */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 rounded-2xl backdrop-blur-sm p-4 border border-yellow-500/30 transition group-hover:bg-slate-950/70">
                            <CountdownTimer opensAt={event.registrationOpensAt || ''} />
                            <p className="text-sm text-yellow-200/70 mt-4 font-medium bg-yellow-900/20 px-3 py-1 rounded-full border border-yellow-500/20">
                                ثبت‌نام هنوز باز نشده است
                            </p>
                        </div>
                    </div>
                    ))}
                </Suspense>
            </div>
        </>
      )}
    </div>
  );
}