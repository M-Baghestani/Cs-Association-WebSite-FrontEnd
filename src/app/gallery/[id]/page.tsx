import { Metadata } from "next";
// ✅ اصلاح مسیر ایمپورت: اشاره به فایل کلاینت همین پوشه
import GalleryDetailClient from "./GalleryDetailClient";

// آدرس API برای دریافت اطلاعات جهت سئو
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type Props = {
  params: { id: string };
};

// 🟢 تولید متادیتای داینامیک برای سئو
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(`${API_URL}/galleries/${params.id}`, { cache: 'no-store' });
    const data = await res.json();
    
    if (data.success && data.data) {
      return {
        title: `${data.data.title} | گالری تصاویر`,
        description: data.data.description?.substring(0, 160) || 'مشاهده تصاویر این رویداد در انجمن علمی کامپیوتر',
      };
    }
  } catch (error) {
    console.error("Error fetching gallery metadata:", error);
  }

  return {
    title: 'جزئیات گالری | انجمن علمی کامپیوتر',
    description: 'مشاهده تصاویر و گزارش‌های تصویری انجمن',
  };
}

export default function GalleryDetailPage({ params }: Props) {
  // حالا GalleryDetailClient ورودی id را می‌پذیرد
  return <GalleryDetailClient id={params.id} />;
}