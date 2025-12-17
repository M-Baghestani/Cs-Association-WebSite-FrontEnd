// src/app/gallery/page.tsx
import { Metadata } from "next";
import GalleryClientContent from "./GalleryClientContent"; // 👈 کامپوننت کلاینت که در ادامه می‌سازیم

export const metadata: Metadata = {
  title: 'گالری تصاویر | انجمن علمی علوم کامپیوتر خوارزمی',
  description: 'گزارش‌های تصویری از رویدادها، دورهمی‌ها، بازدیدهای علمی و فعالیت‌های انجمن علمی علوم کامپیوتر دانشگاه خوارزمی.',
  keywords: ['گالری', 'تصاویر', 'گزارش تصویری', 'انجمن کامپیوتر', 'خوارزمی', 'رویدادها'],
};

export default function GalleryPage() {
  return <GalleryClientContent />;
}