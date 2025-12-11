import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { toShamsiDate } from '../../utils/date';

// جلوگیری از کش شدن برای دیدن تغییرات لحظه‌ای
export const dynamic = 'force-dynamic';

async function getEvents() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    // اضافه کردن پارامتر زمان برای جلوگیری از کش
    const res = await fetch(`${API_URL}/events?t=${Date.now()}`, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-7xl text-white">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">رویدادهای انجمن</h1>
        <p className="text-gray-400">تازه‌ترین کارگاه‌ها، سمینارها و مسابقات</p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-white/5">
          <p className="text-gray-500">در حال حاضر رویدادی وجود ندارد.</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event: any) => (
            <div key={event._id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 transition hover:border-blue-500/50 hover:shadow-2xl">
              
              {/* تصویر */}
              <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                <Image
                  src={event.thumbnail || "https://placehold.co/600x400/1e293b/ffffff?text=Event"}
                  alt={event.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
              </div>

              {/* بدنه کارت */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-2 text-xl font-bold text-white transition group-hover:text-blue-400 line-clamp-2">
                  {event.title}
                </h3>
                
                <div className="space-y-3 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>{toShamsiDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>{event.registeredCount} / {event.capacity} نفر</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5">
                  <Link 
                    // ✅ نکته کلیدی: لینک فقط با ID
                    href={`/events/${event._id}`} 
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600/10 py-3 text-sm font-bold text-blue-400 transition hover:bg-blue-600 hover:text-white"
                  >
                    مشاهده جزئیات <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}