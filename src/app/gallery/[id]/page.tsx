import { Metadata } from "next";
import GalleryDetailClient from "./GalleryDetailClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type Props = {
  params: Promise<{ id: string }>; // 👈 تغییر تایپ برای سازگاری با نسخه‌های جدید
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params; // 👈 حتما باید await شود
  try {
    const res = await fetch(`${API_URL}/galleries/${id}`, { cache: 'no-store' });
    const data = await res.json();
    
    if (data.success && data.data) {
      return {
        title: `${data.data.title} | گالری تصاویر`,
        description: data.data.description?.substring(0, 160),
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

export default async function GalleryDetailPage({ params }: Props) {
  const { id } = await params; // 👈 این خط مشکل شما را حل می‌کند
  return <GalleryDetailClient id={id} />;
}