// src/utils/fetchEvents.ts
// این تابع برای استفاده در Server Components (مانند src/app/events/page.tsx) طراحی شده است

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface EventData {
    _id: string;
    title: string;
    slug: string;
    date: string;
    location: string;
    registeredCount: number;
    capacity: number;
    thumbnail?: string;
    registrationStatus?: 'SCHEDULED' | 'OPEN' | 'CLOSED';
    registrationOpensAt?: string;
    // ... سایر فیلدهای رویداد که از بک‌اند دریافت می‌کنید
}

interface FetchEventsResponse {
    events: EventData[];
    error: boolean;
}

/**
 * دریافت لیست کامل رویدادها از API بک‌اند.
 * @returns آبجکتی شامل لیست رویدادها و وضعیت خطا.
 */
export default async function fetchEvents(): Promise<FetchEventsResponse> {
    try {
        const res = await fetch(`${API_URL}/events`, {
            // تنظیمات حیاتی برای Server Components: تضمین می‌کند که داده‌ها جدید هستند
            cache: 'no-store', 
            headers: { 'Cache-Control': 'no-cache' }
        });

        if (!res.ok) {
            console.error(`Backend fetch failed: ${res.status} ${res.statusText}`);
            return { events: [], error: true };
        }

        const json = await res.json();
        return { events: json.data || [], error: false };
    } catch (error) {
        console.error("Network error fetching events:", error);
        return { events: [], error: true };
    }
}