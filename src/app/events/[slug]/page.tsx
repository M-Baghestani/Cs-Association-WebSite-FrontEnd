// src/app/events/[slug]/page.tsx
// (Server Component)

import { Metadata } from "next";
import { toShamsiDate } from "../../../utils/date"; 
import EventDetailClient from "./EventDetailClient"; // 🚨 FIX: ایمپورت کامپوننت Client

// ------------------------------------
// 🚨 FIX: توابع مورد نیاز برای generateMetadata
// ------------------------------------
const fetchEventBySlug = async (slug: string) => {
    // ⚠️ Placeholder: باید با فراخوانی واقعی API جایگزین شود
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const axios = require('axios');
    const res = await axios.get(`${API_URL}/events/slug/${slug}`);
    return res.data.data;
};

const BASE_URL = 'https://cs-khu.ir';

// ------------------------------------
// 🚨 FIX: تابع generateMetadata (Server Component)
// ------------------------------------
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
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
    "eventStatus": "https://schema.org/EventScheduled", 
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
// تعریف Props مورد انتظار برای Client Component
// ------------------------------------
interface EventDetailPageProps {
  params: { slug: string };
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
    // 🚨 FIX: فراخوانی کامپوننت Client که منطق ثبت‌نام و UI را مدیریت می‌کند
    return <EventDetailClient params={params} />;
}