// src/app/events/[slug]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Users, DollarSign, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Metadata } from "next"; 
import { toShamsiDate } from "../../../utils/date"; 

// 🚨 FIX: فرض بر وجود توابع fetch و کامپوننت‌های RegisterButton و PaymentProofModal
import RegisterButton from '../../../components/RegisterButton'; 
import PaymentProofModal from '../../../components/PaymentProofModal'; 

const fetchEventBySlug = async (slug: string) => {
    // ⚠️ Placeholder: شما باید این تابع را در src/utils/fetchEventBySlug.ts پیاده‌سازی کنید.
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/events/slug/${slug}`);
    return res.data.data;
};

const BASE_URL = 'https://cs-khu.ir';

// ------------------------------------
// 🚨 FIX: تابع generateMetadata (Server Component)
// ------------------------------------
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // ⚠️ از آنجایی که این یک Client Component است، این تابع باید در یک فایل مجزا باشد
  // اما برای سادگی، فرض می‌کنیم تابع fetchEventBySlug در اینجا تعریف شده است.
  const event = await fetchEventBySlug(params.slug);

  if (!event) {
    return { title: 'رویداد یافت نشد' };
  }

  const description = event.description.substring(0, 160) + '...';
  const eventUrl = `${BASE_URL}/events/${params.slug}`;

  // Schema Markup از نوع Event
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "startDate": event.date,
    "eventStatus": event.isPassed ? "https://schema.org/EventScheduled" : "https://schema.org/EventScheduled", 
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": event.location,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": event.location, 
        "addressLocality": "کرج", 
        "addressRegion": "البرز",
        "addressCountry": "ایران"
      }
    },
    "image": [event.thumbnail],
    "description": description,
    "organizer": {
      "@type": "Organization",
      "name": "انجمن علمی علوم کامپیوتر دانشگاه خوارزمی",
      "url": BASE_URL
    },
    "offers": {
        "@type": "Offer",
        "price": event.price || 0,
        "priceCurrency": "IRR", 
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString(),
        "url": eventUrl
    }
  };

  return {
    title: event.title + ' | رویداد انجمن علمی کامپیوتر',
    description: description,
    keywords: ['رویداد', event.location, event.title, 'دانشگاه خوارزمی', 'انجمن علمی'],
    
    openGraph: {
        title: event.title,
        description: description,
        url: eventUrl,
        type: 'website', 
        images: [{ url: event.thumbnail }],
    },
    alternates: {
        types: {
            'application/ld+json': eventSchema as any,
        },
    },
  };
}

// ------------------------------------
// صفحه جزئیات رویداد (Client Component)
// ------------------------------------

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RegistrationStatus {
  status: 'VERIFIED' | 'PENDING' | 'FAILED' | 'PAID';
  pricePaid: number;
  trackingCode?: string;
}

interface EventType {
  _id: string; title: string; slug: string; description: string; date: string;
  location: string; capacity: number; registeredCount: number; isFree: boolean;
  price: number; thumbnail?: string; creator: string;
  userRegistration?: RegistrationStatus | null; 
}


export default function EventPage() {
  const router = useRouter();
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // 1. فراخوانی اطلاعات (شامل وضعیت کاربر)
  const fetchEvent = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const res = await axios.get(`${API_URL}/events/slug/${slug}`, { headers });
        
        const data = res.data.data;
        data.price = Number(data.price) || 0;
        setEvent(data);

    } catch (error: any) {
        if (error.response?.status === 404) {
            toast.error("رویداد یافت نشد.");
            router.push('/events'); 
        } else {
            toast.error("خطا در دریافت اطلاعات.");
        }
    } finally {
        setLoading(false);
    }
  }, [slug, router]);

  useEffect(() => { if (slug) fetchEvent(); }, [slug, fetchEvent]);

  // 2. هندلر کلیک روی دکمه ثبت نام
  const handleRegisterClick = async () => {
    if (!event) return;
    const token = localStorage.getItem('token');
    if (!token) {
        toast.error('لطفاً ابتدا وارد حساب کاربری خود شوید.');
        return;
    }
    
    // اگر رایگان بود: ثبت نام مستقیم
    if (event.isFree) {
        setRegisterLoading(true);
        try {
            await axios.post(`${API_URL}/events/${event._id}/register`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("ثبت‌نام رایگان انجام شد.");
            fetchEvent(); // رفرش وضعیت دکمه
        } catch (error: any) {
            toast.error(error.response?.data?.message || "خطا در ثبت نام.");
        } finally {
            setRegisterLoading(false);
        }
    } else {
        // اگر پولی بود: باز کردن مودال
        setIsModalOpen(true);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin inline-block mr-2"/>در حال بارگذاری...</div>;
  if (!event) return null;

  const formattedDate = toShamsiDate(event.date); // 🚨 FIX: شمسی‌سازی تاریخ

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-5xl text-white">
      <Link href="/events" className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white w-fit"><ArrowRight className="h-4 w-4" /> بازگشت به رویدادها</Link>

      <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl border border-white/10 bg-slate-800">
        <img src={event.thumbnail || "https://picsum.photos/800/600"} alt={event.title} className="w-full h-full object-cover" />
      </div>
      
      <h1 className="text-4xl font-extrabold mb-4 border-b border-white/10 pb-4">{event.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 mb-8">
        <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-400"/> {formattedDate}</div>
        <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-blue-400"/> {event.location}</div>
        <div className="flex items-center gap-2"><Users className="h-5 w-5 text-blue-400"/> ظرفیت: {event.registeredCount} از {event.capacity} نفر</div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-400"/> {event.isFree ? "رایگان" : `قیمت: ${event.price.toLocaleString('fa-IR')} تومان`}
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-3 mt-10">توضیحات</h2>
      <p className="leading-relaxed text-gray-300 whitespace-pre-wrap">{event.description}</p>
      
      <div className="mt-10 border-t border-white/10 pt-6">
        <div className="mb-4 flex justify-between text-sm text-gray-400"><span>وضعیت ظرفیت</span><span>{Math.round((event.registeredCount / event.capacity) * 100)}%</span></div>
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-gray-800"><div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }} /></div>
        
        <RegisterButton 
          eventId={event._id} 
          isFree={event.isFree}
          price={event.price}
          capacity={event.capacity} 
          registeredCount={event.registeredCount} 
          userRegistration={event.userRegistration || null}
          onRegisterSuccess={fetchEvent} 
          handleRegister={handleRegisterClick}
          isLoading={registerLoading}
        />
      </div>
      
      <PaymentProofModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventId={event._id}
        eventPrice={event.price}
        onRegistrationSuccess={fetchEvent}
      />
    </div>
  );
}