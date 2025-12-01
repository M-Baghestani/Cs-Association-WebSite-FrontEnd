
export interface EventType {
  _id: string; 
  title: string;
  slug: string;
  description: string;
  date: string; // تاریخ از MongoDB به شکل ISO String می‌آید
  location: string;
  capacity: number;
  registeredCount: number;
  isFree: boolean;
  price?: number;
  thumbnail?: string;
  creator: string; // ID سازنده
}