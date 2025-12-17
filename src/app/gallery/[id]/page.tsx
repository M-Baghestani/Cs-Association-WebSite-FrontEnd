// src/app/gallery/[id]/page.tsx
"use client"
import React from 'react';
import Image from 'next/image';
import BackButton from '../../../components/BackButton'; // استفاده از کامپوننت موجود در پروژه

export default function GalleryDetailPage({ params }: { params: { id: string } }) {
  // تصاویر نمونه (در واقعیت از بک‌ساید می‌آیند)
  const images = ["/img1.jpg", "/img2.jpg", "/img3.jpg"]; 

  return (
    <div className="min-h-screen py-24 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-white">تصاویر بازدید الکامپ</h1>
          <BackButton />
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((src, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg border border-zinc-800">
              <img 
                src={src} 
                alt={`image-${index}`} 
                className="w-full h-auto hover:opacity-80 transition-opacity cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}