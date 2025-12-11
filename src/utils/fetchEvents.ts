// src/utils/fetchEvents.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function fetchEvents() {
  try {
    const res = await fetch(`${API_URL}/events`, {
      next: { revalidate: 60 } 
    });

    if (!res.ok) {
      console.error(`Backend error: ${res.status}`);
      return { events: [], error: true };
    }

    const json = await res.json();
    return { events: json.data || [], error: false };
  } catch (error) {
    console.error("Network error:", error);
    return { events: [], error: true };
  }
}