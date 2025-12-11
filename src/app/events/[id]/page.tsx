import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import EventRegisterWrapper from "./EventRegisterWrapper"; 
import { toShamsiDate } from "../../../utils/date";

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getEventData(id: string) {
  try {
    // درخواست مستقیم به بک‌اند با ID
    const res = await fetch(`${API_URL}/events/${id}`, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) return null;

    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    return null;
  }
}

interface PageProps {
  params: { id: string };
}

export default async function EventDetailPage({ params }: PageProps) {
  // در نکست 15 (که شاید استفاده کنید) پارامترها پرامیس هستند، اما اینجا مستقیم می‌خوانیم
  // اگر ارور تایپ داد، آن را await کنید: const { id } = await params;
  const { id } = params;

  if (!id) return notFound();

  const event = await getEventData(id);

  if (!event) return notFound();

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-6xl text-white">
      
      {/* کاور رویداد */}
      <div className="relative w-full h-64 md:h-[450px] rounded-3xl overflow-hidden mb-8 shadow-2xl border border-white/10 bg-slate-900">
        {/* استفاده از img معمولی برای جلوگیری از مشکلات دامنه عکس */}
        <img
          src={event.thumbnail || "https://placehold.co/1200x600/1e293b/ffffff?text=Event+Cover"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-0 right-0 p-6 md:p-10 w-full">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              توضیحات
            </h2>
            <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl sticky top-28 shadow-xl">
             <div className="space-y-5">
              <div className="flex items-center gap-4 text-gray-300">
                <Calendar className="h-6 w-6 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-500">تاریخ</p>
                  <p className="font-bold">{toShamsiDate(event.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-300">
                <MapPin className="h-6 w-6 text-orange-400" />
                <div>
                  <p className="text-xs text-gray-500">مکان</p>
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