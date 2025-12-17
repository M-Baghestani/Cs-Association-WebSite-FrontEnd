// src/app/gallery/GalleryClientContent.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Image as ImageIcon, ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";
// اطمینان حاصل کنید که این کامپوننت وجود دارد (چون در صفحات دیگر استفاده شده)
import NeuralBackground from "../../components/NeuralBackground";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function GalleryClientContent() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const res = await axios.get(`${API_URL}/galleries`);
        if (res.data.success) {
          setGalleries(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching galleries", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-white">
      <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
    </div>
  );

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden bg-slate-950 text-white">
      {/* پس‌زمینه متحرک برای زیبایی بیشتر (مشابه سایر صفحات مدرن سایت) */}
      <NeuralBackground />
      
      {/* کانتینر اصلی مشابه صفحه نشریات */}
      <div className="relative z-10 px-4 pt-24 pb-20 container mx-auto max-w-6xl">
        
        {/* هدر صفحه - دقیقاً مشابه استایل journals */}
        <div className="text-center py-10 mb-10 border-b border-white/10">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
             گالری تصاویر 📸
          </h1>
          <p className="text-gray-400">
            روایتی تصویری از خاطرات و رویدادهای انجمن
          </p>
        </div>

        {/* لیست گالری‌ها */}
        {galleries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-700 rounded-2xl bg-slate-900/50">
            <ImageIcon className="h-16 w-16 text-gray-600 mb-4" />
            <p className="text-gray-500 text-lg">
              هنوز آلبومی منتشر نشده است.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.map((gallery, index) => (
              <GalleryCard key={gallery._id} gallery={gallery} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GalleryCard({ gallery, index }: { gallery: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/gallery/${gallery._id}`} className="group flex flex-col h-full bg-slate-900 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition shadow-lg">
          
          {/* بخش تصویر - مشابه صفحه نشریات */}
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={gallery.coverImage}
              alt={gallery.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-80"
            />
            
            {/* بج تعداد تصاویر */}
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1">
              <ImageIcon className="h-3 w-3 text-blue-400" />
              <span>{gallery.images?.length || 0}</span>
            </div>
          </div>

          {/* محتوا */}
          <div className="p-5 text-center border-t border-white/5 flex flex-col grow">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition line-clamp-1">
              {gallery.title}
            </h3>
            
            <p className="text-gray-500 text-sm mb-6 line-clamp-2 h-10">
              {gallery.description || "بدون توضیحات..."}
            </p>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5 w-full">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(gallery.createdAt).toLocaleDateString('fa-IR')}
              </span>
              
              <span className="text-sm font-bold text-blue-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                مشاهده <ArrowLeft className="h-4 w-4" />
              </span>
            </div>
          </div>
      </Link>
    </motion.div>
  );
}