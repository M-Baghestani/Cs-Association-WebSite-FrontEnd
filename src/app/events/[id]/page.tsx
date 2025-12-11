import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import EventRegisterWrapper from "./EventRegisterWrapper"; 
import { toShamsiDate } from "../../../utils/date";

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getEventData(id: string) {
  try {
    // چاپ آیدی در کنسول برای دیباگ (این را در ترمینال فرانت‌اند چک کنید)
    console.log("🔍 Fetching Event with ID:", id);

    if (!id || id === 'undefined') return null;

    const res = await fetch(`${API_URL}/events/${id}`, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
        console.error(`❌ API Error: ${res.status} for ID: ${id}`);
        return null;
    }

    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error("❌ Network error:", error);
    return null;
  }
}

// این اینترفیس هر دو حالت را قبول می‌کند
interface PageProps {
  params: { id?: string; slug?: string };
}

export default async function EventDetailPage({ params }: PageProps) {
  // ✅ اصلاح مهم: دریافت شناسه چه از id و چه از slug
  const eventId = params.id || params.slug;

  if (!eventId) {
    console.error("⚠️ Error: No ID provided in params!", params);
    notFound();
  }

  const event = await getEventData(eventId);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-6xl text-white">
      
      {/* هدر و تصویر */}
      <div className="relative w-full h-64 md:h-[450px] rounded-3xl overflow-hidden mb-8 shadow-2xl border border-white/10 bg-slate-900">
        <Image
          src={event.thumbnail || "https://placehold.co/1200x600/1e293b/ffffff?text=Event+Cover"}
          alt={event.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-0 right-0 p-6 md:p-10 w-full">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${event.isFree ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {event.isFree ? 'رایگان' : `${event.price?.toLocaleString()} تومان`}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs backdrop-blur-sm">
              ظرفیت: {event.capacity} نفر
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* ستون اصلی: توضیحات */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              توضیحات رویداد
            </h2>
            <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </div>
          </div>
        </div>

        {/* ستون کناری: اطلاعات و ثبت‌نام */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl sticky top-28 shadow-xl">
            <h3 className="font-bold text-lg mb-6 border-b border-white/10 pb-4">اطلاعات برگزاری</h3>
            
            <div className="space-y-5">
              <div className="flex items-center gap-4 text-gray-300">
                <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">تاریخ برگزاری</p>
                  <p className="font-bold">{toShamsiDate(event.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-300">
                <div className="bg-purple-500/10 p-3 rounded-xl text-purple-400">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">ساعت شروع</p>
                  <p className="font-bold">
                    {new Date(event.date).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-300">
                <div className="bg-orange-500/10 p-3 rounded-xl text-orange-400">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">مکان برگزاری</p>
                  <p className="font-bold">{event.location}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <EventRegisterWrapper event={event} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}