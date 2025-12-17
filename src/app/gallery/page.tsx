// src/app/gallery/page.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default async function GalleryPage() {
  // در دنیای واقعی داده‌ها از API دریافت می‌شوند
  // const { data: galleries } = await getGalleries();

  return (
    <div className="min-h-screen py-20 px-4 md:px-10 bg-black text-white">
      <h1 className="text-3xl font-bold mb-10 text-center border-b border-blue-500 pb-4">
        گزارش‌های تصویری انجمن
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* نمونه یک کارت گالری */}
        <div className="group relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 hover:border-blue-500 transition-all">
          <div className="relative h-60 w-full">
            <Image 
              src="/sample-gallery.jpg" 
              alt="عنوان گزارش" 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="p-5">
            <h2 className="text-xl font-semibold mb-2">بازدید از نمایشگاه الکامپ</h2>
            <p className="text-zinc-400 text-sm mb-4">گزارش تصویری حضور اعضای انجمن در نمایشگاه بین‌المللی</p>
            <Link href={`/gallery/1`} className="text-blue-500 hover:text-blue-400 font-medium">
              مشاهده تصاویر ←
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}