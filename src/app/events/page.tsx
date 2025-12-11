import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, ArrowRight, Clock, Archive } from 'lucide-react';
import { toShamsiDate } from '../../utils/date';

export const dynamic = 'force-dynamic';

async function getEvents() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${API_URL}/events`, { 
      cache: 'no-store', // همیشه دیتای تازه بگیر
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

  // 🔽 فیلتر کردن رویدادها
  const activeEvents = allEvents.filter((e: any) => e.registrationStatus !== 'CLOSED');
  const pastEvents = allEvents.filter((e: any) => e.registrationStatus === 'CLOSED');

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-7xl text-white">
      
      {/* هدر صفحه */}
      <div className="mb-16 text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          رویدادهای انجمن
        </h1>
        <p className="text-gray-400 text-lg">تازه‌ترین کارگاه‌ها، سمینارها و مسابقات علمی</p>
      </div>

      {/* بخش ۱: رویدادهای فعال */}
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
          <h2 className="text-2xl font-bold text-white">رویدادهای جاری و پیش‌رو</h2>
        </div>

        {activeEvents.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-dashed border-gray-700">
            <p className="text-gray-500">در حال حاضر رویداد فعالی وجود ندارد.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {activeEvents.map((event: any) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* بخش ۲: بایگانی رویدادها */}
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

// کامپوننت کارت رویداد (تعبیه شده در همین فایل برای سادگی)
function EventCard({ event, isPast = false }: { event: any, isPast?: boolean }) {
  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-2xl border ${isPast ? 'border-white/5 bg-slate-900/30' : 'border-white/10 bg-slate-900/80'} transition hover:border-blue-500/50 hover:shadow-2xl`}>
      
      {/* تصویر */}
      <div className="relative h-52 w-full bg-slate-800 overflow-hidden">
        <Image
          src={event.thumbnail || "https://placehold.co/600x400/1e293b/ffffff?text=Event"}
          alt={event.title}
          fill
          className={`object-cover transition duration-700 group-hover:scale-110 ${isPast ? 'grayscale-[80%]' : ''}`}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
        
        {/* بج */}
        <div className="absolute top-4 right-4">
            {isPast ? (
                <span className="px-3 py-1 rounded-full bg-black/60 text-gray-300 text-xs font-bold border border-white/10 backdrop-blur-md">
                    پایان یافته
                </span>
            ) : (
                <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${
                    event.registrationStatus === 'OPEN' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/20' 
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'
                }`}>
                    {event.registrationStatus === 'OPEN' ? 'در حال ثبت‌نام' : 'به زودی'}
                </span>
            )}
        </div>
      </div>

      {/* بدنه */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className={`mb-3 text-lg font-bold transition line-clamp-2 ${isPast ? 'text-gray-400' : 'text-white group-hover:text-blue-400'}`}>
          {event.title}
        </h3>
        
        <div className="space-y-3 text-sm text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500/70" />
            <span>{toShamsiDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-500/70" />
            <span>{new Date(event.date).toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-orange-500/70" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Link 
            // 🚨 نکته حیاتی: فقط ID
            href={`/events/${event._id}`} 
            className={`flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-bold transition ${
                isPast 
                ? 'bg-white/5 text-gray-400 hover:bg-white/10' 
                : 'bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white'
            }`}
          >
            {isPast ? 'مشاهده آرشیو' : 'مشاهده جزئیات'} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}