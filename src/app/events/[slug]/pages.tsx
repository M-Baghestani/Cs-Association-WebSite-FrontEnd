// src/app/events/[id]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import EventRegisterWrapper from './EventRegisterWrapper';
import { EventType } from '../../../types/event';
import { toShamsiDate } from '../../../utils/date';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchEventById(id: string): Promise<EventType | null> {
  try {
    const res = await fetch(`${API_URL}/events/${id}`, { cache: 'no-store' });
    const json = await res.json();
    if (json.success) return json.data;
    return null;
  } catch (err) {
    console.error("fetchEventById error:", err);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const event = await fetchEventById(params.id);
  if (!event) return { title: "رویداد یافت نشد" };
  return { title: `${event.title} | رویداد انجمن علمی کامپیوتر` };
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await fetchEventById(params.id);

  if (!event) {
    return <div className="text-white p-8 text-center text-xl">رویداد یافت نشد</div>;
  }

  const formattedDate = toShamsiDate(event.date);

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-5xl text-white">
      <Link href="/events" className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white w-fit">
        بازگشت به رویدادها
      </Link>

      <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl border border-white/10 bg-slate-800">
        <img src={event.thumbnail || "https://picsum.photos/800/600"} alt={event.title} className="w-full h-full object-cover" />
      </div>

      <h1 className="text-4xl font-bold mb-4 border-b border-white/10 pb-4">{event.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 mb-8">
        <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-400" /> {formattedDate}</div>
        <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-blue-400" /> {event.location}</div>
        <div className="flex items-center gap-2"><Users className="h-5 w-5 text-blue-400" /> ظرفیت: {event.registeredCount} از {event.capacity} نفر</div>
        <div className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-blue-400" /> {event.isFree ? "رایگان" : `${event.price.toLocaleString('fa-IR')} تومان`}</div>
      </div>

      <h2 className="text-2xl font-bold mb-3 mt-10">توضیحات</h2>
      <p className="leading-relaxed text-gray-300 whitespace-pre-wrap">{event.description}</p>

      <div className="mt-10">
        <EventRegisterWrapper event={event} />
      </div>
    </div>
  );
}
