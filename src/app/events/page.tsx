import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, ArrowRight, Clock, Archive, Hourglass } from 'lucide-react';
import { toShamsiDate } from '../../utils/date';
import EventCard from '../../components/EventCard'; // ایمپورت کامپوننت کارت

export const dynamic = 'force-dynamic';

async function getEvents() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${API_URL}/events`, { 
      cache: 'no-store',
    });
    
    if (!res.ok) return [];
    
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export default async function EventsPage() {
  const allEvents = await getEvents();

  // 🔽 جداسازی رویدادها به ۳ دسته
  // ۱. رویدادهایی که هنوز ثبت‌نامشان شروع نشده (غیرفعال / تایمردار)
  const scheduledEvents = allEvents.filter((e: any) => e.registrationStatus === 'SCHEDULED');
  
  // ۲. رویدادهای فعال (در حال ثبت‌نام)
  const openEvents = allEvents.filter((e: any) => e.registrationStatus === 'OPEN');
  
  // ۳. رویدادهای پایان یافته
  const pastEvents = allEvents.filter((e: any) => e.registrationStatus === 'CLOSED');

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-7xl text-white">
      
      <div className="mb-16 text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          رویدادهای انجمن
        </h1>
        <p className="text-gray-400 text-lg">تازه‌ترین کارگاه‌ها، سمینارها و مسابقات علمی</p>
      </div>

      {/* بخش ۱: رویدادهای آینده (تایمردار) */}
      {scheduledEvents.length > 0 && (
        <div className="mb-20">
            <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
            <Hourglass className="w-6 h-6 text-yellow-500 animate-pulse" />
            <h2 className="text-2xl font-bold text-white">رویدادهای پیش‌رو (به زودی)</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {scheduledEvents.map((event: any) => (
                <EventCard key={event._id} event={event} />
            ))}
            </div>
        </div>
      )}

      {/* بخش ۲: رویدادهای فعال (در حال ثبت‌نام) */}
      {openEvents.length > 0 && (
        <div className="mb-20">
            <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
            <h2 className="text-2xl font-bold text-white">در حال ثبت‌نام</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {openEvents.map((event: any) => (
                <EventCard key={event._id} event={event} />
            ))}
            </div>
        </div>
      )}

      {/* اگر هیچ رویداد فعال یا برنامه‌ریزی شده‌ای نبود */}
      {openEvents.length === 0 && scheduledEvents.length === 0 && (
          <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-dashed border-gray-700 mb-20">
            <p className="text-gray-500">در حال حاضر رویداد فعالی وجود ندارد.</p>
          </div>
      )}

      {/* بخش ۳: بایگانی رویدادها */}
      {pastEvents.length > 0 && (
        <div className="opacity-80 hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
            <Archive className="w-5 h-5 text-gray-500" />
            <h2 className="text-2xl font-bold text-gray-300">بایگانی رویدادهای گذشته</h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event: any) => (
              <EventCard key={event._id} event={event} isPast={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}