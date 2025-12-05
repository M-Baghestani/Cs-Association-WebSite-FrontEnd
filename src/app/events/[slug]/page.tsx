// src/app/events/[slug]/page.tsx
import axios from 'axios';
import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface EventType {
  _id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  registeredCount: number;
  isFree: boolean;
  price: number;
  thumbnail?: string;
}

async function fetchEventBySlug(slug: string): Promise<EventType | null> {
  try {
    const res = await axios.get(`${API_URL}/slug/${slug}`);
    return res.data.data;
  } catch (err) {
    console.error("fetchEventBySlug error:", err);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await fetchEventBySlug(params.slug);
  if (!event) return { title: 'رویداد یافت نشد' };
  return { title: `${event.title} | رویداد انجمن علمی کامپیوتر` };
}

interface EventDetailPageProps {
  params: { slug: string };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const event = await fetchEventBySlug(params.slug);

  if (!event) {
    return <div className="text-white p-8 text-center text-xl">رویداد یافت نشد</div>;
  }

  const formattedDate = new Date(event.date).toLocaleDateString('fa-IR');

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
        <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-400"/> {formattedDate}</div>
        <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-blue-400"/> {event.location}</div>
        <div className="flex items-center gap-2"><Users className="h-5 w-5 text-blue-400"/> ظرفیت: {event.registeredCount} از {event.capacity} نفر</div>
        <div className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-blue-400"/> {event.isFree ? "رایگان" : `${event.price.toLocaleString('fa-IR')} تومان`}</div>
      </div>

      <h2 className="text-2xl font-bold mb-3 mt-10">توضیحات</h2>
      <p className="leading-relaxed text-gray-300 whitespace-pre-wrap">{event.description}</p>

      {event.isFree ? (
        <form method="POST" action={`${API_URL}/events/${event._id}/register`} className="mt-10">
          <button type="submit" className="w-full rounded-lg bg-green-600 py-3 font-bold text-white hover:bg-green-700">
            ثبت‌نام رایگان
          </button>
        </form>
      ) : (
        <div className="mt-10 p-4 bg-blue-900/20 rounded-xl border border-blue-600/50">
          <p>این رویداد پولی است. لطفاً پس از ورود به حساب کاربری، پرداخت و ثبت‌نام را انجام دهید.</p>
        </div>
      )}
    </div>
  );
}
